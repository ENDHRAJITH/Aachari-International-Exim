'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductImage {
  image_url: string
  is_primary: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  hsn_code: string | null
  is_featured: boolean
  images: ProductImage[]
  category: { name: string } | null
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) {
        const featured = data.data.filter((p: Product) => p.is_featured).slice(0, 6)
        setProducts(featured.length > 0 ? featured : data.data.slice(0, 6))
      }
    } finally {
      setLoading(false)
    }
  }

  const getImage = (product: Product) => {
    const primary = product.images?.find((img) => img.is_primary)
    return primary?.image_url || product.images?.[0]?.image_url || ''
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.short_description || `${product.name} export from Aachari International Exim`,
        url: `https://aachariexim.com/products/${product.slug}`,
        image: getImage(product),
        category: product.category?.name,
        brand: { '@type': 'Brand', name: 'Aachari International Exim' }
      }
    }))
  }

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      style={{ padding: '64px 24px', backgroundColor: '#F8F7F4' }}
    >
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontSize: '13px',
            color: '#C1622A',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            What We Export
          </span>
          <h2
            id="products-heading"
            style={{ fontSize: '32px', fontWeight: 700, color: '#1A1A1A', margin: '8px 0 0' }}
          >
            Our Products
          </h2>
          <p style={{ color: '#6B6B6B', fontSize: '15px', margin: '8px 0 0' }}>
            Premium quality agricultural products exported from Tamil Nadu, India
          </p>
        </div>

        {/* Grid — centered, card max-width capped */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                width: '300px',
                aspectRatio: '4/3',
                backgroundColor: '#F0EBE3',
                borderRadius: '14px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6B6B6B' }}>
            No products available right now.
          </p>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {products.map((product) => {
              const image = getImage(product)
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  title={`View ${product.name} export details`}
                  style={{ textDecoration: 'none', width: '300px', flexGrow: 0, flexShrink: 0 }}
                >
                  <article style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #E8E0D8',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      backgroundColor: '#F5EDE0',
                      position: 'relative'
                    }}>
                      {image ? (
                        <Image
                          src={image}
                          alt={`${product.name} export from India${product.category ? ' - ' + product.category.name : ''}${product.hsn_code ? ' - HSN ' + product.hsn_code : ''}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="300px"
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '48px' }} role="img" aria-label={product.name}>🌿</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '18px 20px' }}>
                      {product.category && (
                        <span style={{
                          fontSize: '11px',
                          color: '#C1622A',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}>
                          {product.category.name}
                        </span>
                      )}
                      <h3 style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#1A1A1A',
                        margin: '6px 0 6px'
                      }}>
                        {product.name}
                      </h3>
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
                        {product.short_description || `Premium quality ${product.name.toLowerCase()} export product.`}
                      </p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}

        {/* View All button */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link
            href="/products"
            title="View all export products from Aachari International Exim"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#C1622A',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            View All Products →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}