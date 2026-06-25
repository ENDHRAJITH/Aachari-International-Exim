'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
    params.then(({ slug }) => {
      fetchProduct(slug)
    })
  }, [])

  const fetchProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`)
      const data = await res.json()

      if (!data.success || !data.data) {
        router.push('/products')
        return
      }

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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ aspectRatio: '1', backgroundColor: '#F0EBE3', borderRadius: '14px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ aspectRatio: '1', backgroundColor: '#F0EBE3', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: i === 1 ? '32px' : '16px', backgroundColor: '#F0EBE3', borderRadius: '4px', width: i === 1 ? '60%' : '90%', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    )
  }

  if (!product) return null

  const sortedSpecs = [...(product.specs || [])].sort((a, b) => a.sort_order - b.sort_order)
  const sortedImages = [...(product.images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))

  return (
  <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: '#6B6B6B' }}>
          <Link href="/" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Home</Link>
          <span>→</span>
          <Link href="/products" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Products</Link>
          {product.category && (
            <>
              <span>→</span>
              <Link href={`/products?category=${product.category.slug}`} style={{ color: '#6B6B6B', textDecoration: 'none' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span>→</span>
          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Product Detail — Top Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '40px'
          }}
          className="product-detail-grid"
        >
          {/* Left — Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Main image */}
            <div style={{
              width: '100%',
              aspectRatio: '1',
              backgroundColor: '#F5EDE0',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid #E8E0D8'
            }}>
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '64px' }}>🌿</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {sortedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      border: activeImage === img.image_url ? '2px solid #C1622A' : '2px solid #E8E0D8',
                      transition: 'border-color 0.15s'
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

          {/* Right — Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Category */}
            {product.category && (
              <span style={{
                fontSize: '12px',
                color: '#C1622A',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {product.category.name}
              </span>
            )}

            {/* Name */}
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1A1A1A',
              margin: 0,
              lineHeight: 1.2
            }}>
              {product.name}
            </h1>

            {/* HSN Badge */}
            {product.hsn_code && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#C1622A',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                🌐 HSN Code: {product.hsn_code}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p style={{
                fontSize: '14px',
                color: '#3D3D3D',
                lineHeight: 1.7,
                margin: 0
              }}>
                {product.description}
              </p>
            )}

            {/* Enquire button — dummy, no action */}
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#C1622A',
                color: '#ffffff',
                padding: '13px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                marginTop: '8px'
              }}
            >
              Enquire Now →
            </button>
          </div>
        </div>

        {/* Specifications */}
        {sortedSpecs.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #E8E0D8',
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #F0EBE3',
              backgroundColor: '#FAFAF8'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                Product Specifications
              </h2>
            </div>
            <div style={{ padding: '8px 0' }}>
              {sortedSpecs.map((spec, idx) => (
                <div
                  key={spec.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    padding: '12px 24px',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#FAFAF8',
                    borderBottom: idx < sortedSpecs.length - 1 ? '1px solid #F0EBE3' : 'none'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#3D2314' }}>
                    {spec.spec_key}
                  </span>
                  <span style={{ fontSize: '13px', color: '#1A1A1A' }}>
                    {spec.spec_value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}