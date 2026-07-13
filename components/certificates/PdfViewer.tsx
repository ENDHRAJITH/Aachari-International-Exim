'use client'

import { X, Wrench, AlertTriangle } from 'lucide-react'

interface PdfViewerProps {
  fileUrl?: string // 💡 மாற்றம்: TypeScript எர்ரரைத் தவிர்க்க இதை விருப்பத்தேர்வாக (Optional) அனுமதித்துள்ளோம்
  name: string
  onClose: () => void
}

export default function PdfViewer({ name, onClose }: PdfViewerProps) {
  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -55%) scale(1); }
        }
      `}</style>

      {/* Backdrop blur overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1001,
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Development Stage Alert Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '460px',
          backgroundColor: '#161616',
          border: '1px solid rgba(244, 93, 6, 0.2)',
          borderRadius: '24px',
          zIndex: 1002,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '32px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 80px rgba(244, 93, 6, 0.05)',
          animation: 'fadeIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) forwards',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          <X size={16} />
        </button>

        {/* Animated/Glowing Icon Area */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            background: 'rgba(244, 93, 6, 0.1)',
            color: '#F45D06',
            marginBottom: '20px',
          }}
        >
          <Wrench size={32} />
          <span 
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: '#F45D06',
              color: '#fff',
              borderRadius: '50%',
              padding: '3px',
              display: 'flex',
            }}
          >
            <AlertTriangle size={12} />
          </span>
        </div>

        {/* Document Name */}
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          {name}
        </p>

        {/* Title */}
        <h3
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: '0 0 12px 0',
          }}
        >
          Under Development
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: '0 0 24px 0',
          }}
        >
          The interactive PDF flipbook viewer for this document is currently under maintenance and optimization stage. Please check back later.
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: '#F45D06',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(244, 93, 6, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Understood
        </button>
      </div>
    </>
  )
}