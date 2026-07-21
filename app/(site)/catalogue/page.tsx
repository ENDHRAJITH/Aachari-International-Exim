import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface RawProduct {
  id: string
  name: string
  hsn_code: string | null
  product_images: Array<{ image_url: string; is_primary: boolean }>
}

export default async function CataloguePage() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      hsn_code,
      product_images ( image_url, is_primary )
    `)
    .eq('is_active', true)
    .order('sort_order')

  if (error) console.error('Failed to fetch products:', error)

  const products = ((data as RawProduct[]) ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    hsn_code: p.hsn_code,
    imageUrl:
      p.product_images.find((img) => img.is_primary)?.image_url ??
      p.product_images[0]?.image_url ??
      '',
  }))

  return (
    <div className="relative min-h-screen bg-[#F5F0E8]">
      {/* Home Button */}
      <div className="fixed top-6 left-6 z-[100]">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-black/80 hover:bg-black text-white rounded-full border border-white/20 text-sm font-medium transition-all active:scale-95"
        >
          ← Home
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
          Our products
        </h1>
        <p className="text-neutral-500 mb-10">
          Premium quality agricultural products exported from Tamil Nadu, India
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/catalogue/${product.id}`}
              className="group block bg-white border border-black/5 rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="h-44 bg-neutral-200 bg-cover bg-center"
                style={{ backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined }}
              />
              <div className="p-4">
                <p className="text-sm font-medium text-neutral-900 mb-2 truncate">
                  {product.name}
                </p>
                {product.hsn_code && (
                  <span className="inline-block bg-[#C1622A] text-white text-xs font-medium px-3 py-1 rounded-full">
                    HSN {product.hsn_code}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-neutral-500 py-20">No products found.</p>
        )}
      </div>
    </div>
  )
}