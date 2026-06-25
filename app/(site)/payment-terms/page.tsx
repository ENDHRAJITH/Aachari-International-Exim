import { Metadata } from 'next'
import Terms from '@/components/Terms/Terms'
import IncoTermsSection from '@/components/Terms/IncoTermsSection'

export const metadata: Metadata = {
  title: 'Payment Terms | Aachari International Exim',
  description: 'Payment terms and trade conditions for Aachari International Exim — TT (Telegraphic Transfer), LC (Letter of Credit), and bulk export order terms.',
}

export default function PaymentTermsPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <Terms />
      <IncoTermsSection />
    </div>
  )
}