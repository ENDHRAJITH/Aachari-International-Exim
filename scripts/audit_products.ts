import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wshdktvteuyjhrozviun.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaGRrdHZ0ZXV5amhyb3p2aXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzUzMDgsImV4cCI6MjA5NjY1MTMwOH0.CjDU7Sf4Jfe_kcJNM1Su380aJcfFH2mvsTK6xiMynWo'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runAudit() {
  console.log('---------------------------------------------------------')
  console.log('  AACHARI INTERNATIONAL EXIM - PRODUCT SCHEMA AUDIT')
  console.log('---------------------------------------------------------\n')

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      hsn_code,
      description,
      short_description,
      is_active,
      category:categories(name, slug),
      images:product_images(image_url, is_primary, alt_text),
      specs:product_specs(spec_key, spec_value)
    `)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error querying Supabase products:', error)
    process.exit(1)
  }

  console.log(`Total Products in Database: ${products.length}\n`)

  let priceFoundCount = 0
  let enquiryOnlyCount = 0
  let reviewFoundCount = 0

  const auditReport: Array<{
    name: string
    slug: string
    hasPrice: boolean
    hasOffers: boolean
    hasReviews: boolean
    schemaValid: boolean
    issues: string[]
  }> = []

  for (const [index, p] of products.entries()) {
    const issues: string[] = []

    // Check if real numeric price exists in product or specs
    const priceProp = (p as any).price || (p as any).unit_price || (p as any).cost
    const priceSpec = p.specs?.find((s: any) => s.spec_key.toLowerCase().includes('price'))
    const rawPrice = priceProp || (priceSpec ? priceSpec.spec_value : null)

    const numericPrice = rawPrice ? parseFloat(rawPrice) : NaN
    const hasPrice = !isNaN(numericPrice) && numericPrice > 0

    // Check if real review or rating exists
    const hasReviews = false // No reviews table or reviews data present

    if (hasPrice) {
      priceFoundCount++
    } else {
      enquiryOnlyCount++
    }

    if (hasReviews) {
      reviewFoundCount++
    }

    // Build Schema dynamically based strictly on genuine data:
    const images = p.images?.map((img: any) => img.image_url) || []
    const specs = p.specs || []

    const jsonLdProduct: any = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: images.length > 0 ? images : ['https://aachariexim.com/og-image.jpg'],
      description: p.short_description || p.description || `${p.name} exported from India by Aachari International Exim.`,
      sku: p.hsn_code ? `HSN-${p.hsn_code}` : p.slug,
      mpn: p.hsn_code || p.slug,
      brand: {
        '@type': 'Brand',
        name: 'Aachari International Exim'
      }
    }

    // ONLY include offers if genuine numeric pricing exists!
    let hasOffers = false
    if (hasPrice) {
      hasOffers = true
      jsonLdProduct.offers = {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: numericPrice.toString(),
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: `https://aachariexim.com/products/${p.slug}`,
        seller: {
          '@type': 'Organization',
          name: 'Aachari International Exim Pvt. Ltd.'
        }
      }
    }

    // ONLY include additionalProperty if specs exist
    if (specs.length > 0) {
      jsonLdProduct.additionalProperty = specs.map((s: any) => ({
        '@type': 'PropertyValue',
        name: s.spec_key,
        value: s.spec_value
      }))
    }

    // Validate the generated schema object for any invalid / fake data:
    const schemaStr = JSON.stringify(jsonLdProduct)

    if (schemaStr.includes('http://schema.org')) {
      issues.push('Contains insecure http://schema.org URL')
    }
    if (schemaStr.includes('Contact for Bulk B2B Quote')) {
      issues.push('Contains non-numeric text in JSON-LD price')
    }
    if (jsonLdProduct.offers && !jsonLdProduct.offers.price && !jsonLdProduct.offers.lowPrice) {
      issues.push('Offer missing price or lowPrice')
    }
    if (jsonLdProduct.aggregateRating || jsonLdProduct.review) {
      issues.push('Contains fabricated review or rating data')
    }

    const schemaValid = issues.length === 0

    auditReport.push({
      name: p.name,
      slug: p.slug,
      hasPrice,
      hasOffers,
      hasReviews,
      schemaValid,
      issues
    })
  }

  console.log('----------------------------------------------------------------------------------------------------------------------')
  console.log('Product Name                                | Price? | Offers? | Reviews? | Schema Valid? | Issues')
  console.log('----------------------------------------------------------------------------------------------------------------------')
  
  auditReport.forEach((r, i) => {
    const num = (i + 1).toString().padStart(2, ' ')
    const name = r.name.padEnd(42, ' ').slice(0, 42)
    const priceStr = (r.hasPrice ? 'YES' : 'NO (B2B)').padEnd(6, ' ')
    const offerStr = (r.hasOffers ? 'YES' : 'NONE').padEnd(7, ' ')
    const revStr = (r.hasReviews ? 'YES' : 'NONE').padEnd(8, ' ')
    const validStr = (r.schemaValid ? 'VALID ✓' : 'INVALID ✗').padEnd(13, ' ')
    const issueStr = r.issues.length > 0 ? r.issues.join(', ') : 'None'

    console.log(`${num}. ${name} | ${priceStr} | ${offerStr} | ${revStr} | ${validStr} | ${issueStr}`)
  })

  console.log('----------------------------------------------------------------------------------------------------------------------\n')
  console.log(`Total Products Audited: ${auditReport.length}`)
  console.log(`Products with Real Numeric Price: ${priceFoundCount}`)
  console.log(`Products Enquiry-Only / B2B Quote: ${enquiryOnlyCount}`)
  console.log(`Products with Genuine Reviews: ${reviewFoundCount}`)
  console.log(`All Schemas Valid: ${auditReport.every(r => r.schemaValid) ? 'YES 100% CLEAN' : 'NO'}\n`)
}

runAudit()
