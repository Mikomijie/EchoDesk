require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { AssemblyAI } = require('assemblyai');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const sessions = {};
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function broadcastToStudents(sessionCode, message) {
  const session = sessions[sessionCode];
  if (!session) return;
  console.log(`📢 Broadcasting to ${session.students.length} students:`, message.text?.slice(0, 50));
  session.students.forEach(student => {
    if (student.readyState === WebSocket.OPEN) {
      student.send(JSON.stringify(message));
    }
  });
}

app.post('/summarize', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim().length < 50) {
    return res.json({
      summary: ['The transcript was too short to generate a meaningful summary.'],
      questions: ['What was the main topic discussed in this lecture?']
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://echodesk-server.onrender.com',
        'X-Title': 'EchoDesk'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          {
            role: 'user',
            content: `You are an academic assistant helping deaf university students in Nigeria review their lectures.

Here is a lecture transcript:

"${transcript.slice(0, 4000)}"

Please provide:

1. SUMMARY: Write exactly 5 clear bullet points summarizing the key topics covered.

2. QUESTIONS: Write exactly 5 exam-style practice questions based specifically on what was discussed.

Format your response EXACTLY like this with no extra text:
SUMMARY:
- [bullet 1]
- [bullet 2]
- [bullet 3]
- [bullet 4]
- [bullet 5]

QUESTIONS:
1. [question 1]
2. [question 2]
3. [question 3]
4. [question 4]
5. [question 5]`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const summaryMatch = content.match(/SUMMARY:\n([\s\S]*?)\n\nQUESTIONS:/);
    const questionsMatch = content.match(/QUESTIONS:\n([\s\S]*?)$/);

    const summaryLines = summaryMatch
      ? summaryMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
      : ['Summary could not be generated. Please review the transcript below.']

    const questionLines = questionsMatch
      ? questionsMatch[1].split('\n').filter(l => l.trim().match(/^\d+\./)).map(l => l.replace(/^\d+\.\s*/, '').trim())
      : ['What were the main topics covered in this lecture?']

    res.json({ summary: summaryLines, questions: questionLines });

  } catch (err) {
    console.error('OpenRouter error:', err.message);
    res.status(500).json({
      summary: ['Could not generate summary. Please review the full transcript below.'],
      questions: ['What were the main topics covered in this lecture?']
    });
  }
});

wss.on('connection', (ws) => {
  let role = null;
  let sessionCode = null;
  let aaiStream = null;

  ws.on('message', async (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      // Binary audio data - forward to AssemblyAI stream
      if (sessionCode && sessions[sessionCode] && aaiStream) {
        try {
          aaiStream.write(data);
          console.log('🎵 Audio chunk sent to AssemblyAI, size:', data.length);
        } catch (err) {
          console.error('❌ Error sending audio to AssemblyAI:', err.message);
        }
      }
      return;
    }

    // JSON message handling
    if (msg.type === 'create_session') {
      role = 'lecturer';
      sessionCode = generateCode();
      sessions[sessionCode] = { 
        lecturer: ws, 
        students: [], 
        transcript: ''
      };
      
      try {
        // Create temporary token for streaming
        console.log('🔑 Creating temporary token...');
        const token = await client.streaming.createTemporaryToken({ 
          expires_in_seconds: 3600 
        });
        
        console.log('🎤 Creating streaming transcriber...');
        
        // Create writable stream for audio
        const { PassThrough } = require('stream');
        aaiStream = new PassThrough();
        
        // Start streaming transcription
        const transcriber = await client.streaming.transcriber({
          token: token,
          encoding: 'webm',
          sampleRate: 48000
        });

        transcriber.on('transcript', (transcript) => {
          if (transcript.text) {
            console.log(`📝 ${transcript.is_final ? 'FINAL' : 'interim'}: ${transcript.text}`);
            
            if (transcript.is_final) {
              const session = sessions[sessionCode];
              if (session) {
                session.transcript += transcript.text + ' ';
                
                // Broadcast to students
                broadcastToStudents(sessionCode, {
                  type: 'caption',
                  text: session.transcript
                });

                // Update lecturer
                if (session.lecturer && session.lecturer.readyState === WebSocket.OPEN) {
                  session.lecturer.send(JSON.stringify({
                    type: 'transcript_update',
                    text: session.transcript
                  }));
                }
              }
            }
          }
        });

        transcriber.on('error', (error) => {
          console.error('❌ Streaming error:', error.message);
        });

        transcriber.on('close', () => {
          console.log('🔌 Streaming connection closed');
          aaiStream = null;
        });

        // Connect transcriber
        transcriber.connect();
        sessions[sessionCode].transcriber = transcriber;
        
        ws.send(JSON.stringify({ type: 'session_created', code: sessionCode }));
        console.log(`✅ Session created: ${sessionCode}`);
      } catch (err) {
        console.error('❌ Error creating streaming session:', err.message);
        if (err.response?.status === 402) {
          console.error('⚠️ Account not upgraded or insufficient credits');
        }
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to create session' }));
      }
    }

    if (msg.type === 'join_session') {
      role = 'student';
      sessionCode = msg.code?.toUpperCase();
      const session = sessions[sessionCode];

      if (!session) {
        ws.send(JSON.stringify({ type: 'error', message: 'Session not found. Check the code and try again.' }));
        return;
      }

      session.students.push(ws);
      ws.send(JSON.stringify({ type: 'joined', code: sessionCode }));

      if (session.transcript) {
        ws.send(JSON.stringify({ type: 'caption', text: session.transcript }));
      }

      console.log(`✅ Student joined: ${sessionCode}`);
    }

    if (msg.type === 'end_lecture') {
      const session = sessions[sessionCode];
      if (!session) return;

      // Close streaming transcriber
      if (session.transcriber) {
        try {
          session.transcriber.close();
        } catch (e) {
          console.log('Could not close transcriber');
        }
      }

      broadcastToStudents(sessionCode, {
        type: 'lecture_ended',
        transcript: session.transcript
      });

      console.log(`✅ Session ended: ${sessionCode}`);
      delete sessions[sessionCode];
    }
  });

  ws.on('close', () => {
    if (role === 'lecturer' && sessionCode && sessions[sessionCode]) {
      const session = sessions[sessionCode];
      if (session.transcriber) {
        try {
          session.transcriber.close();
        } catch (e) {
          console.log('Could not close transcriber on disconnect');
        }
      }
      broadcastToStudents(sessionCode, { type: 'lecturer_disconnected' });
      delete sessions[sessionCode];
    }
    
    if (role === 'student' && sessionCode && sessions[sessionCode]) {
      sessions[sessionCode].students = sessions[sessionCode].students.filter(s => s !== ws);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', sessions: Object.keys(sessions).length });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 EchoDesk server running on port ${PORT}`);
});