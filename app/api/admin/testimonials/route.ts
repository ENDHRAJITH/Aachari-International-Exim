import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, country, country_code, role, review, rating, is_active, sort_order } = body

  if (!name || !country || !review) {
    return NextResponse.json(
      { success: false, error: 'Name, country and review are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      name,
      country,
      country_code: country_code || null,
      role: role || null,
      review,
      rating: rating || 5,
      is_active: is_active ?? true,
      sort_order: sort_order || 0
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}