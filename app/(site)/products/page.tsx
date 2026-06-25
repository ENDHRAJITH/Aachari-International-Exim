'use client'

import { useEffect, useState } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilter from '@/components/products/ProductFilter'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories')
    ])
    const productsData = await productsRes.json()
    const categoriesData = await categoriesRes.json()

    setAllProducts(productsData.data || [])
    setProducts(productsData.data || [])
    setCategories(categoriesData.data || [])
    setLoading(false)
  }

  const handleFilter = async (slug: string) => {
    setActiveCategory(slug)
    setLoading(true)

    if (slug === 'all') {
      setProducts(allProducts)
      setLoading(false)
      return
    }

    const res = await fetch(`/api/products?category=${slug}`)
    const data = await res.json()
    setProducts(data.data || [])
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>
        Our Products
      </h1>
      <p style={{ color: '#6B6B6B', marginBottom: '28px' }}>
        Premium quality agricultural products exported from Tamil Nadu, India
      </p>

      <ProductFilter
        categories={categories}
        activeCategory={activeCategory}
        onFilter={handleFilter}
        totalCount={allProducts.length}
      />

      <ProductGrid products={products} loading={loading} />
    </div>
  )
}