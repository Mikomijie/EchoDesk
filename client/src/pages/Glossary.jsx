import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const glossaryTerms = [
  { term: 'CRISPR-Cas9', definition: 'A precision gene-editing tool derived from bacteria.', source: 'Biology 302: Molecular Genetics' },
  { term: 'Diploid', definition: 'A cell containing two complete sets of chromosomes.', source: 'Biology 302: Molecular Genetics' },
  { term: 'Transcription', definition: 'The process of making an RNA copy of a gene\'s DNA sequence.', source: 'Multiple Lectures' },
  { term: 'Algorithm', definition: 'A set of rules or instructions followed by a computer to solve a problem.', source: 'Introduction to AI' },
  { term: 'Machine Learning', definition: 'A type of AI that allows systems to learn from data without being explicitly programmed.', source: 'Introduction to AI' },
  { term: 'Molecular Genetics', definition: 'The study of the structure and function of genes at the molecular level.', source: 'Biology 302: Molecular Genetics' },
  { term: 'Neural Network', definition: 'A series of algorithms that mimic the human brain to recognize patterns.', source: 'Introduction to AI' },
  { term: 'Oxidation', definition: 'A chemical reaction where a substance loses electrons.', source: 'Organic Chemistry 201' },
]

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState('A')

  const filtered = glossaryTerms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    (search === '' && t.term.startsWith(activeLetter))
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', display: 'flex', gap: 32 }}>

        {/* ALPHABET NAV */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 80 }}>
          {alphabet.map(letter => (
            <div
              key={letter}
              onClick={() => { setActiveLetter(letter); setSearch('') }}
              style={{
                width: 28, height: 28, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: activeLetter === letter ? '#0A1930' : 'transparent',
                color: activeLetter === letter ? '#D4A94C' : '#4a5568',
                transition: 'all 0.15s'
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 28, fontWeight: 800, color: '#0A1930'
            }}>
              Glossary
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'white', border: '0.5px solid rgba(10,25,48,0.1)',
              borderRadius: 10, padding: '8px 14px'
            }}>
              <span style={{ color: '#94a3b8' }}>🔍</span>
              <input
                placeholder="Search terms..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: 'none', outline: 'none',
                  fontSize: 13, color: '#0A1930', background: 'transparent'
                }}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: '#4a5568', fontSize: 14 }}>
              No terms found for "{activeLetter}"
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map((term, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16,
                  border: '0.5px solid rgba(10,25,48,0.08)',
                  padding: '20px 24px'
                }}>
                  <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 18, fontWeight: 800, color: '#0A1930', marginBottom: 6
                  }}>
                    {term.term}
                  </h3>
                  <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.6, marginBottom: 8 }}>
                    {term.definition}
                  </p>
                  <span style={{
                    fontSize: 11, color: '#9a7520', fontWeight: 600,
                    background: 'rgba(212,169,76,0.1)',
                    padding: '3px 10px', borderRadius: 20
                  }}>
                    Source: {term.source}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}