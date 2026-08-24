import { useEffect, useRef, useState } from 'react'

export default function Lecturer() {
  const [status, setStatus] = useState('idle')
  const [sessionCode, setSessionCode] = useState('')
  const [transcript, setTranscript] = useState('')
  const [studentCount, setStudentCount] = useState(0)
  const wsRef = useRef(null)

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
      ws.send(JSON.stringify({ type: 'create_session' }))
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'session_created') {
        setSessionCode(msg.code)
        setStatus('live')
      }

      if (msg.type === 'transcript_update') {
        setTranscript(msg.text)
      }

      if (msg.type === 'student_joined') {
        setStudentCount(c => c + 1)
      }
    }

    ws.onerror = () => {
      setStatus('error')
    }
  }

  const endSession = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'end_lecture' }))
      wsRef.current.close()
    }
    setStatus('idle')
    setSessionCode('')
    setTranscript('')
    setStudentCount(0)
  }

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
            Click Start Session to get your session code.
            Then run transcribe.py on your laptop and enter the code.
            Students join from their phones.
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
        <p style={{ fontSize: 16, color: '#0A1930', fontWeight: 600 }}>
          Creating session...
        </p>
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
            background: 'white', borderRadius: 16,
            border: '0.5px solid rgba(10,25,48,0.08)',
            padding: '20px 24px', minHeight: 200,
            maxHeight: '40vh', overflowY: 'auto',
            marginBottom: 16
          }}>
            {transcript ? (
              <p style={{ fontSize: 14, color: '#0A1930',
                lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {transcript}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: '#4a5568', textAlign: 'center',
                marginTop: 60 }}>
                Transcript will appear here once transcribe.py is running...
              </p>
            )}
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