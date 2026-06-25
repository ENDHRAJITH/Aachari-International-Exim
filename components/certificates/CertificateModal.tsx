"use client"
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  FileText, X, Calendar, Hash, Building2, ExternalLink
} from 'lucide-react'

const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#A8A8A8',
      fontSize: '13px',
      zIndex: 1002
    }}>
      Loading viewer…
    </div>
  )
})

interface Certificate {
  id: string
  name: string
  issued_by: string | null
  certificate_number: string | null
  image_url: string | null
  valid_until: string | null
  is_active: boolean
}

interface CertificateModalProps {
  cert: Certificate | null
  onClose: () => void
}

const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#C1622A',
  color: '#ffffff',
  padding: '13px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer'
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    border: 'none',
    background: disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
    color: disabled ? '#555' : '#ffffff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '36px',
        height: '36px',
        backgroundColor: '#F8F7F4',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '11px', color: '#6B6B6B', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default function CertificateModal({ cert, onClose }: CertificateModalProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.1)

  useEffect(() => {
    if (cert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cert])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewerOpen) {
          setViewerOpen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, viewerOpen])

  useEffect(() => {
    setViewerOpen(false)
    setPageNumber(1)
    setScale(1.1)
    setNumPages(0)
  }, [cert])

  if (!cert) return null

  const isPdf =
    cert.image_url?.toLowerCase().includes('.pdf') ||
    cert.image_url?.toLowerCase().includes('/raw/')

  return (
    <>
      <div
        onClick={() => (viewerOpen ? setViewerOpen(false) : onClose())}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease'
        }}
      />

     {viewerOpen && isPdf && cert.image_url && (
  <PdfViewer
    fileUrl={cert.image_url}
    name={cert.name}
    onClose={() => setViewerOpen(false)}
  />
)}

      {!viewerOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            zIndex: 1001,
            overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1A1A1A 0%, #3D2314 100%)',
              padding: '24px',
              position: 'relative'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              <X size={16} />
            </button>

            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#C1622A',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <FileText size={26} color="#ffffff" />
            </div>

            <h2
              style={{
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 700,
                margin: '0 0 6px',
                paddingRight: '40px'
              }}
            >
              {cert.name}
            </h2>
            {cert.issued_by && <p style={{ color: '#A8A8A8', fontSize: '13px', margin: 0 }}>{cert.issued_by}</p>}
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {cert.certificate_number && (
                <DetailRow icon={<Hash size={16} color="#C1622A" />} label="Certificate Number" value={cert.certificate_number} />
              )}

              {cert.issued_by && (
                <DetailRow icon={<Building2 size={16} color="#C1622A" />} label="Issued By" value={cert.issued_by} />
              )}

              {cert.valid_until && (
                <DetailRow
                  icon={<Calendar size={16} color="#C1622A" />}
                  label="Valid Until"
                  value={new Date(cert.valid_until).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                <span style={{ fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>Active & Verified</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {cert.image_url ? (
                isPdf ? (
                  <button onClick={() => setViewerOpen(true)} style={primaryBtnStyle}>
                    <ExternalLink size={16} />
                    View PDF
                  </button>
                ) : (
                  <a href={cert.image_url} target="_blank" rel="noopener noreferrer" style={primaryBtnStyle}>
                    <ExternalLink size={16} />
                    View Certificate
                  </a>
                )
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#F0EBE3',
                    color: '#6B6B6B',
                    padding: '13px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Certificate file coming soon
                </div>
              )}

              <button
                onClick={onClose}
                style={{
                  padding: '13px 20px',
                  borderRadius: '10px',
                  border: '1px solid #E8E0D8',
                  backgroundColor: '#ffffff',
                  color: '#1A1A1A',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .cert-pdf-page canvas {
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  )
}