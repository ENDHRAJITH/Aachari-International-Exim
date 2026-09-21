'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Package, Tag, FileText, ArrowRight, Share2, CheckCircle2, Phone, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductImage {
  id: string
  image_url: string
  is_primary: boolean
  alt_text: string | null
}

interface ProductSpec {
  id: string
  spec_key: string
  spec_value: string
  sort_order: number
}

interface Product {
  id: string
  name: string
  slug: string
  hsn_code: string | null
  description: string | null
  short_description: string | null
  category: { name: string; slug: string } | null
  images: ProductImage[]
  specs: ProductSpec[]
}

interface EnquiryForm {
  name: string
  email: string
  phone: string
  country: string
  city: string
  message: string
}

interface CountryCode {
  code: string
  name: string
  dial: string
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "af", name: "Afghanistan", dial: "+93" },
  { code: "al", name: "Albania", dial: "+355" },
  { code: "dz", name: "Algeria", dial: "+213" },
  { code: "as", name: "American Samoa", dial: "+1684" },
  { code: "ad", name: "Andorra", dial: "+376" },
  { code: "ao", name: "Angola", dial: "+244" },
  { code: "ai", name: "Anguilla", dial: "+1264" },
  { code: "ag", name: "Antigua and Barbuda", dial: "+1268" },
  { code: "ar", name: "Argentina", dial: "+54" },
  { code: "am", name: "Armenia", dial: "+374" },
  { code: "aw", name: "Aruba", dial: "+297" },
  { code: "au", name: "Australia", dial: "+61" },
  { code: "at", name: "Austria", dial: "+43" },
  { code: "az", name: "Azerbaijan", dial: "+994" },
  { code: "bs", name: "Bahamas", dial: "+1242" },
  { code: "bh", name: "Bahrain", dial: "+973" },
  { code: "bd", name: "Bangladesh", dial: "+880" },
  { code: "bb", name: "Barbados", dial: "+1246" },
  { code: "by", name: "Belarus", dial: "+375" },
  { code: "be", name: "Belgium", dial: "+32" },
  { code: "bz", name: "Belize", dial: "+501" },
  { code: "bj", name: "Benin", dial: "+229" },
  { code: "bm", name: "Bermuda", dial: "+1441" },
  { code: "bt", name: "Bhutan", dial: "+975" },
  { code: "bo", name: "Bolivia", dial: "+591" },
  { code: "ba", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "bw", name: "Botswana", dial: "+267" },
  { code: "br", name: "Brazil", dial: "+55" },
  { code: "ca", name: "Canada", dial: "+1" },
  { code: "cn", name: "China", dial: "+86" },
  { code: "dk", name: "Denmark", dial: "+45" },
  { code: "eg", name: "Egypt", dial: "+20" },
  { code: "fr", name: "France", dial: "+33" },
  { code: "de", name: "Germany", dial: "+49" },
  { code: "hk", name: "Hong Kong", dial: "+852" },
  { code: "in", name: "India", dial: "+91" },
  { code: "id", name: "Indonesia", dial: "+62" },
  { code: "it", name: "Italy", dial: "+39" },
  { code: "jp", name: "Japan", dial: "+81" },
  { code: "kw", name: "Kuwait", dial: "+965" },
  { code: "my", name: "Malaysia", dial: "+60" },
  { code: "nl", name: "Netherlands", dial: "+31" },
  { code: "nz", name: "New Zealand", dial: "+64" },
  { code: "om", name: "Oman", dial: "+968" },
  { code: "qa", name: "Qatar", dial: "+974" },
  { code: "sa", name: "Saudi Arabia", dial: "+966" },
  { code: "sg", name: "Singapore", dial: "+65" },
  { code: "za", name: "South Africa", dial: "+27" },
  { code: "es", name: "Spain", dial: "+34" },
  { code: "lka", name: "Sri Lanka", dial: "+94" },
  { code: "ch", name: "Switzerland", dial: "+41" },
  { code: "ae", name: "United Arab Emirates", dial: "+971" },
  { code: "gb", name: "United Kingdom", dial: "+44" },
  { code: "us", name: "United States", dial: "+1" },
  { code: "vn", name: "Vietnam", dial: "+84" }
]

