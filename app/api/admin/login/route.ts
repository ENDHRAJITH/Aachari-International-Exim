import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // Debug — exact error paarkalaam
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        status: error.status
      }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: 'No user found' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: data.session?.access_token,
      admin: {
        id: data.user.id,
        email: data.user.email,
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}