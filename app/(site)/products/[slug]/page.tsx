import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug

  if (!rawSlug) {
    notFound()
  }

  const slug = decodeURIComponent(rawSlug).trim()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
    .ilike('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !product) {
    notFound()
  }

  let relatedProducts: any[] = []
  if (product.category_id) {
    const { data: rel } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('category_id', product.category_id)
      .eq('is_active', true)
      .neq('id', product.id)
      .limit(3)

    relatedProducts = rel || []
  }

  return (
    <ProductDetailClient
      initialProduct={product}
      initialRelated={relatedProducts}
    />
  )
}