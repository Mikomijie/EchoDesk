import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const recentLectures = [
  { title: 'Biology 302: Molecular Genetics', lecturer: 'Dr. Okafor', time: '129m', color: '#4CAF50' },
  { title: 'Organic Chemistry 201', lecturer: 'Dr. Uhafer', time: '12.05h', color: '#2196F3' },
  { title: 'Introduction to AI', lecturer: 'Dr. Smith', time: '16m', color: '#FF9800' },
]

const features = [
  { icon: '⏺', title: 'Real-time Transcription', desc: 'Live captions appear on any device instantly' },
  { icon: '📝', title: 'Automated Summaries', desc: 'AI generates study notes from every lecture' },
  { icon: '🔍', title: 'Searchable History', desc: 'Search your lectures and transcripts anytime' },
  { icon: '👤', title: 'Speaker Identification', desc: 'Color-coded lecturer and student voices' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <Sidebar />

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px' }}>

        {/* SEARCH BAR */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'white', border: '0.5px solid rgba(10,25,48,0.1)',
          borderRadius: 12, padding: '10px 16px', marginBottom: 32,
          maxWidth: 480
        }}>
          <span style={{ color: '#94a3b8' }}>🔍</span>
          <input
            placeholder="Find transcripts, course materials..."
            style={{
              border: 'none', outline: 'none', fontSize: 13,
              color: '#0A1930', background: 'transparent', flex: 1
            }}
          />
        </div>

        {/* WELCOME */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: '#4a5568', marginBottom: 4 }}>
            EchoDesk • Welcome back
          </p>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800,
            color: '#0A1930', letterSpacing: '-0.5px', marginBottom: 24
          }}>
            Every lecture, <span style={{ color: '#D4A94C' }}>readable</span> in real time.
          </h1>

          {/* FEATURE CARDS */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16, marginBottom: 32
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 12,
                border: '0.5px solid rgba(10,25,48,0.08)',
                padding: '16px', cursor: 'pointer',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1930', marginBottom: 4 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.5 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>

          {/* JOIN LECTURE BUTTON */}
          <div
            onClick={() => navigate('/join')}
            style={{
              background: '#0A1930', borderRadius: 16,
              padding: '40px', textAlign: 'center',
              cursor: 'pointer', marginBottom: 32,
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <div style={{
              fontSize: 28, fontWeight: 800, color: '#D4A94C',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: 2
            }}>
              JOIN LECTURE
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
              Enter your session code to see live captions
            </div>
          </div>

          {/* RECENT LECTURES */}
          <div>
            <h3 style={{
              fontSize: 13, fontWeight: 600, color: '#4a5568',
              textTransform: 'uppercase', letterSpacing: '0.8px',
              marginBottom: 16
            }}>
              Recent Lectures
            </h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {recentLectures.map((lec, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 12,
                  border: '0.5px solid rgba(10,25,48,0.08)',
                  padding: '14px 16px', cursor: 'pointer',
                  minWidth: 200, flex: 1,
                  transition: 'transform 0.15s'
                }}
                onClick={() => navigate('/history')}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: lec.color, marginBottom: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14
                  }}>📚</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1930', marginBottom: 2 }}>
                    {lec.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#4a5568' }}>
                    {lec.lecturer} • {lec.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}