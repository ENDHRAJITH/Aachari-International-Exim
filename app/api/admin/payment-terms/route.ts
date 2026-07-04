import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_terms')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { number, title, description, points, is_active, sort_order } = body
    if (!title) return NextResponse.json({ success: false, error: 'Title required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('payment_terms')
      .insert({ number, title, description, points: points || [], is_active: is_active ?? true, sort_order: sort_order ?? 0 })
      .select().single()

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}