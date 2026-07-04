'use client'

import { useEffect, useState } from 'react'

interface IncoTerm {
  id: string
  label: string
  value: string
}

export default function IncoTermsSection() {
  const [terms, setTerms] = useState<IncoTerm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/inco-terms')
      .then(r => r.json())
      .then(data => { if (data.success) setTerms(data.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section style={{
      backgroundColor: '#F8F7F4',
      borderRadius: '14px',
      border: '1px solid #E8E0D8',
      padding: '32px'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{
          fontSize: '13px', color: '#C1622A',
          fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          Trade Terms
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: '8px 0 0' }}>
          INCO Terms
        </h2>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              height: '72px', backgroundColor: '#F0EBE3',
              borderRadius: '10px', animation: 'pulse 1.5s infinite'
            }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {terms.map((term) => (
            <div key={term.id} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E8E0D8',
              borderRadius: '10px',
              padding: '16px 18px'
            }}>
              <p style={{
                fontSize: '11px', color: '#6B6B6B',
                fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.4px', margin: '0 0 6px'
              }}>
                {term.label}
              </p>
              <p style={{
                fontSize: '14px', color: '#1A1A1A',
                fontWeight: 500, margin: 0, lineHeight: 1.4
              }}>
                {term.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}