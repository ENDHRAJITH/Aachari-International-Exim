'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip'
import React from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CatalogueViewerProps {
  fileUrl: string
  name: string
  onClose: () => void
}

// ─── Sound engine (Web Audio API — no external dep) ──────────────────────────

function createPageFlipSound(ctx: AudioContext) {
  const duration = 0.18
  const now = ctx.currentTime

  // Swoosh layer
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  // Band-pass filter — make it papery
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1800, now)
  filter.frequency.exponentialRampToValueAtTime(800, now + duration)
  filter.Q.value = 0.8

  // Gentle thud at the end
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, now + duration * 0.7)
  osc.frequency.exponentialRampToValueAtTime(60, now + duration)
  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0, now + duration * 0.7)
  oscGain.gain.linearRampToValueAtTime(0.18, now + duration * 0.8)
  oscGain.gain.linearRampToValueAtTime(0, now + duration + 0.04)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(now + duration * 0.7)
  osc.stop(now + duration + 0.05)

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0.35, now)
  gainNode.gain.linearRampToValueAtTime(0, now + duration)

  noise.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)
  noise.start(now)
  noise.stop(now + duration)
}

// ─── Individual flip page ─────────────────────────────────────────────────────

const FlipPage = React.forwardRef<
  HTMLDivElement,
  {
    pageNumber: number
    numPages: number
    scale: number
    fileUrl: string
    isLeft: boolean
  }
>(({ pageNumber, numPages, scale, fileUrl, isLeft }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Paper texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Spine edge shadow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          [isLeft ? 'right' : 'left']: 0,
          width: '18px',
          height: '100%',
          background: isLeft
            ? 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, transparent 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Page PDF content */}
      <Document file={fileUrl} loading={null} error={null}>
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>

      {/* Page number */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          [isLeft ? 'left' : 'right']: '14px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-sans, sans-serif)',
          letterSpacing: '0.1em',
          zIndex: 4,
        }}
      >
        {pageNumber} / {numPages}
      </div>
    </div>
  )
})
FlipPage.displayName = 'FlipPage'

// ─── Main component ───────────────────────────────────────────────────────────

