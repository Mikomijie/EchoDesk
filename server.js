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

1. SUMMARY: Write exactly 5 clear bullet points summarizing the key topics covered. Each bullet must be a complete, meaningful sentence about what was actually discussed.

2. QUESTIONS: Write exactly 5 exam-style practice questions based specifically on what was discussed. Mix definition, application, and critical thinking questions.

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
  let streamingTranscriber = null;

  ws.on('message', async (data) => {
    console.log('📨 Message received, size:', data.length);
    
    let msg;
    try {
      msg = JSON.parse(data.toString());
      console.log('📨 Parsed message type:', msg.type);
    } catch {
      // Binary audio data
      if (streamingTranscriber && role === 'lecturer') {
        try {
          streamingTranscriber.send(data);
        } catch (err) {
          console.error('Error sending audio to AssemblyAI:', err);
        }
      }
      return;
    }

    if (msg.type === 'create_session') {
      role = 'lecturer';
      sessionCode = generateCode();
      sessions[sessionCode] = { 
        lecturer: ws, 
        students: [], 
        transcript: '',
        transcriber: null,
        tempToken: null
      };
      
      try {
        const token = await client.streaming.createTemporaryToken({ expires_in_seconds: 600 });
        sessions[sessionCode].tempToken = token;
        
        ws.send(JSON.stringify({ type: 'session_created', code: sessionCode, token: token }));
        console.log(`✅ Session created: ${sessionCode}`);
      } catch (err) {
        console.error('Error creating temp token:', err);
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

    if (msg.type === 'start_streaming') {
      if (role !== 'lecturer' || !sessionCode) return;

      const session = sessions[sessionCode];
      if (!session || streamingTranscriber) return;

      try {
        const { StreamingTranscriber } = require('assemblyai');
        
       streamingTranscriber = new StreamingTranscriber({
  token: session.tempToken,
  encoding: 'opus',
  speechModel: 'universal-streaming-english'
});

        streamingTranscriber.on('open', ({ id, expires_at }) => {
          console.log('🎤 StreamingTranscriber OPEN - ID:', id);
        });

        streamingTranscriber.on('transcript', ({ transcript, is_final }) => {
          console.log('🎯 Transcript event received:', { transcript, is_final });
          if (transcript) {
            console.log(`📝 ${is_final ? 'FINAL' : 'interim'}: ${transcript}`);
            
            if (is_final) {
              session.transcript += transcript + ' ';
            }
            
            broadcastToStudents(sessionCode, {
              type: 'caption',
              text: session.transcript,
              interim: transcript && !is_final
            });

            if (session.lecturer && session.lecturer.readyState === WebSocket.OPEN) {
              session.lecturer.send(JSON.stringify({
                type: 'transcript_update',
                text: session.transcript
              }));
            }
          }
        });

        streamingTranscriber.on('error', (error) => {
          console.error('❌ Streaming error:', error);
        });

        streamingTranscriber.on('close', () => {
          console.log('Streaming closed');
          streamingTranscriber = null;
        });

        streamingTranscriber.connect();
        session.transcriber = streamingTranscriber;
        
        ws.send(JSON.stringify({ type: 'streaming_started' }));
        console.log(`🎤 Streaming started for session ${sessionCode}`);
      } catch (err) {
        console.error('Error starting streaming:', err);
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to start streaming' }));
      }
    }

    if (msg.type === 'end_lecture') {
      const session = sessions[sessionCode];
      if (!session) return;

      if (streamingTranscriber) {
        streamingTranscriber.close();
        streamingTranscriber = null;
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
    if (streamingTranscriber) {
      streamingTranscriber.close();
      streamingTranscriber = null;
    }
    
    if (role === 'lecturer' && sessionCode && sessions[sessionCode]) {
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