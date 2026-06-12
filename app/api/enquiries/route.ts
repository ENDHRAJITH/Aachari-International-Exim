import { supabase } from '@/lib/supabase'
import { sendEnquiryEmail } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
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

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    // Get product name for email
    const { data: product } = await supabase
      .from('products')
      .select('name')
      .eq('id', product_id)
      .single()

    // Save to database
    const { data, error } = await supabase
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

    // Send email notification
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