import { useEffect, useRef, useState } from 'react'

export default function Lecturer() {
  const [transcript, setTranscript] = useState('')
  const [studentCount, setStudentCount] = useState(0)
  const [lectureActive, setLectureActive] = useState(false)
  const [wsStatus, setWsStatus] = useState('connecting')
  const wsRef = useRef(null)
  const bottomRef = useRef(null)

  const getServerUrl = () => {
    const host = window.location.hostname
    return `ws://${host}:3000`
  }

  const connect = () => {
    const ws = new WebSocket(getServerUrl())
    wsRef.current = ws

    ws.onopen = () => setWsStatus('connected')

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        if (parsed.type === 'student_count') {
          setStudentCount(parsed.count)
          return
        }
      } catch (e) {}

      if (event.data === '__END_LECTURE__') return
      setTranscript(event.data)
    }

    ws.onclose = () => {
      setWsStatus('disconnected')
      setTimeout(() => connect(), 3000)
    }

    ws.onerror = () => setWsStatus('error')
  }

  useEffect(() => {
    connect()
    return () => { if (wsRef.current) wsRef.current.close() }
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [transcript])

  const startLecture = () => {
    setLectureActive(true)
    setTranscript('')
  }

  const endLecture = async () => {
    try {
      await fetch(`http://${window.location.hostname}:3000/end-lecture`, { method: 'POST' })
    } catch (err) {
      console.error('Error ending lecture:', err)
    }
    setLectureActive(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        * { box-sizing: border-box; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid rgba(10,25,48,0.08)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: '#0A1930', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10" stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontWeight: 800, fontSize: 17, color: '#0A1930',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Echo<span style={{ color: '#D4A94C' }}>Desk</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#9a7520', marginLeft: 8 }}>Lecturer Panel</span>
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: wsStatus === 'connected' ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.08)',
          color: wsStatus === 'connected' ? '#16a34a' : '#dc2626',
          fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: wsStatus === 'connected' ? '#22c55e' : '#dc2626',
            display: 'inline-block', animation: wsStatus === 'connected' ? 'pulse 1.5s infinite' : 'none'
          }} />
          {wsStatus === 'connected' ? 'Server connected' : 'Server disconnected'}
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {/* STATUS CARDS */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32
        }}>
          <div style={{
            background: 'white', borderRadius: 16,
            border: '0.5px solid rgba(10,25,48,0.08)', padding: '20px 24px'
          }}>
            <div style={{ fontSize: 11, color: '#4a5568', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Lecture status
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 18, fontWeight: 700, color: lectureActive ? '#16a34a' : '#0A1930',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: lectureActive ? '#22c55e' : '#94a3b8',
                animation: lectureActive ? 'pulse 1.5s infinite' : 'none'
              }} />
              {lectureActive ? 'Live' : 'Not started'}
            </div>
          </div>

          <div style={{
            background: 'white', borderRadius: 16,
            border: '0.5px solid rgba(10,25,48,0.08)', padding: '20px 24px'
          }}>
            <div style={{ fontSize: 11, color: '#4a5568', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Students connected
            </div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#0A1930',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              {studentCount}
            </div>
          </div>
        </div>

        {/* MAIN CONTROLS */}
        {!lectureActive ? (
          <div style={{
            background: '#0A1930', borderRadius: 24,
            padding: '48px 40px', textAlign: 'center', marginBottom: 24
          }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 12
            }}>
              Ready to start
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 28, lineHeight: 1.6 }}>
              Make sure the microphone is on and the transcription script is running before you begin.
            </p>
            <button
              onClick={startLecture}
              style={{
                background: '#D4A94C', color: '#0A1930',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16, fontWeight: 800, padding: '16px 48px',
                borderRadius: 12, border: 'none', cursor: 'pointer'
              }}
            >
              Start Lecture
            </button>
          </div>
        ) : (
          <div style={{
            background: 'white', borderRadius: 20,
            border: '0.5px solid rgba(10,25,48,0.08)',
            padding: '24px 28px', marginBottom: 24
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 16
            }}>
              <span style={{
                fontSize: 14, fontWeight: 700, color: '#0A1930',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                Live transcript
              </span>
              <button
                onClick={endLecture}
                style={{
                  background: 'rgba(220,38,38,0.08)', color: '#dc2626',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12, fontWeight: 700, padding: '8px 18px',
                  borderRadius: 8, border: '0.5px solid rgba(220,38,38,0.2)',
                  cursor: 'pointer'
                }}
              >
                End Lecture
              </button>
            </div>
            <div style={{
              background: '#FAF7F2', borderRadius: 12,
              padding: '20px', minHeight: 150, maxHeight: 300, overflowY: 'auto'
            }}>
              <p style={{ fontSize: 14, color: '#0A1930', lineHeight: 1.7, margin: 0 }}>
                {transcript || 'Waiting for speech...'}
              </p>
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* INFO CARD */}
        <div style={{
          background: 'rgba(212,169,76,0.06)',
          border: '0.5px solid rgba(212,169,76,0.2)',
          borderRadius: 16, padding: '18px 22px'
        }}>
          <p style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#0A1930' }}>Note:</strong> This panel only shows the live transcript for monitoring.
            The actual transcription is powered by <code>transcribe.py</code> running separately.
            Make sure <code>server.js</code> and <code>transcribe.py</code> are both running before starting a lecture.
          </p>
        </div>

      </div>
    </div>
  )
}