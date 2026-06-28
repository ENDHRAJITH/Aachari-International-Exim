import { supabase } from '@/lib/supabase'
import { loginLimiter } from '@/lib/ratelimit'
import { getIP } from '@/lib/getIP'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Rate limit — 10 login attempts per 15 mins per IP
    const ip = getIP(request)
    const { success: allowed, remaining } = await loginLimiter.limit(ip)

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' },
        { status: 429 }
      )
    }

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

    if (error || !data.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
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