'use client'

import { useEffect, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const categoryLabels: Record<string, string> = {
  all: 'All',
  ordering: 'Ordering',
  payment: 'Payment',
  shipping: 'Shipping',
  quality: 'Quality'
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetch('/api/faqs')
      .then(r => r.json())
      .then(data => { if (data.success) setFaqs(data.data) })
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))]

  const filtered = activeCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  const toggle = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <section style={{ padding: '64px 24px', backgroundColor: '#F8F7F4' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px',marginTop: '150px'}}>
          <span style={{
            fontSize: '13px', color: '#C1622A',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            Got Questions?
          </span>
          <h2 style={{
            fontSize: '32px', fontWeight: 700,
            color: '#1A1A1A', margin: '8px 0 8px'
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#6B6B6B', fontSize: '15px', margin: 0 }}>
            Everything you need to know about exporting with Aachari International
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex', gap: '8px',
          flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '32px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setActiveId(null)
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: activeCategory === cat ? '#C1622A' : '#E8E0D8',
                backgroundColor: activeCategory === cat ? '#C1622A' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : '#1A1A1A',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'capitalize'
              }}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                height: '64px', backgroundColor: '#F0EBE3',
                borderRadius: '12px', animation: 'pulse 1.5s infinite'
              }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B6B6B' }}>
            No FAQs found for this category
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((faq, idx) => (
              <div
                key={faq.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: `1.5px solid ${activeId === faq.id ? '#C1622A' : '#E8E0D8'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  animation: `fadeIn 0.3s ease ${idx * 0.05}s both`
                }}
              >
                {/* Question */}
                <button
                  onClick={() => toggle(faq.id)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: activeId === faq.id ? '#C1622A' : '#1A1A1A',
                    lineHeight: 1.4,
                    transition: 'color 0.15s'
                  }}>
                    {faq.question}
                  </span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: activeId === faq.id ? '#C1622A' : '#F0EBE3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.15s'
                  }}>
                    {activeId === faq.id
                      ? <Minus size={14} color="#ffffff" />
                      : <Plus size={14} color="#C1622A" />
                    }
                  </div>
                </button>

                {/* Answer */}
                {activeId === faq.id && (
                  <div style={{
                    padding: '0 20px 20px',
                    borderTop: '1px solid #F0EBE3',
                    animation: 'slideDown 0.2s ease'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#3D3D3D',
                      lineHeight: 1.8,
                      margin: '14px 0 0'
                    }}>
                      {faq.answer}
                    </p>
                    <div style={{
                      display: 'inline-block',
                      marginTop: '12px',
                      padding: '4px 10px',
                      backgroundColor: '#C1622A15',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: '#C1622A',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {categoryLabels[faq.category] || faq.category}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          marginTop: '48px',
          backgroundColor: '#1A1A1A',
          borderRadius: '16px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>
              Still have questions?
            </p>
            <p style={{ color: '#A8A8A8', fontSize: '13px', margin: 0 }}>
              Our team is available 24/7 to help you
            </p>
          </div>
          
          <a  href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#C1622A',
              color: '#ffffff',
              padding: '11px 22px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap'
            }}
          >
            Contact Us →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </section>
  )
}