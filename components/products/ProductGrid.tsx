import ProductCard from './ProductCard'
import { Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  hsn_code: string | null
  short_description: string | null
  category: { name: string } | null
  images: any[]
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

const SkeletonCard = () => (
  <div style={{
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #E8E0D8',
    overflow: 'hidden'
  }}>
    <div style={{
      width: '100%',
      aspectRatio: '4/3',
      backgroundColor: '#F0EBE3',
      animation: 'pulse 1.5s infinite'
    }} />
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ height: '12px', width: '40%', backgroundColor: '#F0EBE3', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '18px', width: '70%', backgroundColor: '#F0EBE3', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '13px', width: '90%', backgroundColor: '#F0EBE3', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '36px', width: '45%', backgroundColor: '#F0EBE3', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
    </div>
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
  </div>
)

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6B6B6B'
      }}>
        <Package size={48} color="#E8E0D8" style={{ margin: '0 auto 16px', display: 'block' }} />
        <p style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 8px', color: '#1A1A1A' }}>
          No products found
        </p>
        <p style={{ fontSize: '14px', margin: 0 }}>
          Try selecting a different category
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}