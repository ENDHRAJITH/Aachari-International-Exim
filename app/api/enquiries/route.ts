import { supabase, supabaseAdmin } from '@/lib/supabase'
import { sendEnquiryEmail } from '@/lib/resend'
import { enquiryLimiter } from '@/lib/ratelimit'
import { getIP } from '@/lib/getIP'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 60

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request)
    const { success: allowed } = await enquiryLimiter.limit(ip)

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many enquiries. Please try again after 1 hour.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      product_id,
      name,
      email,
      phone,
      country,
      city,
      message
    } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { data: product } = await supabase
      .from('products')
      .select('name')
      .eq('id', product_id)
      .single()

    // Save to database — using supabaseAdmin to bypass RLS on insert+select
    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert({
        product_id: product_id || null,
        name,
        email,
        phone,
        country,
        city,
        message,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    await sendEnquiryEmail({
      name,
      email,
      phone,
      country,
      city,
      message,
      productName: product?.name || 'General Enquiry'
    })

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      data
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}