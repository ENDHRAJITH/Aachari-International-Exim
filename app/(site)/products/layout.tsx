import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Products | Aachari International Exim',
  description: 'Browse our full range of export products — onions, moringa powder, spices, grains, and handicrafts. A diverse range of Indian products exported to global market.',
  keywords: 'export products India, agricultural export catalog, onion exporter, moringa powder export, spice exporter Tamil Nadu',
  openGraph: {
    title: 'Our Products | Aachari International Exim',
    description: 'A diverse range of Indian products exported to global market.',
    url: 'https://aachariexim.com/products',
    siteName: 'Aachari International Exim',
    type: 'website'
  },
  alternates: {
    canonical: 'https://aachariexim.com/products'
  }
}

export default function ProductsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}