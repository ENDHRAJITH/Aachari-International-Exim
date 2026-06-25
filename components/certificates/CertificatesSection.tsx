'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Award } from 'lucide-react'
import CertificateModal from './CertificateModal'

interface Certificate {
  id: string
  name: string
  issued_by: string | null
  certificate_number: string | null
  image_url: string | null
  valid_until: string | null
  is_active: boolean
}

interface CertificatesSectionProps {
  mode?: 'home' | 'full'
}

export default function CertificatesSection({ mode = 'full' }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Certificate | null>(null)

  useEffect(() => {
    fetch('/api/certificates')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCertificates(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const displayed = mode === 'home' ? certificates.slice(0, 3) : certificates

  const dark = mode === 'home'

  return (
    <section style={{
      padding: dark ? '64px 24px' : '40px 24px',
      backgroundColor: dark ? '#1A1A1A' : '#F8F7F4'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontSize: '13px',
            color: '#C1622A',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Certified & Trusted
          </span>
          <h2 style={{
            fontSize: dark ? '28px' : '32px',
            fontWeight: 700,
            color: dark ? '#ffffff' : '#1A1A1A',
            margin: '8px 0'
          }}>
            Our Certifications
          </h2>
          <p style={{
            color: dark ? '#A8A8A8' : '#6B6B6B',
            fontSize: '14px',
            margin: 0
          }}>
            Internationally recognized certifications ensuring quality and compliance
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height: '160px',
                backgroundColor: dark ? '#2A2A2A' : '#F0EBE3',
                borderRadius: '14px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {displayed.map((cert, idx) => (
              <div
                key={cert.id}
                onClick={() => setSelected(cert)}
                style={{
                  // ✅ flex column so footer can be pushed to bottom
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: dark ? '#242424' : '#ffffff',
                  borderRadius: '14px',
                  border: `1px solid ${dark ? '#2A2A2A' : '#E8E0D8'}`,
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: `fadeInCard 0.4s ease ${idx * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = '#C1622A'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(193,98,42,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = dark ? '#2A2A2A' : '#E8E0D8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#C1622A15',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  flexShrink: 0
                }}>
                  <Award size={22} color="#C1622A" />
                </div>

                {/* Name */}
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: dark ? '#ffffff' : '#1A1A1A',
                  margin: '0 0 6px',
                  lineHeight: 1.3
                }}>
                  {cert.name}
                </h3>

                {/* Issued by */}
                {cert.issued_by && (
                  <p style={{
                    fontSize: '12px',
                    color: dark ? '#A8A8A8' : '#6B6B6B',
                    margin: '0 0 12px',
                    lineHeight: 1.4
                  }}>
                    {cert.issued_by}
                  </p>
                )}

                {/* ✅ spacer pushes footer to bottom regardless of content height */}
                <div style={{ flex: 1 }} />

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: `1px solid ${dark ? '#2A2A2A' : '#F0EBE3'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A'
                    }} />
                    <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                      Active
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#C1622A', fontWeight: 600 }}>
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All — home mode only */}
        {mode === 'home' && certificates.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link
              href="/certificates"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#C1622A',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <FileText size={16} />
              Explore All Certificates →
            </Link>
          </div>
        )}
      </div>

      <CertificateModal cert={selected} onClose={() => setSelected(null)} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}