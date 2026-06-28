import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://aachariexim.com',
  'https://www.aachariexim.com',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. API direct access block ──
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')

    const isDirectAccess = !origin && !referer
    if (isDirectAccess) {
      return NextResponse.json(
        { error: 'Direct API access not allowed' },
        { status: 403 }
      )
    }

    if (origin && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
  }

  // ── 2. Admin routes — JWT check ──
  if (pathname.startsWith('/api/admin/')) {
    if (pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  // ── 3. Security headers ──
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/api/:path*', '/api/admin/:path*']
}