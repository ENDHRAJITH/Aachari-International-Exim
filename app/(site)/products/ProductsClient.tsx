'use client'

import { useState, useEffect, useTransition } from 'react'
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

interface ProductsClientProps {
  initialProducts: Product[]
  initialCategories: any[]
}

export default function ProductsClient({ initialProducts, initialCategories }: ProductsClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [, startTransition] = useTransition()

  const categoryParam = searchParams.get('category') || 'all'

  const [allProducts] = useState<Product[]>(initialProducts)
  const [categories] = useState(initialCategories)
  const [activeCategory, setActiveCategory] = useState(categoryParam)

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(() => {
    if (categoryParam === 'all') return initialProducts
    return initialProducts.filter(p => p.category?.slug === categoryParam)
  })

  // Sync active category & filter when categoryParam URL changes
  useEffect(() => {
    setActiveCategory(categoryParam)
    if (categoryParam === 'all') {
      setFilteredProducts(allProducts)
    } else {
      setFilteredProducts(allProducts.filter(p => p.category?.slug === categoryParam))
    }
  }, [categoryParam, allProducts])

  // Instant 0ms client-side filter switching
  const handleFilter = (slug: string) => {
    setActiveCategory(slug)

    if (slug === 'all') {
      setFilteredProducts(allProducts)
    } else {
      setFilteredProducts(allProducts.filter(p => p.category?.slug === slug))
    }

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
        loading={false}
      />

      <ProductGrid products={filteredProducts} loading={false} />
    </>
  )
}
