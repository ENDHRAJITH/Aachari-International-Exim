import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

async function getProduct(slug: string) {
  try {
    const { data } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        hsn_code,
        description,
        short_description,
        category:categories(name, slug),
        images:product_images(image_url, is_primary, alt_text),
        specs:product_specs(spec_key, spec_value)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    return data || null
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

  const title = `${product.name} Export${product.hsn_code ? ' (HSN ' + product.hsn_code + ')' : ''} | Aachari International Exim`
  const description = product.short_description || product.description || `${product.name} exported from India by Aachari International Exim. Premium quality, APEDA & FSSAI certified B2B export.`
  const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://aachariexim.com/og-image.jpg'
  const canonicalUrl = `https://aachariexim.com/products/${product.slug}`

  return {
    title,
    description,
    keywords: [
      `${product.name} export`,
      `${product.name} supplier India`,
      `${product.name} B2B bulk export`,
      'spices export India',
      'aachari international exim'
    ],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Aachari International Exim',
      type: 'website',
      images: [
        {
          url: primaryImage,
          alt: `${product.name} Export Quality India`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage]
    }
  }
}

export default async function ProductLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return <>{children}</>
  }

  const images = product.images?.map((img: any) => img.image_url) || []
  const specs = product.specs || []

  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images.length > 0 ? images : ['https://aachariexim.com/og-image.jpg'],
    description: product.short_description || product.description || `${product.name} exported from India by Aachari International Exim.`,
    sku: product.hsn_code ? `HSN-${product.hsn_code}` : product.slug,
    mpn: product.hsn_code || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Aachari International Exim'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      price: 'Contact for Bulk B2B Quote',
      offerCount: '1000',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Aachari International Exim Pvt. Ltd.'
      }
    },
    additionalProperty: specs.map((s: any) => ({
      '@type': 'PropertyValue',
      name: s.spec_key,
      value: s.spec_value
    }))
  }

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://aachariexim.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://aachariexim.com/products'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://aachariexim.com/products/${product.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {children}
    </>
  )
}