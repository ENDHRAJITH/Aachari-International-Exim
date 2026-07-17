'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Award, Images, Loader2 } from 'lucide-react'

interface CertImage {
  id: string
  image_url: string
  is_primary: boolean
}

interface Certificate {
  id: string
  name: string
  issued_by: string | null
  certificate_number: string | null
  image_url: string | null
  pdf_url: string | null
  valid_until: string | null
  images?: CertImage[]
}

interface Props {
  cert: Certificate
  onClick: () => void
}

// Fetches the PDF as a blob and triggers a download with a clean filename.
// (A Cloudinary fl_attachment URL trick was tried first, but that adds a new
// on-the-fly transformation which many Cloudinary accounts block by default
// — "Strict Transformations" — causing the link to silently fail. Fetching
// the existing, already-allowed URL and saving it as a blob sidesteps that.)
async function downloadPdf(url: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('fetch failed')
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank') // fallback — at least opens the PDF
  }
}

export default function CertificateCard({ cert, onClick }: Props) {
  const [downloading, setDownloading] = useState(false)
  const extraCount = (cert.images?.length ?? (cert.image_url ? 1 : 0)) - 1

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #E8E0D8',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(193,98,42,0.12)'
        e.currentTarget.style.borderColor = '#C1622A'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#E8E0D8'
      }}
    >
      {/* Image */}
      <div
        onClick={onClick}
        style={{
          width: '100%', aspectRatio: '4/3',
          backgroundColor: '#F8F7F4',
          position: 'relative', overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
        {cert.image_url ? (
          <Image
            src={cert.image_url}
            alt={cert.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: '12px'
          }}>
            <Award size={48} color="#E8E0D8" />
            <span style={{ fontSize: '12px', color: '#9c7a6a' }}>Certificate Image</span>
          </div>
        )}

        {/* Verified badge */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          backgroundColor: 'rgba(22,163,74,0.9)',
          color: '#ffffff', padding: '4px 10px',
          borderRadius: '20px', fontSize: '11px', fontWeight: 600
        }}>
          ✓ Verified
        </div>

        {/* More images badge */}
        {extraCount > 0 && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            backgroundColor: 'rgba(26,26,26,0.75)',
            color: '#ffffff', padding: '4px 10px',
            borderRadius: '20px', fontSize: '11px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <Images size={11} /> +{extraCount}
          </div>
        )}

        {/* Click to view overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s'
        }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
        >
          <span style={{
            color: '#ffffff', fontSize: '13px', fontWeight: 600,
            opacity: 0, transition: 'opacity 0.2s'
          }}
            className="view-label"
          >
            Click to view details
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: 0, lineHeight: 1.3 }}>
          {cert.name}
        </h3>

        {cert.issued_by && (
          <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0, lineHeight: 1.4 }}>
            {cert.issued_by}
          </p>
        )}

        {cert.certificate_number && (
          <p style={{ fontSize: '11px', color: '#9c7a6a', margin: 0 }}>
            No: {cert.certificate_number}
          </p>
        )}

        {cert.valid_until && (
          <p style={{ fontSize: '11px', color: '#9c7a6a', margin: 0 }}>
            Valid until: {new Date(cert.valid_until).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        )}

        {/* Download PDF */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          {cert.pdf_url ? (
            
             <button
              onClick={async (e) => {
                e.stopPropagation()
                setDownloading(true)
                await downloadPdf(cert.pdf_url!, `${cert.name.trim().replace(/\s+/g, '_')}.pdf`)
                setDownloading(false)
              }}
              disabled={downloading}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                backgroundColor: '#C1622A', color: '#ffffff',
                padding: '10px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600,
                border: 'none', width: '100%', cursor: downloading ? 'not-allowed' : 'pointer',
                opacity: downloading ? 0.7 : 1, transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = '#A8521F')}
              onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = '#C1622A')}
            >
              {downloading ? <Loader2 size={14} className="cc-spin" /> : <Download size={14} />}
              {downloading ? 'Downloading...' : 'Download Certificate'}
            </button>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              backgroundColor: '#F0EBE3', color: '#9c7a6a',
              padding: '10px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 500
            }}>
              PDF Coming Soon
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cc-spin { animation: ccSpin 0.8s linear infinite; }
        @keyframes ccSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}