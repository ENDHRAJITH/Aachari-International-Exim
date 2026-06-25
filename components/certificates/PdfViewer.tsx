'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface PdfViewerProps {
  fileUrl: string
  name: string
  onClose: () => void
}

export default function PdfViewer({ fileUrl, name, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.1)

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

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '94%',
        maxWidth: '900px',
        height: '88vh',
        backgroundColor: '#1A1A1A',
        borderRadius: '20px',
        zIndex: 1002,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #1A1A1A 0%, #3D2314 100%)',
          flexShrink: 0
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '180px'
          }}
        >
          {name}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            style={navBtnStyle(pageNumber <= 1)}
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ color: '#ffffff', fontSize: '12px', minWidth: '52px', textAlign: 'center' }}>
            {pageNumber} / {numPages || '-'}
          </span>

          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            style={navBtnStyle(pageNumber >= numPages)}
          >
            <ChevronRight size={16} />
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} style={navBtnStyle(false)}>
            <ZoomOut size={16} />
          </button>

          <button onClick={() => setScale((s) => Math.min(2.5, s + 0.2))} style={navBtnStyle(false)}>
            <ZoomIn size={16} />
          </button>

          <a href={fileUrl} download style={navBtnStyle(false)}>
            <Download size={16} />
          </a>

          <button onClick={onClose} style={navBtnStyle(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '24px',
          backgroundColor: '#0F0F0F'
        }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div style={{ color: '#A8A8A8', fontSize: '13px', padding: '60px 0' }}>
              Loading certificate…
            </div>
          }
          error={
            <div style={{ color: '#f87171', fontSize: '13px', padding: '60px 0' }}>
              Couldn't load PDF.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="cert-pdf-page"
          />
        </Document>
      </div>

      <style>{`
        .cert-pdf-page canvas {
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}