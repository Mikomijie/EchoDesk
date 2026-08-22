import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const demoLines = [
  "A lecturer speaks. EchoDesk listens...",
  "Every word transcribed, zero cost ofr students, in real time...",
  "Zero Cost for students. Just the lecture, readable.",
  "Built for deaf students at UNIBEN and beyond.",
  "Communication, made visible for everyone."
]

const steps = [
  {
    num: '1',
    title: 'Lecturer wears the mic',
    desc: 'A small wireless lapel mic clips to their shirt. They teach normally. Nothing changes.',
    shade: 'rgba(212,169,76,0.15)'
  },
  {
    num: '2',
    title: 'Speech becomes text, with zero cost for students',
    desc: 'The laptop transcribes every word locally using AI. Zero Cost for Students, no cloud.',
    shade: 'rgba(212,169,76,0.3)'
  },
  {
    num: '3',
    title: 'Students read it live',
    desc: 'Open a webpage, connect to EchoDesk WiFi. Captions stream in real time instantly.',
    shade: 'rgba(212,169,76,0.55)'
  },
  {
    num: '4',
    title: 'Summary after class',
    desc: 'EchoDesk generates a full summary and practice questions automatically when class ends.',
    shade: '#D4A94C'
  }
]

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`
    }}>
      {children}
    </div>
  )
}

function DotGrid() {
  return (
    <svg style={{
      position: 'absolute', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0
    }}>
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="#0A1930" opacity="0.055" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [demoIndex, setDemoIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const line = demoLines[demoIndex]
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setDisplayed(line.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, 40)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDemoIndex(i => (i + 1) % demoLines.length)
        setDisplayed('')
        setCharIndex(0)
      }, 2800)
      return () => clearTimeout(t)
    }
  }, [charIndex, demoIndex])

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing: border-box; }
       @media (max-width: 768px) {
  .steps-grid { grid-template-columns: 1fr 1fr !important; }
  .nav-links { display: none !important; }
  .nav-offline { display: none !important; }
  .nav-logo-text { font-size: 14px !important; }
  .nav-logo-icon { width: 28px !important; height: 28px !important; }
  .nav-join-btn { font-size: 11px !important; padding: 7px 14px !important; }
          .stat-block { flex-direction: column !important; }
          .stat-divider { display: none !important; }
          .hero-btns { flex-direction: column !important; width: 100% !important; }
          .hero-btns a, .hero-btns button { width: 100% !important; text-align: center !important; }
          .stats-bar { flex-direction: column !important; }
          .stats-bar-item { border-right: none !important; border-bottom: 0.5px solid rgba(10,25,48,0.07) !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid rgba(10,25,48,0.08)'
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', padding: '13px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="nav-logo-icon" style={{
  width: 34, height: 34, background: '#0A1930', borderRadius: 9,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10" stroke="#D4A94C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <span className="nav-logo-text" style={{
  fontWeight: 800, fontSize: 17, letterSpacing: '-0.4px',
  color: '#0A1930', fontFamily: "'Plus Jakarta Sans', sans-serif"
}}>
              Echo<span style={{ color: '#D4A94C' }}>Desk</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
           <span className="nav-offline" style={{
  fontSize: 11, color: '#4a5568', fontWeight: 500,
  display: 'flex', alignItems: 'center', gap: 5
}}>
              <span style={{
                width: 6, height: 6, background: '#22c55e',
                borderRadius: '50%', display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }} />
              Zero cost for students
            </span>
            <a href="#how" className="nav-links" style={{
  fontSize: 13, fontWeight: 500, color: '#0A1930',
  textDecoration: 'none', opacity: 0.55
}}>
              How it works
            </a>
            <button
  className="nav-join-btn"
  onClick={() => navigate('/captions')}
  style={{
    background: '#0A1930', color: '#D4A94C',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13, fontWeight: 700, padding: '9px 20px',
    borderRadius: 10, border: 'none', cursor: 'pointer'
  }}
>
              Join Lecture
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '88px 28px 72px', textAlign: 'center'
      }}>
        <DotGrid />
        <div style={{
          position: 'relative', zIndex: 1, maxWidth: 720,
          margin: '0 auto', display: 'flex',
          flexDirection: 'column', alignItems: 'center'
        }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(30px, 4.5vw, 52px)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px',
            color: '#0A1930', marginBottom: 20,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s'
          }}>
            Every lecture,{' '}
            <span style={{ color: '#D4A94C' }}>readable</span>{' '}
            in real time
          </h1>

          <p style={{
            fontSize: 16, color: '#4a5568', lineHeight: 1.8,
            maxWidth: 440, marginBottom: 12,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s'
          }}>
            Built for deaf students at UNIBEN, and every classroom that forgot them.
          </p>

          <p style={{
            fontSize: 13, color: '#9a7520', fontWeight: 500,
            marginBottom: 36,
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 0.7s ease 0.35s'
          }}>
            Zero cost for students · No app to install · No data needed
          </p>

          <div className="hero-btns" style={{
            display: 'flex', gap: 12, marginBottom: 52,
            flexWrap: 'wrap', justifyContent: 'center',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s'
          }}>
            <button
              onClick={() => navigate('/captions')}
              style={{
                background: '#0A1930', color: '#D4A94C',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15, fontWeight: 800, padding: '15px 38px',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(10,25,48,0.18)',
                transition: 'transform 0.15s, background 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#152a4a'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0A1930'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Join Lecture
            </button>
            <a href="#how" style={{
              background: 'white', color: '#0A1930',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15, fontWeight: 700, padding: '15px 38px',
              borderRadius: 12, border: '0.5px solid rgba(10,25,48,0.15)',
              textDecoration: 'none', display: 'inline-block',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0ebe1'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              See how it works
            </a>
          </div>

          {/* CAPTION DEMO */}
          <div style={{
            width: '100%', maxWidth: 560,
            background: 'white', borderRadius: 18,
            border: '0.5px solid rgba(10,25,48,0.08)',
            padding: '20px 24px',
            boxShadow: '0 8px 40px rgba(10,25,48,0.07)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 14
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840' }} />
                <span style={{
                  fontSize: 11, fontWeight: 500, color: '#0A1930',
                  marginLeft: 8, opacity: 0.4
                }}>
                  EchoDesk · Live Captions
                </span>
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(34,197,94,0.1)', color: '#16a34a',
                fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20
              }}>
                <span style={{
                  width: 5, height: 5, background: '#22c55e',
                  borderRadius: '50%', display: 'inline-block',
                  animation: 'pulse 1.5s infinite'
                }} />
                Live
              </span>
            </div>
            <div style={{
              fontSize: 18, fontWeight: 500, color: '#0A1930',
              lineHeight: 1.65, minHeight: 58
            }}>
              {displayed}
              <span style={{
                display: 'inline-block', width: 2, height: 20,
                background: '#D4A94C', verticalAlign: 'middle',
                marginLeft: 2, animation: 'blink 1s infinite'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* STAT BLOCK - FULL WIDTH */}
      <FadeIn>
        <div className="stat-block" style={{
          background: '#0A1930', color: 'white',
          display: 'flex', alignItems: 'stretch', overflow: 'hidden',
          marginBottom: 72
        }}>
          <div style={{ padding: 'clamp(28px, 5vw, 52px) clamp(20px, 8vw, 10vw)', minWidth: 200, flexShrink: 0 }}>
            <div style={{
              fontSize: 'clamp(44px, 5vw, 64px)', fontWeight: 800,
              color: '#D4A94C', lineHeight: 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>9M+</div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.4)',
              marginTop: 8, lineHeight: 1.5
            }}>
              Nigerians are deaf or hard of hearing
            </div>
          </div>
          <div className="stat-divider" style={{
            width: 1, background: 'rgba(255,255,255,0.08)', flexShrink: 0
          }} />
          <div style={{ padding: 'clamp(28px, 5vw, 52px) clamp(20px, 8vw, 10vw)', flex: 1 }}>
            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.85, margin: 0, maxWidth: 640
            }}>
              At UNIBEN and most Nigerian universities, there are zero sign language
              interpreters or captioning systems in any lecture hall. Students sit for
              two hours, understanding nothing. Not because of inability, but because
              the infrastructure to include them was never built.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* CENTERED CONTENT */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 28px' }}>

        {/* EMILY QUOTE */}
        <section style={{ paddingBottom: 72 }}>
          <FadeIn>
            <div style={{
              borderLeft: '3px solid #D4A94C',
              paddingLeft: 24, maxWidth: 560, margin: '0 auto'
            }}>
              <p style={{
                fontSize: 17, fontStyle: 'italic', color: '#0A1930',
                lineHeight: 1.75, marginBottom: 10, fontWeight: 500
              }}>
                "The lecture itself is where I lose everything. By the time I get home
                and teach myself from the textbook, I am three times behind everyone else."
              </p>
              <span style={{ fontSize: 12, color: '#4a5568', fontWeight: 600 }}>
                Emily, Management Science graduate, University of Benin
              </span>
            </div>
          </FadeIn>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{ paddingBottom: 72 }}>
          <FadeIn>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '1.4px',
              textTransform: 'uppercase', color: '#D4A94C', marginBottom: 8
            }}>
              How it works
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
              color: '#0A1930', letterSpacing: '-0.4px',
              marginBottom: 36, maxWidth: 460
            }}>
              Simple for the lecturer. Powerful for the student.
            </h2>
          </FadeIn>

          <div className="steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14
          }}>
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div style={{
                  background: 'white',
                  border: '0.5px solid rgba(10,25,48,0.07)',
                  borderRadius: 16, padding: '22px 20px', height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(10,25,48,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{
                    width: 34, height: 34,
                    background: step.shade,
                    color: i === 3 ? '#0A1930' : '#6b4e0a',
                    fontSize: 14, fontWeight: 800,
                    borderRadius: 9, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}>
                    {step.num}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: '#0A1930',
                    marginBottom: 8, lineHeight: 1.3,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#4a5568',
                    lineHeight: 1.75, textDecoration: 'none'
                  }}>
                    {step.desc}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* STATS BAR */}
        <section style={{ paddingBottom: 72 }}>
          <FadeIn>
            <div className="stats-bar" style={{
              display: 'flex', background: 'white', borderRadius: 16,
              border: '0.5px solid rgba(10,25,48,0.07)',
              overflow: 'hidden', flexWrap: 'wrap'
            }}>
              {[
                { num: '9.5M+', label: 'Deaf Nigerians' },
                { num: '255', label: 'Universities with zero accessibility' },
                { num: '0', label: 'Interpreters at UNIBEN' },
              ].map((stat, i) => (
                <div key={i} className="stats-bar-item" style={{
                  flex: 1, minWidth: 160, padding: '28px 24px', textAlign: 'center',
                  borderRight: i < 2 ? '0.5px solid rgba(10,25,48,0.07)' : 'none'
                }}>
                  <div style={{
                    fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800,
                    color: '#D4A94C', lineHeight: 1,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}>
                    {stat.num}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#4a5568', marginTop: 6, lineHeight: 1.5
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ILLUSTRATION */}
        <section style={{ paddingBottom: 40 }}>
          <FadeIn>
            <div style={{
              borderRadius: 24, overflow: 'hidden',
              border: '0.5px solid rgba(10,25,48,0.08)',
              boxShadow: '0 8px 40px rgba(10,25,48,0.1)'
            }}>
              <img
                src="/hero-illustration.jpg"
                alt="EchoDesk in action"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <p style={{
              textAlign: 'center', fontSize: 12,
              color: '#4a5568', marginTop: 12, fontStyle: 'italic'
            }}>
              EchoDesk in action. Speech becomes live captions on every student's phone, instantly.
            </p>
          </FadeIn>
        </section>

      </div>

      {/* CTA - FULL WIDTH */}
      <FadeIn>
        <div style={{ paddingBottom: 0 }}>
          <div className="cta-inner" style={{
            background: '#0A1930',
            padding: '72px 10vw', textAlign: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            <svg style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              opacity: 0.03, pointerEvents: 'none'
            }}>
              <defs>
                <pattern id="ctadots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1.2" cy="1.2" r="1.2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctadots)" />
            </svg>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800,
                color: 'white', marginBottom: 14, letterSpacing: '-0.4px'
              }}>
                Ready to follow your lecture?
              </h2>
              <p style={{
                fontSize: 16, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7, maxWidth: 460,
                margin: '0 auto 36px'
              }}>
                Get your session code from your lecturer and tap below to join instantly.
              </p>
              <button
                onClick={() => navigate('/captions')}
                style={{
                  background: '#D4A94C', color: '#0A1930',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16, fontWeight: 800, padding: '17px 52px',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(212,169,76,0.28)',
                  transition: 'transform 0.15s, opacity 0.15s',
                  display: 'block', margin: '0 auto 24px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '0.9'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Join Lecture
              </button>
              <div style={{
                display: 'flex', justifyContent: 'center',
                gap: 28, flexWrap: 'wrap'
              }}>
                {['No setup required', 'No login needed', 'Zero data cost'].map(t => (
                  <span key={t} style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.45)',
                    display: 'flex', alignItems: 'center', gap: 5
                  }}>
                    <span style={{ color: '#22c55e', fontSize: 14 }}>✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* FOOTER */}
      <footer style={{
        borderTop: '0.5px solid rgba(10,25,48,0.08)',
        padding: '24px 28px', textAlign: 'center'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8
        }}>
          <div style={{
            width: 24, height: 24, background: '#0A1930',
            borderRadius: 6, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10"
                stroke="#D4A94C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontWeight: 700, fontSize: 14, color: '#0A1930',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Echo<span style={{ color: '#D4A94C' }}>Desk</span>
          </span>
        </div>
      </footer>

    </div>
  )
}