// File location: src/app/api/admin/certificates/[id]/images/route.ts

import { supabaseAdmin } from '@/lib/supabase'
import cloudinary from '@/lib/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

// GET — list all images for a certificate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('certificate_images')
    .select('*')
    .eq('certificate_id', id)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}

// POST — upload one or more images (field name: "files", multiple allowed)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 })
    }
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `${file.name} is over 10MB` },
          { status: 400 }
        )
      }
    }

    // Does this certificate already have a primary image?
    const { data: existing } = await supabaseAdmin
      .from('certificate_images')
      .select('id, is_primary, sort_order')
      .eq('certificate_id', id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const hasPrimary = await supabaseAdmin
      .from('certificate_images')
      .select('id', { count: 'exact', head: true })
      .eq('certificate_id', id)
      .eq('is_primary', true)

    let nextSortOrder = existing?.[0] ? existing[0].sort_order + 1 : 0
    let needsPrimary = !hasPrimary.count

    const uploaded: any[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `aachari/certificates/${id}`, resource_type: 'image' },
            (error, result) => (error ? reject(error) : resolve(result))
          )
          .end(buffer)
      })

      const isPrimary = needsPrimary
      needsPrimary = false // only the first newly-uploaded file becomes primary

      const { data: row, error: insertError } = await supabaseAdmin
        .from('certificate_images')
        .insert({
          certificate_id: id,
          image_url: uploadResult.secure_url,
          cloudinary_public_id: uploadResult.public_id,
          is_primary: isPrimary,
          sort_order: nextSortOrder,
        })
        .select()
        .single()

      nextSortOrder += 1
      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
      }
      uploaded.push(row)

      // Keep certificates.image_url in sync with the primary image
      if (isPrimary) {
        await supabaseAdmin
          .from('certificates')
          .update({ image_url: uploadResult.secure_url })
          .eq('id', id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`,
      data: uploaded,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// PATCH — set an image as primary. Body: { imageId: string }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { imageId } = await request.json()
  if (!imageId) {
    return NextResponse.json({ success: false, error: 'imageId required' }, { status: 400 })
  }

  // Unset any existing primary, then set the chosen one
  await supabaseAdmin
    .from('certificate_images')
    .update({ is_primary: false })
    .eq('certificate_id', id)
    .eq('is_primary', true)

  const { data: newPrimary, error } = await supabaseAdmin
    .from('certificate_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .eq('certificate_id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  await supabaseAdmin
    .from('certificates')
    .update({ image_url: newPrimary.image_url })
    .eq('id', id)

  return NextResponse.json({ success: true, data: newPrimary })
}

// DELETE — remove an image. Query param: ?imageId=
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const imageId = request.nextUrl.searchParams.get('imageId')
  if (!imageId) {
    return NextResponse.json({ success: false, error: 'imageId required' }, { status: 400 })
  }

  const { data: img } = await supabaseAdmin
    .from('certificate_images')
    .select('*')
    .eq('id', imageId)
    .single()

  const { error } = await supabaseAdmin
    .from('certificate_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  if (img?.cloudinary_public_id) {
    try {
      await cloudinary.uploader.destroy(img.cloudinary_public_id)
    } catch {
      // non-fatal — DB row is already gone
    }
  }

  // If we deleted the primary image, promote the next one in sort order
  if (img?.is_primary) {
    const { data: next } = await supabaseAdmin
      .from('certificate_images')
      .select('*')
      .eq('certificate_id', id)
      .order('sort_order', { ascending: true })
      .limit(1)

    if (next?.[0]) {
      await supabaseAdmin
        .from('certificate_images')
        .update({ is_primary: true })
        .eq('id', next[0].id)
      await supabaseAdmin
        .from('certificates')
        .update({ image_url: next[0].image_url })
        .eq('id', id)
    } else {
      await supabaseAdmin.from('certificates').update({ image_url: null }).eq('id', id)
    }
  }

  return NextResponse.json({ success: true })
}