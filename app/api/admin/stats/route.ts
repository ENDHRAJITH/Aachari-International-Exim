import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { label, number, sort_order } = body

  if (!label || !number) {
    return NextResponse.json(
      { success: false, error: 'Label and number are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('stats')
    .insert({ label, number, sort_order: sort_order || 0 })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}