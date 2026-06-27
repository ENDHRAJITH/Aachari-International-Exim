'use client'

import { useState, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, BookOpen } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface PdfViewerProps {
  fileUrl: string
  name: string
  onClose: () => void
}

// Single page component forwarded for react-pageflip
import React from 'react'

const FlipPage = React.forwardRef<
  HTMLDivElement,
  { pageNumber: number; scale: number; fileUrl: string; isLeft: boolean }
>(({ pageNumber, scale, fileUrl, isLeft }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        background: '#1c1c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        // Subtle inner shadow to give page-edge depth
        boxShadow: isLeft
          ? 'inset -8px 0 20px rgba(0,0,0,0.4)'
          : 'inset 8px 0 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Page number badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          ...(isLeft ? { left: '16px' } : { right: '16px' }),
          color: 'rgba(255,255,255,0.3)',
          fontSize: '11px',
          fontFamily: 'sans-serif',
          letterSpacing: '0.05em',
        }}
      >
        {pageNumber}
      </div>

      {/* Spine shadow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          ...(isLeft ? { right: 0 } : { left: 0 }),
          width: '3px',
          height: '100%',
          background: isLeft
            ? 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)'
            : 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
        }}
      />

      <Document
        file={fileUrl}
        loading={null}
        error={null}
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </div>
  )
})

FlipPage.displayName = 'FlipPage'

export default function PdfViewer({ fileUrl, name, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(0) // 0-indexed spread
  const [scale, setScale] = useState<number>(0.7)
  const [isLoaded, setIsLoaded] = useState(false)
  const bookRef = useRef<any>(null)

  // react-pageflip works with 0-indexed pages
  // We show 2 pages per spread (double-page view)
  const totalSpreads = Math.ceil(numPages / 2)
  const displayPage = currentPage * 2 + 1 // human-readable left page

  const goNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  const goPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(Math.floor(e.data / 2))
  }, [])

  const navBtn = (disabled: boolean, onClick: () => void, children: React.ReactNode) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        border: 'none',
        background: disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
        color: disabled ? '#555' : '#ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  )

  // Page width for the flipbook — each page is half of usable width
  const pageWidth = 380
  const pageHeight = 520

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .stf__parent { background: transparent !important; }
        .stf__block  { box-shadow: none !important; }
        /* Page canvas styling */
        .flip-page-wrap canvas {
          border-radius: 2px;
          display: block;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 1001,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '96%',
          maxWidth: '860px',
          height: '90vh',
          backgroundColor: '#141414',
          borderRadius: '20px',
          zIndex: 1002,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.25s cubic-bezier(0.34, 1.3, 0.64, 1) forwards',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #1A1A1A 0%, #3D2314 100%)',
            flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Title + icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={15} color="rgba(255,255,255,0.5)" />
            <span
              style={{
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '200px',
              }}
            >
              {name}
            </span>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {navBtn(currentPage <= 0, goPrev, <ChevronLeft size={15} />)}

            <span
              style={{
                color: '#fff',
                fontSize: '11px',
                minWidth: '64px',
                textAlign: 'center',
                opacity: 0.7,
              }}
            >
              {isLoaded ? `${displayPage}–${Math.min(displayPage + 1, numPages)} / ${numPages}` : '…'}
            </span>

            {navBtn(currentPage >= totalSpreads - 1, goNext, <ChevronRight size={15} />)}

            <div
              style={{
                width: '1px',
                height: '18px',
                background: 'rgba(255,255,255,0.12)',
                margin: '0 3px',
              }}
            />

            {navBtn(scale <= 0.4, () => setScale((s) => Math.max(0.4, +(s - 0.1).toFixed(1))), <ZoomOut size={15} />)}
            {navBtn(scale >= 1.4, () => setScale((s) => Math.min(1.4, +(s + 0.1).toFixed(1))), <ZoomIn size={15} />)}

            <a
              href={fileUrl}
              download
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <Download size={15} />
            </a>

            {navBtn(false, onClose, <X size={15} />)}
          </div>
        </div>

        {/* ── Book area ── */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, #1e1e1e 0%, #0a0a0a 100%)',
            position: 'relative',
          }}
        >
          {/* Loading state — render Document invisibly first to get numPages */}
          {!isLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '13px',
              }}
            >
              <BookOpen size={28} strokeWidth={1.2} />
              <span>Opening document…</span>
            </div>
          )}

          {/* Hidden preload document to get numPages before showing flipbook */}
          {!isLoaded && (
            <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
              <Document
                file={fileUrl}
                onLoadSuccess={({ numPages: n }) => {
                  setNumPages(n)
                  setIsLoaded(true)
                }}
              >
                <Page pageNumber={1} scale={0.1} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>
          )}

          {/* FlipBook — only mount after numPages is known */}
          {isLoaded && numPages > 0 && (
            <div
              style={{
                // Drop shadow under the whole book
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))',
              }}
            >
              {/* @ts-ignore — react-pageflip typings quirk */}
              <HTMLFlipBook
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                minWidth={pageWidth}
                maxWidth={pageWidth}
                minHeight={pageHeight}
                maxHeight={pageHeight}
                drawShadow
                flippingTime={650}
                usePortrait={false}
                startPage={0}
                showCover={false}
                mobileScrollSupport={false}
                onFlip={handleFlip}
                className="flip-book"
                style={{}}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <FlipPage
                    key={i + 1}
                    pageNumber={i + 1}
                    scale={scale}
                    fileUrl={fileUrl}
                    isLeft={i % 2 === 0}
                  />
                ))}
              </HTMLFlipBook>
            </div>
          )}

          {/* Keyboard hint */}
          {isLoaded && (
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.2)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              Click page edges or use ‹ › buttons to flip
            </div>
          )}
        </div>
      </div>
    </>
  )
}