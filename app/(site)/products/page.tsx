'use client'

import { useEffect, useState, useTransition, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilter from '@/components/products/ProductFilter'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  hsn_code: string | null
  category: { id: string; name: string; slug: string } | null
  images: any[]
  specs: any[]
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const categoryParam = searchParams.get('category') || 'all'

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [loading, setLoading] = useState(true)

  // Fetch categories and all products ONCE on mount
  useEffect(() => {
    let isMounted = true

    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        if (isMounted) {
          const fetchedProducts: Product[] = productsData.data || []
          setAllProducts(fetchedProducts)
          setCategories(categoriesData.data || [])

          // Apply initial category filter from URL instantly in-memory
          if (categoryParam !== 'all') {
            setFilteredProducts(
              fetchedProducts.filter(p => p.category?.slug === categoryParam)
            )
          } else {
            setFilteredProducts(fetchedProducts)
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchInitialData()

    return () => {
      isMounted = false
    }
  }, [])

  // Sync category filter instantly when URL categoryParam changes
  useEffect(() => {
    setActiveCategory(categoryParam)
    if (allProducts.length > 0) {
      if (categoryParam === 'all') {
        setFilteredProducts(allProducts)
      } else {
        setFilteredProducts(
          allProducts.filter(p => p.category?.slug === categoryParam)
        )
      }
    }
  }, [categoryParam, allProducts])

  // Instant 0ms client-side filter switching
  const handleFilter = (slug: string) => {
    setActiveCategory(slug)

    // Instant memory filtering
    if (slug === 'all') {
      setFilteredProducts(allProducts)
    } else {
      setFilteredProducts(allProducts.filter(p => p.category?.slug === slug))
    }

    // Non-blocking background URL update
    startTransition(() => {
      if (slug === 'all') {
        router.push('/products', { scroll: false })
      } else {
        router.push(`/products?category=${slug}`, { scroll: false })
      }
    })
  }

  return (
    <>
      <ProductFilter
        categories={categories}
        activeCategory={activeCategory}
        onFilter={handleFilter}
        totalCount={allProducts.length}
      />

      <ProductGrid products={filteredProducts} loading={loading} />
    </>
  )
}

export default function ProductsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', marginTop: '70px' }}>
        Our Products
      </h1>
      <p style={{ color: '#6B6B6B', marginBottom: '28px' }}>
        Premium quality agricultural products exported from Tamil Nadu, India
      </p>

      <Suspense fallback={
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>
          Loading products...
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  )
}