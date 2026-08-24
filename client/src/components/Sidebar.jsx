import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/', icon: '⊞' },
  { label: 'Live Capture', path: '/captions', icon: '⏺' },
  { label: 'Lectures', path: '/history', icon: '📚' },
  { label: 'Transcript', path: '/summary', icon: '📝' },
  { label: 'Glossary', path: '/glossary', icon: '📖' },
  { label: 'Study Notes', path: '/summary', icon: '✏️' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{
      width: 220, minHeight: '100vh', background: '#0A1930',
      display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'fixed', left: 0, top: 0,
      fontFamily: "'Inter', sans-serif", zIndex: 50
    }}>
      {/* LOGO */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px', marginBottom: 32
      }}>
        <div style={{
          width: 32, height: 32, background: '#D4A94C',
          borderRadius: 8, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M2 10 Q5 4 8 10 Q11 16 14 10 Q16 6 18 10"
              stroke="#0A1930" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{
          fontWeight: 800, fontSize: 16, color: 'white',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          Echo<span style={{ color: '#D4A94C' }}>Desk</span>
        </span>
      </div>

      {/* NAV ITEMS */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                marginBottom: 4, cursor: 'pointer',
                background: isActive ? 'rgba(212,169,76,0.15)' : 'transparent',
                color: isActive ? '#D4A94C' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* SETTINGS */}
      <div style={{ padding: '0 12px' }}>
        <div
          onClick={() => {}}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10,
            cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
            fontSize: 13
          }}
        >
          <span>⚙️</span> Settings
        </div>
      </div>
    </div>
  )
}