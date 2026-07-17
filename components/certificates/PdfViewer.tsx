'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import HTMLFlipBook from 'react-pageflip'
import * as pdfjsLib from 'pdfjs-dist'

// Worker thread link logic setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PdfViewerProps {
  fileUrl: string // Parent router layout file dynamic data reference
  name: string
  onClose: () => void
}

export default function PdfViewer({ fileUrl, name, onClose }: PdfViewerProps) {
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const bookRef = useRef<any>(null)

  useEffect(() => {
    const loadPdfData = async () => {
      try {
        setLoading(true)
        
        // 💡 TypeScript Fix 1: String object-a target param wrapper object-a pass panrom
        const loadingTask = pdfjsLib.getDocument({ url: fileUrl })
        const pdf = await loadingTask.promise
        const totalPages = pdf.numPages
        const renderedPages: string[] = []

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i)
          
          // Crisp view graphics maintenance scale
          const scale = 2.0 
          const viewport = page.getViewport({ scale })
          
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          
          if (context) {
            canvas.height = viewport.height
            canvas.width = viewport.width
            
            // 💡 TypeScript Fix 2: Explicit canvas DOM element variable link custom add panniyachu
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
              canvas: canvas
            }
            
            await page.render(renderContext).promise
            renderedPages.push(canvas.toDataURL('image/jpeg', 0.95))
          }
        }
        setPages(renderedPages)
      } catch (error) {
        console.error("PDF Processing system internal log error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (fileUrl) loadPdfData()
  }, [fileUrl])

  // Native dynamic downloader executor script
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `${name.replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .flipbook-container canvas, .flipbook-container img {
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>

      {/* Backdrop blur element wrapper layer */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1001,
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* Main Studio View Panel Base */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '1200px',
          height: '85vh',
          backgroundColor: '#121212',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          zIndex: 1002,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
          animation: 'fadeIn 0.25s cubic-bezier(0.34, 1.5, 0.64, 1) forwards',
        }}
      >
        {/* Upper Control Bar Station */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: '#161616'
        }}>
          <div>
            <h3 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: 600 }}>{name}</h3>
            {pages.length > 0 && (
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0', fontSize: '12px' }}>
                Page {currentPage + 1} of {pages.length}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Realtime Direct Download Action Trigger Button */}
            <button
              onClick={handleDownload}
              title="Download Document"
              style={{
                background: 'rgba(244, 93, 6, 0.15)',
                color: '#F45D06',
                border: '1px solid rgba(244, 93, 6, 0.3)',
                padding: '8px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 93, 6, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 93, 6, 0.15)'}
            >
              <Download size={16} />
              Download
            </button>

            {/* Modal Exit Button */}
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.6)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Graphic Canvas Center Viewport */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0a0a0a',
          padding: '20px',
          position: 'relative',
          overflow: 'auto'
        }} className="flipbook-container">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)' }}>
              <Loader2 className="animate-spin" size={32} style={{ color: '#F45D06' }} />
              <p style={{ fontSize: '14px' }}>Processing book graphics layout crisp view...</p>
            </div>
          ) : pages.length > 0 ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px' }}>
              
              {/* Previous page trigger navigator layout */}
              <button 
                onClick={() => bookRef.current?.pageFlip().flipPrev()}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
              >
                <ChevronLeft size={20} />
              </button>

              {/* 3D Core Canvas Flipbook Core Engine element mapping */}
              {/* @ts-ignore */}
              <HTMLFlipBook
                width={450}
                height={600}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={420}
                maxHeight={1350}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={(e: any) => setCurrentPage(e.data)}
                ref={bookRef}
                style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}
              >
                {pages.map((pageImg, index) => (
                  <div key={index} style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>
                    <img 
                      src={pageImg} 
                      alt={`Page indexing map loop dynamic: ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                    />
                  </div>
                ))}
              </HTMLFlipBook>

              {/* Next page trigger navigator layout */}
              <button 
                onClick={() => bookRef.current?.pageFlip().flipNext()}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <p style={{ color: '#fff' }}>Failed to render book pages. Check target source route.</p>
          )}
        </div>
      </div>
    </>
  )
}