import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
export const revalidate = 60
export async function GET() {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}