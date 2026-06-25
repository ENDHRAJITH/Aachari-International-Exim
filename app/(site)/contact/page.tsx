import { Metadata } from 'next'
import Contact from '@/components/Contact/Contact'

export const metadata: Metadata = {
  title: 'Contact Us | Aachari International Exim',
  description: 'Get in touch with Aachari International Exim for bulk export enquiries, pricing, and product samples. We respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <Contact />
    </div>
  )
}