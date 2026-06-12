import { supabase } from '@/lib/supabase'
import { ApiResponse, Category } from '@/types'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse<Category[]>>({
      success: true,
      data
    })

  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}