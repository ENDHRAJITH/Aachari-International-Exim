import { MetadataRoute } from 'next'

const BASE_URL = 'https://aachariexim.com'

async function getProducts() {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, { cache: 'no-store' })
    const data = await res.json()
    return data.success ? data.data : []
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, { cache: 'no-store' })
    const data = await res.json()
    return data.success ? data.data : []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const categories = await getCategories()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/certificates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/payment-terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: any) => ({
    url: `${BASE_URL}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}