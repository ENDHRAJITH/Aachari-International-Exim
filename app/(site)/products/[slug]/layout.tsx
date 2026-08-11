import { Metadata } from 'next'

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store',
      headers: {
        'x-internal-secret': process.env.INTERNAL_API_SECRET || ''
      }
    })
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Product Not Found | Aachari International Exim' }
  }

  const title = `${product.name} Export${product.hsn_code ? ' | HSN ' + product.hsn_code : ''} | Aachari International Exim`
  const description = product.short_description || `${product.name} exported from India by Aachari International Exim. Bulk export, APEDA & FSSAI certified.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images?.[0]?.image_url ? [{ url: product.images[0].image_url }] : []
    }
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}