import { Metadata } from 'next'
import Terms from '@/components/Terms/Terms'
import IncoTermsSection from '@/components/Terms/IncoTermsSection'

export const metadata: Metadata = {
  title: 'Payment & Trade Terms | Aachari International Exim',
  description: 'Payment terms and international trade conditions for Aachari International Exim — TT (Telegraphic Transfer), LC (Letter of Credit), FOB, and CIF export terms.',
  alternates: {
    canonical: 'https://aachariexim.com/payment-terms'
  },
  openGraph: {
    title: 'Payment & Trade Terms | Aachari International Exim',
    description: 'Payment terms and trade conditions — TT, LC, FOB, and CIF export terms.',
    url: 'https://aachariexim.com/payment-terms',
    siteName: 'Aachari International Exim',
    type: 'website'
  }
}

export default function PaymentTermsPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <Terms />
      <IncoTermsSection />
    </div>
  )
}