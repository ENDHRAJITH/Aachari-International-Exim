import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Products | Aachari International Exim',
  description: 'Browse our full range of export products — onions, moringa powder, spices, grains, and handicrafts. Premium quality agricultural products exported from Tamil Nadu, India to global markets.',
  keywords: 'export products India, agricultural export catalog, onion exporter, moringa powder export, spice exporter Tamil Nadu',
  openGraph: {
    title: 'Our Products | Aachari International Exim',
    description: 'Premium quality agricultural products exported from Tamil Nadu, India.',
    url: 'https://aachari-international-exim.vercel.app/products',
    siteName: 'Aachari International Exim',
    type: 'website'
  },
  alternates: {
    canonical: 'https://aachari-international-exim.vercel.app/products'
  }
}

export default function ProductsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}