export default function CatalogueViewer({ fileUrl, name, onClose }: CatalogueViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSpread, setCurrentSpread] = useState(0)
  const [scale, setScale] = useState(0.68)
  const [soundOn, setSoundOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [flipDir, setFlipDir] = useState<'next' | 'prev' | null>(null)

  const bookRef = useRef<any>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Audio context (lazy — must be after user gesture)
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtxRef.current
  }, [])

  const playFlip = useCallback(() => {
    if (!soundOn) return
    try {
      const ctx = getAudioCtx()
      if (ctx.state === 'suspended') ctx.resume()
      createPageFlipSound(ctx)
    } catch (_) {}
  }, [soundOn, getAudioCtx])

  const goNext = useCallback(() => {
    setFlipDir('next')
    playFlip()
    bookRef.current?.pageFlip()?.flipNext()
  }, [playFlip])

  const goPrev = useCallback(() => {
    setFlipDir('prev')
    playFlip()
    bookRef.current?.pageFlip()?.flipPrev()
  }, [playFlip])

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentSpread(Math.floor(e.data / 2))
    setFlipDir(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, onClose])

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const totalSpreads = Math.ceil(numPages / 2)
  const leftPageNum = currentSpread * 2 + 1
  const rightPageNum = currentSpread * 2 + 2

  // Flipbook page dimensions
  const PAGE_W = 360
  const PAGE_H = 500

  return (
    <>
      <style>{`
        @keyframes catalogueFadeIn {
          from { opacity: 0; transform: translate(-50%,-47%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes catalogueGlow {
          0%, 100% { box-shadow: 0 0 60px rgba(255,140,60,0.08), 0 0 120px rgba(255,100,40,0.04); }
          50%       { box-shadow: 0 0 80px rgba(255,160,80,0.14), 0 0 160px rgba(255,120,50,0.07); }
        }
        @keyframes spineGlow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes pageFlipIn {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }
        .catalogue-ctrl-btn {
          width: 32px; height: 32px;
          border-radius: 8px; border: none;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s, transform 0.1s;
        }
        .catalogue-ctrl-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.14);
          color: #fff;
        }
        .catalogue-ctrl-btn:active:not(:disabled) { transform: scale(0.93); }
        .catalogue-ctrl-btn:disabled {
          opacity: 0.22; cursor: not-allowed;
        }
        .catalogue-nav-btn {
          width: 44px; height: 44px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(20,20,20,0.85);
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          z-index: 10;
          flex-shrink: 0;
        }
        .catalogue-nav-btn:hover:not(:disabled) {
          background: rgba(255,140,60,0.18);
          border-color: rgba(255,140,60,0.35);
          color: #FFB07A;
          transform: scale(1.08);
        }
        .catalogue-nav-btn:disabled { opacity: 0.18; cursor: not-allowed; }
        .stf__parent { background: transparent !important; }
        .flip-page-canvas canvas { display: block; }
        .catalogue-modal:fullscreen { border-radius: 0; width: 100vw !important; height: 100vh !important; }
        .catalogue-modal:-webkit-full-screen { border-radius: 0; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1001,
        }}
      />

      {/* ── Modal shell ── */}
      <div
        ref={containerRef}
        className="catalogue-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '97%',
          maxWidth: '900px',
          height: '92vh',
          background: '#0D0D0D',
          borderRadius: '22px',
          zIndex: 1002,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.07)',
          animation: 'catalogueFadeIn 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards, catalogueGlow 4s ease-in-out 0.3s infinite',
        }}
      >
        {/* ── Top header bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 16px',
            background: 'linear-gradient(135deg, #181818 0%, #2A1508 60%, #3D1F08 100%)',
            borderBottom: '1px solid rgba(255,160,80,0.1)',
            flexShrink: 0,
            gap: '12px',
          }}
        >
          {/* Left — icon + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                background: 'linear-gradient(135deg,#FF8C3A,#C0440A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={14} color="#fff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '220px',
                }}
              >
                {name}
              </div>
              {isLoaded && (
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                  {numPages} pages · PDF
                </div>
              )}
            </div>
          </div>

          {/* Right — controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            {/* Page indicator */}
            {isLoaded && (
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '11px',
                  marginRight: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {leftPageNum}
                {rightPageNum <= numPages ? `–${rightPageNum}` : ''} / {numPages}
              </div>
            )}

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />

            <button
              className="catalogue-ctrl-btn"
              onClick={() => setScale((s) => Math.max(0.4, +(s - 0.1).toFixed(1)))}
              disabled={scale <= 0.4}
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', minWidth: '30px', textAlign: 'center' }}>
              {Math.round(scale * 100)}%
            </span>
            <button
              className="catalogue-ctrl-btn"
              onClick={() => setScale((s) => Math.min(1.4, +(s + 0.1).toFixed(1)))}
              disabled={scale >= 1.4}
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />

            <button
              className="catalogue-ctrl-btn"
              onClick={() => setSoundOn((v) => !v)}
              title={soundOn ? 'Mute sound' : 'Enable sound'}
            >
              {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            <button
              className="catalogue-ctrl-btn"
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            <a
              href={fileUrl}
              download
              className="catalogue-ctrl-btn"
              title="Download PDF"
              style={{ textDecoration: 'none' }}
            >
              <Download size={14} />
            </a>

            <button className="catalogue-ctrl-btn" onClick={onClose} title="Close">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Book stage ── */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '24px 16px 20px',
            background: 'radial-gradient(ellipse 70% 70% at 50% 55%, #1A1008 0%, #0A0A0A 100%)',
            position: 'relative',
          }}
        >
          {/* Ambient floor glow */}
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '40px',
              background: 'radial-gradient(ellipse, rgba(255,120,40,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Preload: get numPages silently */}
          {!isLoaded && (
            <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
              <Document
                file={fileUrl}
                onLoadSuccess={({ numPages: n }) => {
                  setNumPages(n)
                  setIsLoaded(true)
                }}
              >
                <Page pageNumber={1} scale={0.05} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>
          )}

          {/* Loading state */}
          {!isLoaded && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              <BookOpen size={32} strokeWidth={1} />
              <span style={{ fontSize: '13px', letterSpacing: '0.06em' }}>Opening catalogue…</span>
            </div>
          )}

          {/* ── Prev button ── */}
          {isLoaded && (
            <button
              className="catalogue-nav-btn"
              onClick={goPrev}
              disabled={currentSpread <= 0}
              title="Previous page"
              style={{ zIndex: 10 }}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* ── Flip book ── */}
          {isLoaded && numPages > 0 && (
            <div
              style={{
                position: 'relative',
                zIndex: 5,
                // 3D perspective wrapper
                filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.85)) drop-shadow(0 8px 20px rgba(255,100,40,0.08))',
              }}
            >
              {/* Book top edge highlight */}
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '8px',
                  right: '8px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)',
                  borderRadius: '2px 2px 0 0',
                  zIndex: 6,
                  pointerEvents: 'none',
                }}
              />

              {/* Spine center line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(255,160,80,0.08) 50%, rgba(0,0,0,0.7) 100%)',
                  zIndex: 8,
                  pointerEvents: 'none',
                  animation: 'spineGlow 3s ease-in-out infinite',
                }}
              />

              {/* @ts-ignore */}
              <HTMLFlipBook
                ref={bookRef}
                width={PAGE_W}
                height={PAGE_H}
                size="fixed"
                minWidth={PAGE_W}
                maxWidth={PAGE_W}
                minHeight={PAGE_H}
                maxHeight={PAGE_H}
                drawShadow={true}
                flippingTime={700}
                usePortrait={false}
                startPage={0}
                showCover={true}
                mobileScrollSupport={false}
                onFlip={handleFlip}
                style={{ borderRadius: '3px' }}
                className="flip-page-canvas"
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <FlipPage
                    key={i + 1}
                    pageNumber={i + 1}
                    numPages={numPages}
                    scale={scale}
                    fileUrl={fileUrl}
                    isLeft={i % 2 === 0}
                  />
                ))}
              </HTMLFlipBook>
            </div>
          )}

          {/* ── Next button ── */}
          {isLoaded && (
            <button
              className="catalogue-nav-btn"
              onClick={goNext}
              disabled={currentSpread >= totalSpreads - 1}
              title="Next page"
              style={{ zIndex: 10 }}
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* ── Bottom hint bar ── */}
        {isLoaded && (
          <div
            style={{
              flexShrink: 0,
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {[
              { icon: '←→', label: 'Arrow keys to navigate' },
              { icon: '🖱', label: 'Click page edges to flip' },
              { icon: '⎋', label: 'Esc to close' },
            ].map((h) => (
              <span
                key={h.label}
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  letterSpacing: '0.04em',
                }}
              >
                <span style={{ fontSize: '11px' }}>{h.icon}</span>
                {h.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
