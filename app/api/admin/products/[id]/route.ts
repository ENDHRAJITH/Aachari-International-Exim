import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_FIELDS = [
  'category_id',
  'name',
  'slug',
  'hsn_code',
  'description',
  'short_description',
  'is_active',
  'is_featured',
  'sort_order'
]

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product id is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Whitelist — id, created_at, specs ellam ignore pannidum
    const updatePayload: Record<string, any> = {}
    for (const key of ALLOWED_FIELDS) {
      if (key in body) updatePayload[key] = body[key]
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        ...updatePayload,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Specs update pannurom — old specs delete pannitu new specs insert
    if (Array.isArray(body.specs)) {
      await supabaseAdmin
        .from('product_specs')
        .delete()
        .eq('product_id', id)

      const validSpecs = body.specs.filter((s: any) => s.spec_key && s.spec_value)

      if (validSpecs.length > 0) {
        const specsData = validSpecs.map((spec: any, index: number) => ({
          product_id: id,
          spec_key: spec.spec_key,
          spec_value: spec.spec_value,
          sort_order: index + 1
        }))

        await supabaseAdmin.from('product_specs').insert(specsData)
      }
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('PUT /products/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}