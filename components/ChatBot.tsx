'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const quickReplies = [
  'What products do you export?',
  'Tell me about Moringa Powder',
  'How to place an enquiry?'
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I'm the Aachari AI assistant. Ask me about our export products, HSN codes, packaging, or pricing."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      const data = await res.json()

      setMessages((prev) => [...prev, {
        role: 'bot',
        content: data.response || 'Sorry, I could not understand that.'
      }])

    } catch {
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '86px',
          right: '24px',
          width: '320px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E8E0D8',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}>

          {/* Header */}
          <div style={{
            background: '#1A1A1A',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#C1622A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0
            }}>AI</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                Aachari Assistant
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div style={{ width: '6px', height: '6px', background: '#16A34A', borderRadius: '50%' }} />
                <span style={{ color: '#A8A8A8', fontSize: '11px' }}>Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#A8A8A8',
                fontSize: '18px',
                lineHeight: 1
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '280px',
            overflowY: 'auto',
            background: '#FAFAF8'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  padding: '9px 12px',
                  borderRadius: '12px',
                  borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  maxWidth: '85%',
                  backgroundColor: msg.role === 'user' ? '#C1622A' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#1A1A1A',
                  border: msg.role === 'bot' ? '1px solid #E8E0D8' : 'none'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '9px 12px',
                background: '#fff',
                border: '1px solid #E8E0D8',
                borderRadius: '12px',
                borderBottomLeftRadius: '4px',
                width: 'fit-content'
              }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: '6px',
                    height: '6px',
                    background: '#C1622A',
                    borderRadius: '50%',
                    animation: `bounce 1.2s ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '8px 12px 4px',
            background: '#FAFAF8'
          }}>
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '20px',
                  border: '1px solid #C1622A',
                  background: 'transparent',
                  color: '#C1622A',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #E8E0D8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fff'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about products..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1.5px solid #E8E0D8',
                fontSize: '13px',
                outline: 'none',
                background: '#FAFAF8',
                color: '#1A1A1A'
              }}
              onFocus={(e) => e.target.style.borderColor = '#C1622A'}
              onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: loading ? '#A8521F80' : '#C1622A',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
                fontSize: '16px'
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Float Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#C1622A',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          fontSize: '22px',
          boxShadow: '0 4px 16px rgba(193,98,42,0.4)',
          transition: 'transform 0.15s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}