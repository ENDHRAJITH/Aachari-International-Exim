import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Test supabaseAdmin connection first
    const { data: test, error: testError } = await supabaseAdmin
      .from('admin_users')
      .select('count')

    if (testError) {
      return NextResponse.json({ 
        success: false, 
        step: 'connection test',
        error: testError.message,
        code: testError.code
      })
    }

    const password = 'admin@123'
    const hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: 'admin@aachariexim.com',
        password_hash: hash,
        role: 'admin',
        is_active: true
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ 
        success: false, 
        step: 'insert',
        error: error.message,
        code: error.code
      })
    }

    return NextResponse.json({ success: true, data })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      success: false, 
      step: 'catch',
      error: message
    })
  }
}