'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Package, Tag, FileText, ArrowRight } from 'lucide-react'

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

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string>('')

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
    } catch {
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '120px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ aspectRatio: '1', backgroundColor: '#EDE8E0', borderRadius: '20px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ aspectRatio: '1', backgroundColor: '#EDE8E0', borderRadius: '10px', animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
              {[60,40,90,70,50].map((w,i) => (
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

  return (
    <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '110px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '32px', fontSize: '12px', color: '#9B9B9B',
          flexWrap: 'wrap'
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

            {/* Main Image */}
            <div style={{
              width: '100%', aspectRatio: '1',
              backgroundColor: '#F0EAE0',
              borderRadius: '20px', overflow: 'hidden',
              position: 'relative',
              border: '1px solid #E8E0D8'
            }}>
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  loading="eager"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={64} color="#D8CFC4" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {sortedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    style={{
                      aspectRatio: '1', borderRadius: '10px',
                      overflow: 'hidden', position: 'relative',
                      cursor: 'pointer',
                      border: activeImage === img.image_url
                        ? '2px solid #C1622A'
                        : '2px solid transparent',
                      outline: activeImage === img.image_url
                        ? 'none'
                        : '1px solid #E8E0D8',
                      transition: 'all 0.15s',
                      backgroundColor: '#F0EAE0'
                    }}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>

            {/* Category pill */}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: '#C1622A18', color: '#C1622A',
                  padding: '5px 12px', borderRadius: '999px',
                  fontSize: '11px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  textDecoration: 'none', width: 'fit-content'
                }}
              >
                <Tag size={11} />
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700, color: '#1A1A1A',
              margin: 0, lineHeight: 1.2
            }}>
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

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E8E0D8' }} />

            {/* Short description */}
            {product.short_description && (
              <p style={{
                fontSize: '15px', color: '#6B6B6B',
                lineHeight: 1.8, margin: 0,
                fontStyle: 'italic'
              }}>
                {product.short_description}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p style={{
                fontSize: '14px', color: '#3D3D3D',
                lineHeight: 1.8, margin: 0
              }}>
                {product.description}
              </p>
            )}

            {/* Quick specs preview — first 3 */}
            {sortedSpecs.length > 0 && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #E8E0D8',
                overflow: 'hidden'
              }}>
                {sortedSpecs.slice(0, 3).map((spec, idx) => (
                  <div key={spec.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: idx < 2 && idx < sortedSpecs.length - 1
                      ? '1px solid #F0EBE3' : 'none',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#FAFAF8'
                  }}>
                    <span style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 500 }}>
                      {spec.spec_key}
                    </span>
                    <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600 }}>
                      {spec.spec_value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
              <Link href="/contact" style={{ textDecoration: 'none', flex: 1, minWidth: '160px' }}>
                <button style={{
                  width: '100%',
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  backgroundColor: '#C1622A', color: '#ffffff',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600,
                  border: 'none', cursor: 'pointer'
                }}>
                  Enquire Now
                  <ArrowRight size={16} />
                </button>
              </Link>

              <Link href="/products" style={{ textDecoration: 'none', flex: 1, minWidth: '140px' }}>
                <button style={{
                  width: '100%',
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  backgroundColor: 'transparent', color: '#1A1A1A',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600,
                  border: '1px solid #E8E0D8', cursor: 'pointer'
                }}>
                  All Products
                </button>
              </Link>
            </div>
          </div>
        </div>

       
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </div>
  )
}