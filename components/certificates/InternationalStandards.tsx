'use client'

import { Globe } from 'lucide-react'

const standards = [
  { label: 'European Standards' },
  { label: 'Gulf Standards' },
  { label: 'Asian Standards' },
  { label: 'Middle-East Standards' },
]

export default function InternationalStandards() {
  return (
    <section style={{
      padding: '64px 24px',
      backgroundColor: '#1A1A1A'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px'
          }}>
            <Globe size={14} color="#C1622A" />
            <span style={{
              fontSize: '13px',
              color: '#C1622A',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              International Standards
            </span>
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ffffff',
            margin: '8px 0'
          }}>
            We Provide International Standards
          </h2>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {standards.map((std) => (
            <div
              key={std.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#242424',
                borderRadius: '14px',
                border: '1px solid #2A2A2A',
                padding: '32px 20px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = '#C1622A'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(193,98,42,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#2A2A2A'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#C1622A15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                flexShrink: 0
              }}>
                <Globe size={24} color="#C1622A" />
              </div>
              <p style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                textAlign: 'center'
              }}>
                {std.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}