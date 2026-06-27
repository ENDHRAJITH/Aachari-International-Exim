'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { BookOpen, Download, ArrowRight } from 'lucide-react'

// SSR false — react-pdf uses DOMMatrix which is browser-only
const CatalogueViewer = dynamic(
  () => import('@/components/catalogue/CatalogueViewer'),
  { ssr: false }
)

const CATALOGUE_PDF = '/catalogue.pdf'

export default function CataloguePageClient() {
  const [viewerOpen, setViewerOpen] = useState(false)

  return (
    <>
      {/* ── Page ── */}
      <main
      style={{
  minHeight: '100vh',
  background: 'linear-gradient(160deg, #0D0D0D 0%, #1A0C04 50%, #0D0D0D 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  marginTop: '100px',

  paddingBottom: '48px',
  paddingLeft: '24px',
  paddingRight: '24px',

  position: 'relative',
  overflow: 'hidden',
}}
      >
        {/* Background grain */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          }}
        />

        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '500px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(255,120,40,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Hero content ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '580px',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,140,60,0.25)',
              background: 'rgba(255,140,60,0.06)',
              color: '#FF9A50',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            <BookOpen size={11} />
            2026 Edition
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            Export{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #FF8C3A, #FFB86C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Catalogue
            </span>
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}
          >
            Browse our complete range of premium Indian spices with full specs,
            HSN codes, and certifications — built for international buyers.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewerOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #FF8C3A 0%, #C0440A 100%)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                boxShadow: '0 8px 32px rgba(255,100,40,0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 12px 40px rgba(255,100,40,0.35)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 32px rgba(255,100,40,0.25)'
              }}
            >
              <BookOpen size={16} />
              View Catalogue
              <ArrowRight size={15} />
            </button>

            <a
              href={CATALOGUE_PDF}
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                padding: '14px 28px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.25)'
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.12)'
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.04)'
              }}
            >
              <Download size={16} />
              Download PDF
            </a>
          </div>

        
        </div>
      </main>

      {/* ── Catalogue viewer modal ── */}
      {viewerOpen && (
        <CatalogueViewer
          fileUrl={CATALOGUE_PDF}
          name="Aachari International — Export Catalogue 2026"
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  )
}