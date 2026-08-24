import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const lectures = [
  { title: 'Biology 302: Molecular Genetics', lecturer: 'Dr. Okafor', date: 'Aug 18, 2026 - 11:00am', status: 'Complete' },
  { title: 'Organic Chemistry 201: Introduction', lecturer: 'Dr. Uhafer', date: 'Aug 20, 2026 - 11:00am', status: 'Complete' },
  { title: 'Cell Biology 101', lecturer: 'Dr. Eze', date: 'Aug 21, 2026 - 11:00am', status: 'Complete' },
  { title: 'Physics 101', lecturer: 'Dr. Bello', date: 'Aug 22, 2026 - 11:00am', status: 'Complete' },
  { title: 'Introduction to AI', lecturer: 'Dr. Smith', date: 'Aug 22, 2026 - 2:00pm', status: 'Complete' },
]

export default function History() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 28, fontWeight: 800, color: '#0A1930'
          }}>
            All Lectures
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <select style={{
              border: '0.5px solid rgba(10,25,48,0.15)', borderRadius: 8,
              padding: '8px 12px', fontSize: 12, color: '#0A1930',
              background: 'white', cursor: 'pointer'
            }}>
              <option>All Subjects</option>
              <option>Biology</option>
              <option>Chemistry</option>
              <option>Physics</option>
            </select>
            <select style={{
              border: '0.5px solid rgba(10,25,48,0.15)', borderRadius: 8,
              padding: '8px 12px', fontSize: 12, color: '#0A1930',
              background: 'white', cursor: 'pointer'
            }}>
              <option>All Dates</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        <div style={{
          background: 'white', borderRadius: 16,
          border: '0.5px solid rgba(10,25,48,0.08)', overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px',
            padding: '12px 20px', borderBottom: '0.5px solid rgba(10,25,48,0.06)',
            fontSize: 11, fontWeight: 600, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            <span>Lecture Title</span>
            <span>Date & Time</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {lectures.map((lec, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px',
              padding: '16px 20px',
              borderBottom: i < lectures.length - 1 ? '0.5px solid rgba(10,25,48,0.04)' : 'none',
              alignItems: 'center', cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,25,48,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => navigate('/summary')}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0A1930', marginBottom: 2 }}>
                  {lec.title}
                </div>
                <div style={{ fontSize: 12, color: '#4a5568' }}>{lec.lecturer}</div>
              </div>
              <div style={{ fontSize: 12, color: '#4a5568' }}>{lec.date}</div>
              <div>
                <span style={{
                  background: 'rgba(34,197,94,0.1)', color: '#16a34a',
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20
                }}>
                  {lec.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  background: 'rgba(10,25,48,0.06)', border: 'none',
                  borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                  fontSize: 12, color: '#0A1930'
                }}>View</button>
                <button style={{
                  background: 'rgba(10,25,48,0.06)', border: 'none',
                  borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                  fontSize: 12, color: '#0A1930'
                }}>⬇</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}