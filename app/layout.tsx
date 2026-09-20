import "./globals.css";
import { fraunces, interTight } from "./fonts";
import type { Metadata } from 'next'
import ScrollPlane from "@/components/ScrollPlane";

export const metadata: Metadata = {
  title: {
    default: 'Aachari International Exim | Agro Organic | Textile | Rice | Handicrafts',
    template: '%s | Aachari International Exim'
  },
  description: 'Premium quality Agro Organic products, Textiles, Rice, and Handicrafts exported from India. Trusted B2B export partner worldwide.',
  keywords: ['agro organic export', 'textile export India', 'rice export India', 'handicrafts export India', 'aachari international exim'],
  metadataBase: new URL('https://aachariexim.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Aachari International Exim | Agro Organic | Textile | Rice | Handicrafts',
    description: 'Premium quality Agro Organic products, Textiles, Rice, and Handicrafts exported from India.',
    url: 'https://aachariexim.com',
    siteName: 'Aachari International Exim',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aachari International Exim | Agro Organic | Textile | Rice | Handicrafts',
    description: 'Premium quality Agro Organic products, Textiles, Rice, and Handicrafts exported from India.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png' },
    ]
  }
}

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://aachariexim.com/#organization',
  name: 'Aachari International Exim Pvt. Ltd.',
  alternateName: 'Aachari Exim',
  url: 'https://aachariexim.com',
  logo: 'https://aachariexim.com/logo.png',
  image: 'https://aachariexim.com/og-image.jpg',
  description: 'Leading B2B exporter of premium Agro Organic products, Textiles, Rice, Handicrafts, and agricultural products worldwide.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'aachariexim@gmail.com',
    availableLanguage: ['English', 'Tamil']
  },
  sameAs: [
    'https://aachariexim.com'
  ]
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://aachariexim.com/#website',
  url: 'https://aachariexim.com',
  name: 'Aachari International Exim',
  description: 'Premium Quality Agro Organic, Textile, Rice & Handicrafts Export Partner from India',
  publisher: {
    '@id': 'https://aachariexim.com/#organization'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://aachariexim.com/products?search={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className={`${fraunces.className} ${interTight.variable}`}>
        {children}
      </body>
    </html>
  );
}