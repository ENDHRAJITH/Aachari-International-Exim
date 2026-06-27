'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [showAllSpecs, setShowAllSpecs] = useState(false)

  const [form, setForm] = useState<EnquiryForm>({
    name: '', email: '', phone: '', country: '', city: '', message: ''
  })

  useEffect(() => {
    params.then(({ slug }) => fetchProduct(slug))
  }, [])

  const fetchProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`)
      const data = await res.json()
      if (!data.success || !data.data) { router.push('/products'); return }
      setProduct(data.data)
      const primary = data.data.images?.find((img: ProductImage) => img.is_primary)
      setActiveImage(primary?.image_url || data.data.images?.[0]?.image_url || '')

      // Related products fetch
      if (data.data.category?.slug) {
        const relRes = await fetch(`/api/products?category=${data.data.category.slug}`)
        const relData = await relRes.json()
        if (relData.success) {
          setRelatedProducts(relData.data.filter((p: any) => p.slug !== slug).slice(0, 3))
        }
      }
    } catch {
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError('Name, email and message are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product?.id, ...form })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', phone: '', country: '', city: '', message: '' })
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
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '120px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div style={{ aspectRatio: '1', backgroundColor: '#EDE8E0', borderRadius: '20px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
              {[60, 40, 90, 70, 50].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? '36px' : '14px', backgroundColor: '#EDE8E0', borderRadius: '6px', width: `${w}%`, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    )
  }

  if (!product) return null

  const sortedSpecs = [...(product.specs || [])].sort((a, b) => a.sort_order - b.sort_order)
  const sortedImages = [...(product.images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
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
          marginBottom: '32px', fontSize: '12px', color: '#9B9B9B', flexWrap: 'wrap'
        }}>
          <Link href="/" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Products</Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/products?category=${product.category.slug}`} style={{ color: '#9B9B9B', textDecoration: 'none' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{product.name}</span>
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
                <Image src={activeImage} alt={product.name} fill priority style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
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
                    <Image src={img.image_url} alt={img.alt_text || product.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
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
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: '#C1622A18', color: '#C1622A',
                    padding: '5px 12px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.5px', textDecoration: 'none'
                  }}
                >
                  <Tag size={11} />
                  {product.category.name}
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
              {product.name}
            </h1>

            {/* HSN */}
            {product.hsn_code && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#1A1A1A', color: '#ffffff',
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, width: 'fit-content'
              }}>
                <FileText size={14} />
                HSN Code: {product.hsn_code}
              </div>
            )}

            <div style={{ height: '1px', backgroundColor: '#E8E0D8' }} />

            {product.short_description && (
              <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                {product.short_description}
              </p>
            )}

            {product.description && (
              <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: 1.8, margin: 0 }}>
                {product.description}
              </p>
            )}

            {/* Specs — expands in place to show all, fully responsive */}
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

              
            <a    href={`https://wa.me/919080619919?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: '140px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: '#25D366', color: '#ffffff',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none'
                }}
              >
                <Phone size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div id="enquiry-form" style={{
          backgroundColor: '#ffffff', borderRadius: '16px',
          border: '1px solid #E8E0D8', padding: '32px',
          marginBottom: '48px', scrollMarginTop: '100px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px' }}>
            Send Enquiry
          </h2>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: '0 0 24px' }}>
            Enquiring about: <strong style={{ color: '#C1622A' }}>{product.name}</strong>
          </p>

          {submitted ? (
            <div style={{
              backgroundColor: '#F0FDF4', border: '1px solid #86EFAC',
              borderRadius: '12px', padding: '24px', textAlign: 'center'
            }}>
              <CheckCircle2 size={40} color="#16A34A" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontWeight: 700, color: '#16A34A', fontSize: '16px', margin: '0 0 6px' }}>
                Enquiry Submitted!
              </p>
              <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>
                Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', color: '#DC2626', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" style={inputStyle} placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} placeholder="+91 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input style={inputStyle} placeholder="e.g. United Arab Emirates" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} placeholder="Your city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
              </div>

              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                  placeholder={`I'm interested in ${product.name}. Please share pricing and MOQ details...`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '14px', borderRadius: '12px', border: 'none',
                  backgroundColor: submitting ? '#A8521F80' : '#C1622A',
                  color: '#ffffff', fontSize: '15px', fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {submitting ? 'Submitting...' : <>Submit Enquiry <ArrowRight size={16} /></>}
              </button>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 20px' }}>
              Related Products
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {relatedProducts.map((rp) => {
                const rpImage = rp.images?.find((img: any) => img.is_primary)?.image_url || rp.images?.[0]?.image_url
                return (
                  <Link key={rp.id} href={`/products/${rp.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      backgroundColor: '#ffffff', borderRadius: '14px',
                      border: '1px solid #E8E0D8', overflow: 'hidden',
                      transition: 'all 0.2s', cursor: 'pointer'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.borderColor = '#C1622A'
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = '#E8E0D8'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#F5EDE0', position: 'relative' }}>
                        {rpImage ? (
                          <Image src={rpImage} alt={rp.name} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={40} color="#D8CFC4" />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '16px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>{rp.name}</p>
                        <p style={{ fontSize: '12px', color: '#C1622A', fontWeight: 600, margin: 0 }}>View Details →</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .spec-row { grid-template-columns: 1fr !important; gap: 2px !important; }
        }
      `}</style>
    </div>
  )
}