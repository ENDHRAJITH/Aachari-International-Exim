import { supabaseAdmin } from '@/lib/supabase'
import cloudinary from '@/lib/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params

    console.log('DELETE image:', { id, imageId })

    const { data: image, error: fetchError } = await supabaseAdmin
      .from('product_images')
      .select('image_url')
      .eq('id', imageId)
      .single()

    console.log('Image found:', image, 'Fetch error:', fetchError)

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    // Cloudinary public_id extract pannurom
    const urlParts = image.image_url.split('/')
    const filename = urlParts[urlParts.length - 1].split('.')[0]
    const publicId = `aachari/products/${id}/${filename}`

    console.log('Cloudinary publicId:', publicId)

    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (err) {
      console.error('Cloudinary delete error:', err)
      // Continue anyway — DB delete still pannurom
    }

    const { error } = await supabaseAdmin
      .from('product_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Delete route error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params
    const body = await request.json()
    const { is_primary } = body

    if (is_primary) {
      await supabaseAdmin
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', id)
    }

    const { data, error } = await supabaseAdmin
      .from('product_images')
      .update({ is_primary })
      .eq('id', imageId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}