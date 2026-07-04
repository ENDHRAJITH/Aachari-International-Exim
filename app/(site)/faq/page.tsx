import { Metadata } from 'next'
import FAQ from '@/components/FAQ/FAQ'

export const metadata: Metadata = {
  title: 'FAQ | Aachari International Exim',
  description: 'Frequently asked questions about ordering, payment terms, shipping, and quality at Aachari International Exim.'
}

export default function FAQPage() {
  return (
    <div style={{ paddingTop: '80px',marginTop:'20px' }}>
      <FAQ />
    </div>
  )
}