function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (dial: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected =
    COUNTRY_CODES.find((c) => c.dial === value) ??
    COUNTRY_CODES.find((c) => c.code === 'in')!

  const filtered = COUNTRY_CODES.filter((c) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.includes(q)
    )
  })

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 10)
      return () => clearTimeout(t)
    }
  }, [open])

  function handleSelect(c: CountryCode) {
    onChange(c.dial)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '112px', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', padding: '11px 10px',
          borderRadius: '9px', border: '1.5px solid #E8E0D8',
          backgroundColor: '#FAFAF8', fontSize: '14px', color: '#1A1A1A',
          cursor: 'pointer', fontFamily: 'inherit'
        }}
      >
        <img
          src={`https://flagcdn.com/24x18/${selected.code}.png`}
          alt=""
          width={20}
          height={15}
          style={{ borderRadius: '2px', flexShrink: 0, pointerEvents: 'none' }}
        />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected.dial}
        </span>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{
            marginLeft: 'auto', flexShrink: 0, color: '#6B6B6B',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', left: 0, top: 'calc(100% + 6px)',
            zIndex: 30, width: '260px', overflow: 'hidden',
            borderRadius: '10px', border: '1px solid #E8E0D8',
            backgroundColor: '#ffffff',
            boxShadow: '0 16px 40px rgba(42,31,23,0.16)'
          }}
        >
          <div style={{ borderBottom: '1px solid #F0EBE3', padding: '8px' }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '6px',
                border: '1px solid #E8E0D8', backgroundColor: '#FAFAF8',
                fontSize: '13px', color: '#1A1A1A', outline: 'none', fontFamily: 'inherit'
              }}
            />
          </div>

          <ul role="listbox" style={{ maxHeight: '240px', overflowY: 'auto', padding: '4px 0', margin: 0, listStyle: 'none' }}>
            {filtered.length === 0 && (
              <li style={{ padding: '12px 16px', fontSize: '13px', color: '#6B6B6B' }}>
                No matches found
              </li>
            )}

            {filtered.map((c) => {
              const isSelected = c.dial === selected.dial && c.code === selected.code
              return (
                <li key={c.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '9px 16px', textAlign: 'left', fontSize: '13px',
                      color: '#1A1A1A', border: 'none', cursor: 'pointer',
                      backgroundColor: isSelected ? '#C1622A18' : 'transparent',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#C1622A0D' }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <img
                      src={`https://flagcdn.com/24x18/${c.code}.png`}
                      alt=""
                      width={20}
                      height={15}
                      style={{ borderRadius: '2px', flexShrink: 0 }}
                    />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </span>
                    <span style={{ flexShrink: 0, color: '#6B6B6B' }}>{c.dial}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function ProductDetailClient({
  initialProduct,
  initialRelated
}: {
  initialProduct: Product
  initialRelated: any[]
}) {
  const primaryImg = initialProduct.images?.find((img) => img.is_primary)?.image_url || initialProduct.images?.[0]?.image_url || ''
  const [activeImage, setActiveImage] = useState<string>(primaryImg)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [dialCode, setDialCode] = useState('+91')

  const [form, setForm] = useState<EnquiryForm>({
    name: '', email: '', phone: '', country: '', city: '', message: ''
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d\s-]/g, '')
    setForm({ ...form, phone: cleaned })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError('Name, email and message are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const fullPhone = form.phone ? `${dialCode} ${form.phone.trim()}` : null

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: initialProduct.id, ...form, phone: fullPhone })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', phone: '', country: '', city: '', message: '' })
        setDialCode('+91')
      } else {
        setError(data.error || 'Failed to submit')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '9px',
    border: '1.5px solid #E8E0D8',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FAFAF8',
    color: '#1A1A1A',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1A1A1A',
    display: 'block',
    marginBottom: '6px'
  }

  const sortedSpecs = [...(initialProduct.specs || [])].sort((a, b) => a.sort_order - b.sort_order)
  const sortedImages = [...(initialProduct.images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
  const visibleSpecs = showAllSpecs ? sortedSpecs : sortedSpecs.slice(0, 3)

  const trustBadges = [
    '✅ APEDA Certified',
    '✅ Quality Checked',
    '✅ Bulk Orders',
    '✅ Export Ready'
  ]

  return (
    <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '110px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '32px', fontSize: '12px', color: '#9B9B9B', flexWrap: 'wrap',
          marginTop: '70px'
        }}>
          <Link href="/" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Products</Link>
          {initialProduct.category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/products?category=${initialProduct.category.slug}`} style={{ color: '#9B9B9B', textDecoration: 'none' }}>
                {initialProduct.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{initialProduct.name}</span>
        </div>

        {/* Main Grid */}
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>

          {/* Left — Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '100%', aspectRatio: '1',
              backgroundColor: '#F0EAE0', borderRadius: '20px',
              overflow: 'hidden', position: 'relative',
              border: '1px solid #E8E0D8'
            }}>
              {activeImage ? (
                <Image src={activeImage} alt={initialProduct.name} fill priority style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={64} color="#D8CFC4" />
                </div>
              )}
            </div>

            {sortedImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {sortedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    style={{
                      aspectRatio: '1', borderRadius: '10px',
                      overflow: 'hidden', position: 'relative', cursor: 'pointer',
                      border: activeImage === img.image_url ? '2px solid #C1622A' : '2px solid transparent',
                      outline: activeImage === img.image_url ? 'none' : '1px solid #E8E0D8',
                      transition: 'all 0.15s', backgroundColor: '#F0EAE0'
                    }}
                  >
                    <Image src={img.image_url} alt={img.alt_text || initialProduct.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                  </div>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '8px', marginTop: '4px'
            }}>
              {trustBadges.map((badge) => (
                <div key={badge} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #E8E0D8',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#1A1A1A',
                  fontWeight: 500
                }}>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>

            {/* Category + Share */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {initialProduct.category && (
                <Link
                  href={`/products?category=${initialProduct.category.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: '#C1622A18', color: '#C1622A',
                    padding: '5px 12px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.5px', textDecoration: 'none'
                  }}
                >
                  <Tag size={11} />
                  {initialProduct.category.name}
                </Link>
              )}
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  border: '1px solid #E8E0D8', backgroundColor: '#ffffff',
                  fontSize: '12px', color: copied ? '#16A34A' : '#6B6B6B',
                  cursor: 'pointer', fontWeight: 500
                }}
              >
                {copied ? <CheckCircle2 size={13} /> : <Share2 size={13} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#1A1A1A', margin: 0, lineHeight: 1.2 }}>
              {initialProduct.name}
            </h1>

            {/* HSN */}
            {initialProduct.hsn_code && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#1A1A1A', color: '#ffffff',
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, width: 'fit-content'
              }}>
                <FileText size={14} />
                HSN Code: {initialProduct.hsn_code}
              </div>
            )}

            <div style={{ height: '1px', backgroundColor: '#E8E0D8' }} />

            {initialProduct.short_description && (
              <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                {initialProduct.short_description}
              </p>
            )}

            {initialProduct.description && (
              <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: 1.8, margin: 0 }}>
                {initialProduct.description}
              </p>
            )}

            {/* Specs */}
            {sortedSpecs.length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E8E0D8', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EBE3', backgroundColor: '#FAFAF8' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>
                    Specifications
                  </p>
                </div>

                {visibleSpecs.map((spec, idx) => (
                  <div
                    key={spec.id}
                    className="spec-row"
                    style={{
                      display: 'grid', gridTemplateColumns: '140px 1fr',
                      gap: '4px 16px',
                      padding: '11px 16px',
                      borderBottom: idx < visibleSpecs.length - 1 ? '1px solid #F0EBE3' : 'none',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#FAFAF8'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 500 }}>{spec.spec_key}</span>
                    <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, wordBreak: 'break-word' }}>{spec.spec_value}</span>
                  </div>
                ))}

                {sortedSpecs.length > 3 && (
                  <button
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                    style={{
                      width: '100%', padding: '10px 16px', textAlign: 'center',
                      fontSize: '12px', color: '#C1622A', fontWeight: 600,
                      cursor: 'pointer', border: 'none', backgroundColor: '#FAFAF8',
                      borderTop: '1px solid #F0EBE3',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    {showAllSpecs ? (
                      <>Show less <ChevronUp size={13} /></>
                    ) : (
                      <>View all {sortedSpecs.length} specifications <ChevronDown size={13} /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
              <button
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  flex: 1, minWidth: '160px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: '#C1622A', color: '#ffffff',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer'
                }}
              >
                Enquire Now <ArrowRight size={16} />
              </button>

              <a
                href="https://wa.me/919443212345"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: '#25D366', color: '#ffffff',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none'
                }}
              >
                <Phone size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Enquiry Form Section */}
        <div id="enquiry-form" style={{
          backgroundColor: '#ffffff', borderRadius: '20px',
          border: '1px solid #E8E0D8', padding: '36px', marginBottom: '48px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px' }}>
            Request B2B Quote for {initialProduct.name}
          </h2>
          <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 24px' }}>
            Fill out the details below to receive product specifications, minimum order quantity (MOQ), and shipping estimates.
          </p>

          {submitted ? (
            <div style={{
              backgroundColor: '#16A34A15', border: '1px solid #16A34A',
              borderRadius: '12px', padding: '24px', textAlign: 'center'
            }}>
              <CheckCircle2 size={40} color="#16A34A" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>
                Enquiry Submitted Successfully!
              </p>
              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0 }}>
                Thank you for your interest. Our export sales team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {error && (
                <div style={{
                  backgroundColor: '#DC262615', border: '1px solid #DC2626',
                  borderRadius: '8px', padding: '10px 14px', marginBottom: '20px',
                  fontSize: '13px', color: '#DC2626'
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full Name / Company Representative"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <CountryCodeSelect value={dialCode} onChange={setDialCode} />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      placeholder="9876543210"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. United Arab Emirates, USA"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>City / Destination Port</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Dubai Port, Jebel Ali"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Requirement / Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Specify quantity required, packaging preference, target price, etc."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: '#C1622A', color: '#ffffff',
                  padding: '14px 32px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 600, border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1, width: '100%'
                }}
              >
                {submitting ? 'Submitting Enquiry...' : 'Submit B2B Enquiry'}
              </button>
            </form>
          )}
        </div>

        {/* Related Products */}
        {initialRelated.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '20px' }}>
              Related Export Products
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {initialRelated.map((relP) => {
                const img = relP.images?.find((i: any) => i.is_primary)?.image_url || relP.images?.[0]?.image_url
                return (
                  <Link
                    key={relP.id}
                    href={`/products/${relP.slug}`}
                    style={{
                      backgroundColor: '#ffffff', borderRadius: '14px',
                      border: '1px solid #E8E0D8', overflow: 'hidden',
                      textDecoration: 'none', transition: 'transform 0.15s'
                    }}
                  >
                    <div style={{ aspectRatio: '4/3', backgroundColor: '#F0EAE0', position: 'relative' }}>
                      {img ? (
                        <Image src={img} alt={relP.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={32} color="#D8CFC4" />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>
                        {relP.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0, lineClamp: 2 }}>
                        {relP.short_description || relP.name}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .spec-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
