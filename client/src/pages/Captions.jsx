import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Captions() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('join') // join, connecting, live
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('connecting')
  const [sentences, setSentences] = useState([])
  const [captions, setCaptions] = useState('')
  const [fontSize, setFontSize] = useState(22)
  const [error, setError] = useState('')
  const wsRef = useRef(null)
  const bottomRef = useRef(null)
  const reconnectRef = useRef(null)

  const getServerUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'ws://localhost:3000'
  }
  return 'wss://echodesk-server.onrender.com'
}

  const joinSession = () => {
    if (!code.trim()) {
      setError('Please enter a session code')
      return
    }
    setError('')
    setScreen('connecting')
    connect(code.trim().toUpperCase())
  }

  const connect = (sessionCode) => {
    try {
      const ws = new WebSocket(getServerUrl())
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'join_session', code: sessionCode }))
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        if (msg.type === 'joined') {
          setStatus('connected')
          setScreen('live')
        }

        if (msg.type === 'error') {
          setError(msg.message)
          setScreen('join')
        }

        if (msg.type === 'caption') {
          const newText = msg.text
          setCaptions(newText)
          const parts = newText.split('\n').filter(s => s.trim().length > 0)
          setSentences(parts)
          setStatus('live')
        }

        if (msg.type === 'lecture_ended') {
          sessionStorage.setItem('echodesk_transcript', msg.transcript || captions)
          navigate('/summary')
        }

        if (msg.type === 'lecturer_disconnected') {
          setStatus('waiting')
        }
      }

      ws.onerror = () => {
        setError('Connection failed. Check your internet and try again.')
        setScreen('join')
      }

      ws.onclose = () => {
        if (screen === 'live') {
          setStatus('reconnecting')
          reconnectRef.current = setTimeout(() => connect(sessionCode), 3000)
        }
      }
    } catch (err) {
      setError('Connection failed. Try again.')
      setScreen('join')
    }
  }

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
    }
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [sentences])

  const statusConfig = {
    connecting: { color: '#9a7520', bg: 'rgba(212,169,76,0.1)', dot: '#D4A94C', text: 'Connecting...' },
    connected: { color: '#4a5568', bg: 'rgba(10,25,48,0.06)', dot: '#D4A94C', text: 'Waiting for lecturer...' },
    live: { color: '#16a34a', bg: 'rgba(34,197,94,0.1)', dot: '#22c55e', text: 'Live' },
    waiting: { color: '#9a7520', bg: 'rgba(212,169,76,0.1)', dot: '#D4A94C', text: 'Lecturer paused...' },
    reconnecting: { color: '#9a7520', bg: 'rgba(212,169,76,0.1)', dot: '#D4A94C', text: 'Reconnecting...' },
  }

  const s = statusConfig[status] || statusConfig.connecting

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        @media (max-width: 480px) {
          .caps-status { display: none !important; }
          .caps-fontlabel { display: none !important; }
          .caps-fontbtn { width: 24px !important; height: 24px !important; font-size: 12px !important; }
          .caps-endbtn { font-size: 10px !important; padding: 5px 10px !important; }
          .caps-nav { padding: 10px 14px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="caps-nav" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid rgba(10,25,48,0.08)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: '#0A1930',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10" stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0A1930', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Echo<span style={{ color: '#D4A94C' }}>Desk</span>
          </span>
        </div>

        {screen === 'live' && (
          <>
            <div className="caps-status" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: s.bg, color: s.color,
              fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
              transition: 'all 0.3s ease'
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: s.dot,
                display: 'inline-block',
                animation: status === 'live' ? 'pulse 1.5s infinite' : 'none'
              }} />
              {s.text}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="caps-fontlabel" style={{ fontSize: 11, color: '#4a5568', fontWeight: 500 }}>
                Text size
              </span>
              <button className="caps-fontbtn"
                onClick={() => setFontSize(f => Math.max(14, f - 2))}
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  border: '0.5px solid rgba(10,25,48,0.15)',
                  background: 'white', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, color: '#0A1930',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >−</button>
              <button className="caps-fontbtn"
                onClick={() => setFontSize(f => Math.min(40, f + 2))}
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  border: '0.5px solid rgba(10,25,48,0.15)',
                  background: 'white', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, color: '#0A1930',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >+</button>
            </div>
          </>
        )}
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* JOIN SCREEN */}
        {screen === 'join' && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '40px 24px'
          }}>
            <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, background: '#0A1930', borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10" stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 26, fontWeight: 800, color: '#0A1930', marginBottom: 8
              }}>
                Join a lecture
              </h1>
              <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.6, marginBottom: 32 }}>
                Enter the session code your lecturer shared to see live captions.
              </p>

              {error && (
                <div style={{
                  background: 'rgba(220,38,38,0.08)',
                  border: '0.5px solid rgba(220,38,38,0.2)',
                  borderRadius: 10, padding: '10px 16px',
                  fontSize: 13, color: '#dc2626', marginBottom: 16
                }}>
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Enter code (e.g. ABC123)"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && joinSession()}
                maxLength={6}
                style={{
                  width: '100%', padding: '16px 20px',
                  fontSize: 24, fontWeight: 800, textAlign: 'center',
                  letterSpacing: 6, border: '0.5px solid rgba(10,25,48,0.2)',
                  borderRadius: 12, background: 'white', color: '#0A1930',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  outline: 'none', marginBottom: 16
                }}
              />
              <button
                onClick={joinSession}
                style={{
                  width: '100%', background: '#0A1930', color: '#D4A94C',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 15, fontWeight: 800, padding: '15px',
                  borderRadius: 12, border: 'none', cursor: 'pointer'
                }}
              >
                Join Lecture
              </button>
            </div>
          </div>
        )}

        {/* CONNECTING SCREEN */}
        {screen === 'connecting' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '3px solid rgba(10,25,48,0.08)',
              borderTop: '3px solid #D4A94C',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: '#0A1930' }}>
              Joining lecture...
            </p>
          </div>
        )}

        {/* LIVE CAPTIONS SCREEN */}
        {screen === 'live' && (
          <div style={{ flex: 1, padding: '24px', maxWidth: 800, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
            {sentences.length === 0 ? (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(212,169,76,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10" stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={{ fontSize: 18, fontWeight: 600, color: '#0A1930', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Connected. Waiting for lecture to start.
                </p>
                <p style={{ fontSize: 13, color: '#4a5568' }}>
                  Captions will appear here the moment the lecturer starts speaking.
                </p>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{
                  background: 'white', border: '0.5px solid rgba(10,25,48,0.08)',
                  borderRadius: 20, padding: '28px 32px',
                  boxShadow: '0 4px 24px rgba(10,25,48,0.06)',
                  minHeight: 200, overflowY: 'auto', maxHeight: '70vh'
                }}>
                  {sentences.map((sentence, index) => {
                    const isLatest = index === sentences.length - 1
                    const isRecent = index === sentences.length - 2
                    return (
                      <p key={index} style={{
                        fontSize: isLatest ? fontSize : fontSize - 2,
                        color: isLatest ? '#0A1930' : isRecent ? 'rgba(10,25,48,0.55)' : 'rgba(10,25,48,0.3)',
                        lineHeight: 1.75, margin: 0, marginBottom: 14,
                        fontWeight: isLatest ? 600 : 400,
                        animation: isLatest ? 'slideUp 0.3s ease' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        {sentence}
                      </p>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
                <div style={{
                  marginTop: 16, padding: '12px 20px',
                  background: 'rgba(34,197,94,0.06)',
                  borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#22c55e', display: 'inline-block',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                    Live captions active
                  </span>
                  <span style={{ fontSize: 12, color: '#4a5568', marginLeft: 'auto' }}>
                    Use + and − to adjust text size
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        borderTop: '0.5px solid rgba(10,25,48,0.08)',
        padding: '14px 24px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'rgba(250,247,242,0.94)'
      }}>
        <div style={{
          width: 20, height: 20, background: '#0A1930',
          borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
            <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10" stroke="#D4A94C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#0A1930', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Echo<span style={{ color: '#D4A94C' }}>Desk</span>
        </span>
        <span style={{ fontSize: 10, color: '#4a5568', marginLeft: 8, whiteSpace: 'nowrap' }}>
          Zero cost · No app needed
        </span>
      </div>
    </div>
  )
}