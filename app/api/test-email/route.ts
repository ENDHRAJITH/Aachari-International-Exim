import { sendEnquiryEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await sendEnquiryEmail({
    name: 'Test User',
    email: 'endhrajiththiyagu@gmail.com',
    phone: '9876543210',
    country: 'India',
    city: 'Chennai',
    message: 'I need 50kg onions',
    productName: 'Onion'
  })

  return NextResponse.json(result)
}