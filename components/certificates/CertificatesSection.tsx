'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CertificateCard from './CertificateCard'
import CertificateModal from './CertificateModal'

interface Certificate {
  id: string
  name: string
  issued_by: string | null
  certificate_number: string | null
  image_url: string | null
  pdf_url: string | null
  valid_until: string | null
  is_active: boolean
}

interface Props {
  mode?: 'home' | 'full'
}

export default function CertificatesSection({ mode = 'full' }: Props) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Certificate | null>(null)

  useEffect(() => {
    fetch('/api/certificates')
      .then(r => r.json())
      .then(data => { if (data.success) setCertificates(data.data) })
      .finally(() => setLoading(false))
  }, [])

  const displayed = mode === 'home' ? certificates.slice(0, 3) : certificates

  return (
    <section className="mt-30" style={{
      padding: mode === 'home' ? '64px 24px' : '40px 24px',
      backgroundColor: mode === 'home' ? '#ffffff' : '#F7F1E3'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontSize: '13px', color: '#C1622A',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            Certified & Trusted
          </span>
          <h2 style={{
            fontSize: mode === 'home' ? '28px' : '32px',
            fontWeight: 700,
            color: mode === 'home' ? '#ffffff' : '#1A1A1A',
            margin: '8px 0 8px'
          }}>
            Our Certifications
          </h2>
          <p style={{
            color: mode === 'home' ? '#A8A8A8' : '#6B6B6B',
            fontSize: '14px', margin: 0
          }}>
            Internationally recognized certifications ensuring quality and compliance
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '320px',
                backgroundColor: mode === 'home' ? '#2A2A2A' : '#F0EBE3',
                borderRadius: '16px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
          </div>
        ) : certificates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: mode === 'home' ? '#666' : '#9c7a6a' }}>
            <p style={{ fontSize: '16px' }}>Certificates coming soon</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {displayed.map(cert => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                onClick={() => setSelected(cert)}
              />
            ))}
          </div>
        )}

        {/* View All button — home mode */}
        {mode === 'home' && certificates.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link
              href="/certificates"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#C1622A', color: '#ffffff',
                padding: '12px 28px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, textDecoration: 'none'
              }}
            >
              View All Certificates →
            </Link>
          </div>
        )}
      </div>

      {/* Modal */}
      <CertificateModal cert={selected} onClose={() => setSelected(null)} />

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </section>
  )
}