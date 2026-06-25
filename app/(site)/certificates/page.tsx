import { Metadata } from 'next'
import CertificatesSection from '@/components/certificates/CertificatesSection'

export const metadata: Metadata = {
  title: 'Certificates | Aachari International Exim',
  description: 'APEDA, FSSAI, ISO certified export company from Tamil Nadu, India.',
}

export default function CertificatesPage() {
  return (
    <div style={{ paddingTop: '80px' }}>
      <CertificatesSection mode="full" />
    </div>
  )
}