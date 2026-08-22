import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Summary() {
  const navigate = useNavigate()
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('echodesk_transcript')
    if (stored && stored.trim().length > 0) {
      setTranscript(stored)
      generateSummary(stored)
    } else {
      setLoading(false)
      setSummary([])
    }
  }, [])

  const generateSummary = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const summaryLength = Math.min(5, Math.ceil(sentences.length * 0.3) || 1)
    const step = Math.max(1, Math.floor(sentences.length / summaryLength))
    const summaryPoints = []
    for (let i = 0; i < summaryLength; i++) {
      const idx = i * step
      if (sentences[idx]) summaryPoints.push(sentences[idx].trim())
    }
    setSummary(summaryPoints)

    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','it','its','we','you','he','she','they','i','my','your','our','their','so','if','not','no','just','like','also','about','what','which','who','how','when','where','why'])
    const words = text.toLowerCase().split(/\s+/)
    const freq = {}
    words.forEach(w => {
      const clean = w.replace(/[^a-z]/g, '')
      if (clean.length > 4 && !stopWords.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1
      }
    })
    const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([word]) => word)
    const starters = [
      'What is the significance of',
      'Explain the concept of',
      'How does',
      'What are the key points about',
      'Describe the relationship between'
    ]
    const generatedQuestions = starters.slice(0, keywords.length).map((starter, i) => `${starter} ${keywords[i]}?`)
    setQuestions(generatedQuestions)
    setLoading(false)
  }

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    const divider = '='.repeat(40)
    const keyPoints = summary.map((p, i) => `${i + 1}. ${p}`).join('\n')
    const practiceQs = questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
    const content = `ECHODESK LECTURE SUMMARY\n${divider}\n\nKEY POINTS\n${keyPoints}\n\n${divider}\n\nPRACTICE QUESTIONS\n${practiceQs}\n\n${divider}\n\nFULL TRANSCRIPT\n${transcript}`
    downloadFile(content, 'echodesk-full-lecture.txt')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid rgba(10,25,48,0.08)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: '#0A1930',
            borderRadius: 8, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10"
                stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontWeight: 800, fontSize: 15, color: '#0A1930',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Echo<span style={{ color: '#D4A94C' }}>Desk</span>
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(212,169,76,0.1)', color: '#9a7520',
          fontSize: 11, fontWeight: 600,
          padding: '5px 12px', borderRadius: 20
        }}>
          Lecture ended
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#0A1930', color: '#D4A94C',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12, fontWeight: 700, padding: '8px 16px',
            borderRadius: 8, border: 'none', cursor: 'pointer'
          }}
        >
          New Lecture
        </button>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>

        <div style={{ marginBottom: 40, animation: 'fadeUp 0.6s ease both' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '1.4px',
            textTransform: 'uppercase', color: '#D4A94C', marginBottom: 8
          }}>
            Lecture complete
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
            color: '#0A1930', letterSpacing: '-0.5px', marginBottom: 8
          }}>
            Your lecture summary
          </h1>
          <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.6 }}>
            Here is what was covered in today's lecture, with practice questions to help you revise.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(10,25,48,0.08)',
              borderTop: '3px solid #D4A94C',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontSize: 14, color: '#4a5568' }}>Generating your summary...</p>
          </div>
        ) : (
          <>
            {/* SUMMARY */}
            <div style={{
              background: 'white', borderRadius: 20,
              border: '0.5px solid rgba(10,25,48,0.08)',
              padding: '28px 32px', marginBottom: 24,
              animation: 'fadeUp 0.6s ease 0.1s both'
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 10, marginBottom: 20
              }}>
                <div style={{
                  width: 32, height: 32, background: '#0A1930',
                  borderRadius: 8, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12h6M9 16h6M9 8h6M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
                      stroke="#D4A94C" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <span style={{
                  fontSize: 15, fontWeight: 700, color: '#0A1930',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  Key points covered
                </span>
              </div>
              {summary.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {summary.map((point, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start',
                      gap: 12, marginBottom: 14, paddingBottom: 14,
                      borderBottom: i < summary.length - 1
                        ? '0.5px solid rgba(10,25,48,0.06)' : 'none'
                    }}>
                      <div style={{
                        width: 22, height: 22, minWidth: 22,
                        background: 'rgba(212,169,76,0.15)',
                        borderRadius: 6, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', marginTop: 2
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#9a7520' }}>
                          {i + 1}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, color: '#0A1930', lineHeight: 1.7, margin: 0 }}>
                        {point}.
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.7 }}>
                  No transcript available. Make sure the lecture was running before ending.
                </p>
              )}
            </div>

            {/* PRACTICE QUESTIONS */}
            {questions.length > 0 && (
              <div style={{
                background: '#0A1930', borderRadius: 20,
                padding: '28px 32px', marginBottom: 24,
                animation: 'fadeUp 0.6s ease 0.2s both'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, marginBottom: 20
                }}>
                  <div style={{
                    width: 32, height: 32,
                    background: 'rgba(212,169,76,0.15)',
                    borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#D4A94C" strokeWidth="1.8" />
                      <path d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V14M12 17V17.5"
                        stroke="#D4A94C" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{
                    fontSize: 15, fontWeight: 700, color: 'white',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}>
                    Practice questions
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {questions.map((q, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 12, padding: '14px 18px',
                      display: 'flex', alignItems: 'flex-start', gap: 12
                    }}>
                      <span style={{
                        width: 24, height: 24, minWidth: 24,
                        background: '#D4A94C', borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: '#0A1930',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}>{i + 1}</span>
                      <p style={{
                        fontSize: 14, color: 'rgba(255,255,255,0.85)',
                        lineHeight: 1.6, margin: 0
                      }}>{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FULL TRANSCRIPT */}
            {transcript && (
              <div style={{
                background: 'white', borderRadius: 20,
                border: '0.5px solid rgba(10,25,48,0.08)',
                padding: '28px 32px',
                animation: 'fadeUp 0.6s ease 0.3s both'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 16,
                  flexWrap: 'wrap', gap: 8
                }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700, color: '#0A1930',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}>
                    Full transcript
                  </span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={copyTranscript}
                      style={{
                        background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(10,25,48,0.06)',
                        color: copied ? '#16a34a' : '#0A1930',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12, fontWeight: 600,
                        padding: '6px 14px', borderRadius: 8,
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => downloadFile(transcript, 'echodesk-transcript.txt')}
                      style={{
                        background: 'rgba(10,25,48,0.06)', color: '#0A1930',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12, fontWeight: 600,
                        padding: '6px 14px', borderRadius: 8,
                        border: 'none', cursor: 'pointer'
                      }}
                    >
                      Download transcript
                    </button>
                    <button
                      onClick={downloadAll}
                      style={{
                        background: '#0A1930', color: '#D4A94C',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 12, fontWeight: 700,
                        padding: '6px 14px', borderRadius: 8,
                        border: 'none', cursor: 'pointer'
                      }}
                    >
                      Download all
                    </button>
                  </div>
                </div>
                <p style={{
                  fontSize: 13, color: '#4a5568',
                  lineHeight: 1.8, margin: 0,
                  maxHeight: 200, overflowY: 'auto'
                }}>
                  {transcript}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}