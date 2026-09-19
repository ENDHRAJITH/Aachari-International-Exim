import { Metadata } from 'next'
import FAQ from '@/components/FAQ/FAQ'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Aachari International Exim',
  description: 'Find answers to common questions regarding Indian spice exports, B2B minimum order quantities (MOQ), APEDA & FSSAI certificates, shipping terms (FOB/CIF), and payment methods.',
  keywords: [
    'spice export FAQ',
    'moringa powder MOQ',
    'export payment terms',
    'APEDA certificate India',
    'aachari exim faq'
  ],
  alternates: {
    canonical: 'https://aachariexim.com/faq'
  },
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) | Aachari International Exim',
    description: 'Find answers to common questions regarding Indian spice exports, B2B order MOQ, shipping terms, and certificates.',
    url: 'https://aachariexim.com/faq',
    siteName: 'Aachari International Exim',
    type: 'website'
  }
}

async function getFaqs() {
  try {
    const { data } = await supabase
      .from('faqs')
      .select('question, answer')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    return data || []
  } catch {
    return []
  }
}

export default async function FAQPage() {
  const faqs = await getFaqs()

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f: any) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  }

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <div>
        <FAQ />
      </div>
    </>
  )
}