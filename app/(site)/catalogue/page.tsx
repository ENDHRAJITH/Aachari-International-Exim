import type { Metadata } from 'next'
import CataloguePageClient from '@/components/catalogue/CataloguePageClient'

export const metadata: Metadata = {
  title: 'Export Catalogue 2026 | Aachari International Exim',
  description:
    'Browse our complete export catalogue of premium Indian spices — turmeric, black pepper, cardamom, coriander and more. APEDA & FSSAI certified. FOB Chennai / Mumbai. MOQ 500 KG.',
  keywords: [
    'Indian spices export catalogue',
    'turmeric export',
    'black pepper wholesale',
    'cardamom supplier India',
    'APEDA certified spices',
    'Aachari International catalogue',
  ],
  openGraph: {
    title: 'Export Catalogue 2026 — Aachari International Exim',
    description:
      'Premium Indian spice exports. Browse our 2026 catalogue with full specs, HSN codes, and certifications.',
    type: 'website',
    url: 'https://aachariexim.com/catalogue',
    images: [
      {
        url: '/og-catalogue.jpg',
        width: 1200,
        height: 630,
        alt: 'Aachari International Export Catalogue 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export Catalogue 2026 — Aachari International Exim',
    description: 'Premium Indian spice exports. Full specs, HSN codes, certifications.',
    images: ['/og-catalogue.jpg'],
  },
  alternates: {
    canonical: 'https://aachariexim.com/catalogue',
  },
}

export default function CataloguePage() {
  return <CataloguePageClient />
}