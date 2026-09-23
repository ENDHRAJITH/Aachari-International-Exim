import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import ProductsClient from './ProductsClient'

export const revalidate = 60

async function getProductsData() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          specs:product_specs(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
    ])

    return {
      products: productsRes.data || [],
      categories: categoriesRes.data || []
    }
  } catch (err) {
    console.error('Error fetching products server-side:', err)
    return { products: [], categories: [] }
  }
}

export default async function ProductsPage() {
  const { products, categories } = await getProductsData()

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', marginTop: '70px' }}>
        Our Products
      </h1>
      <p style={{ color: '#6B6B6B', marginBottom: '28px' }}>
        A diverse range of Indian products exported to global market
      </p>

      <Suspense fallback={
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>
          Loading products...
        </div>
      }>
        <ProductsClient
          initialProducts={products}
          initialCategories={categories}
        />
      </Suspense>
    </div>
  )
}