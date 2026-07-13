'use client'

/**
 * PdfViewer — DearFlip Lite edition
 * ----------------------------------------------------------------------------
 * ⚠️ LICENSE NOTE: This uses DearFlip *Lite* (dearhive/dearflip-js-flipbook on
 * GitHub, served via jsDelivr CDN). Lite is licensed CC BY-NC-ND 4.0 —
 * NON-COMMERCIAL USE ONLY (personal/testing/trial). If this is for a
 * commercial/business site, you need a paid license from js.dearflip.com and
 * should self-host the files instead of using the CDN.
 *
 * DearFlip depends on jQuery and attaches itself as $.fn.flipBook. It ships
 * its own built-in toolbar (prev/next, zoom, fullscreen, download, sound),
 * so unlike the react-pageflip version, we don't hand-roll page navigation —
 * we just style/hide DearFlip's own controls to match the dark modal theme.
 *
 * Must be rendered client-only (dynamic import, ssr: false) since it touches
 * window/document/jQuery.
 */

import { useEffect, useRef, useState } from 'react'
import { X, Download, BookOpen } from 'lucide-react'

interface PdfViewerProps {
  fileUrl: string
  name: string
  onClose: () => void
}

// Pin a version so the CDN build can't change under you unexpectedly.
// Double-check this matches the current published version at:
// https://www.jsdelivr.com/package/npm/@dearhive/dearflip-jquery-flipbook?tab=files
const DFLIP_VERSION = '1.7.3'
const DFLIP_CDN_BASE = `https://cdn.jsdelivr.net/npm/@dearhive/dearflip-jquery-flipbook@${DFLIP_VERSION}/dflip`

let dflipLoadingPromise: Promise<void> | null = null

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve()
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)))
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = false // preserve order: jquery -> dflip
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

function loadStylesheetOnce(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function loadDflipAssets(): Promise<void> {
  if (dflipLoadingPromise) return dflipLoadingPromise

  dflipLoadingPromise = (async () => {
    loadStylesheetOnce(`${DFLIP_CDN_BASE}/css/dflip.min.css`)
    loadStylesheetOnce(`${DFLIP_CDN_BASE}/css/themify-icons.min.css`)

    const w = window as any
    if (!w.jQuery) {
      await loadScriptOnce(`${DFLIP_CDN_BASE}/js/libs/jquery.min.js`)
    }
    if (!w.$ || !w.$.fn || !w.$.fn.flipBook) {
      await loadScriptOnce(`${DFLIP_CDN_BASE}/js/dflip.min.js`)
    }
  })()

  return dflipLoadingPromise
}

export default function PdfViewer({ fileUrl, name, onClose }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        await loadDflipAssets()
        if (cancelled || !containerRef.current) return

        const $ = (window as any).$
        if (!$?.fn?.flipBook) {
          throw new Error('DearFlip did not attach to jQuery — CDN scripts may have failed to load.')
        }

        if (initializedRef.current) {
          destroyExisting($, containerRef.current)
        }

        $(containerRef.current).flipBook(fileUrl, {
          webgl: true,
          height: '100%',
          duration: 650,
          backgroundColor: 'transparent',
          autoEnableOutline: false,
          autoEnableThumbnail: false,
          showDownloadControl: false, // we have our own download button in the header
          showPrintControl: false,
          showShareControl: false,
        })
        initializedRef.current = true

        if (!cancelled) setStatus('ready')
      } catch (err) {
        console.error('DearFlip init failed:', err)
        if (!cancelled) setStatus('error')
      }
    }

    init()

    return () => {
      cancelled = true
      const $ = (window as any).$
      if ($ && containerRef.current) destroyExisting($, containerRef.current)
      initializedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl])

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        /* Retint DearFlip's default light toolbar to match the dark modal */
        #df_container .df-ui-btn { color: #ffffff !important; }
        #df_container .df-ui-bottom, #df_container .df-ui-top {
          background: rgba(20,20,20,0.85) !important;
        }
      `}</style>

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

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '96%',
          maxWidth: '900px',
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
        {/* Header */}
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
                maxWidth: '260px',
              }}
            >
              {name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
            <button
              onClick={onClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Book area — DearFlip renders its own toolbar + pages inside this div */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            background: 'radial-gradient(ellipse at center, #1e1e1e 0%, #0a0a0a 100%)',
          }}
        >
          {status === 'loading' && (
            <div style={placeholderStyle}>
              <BookOpen size={28} strokeWidth={1.2} />
              <span>Opening document…</span>
            </div>
          )}
          {status === 'error' && (
            <div style={{ ...placeholderStyle, color: '#f87171' }}>
              Couldn&apos;t load the flipbook. Check that the DearFlip CDN
              assets loaded (see console) and that {"fileUrl"} is a public,
              CORS-enabled PDF link.
            </div>
          )}
          <div id="df_container" ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </>
  )
}

function destroyExisting($: any, el: HTMLElement) {
  try {
    const instance = $(el).data('dflip')
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy()
    } else {
      $(el).empty()
    }
  } catch {
    // best-effort cleanup
  }
}

const placeholderStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '12px',
  fontSize: '13px',
  color: 'rgba(255,255,255,0.35)',
  textAlign: 'center',
  padding: '0 24px',
}