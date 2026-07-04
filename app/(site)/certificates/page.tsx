import { Metadata } from 'next'
import CertificatesSection from '@/components/certificates/CertificatesSection'

export const metadata: Metadata = {
  title: 'Certificates | Aachari International Exim',
  description: 'APEDA, FSSAI, ISO certified export company from Tamil Nadu, India.',
  openGraph: {
    title: 'Certificates | Aachari International Exim',
    description: 'APEDA, FSSAI, ISO certified export company from Tamil Nadu, India.',
    url: 'https://aachariexim.com/certificates',
  },
  alternates: {
    canonical: 'https://aachariexim.com/certificates'
  }
}

export default function CertificatesPage() {
  return (
    <div style={{ paddingTop: '80px',marginTop:'20px' }}>
      <CertificatesSection mode="full" />
    </div>
  )
}