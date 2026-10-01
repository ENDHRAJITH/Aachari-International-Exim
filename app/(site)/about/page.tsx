import { Metadata } from 'next'
import AboutFull from '@/components/About/AboutFull'
import TradeNetwork from '@/components/TradeNetwork'

export const metadata: Metadata = {
  title: 'About Us | Aachari International Exim',
  description: 'Aachari International Exim — an India based agricultural export company specializing in onions, moringa powder, rice, and handicrafts.',
  openGraph: {
    title: 'About Us | Aachari International Exim',
    description: 'India based agricultural export company specializing in onions, moringa powder, rice, and handicrafts.',
    url: 'https://aachariexim.com/about',
  },
  alternates: {
    canonical: 'https://aachariexim.com/about'
  }
}

export default function AboutPage() {
  return (
    <div style={{  marginTop:'20px'}}>
      <AboutFull />
      <TradeNetwork/>
    </div>
  )
}