import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.message) {
      return NextResponse.json(
        { success: false, response: 'Message is required' },
        { status: 400 }
      )
    }

    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message })
    })

    const data = await res.json()

    return NextResponse.json({
      success: true,
      response: data.response
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      response: 'AI assistant unavailable. Please try again.'
    }, { status: 500 })
  }
}