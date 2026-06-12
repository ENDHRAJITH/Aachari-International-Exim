import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      category_id,
      name,
      slug,
      hsn_code,
      description,
      short_description,
      is_active,
      is_featured,
      sort_order,
      specs,
      images
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Insert product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        category_id,
        name,
        slug,
        hsn_code,
        description,
        short_description,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        sort_order: sort_order ?? 0
      })
      .select()
      .single()

    if (productError) {
      return NextResponse.json(
        { success: false, error: productError.message },
        { status: 500 }
      )
    }

    // Insert specs if provided
    if (specs && specs.length > 0) {
      const specsData = specs.map((spec: { spec_key: string; spec_value: string }, index: number) => ({
        product_id: product.id,
        spec_key: spec.spec_key,
        spec_value: spec.spec_value,
        sort_order: index + 1
      }))

      await supabaseAdmin.from('product_specs').insert(specsData)
    }

    // Insert images if provided
    if (images && images.length > 0) {
      const imagesData = images.map((img: { image_url: string; alt_text: string; is_primary: boolean }, index: number) => ({
        product_id: product.id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        is_primary: index === 0,
        sort_order: index + 1
      }))

      await supabaseAdmin.from('product_images').insert(imagesData)
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}