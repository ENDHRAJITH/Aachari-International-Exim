import { Metadata } from 'next'
import AboutFull from '@/components/About/AboutFull'
import TradeNetwork from '@/components/TradeNetwork'

export const metadata: Metadata = {
  title: 'About Us | Aachari International Exim',
  description: 'Aachari International Exim — a Tamil Nadu based agricultural export company specializing in onions, moringa powder, spices, and handicrafts.',
  openGraph: {
    title: 'About Us | Aachari International Exim',
    description: 'Tamil Nadu based agricultural export company specializing in onions, moringa powder, spices, and handicrafts.',
    url: 'https://aachariexim.com/about',
  },
  alternates: {
    canonical: 'https://aachariexim.com/about'
  }
}

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '80px' ,marginTop:'20px'}}>
      <AboutFull />
      <TradeNetwork/>
    </div>
  )
}