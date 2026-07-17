'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { X, Calendar, Hash, Building2, Download, ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react'

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
  is_active: boolean
  images?: CertImage[]
}

interface Props {
  cert: Certificate | null
  onClose: () => void
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

const MIN_ZOOM = 1
const MAX_ZOOM = 4

export default function CertificateModal({ cert, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const pinchStartDist = useRef<number | null>(null)
  const pinchStartScale = useRef(1)

  const gallery: CertImage[] =
    cert?.images && cert.images.length > 0
      ? cert.images
      : cert?.image_url
      ? [{ id: 'primary', image_url: cert.image_url, is_primary: true }]
      : []

  const resetZoom = () => {
    setScale(1)
    setPos({ x: 0, y: 0 })
  }

  useEffect(() => {
    setActiveIdx(0)
    resetZoom()
  }, [cert?.id])

  useEffect(() => {
    resetZoom()
  }, [activeIdx])

  const clampScale = (s: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s))

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setScale((s) => {
      const next = clampScale(s - e.deltaY * 0.0025)
      if (next === MIN_ZOOM) setPos({ x: 0, y: 0 })
      return next
    })
  }

  const handleDoubleClick = () => {
    if (scale > MIN_ZOOM) {
      resetZoom()
    } else {
      setScale(2.5)
    }
  }

