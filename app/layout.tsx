import "./globals.css";
import { fraunces, interTight } from "./fonts";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Aachari International Exim | Premium Spices & Powders Export',
    template: '%s | Aachari International Exim'
  },
  description: 'Premium quality spices and powders exported from India. Moringa powder, turmeric, chilli and more. Trusted B2B export partner worldwide.',
  keywords: ['moringa powder export', 'turmeric powder India', 'spices export India', 'B2B spices supplier', 'aachari international exim'],
  metadataBase: new URL('https://aachariexim.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Aachari International Exim | Premium Spices & Powders Export',
    description: 'Premium quality spices and powders exported from India.',
    url: 'https://aachariexim.com',
    siteName: 'Aachari International Exim',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aachari International Exim',
    description: 'Premium quality spices and powders exported from India.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.className} ${interTight.variable}`}>
        {children}
      </body>
    </html>
  );
}