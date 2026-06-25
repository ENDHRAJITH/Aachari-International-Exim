'use client'

import Image from 'next/image'
import Link from 'next/link'

interface ProductImage {
  image_url: string
  is_primary: boolean
  alt_text: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  hsn_code: string | null
  short_description: string | null
  category: { name: string } | null
  images: ProductImage[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #E8E0D8',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(193,98,42,0.12)'
          e.currentTarget.style.borderColor = '#C1622A'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = '#E8E0D8'
        }}
      >
        {/* Image */}
        <div style={{
          width: '100%',
          aspectRatio: '4/3',
          backgroundColor: '#F5EDE0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F5EDE0'
            }}>
              <span style={{ fontSize: '48px' }}>🌿</span>
            </div>
          )}

          {/* Category badge */}
          {product.category && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(26,26,26,0.75)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              backdropFilter: 'blur(4px)'
            }}>
              {product.category.name}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>

          {/* HSN Code */}
          {product.hsn_code && (
            <span style={{
              fontSize: '11px',
              color: '#C1622A',
              fontWeight: 600,
              letterSpacing: '0.3px'
            }}>
              HSN: {product.hsn_code}
            </span>
          )}

          {/* Name */}
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: 0,
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>

          {/* Description */}
          {product.short_description && (
            <p style={{
              fontSize: '13px',
              color: '#6B6B6B',
              margin: 0,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.short_description}
            </p>
          )}

          {/* Enquire button */}
          <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#C1622A',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'background 0.15s'
            }}>
              Enquire Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}