  const zoomStep = (dir: 1 | -1) => {
    setScale((s) => {
      const next = clampScale(s + dir * 0.6)
      if (next === MIN_ZOOM) setPos({ x: 0, y: 0 })
      return next
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= MIN_ZOOM) return
    dragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = pos
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return
    setPos({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    })
  }
  const stopDragging = () => { dragging.current = false }

  const touchDist = (touches: React.TouchList) => {
    const [a, b] = [touches[0], touches[1]]
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = touchDist(e.touches)
      pinchStartScale.current = scale
    } else if (e.touches.length === 1 && scale > MIN_ZOOM) {
      dragging.current = true
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      posStart.current = pos
    }
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current) {
      e.preventDefault()
      const newDist = touchDist(e.touches)
      const next = clampScale(pinchStartScale.current * (newDist / pinchStartDist.current))
      setScale(next)
      if (next === MIN_ZOOM) setPos({ x: 0, y: 0 })
    } else if (e.touches.length === 1 && dragging.current) {
      setPos({
        x: posStart.current.x + (e.touches[0].clientX - dragStart.current.x),
        y: posStart.current.y + (e.touches[0].clientY - dragStart.current.y),
      })
    }
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStartDist.current = null
    if (e.touches.length === 0) dragging.current = false
  }

  useEffect(() => {
    if (cert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [cert])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setActiveIdx((i) => Math.min(i + 1, gallery.length - 1))
      if (e.key === 'ArrowLeft') setActiveIdx((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, gallery.length])

  if (!cert) return null

  const activeImage = gallery[activeIdx]

  return (
    <div className="cm-page">
      {/* Top bar */}
      <div className="cm-topbar">
        <button onClick={onClose} className="cm-back-btn">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <span className="cm-topbar-status">
          <span className="cm-dot" /> Active &amp; Verified
        </span>
        <button onClick={onClose} className="cm-close-btn" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="cm-body">
        {/* Gallery */}
        <div className="cm-gallery">
          {gallery.length > 0 ? (
            <>
              <div
                className="cm-main-image"
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: scale > MIN_ZOOM ? (dragging.current ? 'grabbing' : 'grab') : 'zoom-in' }}
              >
                <div
                  ref={imgWrapRef}
                  className="cm-zoom-wrap"
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: dragging.current ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  <Image
                    key={activeImage.id}
                    src={activeImage.image_url}
                    alt={cert.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 900px) 100vw, 55vw"
                    priority
                    draggable={false}
                  />
                </div>

                {/* Zoom controls */}
                <div className="cm-zoom-controls" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => zoomStep(-1)} disabled={scale <= MIN_ZOOM} className="cm-zoom-btn">
                    <ZoomOut size={16} />
                  </button>
                  <span className="cm-zoom-pct">{Math.round(scale * 100)}%</span>
                  <button onClick={() => zoomStep(1)} disabled={scale >= MAX_ZOOM} className="cm-zoom-btn">
                    <ZoomIn size={16} />
                  </button>
                  {scale > MIN_ZOOM && (
                    <button onClick={resetZoom} className="cm-zoom-btn">
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
                      disabled={activeIdx === 0}
                      className="cm-nav-btn cm-nav-left"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveIdx((i) => Math.min(i + 1, gallery.length - 1))}
                      disabled={activeIdx === gallery.length - 1}
                      className="cm-nav-btn cm-nav-right"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="cm-dots">
                      {gallery.map((img, i) => (
                        <span
                          key={img.id}
                          onClick={() => setActiveIdx(i)}
                          className="cm-dot-item"
                          style={{
                            width: i === activeIdx ? '18px' : '6px',
                            backgroundColor: i === activeIdx ? '#C1622A' : 'rgba(255,255,255,0.7)',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="cm-thumb-strip">
                  {gallery.map((img, i) => (
                    <div
                      key={img.id}
                      onClick={() => setActiveIdx(i)}
                      className="cm-thumb"
                      style={{
                        border: i === activeIdx ? '2px solid #C1622A' : '1px solid #E8E0D8',
                        opacity: i === activeIdx ? 1 : 0.7,
                      }}
                    >
                      <Image src={img.image_url} alt="" fill style={{ objectFit: 'cover' }} sizes="64px" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="cm-main-image cm-no-image">
              <span style={{ fontSize: '48px' }}>🏆</span>
              <span style={{ fontSize: '13px', color: '#9c7a6a' }}>No image uploaded</span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="cm-info">
          <h1 className="cm-title">{cert.name}</h1>
          {cert.issued_by && <p className="cm-subtitle">{cert.issued_by}</p>}

          <div className="cm-detail-list">
            {cert.certificate_number && (
              <div className="cm-detail-row">
                <div className="cm-detail-icon"><Hash size={16} color="#C1622A" /></div>
                <div>
                  <p className="cm-detail-label">Certificate Number</p>
                  <p className="cm-detail-value">{cert.certificate_number}</p>
                </div>
              </div>
            )}

            {cert.issued_by && (
              <div className="cm-detail-row">
                <div className="cm-detail-icon"><Building2 size={16} color="#C1622A" /></div>
                <div>
                  <p className="cm-detail-label">Issued By</p>
                  <p className="cm-detail-value">{cert.issued_by}</p>
                </div>
              </div>
            )}

            {cert.valid_until && (
              <div className="cm-detail-row">
                <div className="cm-detail-icon"><Calendar size={16} color="#C1622A" /></div>
                <div>
                  <p className="cm-detail-label">Valid Until</p>
                  <p className="cm-detail-value">
                    {new Date(cert.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="cm-actions">
            {cert.pdf_url ? (
              <button
                onClick={async () => {
                  setDownloading(true)
                  await downloadPdf(cert.pdf_url!, `${cert.name.trim().replace(/\s+/g, '_')}.pdf`)
                  setDownloading(false)
                }}
                disabled={downloading}
                className="cm-btn cm-btn-primary"
                style={{ border: 'none', opacity: downloading ? 0.7 : 1 }}
              >
                {downloading ? <Loader2 size={15} className="cm-spin" /> : <Download size={15} />}
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            ) : (
              <div className="cm-btn cm-btn-disabled">PDF Coming Soon</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cm-page {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          animation: cmFadeIn 0.2s ease;
        }
        .cm-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #F0EBE3;
          flex-shrink: 0;
        }
        .cm-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #1A1A1A;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
        }
        .cm-back-btn:hover {
          background: #F8F7F4;
        }
        .cm-close-btn {
          display: none;
          background: #F8F7F4;
          border: none;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: #1A1A1A;
        }
        .cm-topbar-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #16A34A;
          font-weight: 600;
        }
        .cm-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16A34A;
        }

        .cm-body {
          flex: 1;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
        }

        .cm-gallery {
          display: flex;
          flex-direction: column;
          background: #F8F7F4;
          border-right: 1px solid #F0EBE3;
        }
        .cm-main-image {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 380px;
          overflow: hidden;
          touch-action: none;
        }
        .cm-zoom-wrap {
          position: absolute;
          inset: 0;
          transform-origin: center center;
        }
        .cm-zoom-controls {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          border-radius: 20px;
          padding: 6px 8px;
          z-index: 2;
        }
        .cm-zoom-btn {
          background: none;
          border: none;
          color: #ffffff;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
        }
        .cm-zoom-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.15);
        }
        .cm-zoom-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .cm-zoom-pct {
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          min-width: 34px;
          text-align: center;
        }
        .cm-no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .cm-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.45);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
        }
        .cm-nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .cm-nav-left { left: 16px; }
        .cm-nav-right { right: 16px; }
        .cm-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
        }
        .cm-dot-item {
          height: 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: width 0.2s ease;
        }
        .cm-thumb-strip {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          overflow-x: auto;
          background: #ffffff;
          border-top: 1px solid #F0EBE3;
        }
        .cm-thumb {
          position: relative;
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }

        .cm-info {
          padding: 40px;
          overflow-y: auto;
        }
        .cm-title {
          font-size: 26px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0 0 6px;
        }
        .cm-subtitle {
          font-size: 14px;
          color: #6B6B6B;
          margin: 0 0 28px;
        }
        .cm-detail-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 32px;
        }
        .cm-detail-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cm-detail-icon {
          width: 40px;
          height: 40px;
          background: #F8F7F4;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cm-detail-label {
          font-size: 11px;
          color: #6B6B6B;
          margin: 0 0 2px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .cm-detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }
        .cm-actions {
          display: flex;
          gap: 10px;
        }
        .cm-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }
        .cm-btn-secondary {
          background: #F8F7F4;
          color: #1A1A1A;
          border: 1px solid #E8E0D8;
        }
        .cm-btn-primary {
          background: #C1622A;
          color: #ffffff;
          border: none;
          transition: background 0.15s;
        }
        .cm-btn-primary:hover {
          background: #A8521F;
        }
        .cm-btn-disabled {
          background: #F0EBE3;
          color: #9c7a6a;
        }

        @keyframes cmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cm-spin {
          animation: cmSpin 0.8s linear infinite;
        }
        @keyframes cmSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile: stack gallery above info, single scroll column */
        @media (max-width: 860px) {
          .cm-body {
            grid-template-columns: 1fr;
            grid-auto-rows: min-content;
          }
          .cm-gallery {
            border-right: none;
            border-bottom: 1px solid #F0EBE3;
          }
          .cm-main-image {
            min-height: 0;
            aspect-ratio: 4 / 3;
            flex: none;
          }
          .cm-info {
            padding: 24px 20px 32px;
          }
          .cm-title {
            font-size: 21px;
          }
          .cm-back-btn span {
            display: none;
          }
          .cm-close-btn {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}