import cloudinary from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Ping cloudinary — account details fetch pannurom
    const result = await cloudinary.api.ping()

    return NextResponse.json({
      success: true,
      message: 'Cloudinary connected!',
      status: result.status
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 })
  }
}