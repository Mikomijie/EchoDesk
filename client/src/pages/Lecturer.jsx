import { useEffect, useRef, useState } from 'react'
import { AudioCapture } from '../utils/audioCapture'

export default function Lecturer() {
  const [status, setStatus] = useState('idle')
  const [sessionCode, setSessionCode] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const wsRef = useRef(null)
  const audioRef = useRef(null)

  const getServerUrl = () => {
    if (window.location.hostname === 'localhost') {
      return 'ws://localhost:3000'
    }
    return 'wss://echodesk-server.onrender.com'
  }

  const startSession = () => {
    setStatus('connecting')
    const ws = new WebSocket(getServerUrl())
    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      ws.send(JSON.stringify({ type: 'create_session' }))
    }

    ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)

  if (msg.type === 'session_created') {
    setSessionCode(msg.code)
    setStatus('live')
    // Start streaming on AssemblyAI
    ws.send(JSON.stringify({ type: 'start_streaming' }))
    startAudioCapture()
  }

  if (msg.type === 'transcript_update') {
    setTranscript(msg.text)
    console.log('📝 Transcript updated:', msg.text)
  }

  if (msg.type === 'streaming_started') {
    console.log('✅ Streaming started')
  }
}

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
      setStatus('error')
    }
  }

  const startAudioCapture = async () => {
    if (!audioRef.current) {
      audioRef.current = new AudioCapture()
    }

    const success = await audioRef.current.start((audioChunk) => {
      sendAudioToServer(audioChunk)
    })

    if (success) {
      setIsRecording(true)
      console.log('✅ Audio capture started')
    } else {
      setStatus('error')
    }
  }

  const sendAudioToServer = (audioChunk) => {
  if (!sessionCode || !wsRef.current) return

  // Send raw audio data directly
  wsRef.current.send(audioChunk)
}

  const endSession = () => {
    if (audioRef.current) {
      audioRef.current.stop()
      setIsRecording(false)
    }

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'end_lecture' }))
      wsRef.current.close()
    }

    setStatus('idle')
    setSessionCode('')
    setTranscript('')
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop()
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF7F2',
      fontFamily: "'Inter', sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
      `}</style>

      {status === 'idle' && (
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 64, height: 64, background: '#0A1930',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10"
                stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 26, fontWeight: 800, color: '#0A1930', marginBottom: 8
          }}>
            Start a Lecture
          </h1>
          <p style={{ fontSize: 14, color: '#4a5568', marginBottom: 32, lineHeight: 1.6 }}>
            Click Start Session to begin. Your microphone will activate and captions will stream to students instantly.
          </p>
          <button
            onClick={startSession}
            style={{
              width: '100%', background: '#0A1930', color: '#D4A94C',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15, fontWeight: 800, padding: 16,
              borderRadius: 12, border: 'none', cursor: 'pointer'
            }}
          >
            Start Session
          </button>
        </div>
      )}

      {status === 'connecting' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(10,25,48,0.08)',
            borderTop: '3px solid #D4A94C',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ fontSize: 16, color: '#0A1930', fontWeight: 600 }}>
            Creating session...
          </p>
        </div>
      )}

      {status === 'live' && (
        <div style={{ width: '100%', maxWidth: 600 }}>
          <div style={{
            background: '#0A1930', borderRadius: 16,
            padding: '24px 32px', marginBottom: 24, textAlign: 'center'
          }}>
            <p style={{ color: '#D4A94C', fontSize: 12, fontWeight: 600,
              letterSpacing: 2, marginBottom: 8 }}>
              SESSION CODE
            </p>
            <p style={{
              color: 'white', fontSize: 48, fontWeight: 800,
              letterSpacing: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: 0
            }}>
              {sessionCode}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8 }}>
              Share this code with your students
            </p>
          </div>

          <div style={{
            background: isRecording ? 'rgba(34,197,94,0.1)' : 'rgba(212,169,76,0.1)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isRecording ? '#22c55e' : '#D4A94C',
              display: 'inline-block',
              animation: isRecording ? 'pulse 1.5s infinite' : 'none'
            }} />
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: isRecording ? '#16a34a' : '#9a7520'
            }}>
              {isRecording ? 'Recording and streaming' : 'Waiting to start'}
            </span>
          </div>

          <div style={{
            background: 'white', borderRadius: 16,
            border: '0.5px solid rgba(10,25,48,0.08)',
            padding: '20px 24px', minHeight: 200,
            maxHeight: '40vh', overflowY: 'auto',
            marginBottom: 16
          }}>
            <p style={{ fontSize: 14, color: '#0A1930',
              lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
              {transcript || 'Transcript will appear here as you speak...'}
            </p>
          </div>

          <button
            onClick={endSession}
            style={{
              width: '100%', background: 'rgba(220,38,38,0.08)',
              color: '#dc2626', fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14, fontWeight: 700, padding: 14,
              borderRadius: 12,
              border: '0.5px solid rgba(220,38,38,0.2)',
              cursor: 'pointer'
            }}
          >
            End Lecture
          </button>
        </div>
      )}

      {status === 'error' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: 16 }}>
            Connection failed. Try again.
          </p>
          <button onClick={() => setStatus('idle')}
            style={{
              background: '#0A1930', color: '#D4A94C',
              padding: '12px 24px', borderRadius: 10,
              border: 'none', cursor: 'pointer', fontWeight: 700
            }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}