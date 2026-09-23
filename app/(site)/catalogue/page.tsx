import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Export Product Catalogue | Aachari International Exim',
  description: 'Explore our comprehensive digital product catalogue featuring export-quality Moringa powder, turmeric, onions, spices, and agricultural goods from India.',
  keywords: [
    'export product catalogue',
    'spices catalog India',
    'moringa powder catalog',
    'B2B export catalog',
    'aachari exim brochure'
  ],
  alternates: {
    canonical: 'https://aachariexim.com/catalogue'
  },
  openGraph: {
    title: 'Export Product Catalogue | Aachari International Exim',
    description: 'Explore our digital product catalogue featuring export-quality spices and agricultural goods from India.',
    url: 'https://aachariexim.com/catalogue',
    siteName: 'Aachari International Exim',
    type: 'website'
  }
}

const fraunces = { className: '', variable: '--font-fraunces' };
const plexMono = { className: '', variable: '--font-plex-mono' };

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RawProduct {
  id: string;
  name: string;
  hsn_code: string | null;
  category_id: string | null;
  product_images: Array<{ image_url: string; is_primary: boolean | null }>;
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order');

  let query = supabase
    .from('products')
    .select(`
      id, name, hsn_code, category_id,
      product_images ( image_url, is_primary )
    `)
    .eq('is_active', true)
    .order('sort_order');

  if (category) {
    const activeCategory = categories?.find((c: Category) => c.slug === category);
    if (activeCategory) query = query.eq('category_id', activeCategory.id);
  }

  const { data, error } = await query;
  if (error) console.error('Failed to fetch products:', error);

  const products = ((data as RawProduct[]) ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    hsn_code: p.hsn_code,
    imageUrl:
      p.product_images.find((img) => img.is_primary)?.image_url ??
      p.product_images[0]?.image_url ??
      '',
  }));

  return (
    <div className={`${fraunces.variable} ${plexMono.variable} min-h-screen`} style={{ background: '#EDE4CC' }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">

        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-3"
          style={{ borderBottom: '2px solid #3A2E1E' }}
        >
          <div>
            <div
              className="text-[10px] tracking-[2px] uppercase"
              style={{ color: '#6B7346', fontFamily: 'var(--font-plex-mono)' }}
            >
              Aachari International Exim
            </div>
            <h1
              className="text-2xl md:text-3xl font-semibold mt-1"
              style={{ color: '#3A2E1E', fontFamily: 'var(--font-fraunces)' }}
            >
              Product catalog
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="text-[10px] hidden sm:block"
              style={{ color: '#8A7B55', fontFamily: 'var(--font-plex-mono)' }}
            >
              {products.length} items listed
            </div>
            <a
              href="/catalogue.pdf"
              download="Aachari_Export_Product_Catalogue.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              style={{
                background: '#C1622A',
                color: '#FFFFFF',
                fontFamily: 'var(--font-plex-mono)',
              }}
            >
              <Download size={15} />
              Download Catalogue (PDF)
            </a>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 my-4 flex-wrap" style={{ fontFamily: 'var(--font-plex-mono)' }}>
          <Link
            href="/catalogue"
            className="text-[9px] tracking-wide uppercase px-3 py-1.5"
            style={
              !category
                ? { background: '#3A2E1E', color: '#EDE4CC' }
                : { border: '1px solid #A99B6E', color: '#6B7346' }
            }
          >
            All
          </Link>
          {categories?.map((c: Category) => (
            <Link
              key={c.id}
              href={`/catalogue?category=${c.slug}`}
              className="text-[9px] tracking-wide uppercase px-3 py-1.5"
              style={
                category === c.slug
                  ? { background: '#3A2E1E', color: '#EDE4CC' }
                  : { border: '1px solid #A99B6E', color: '#6B7346' }
              }
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/catalogue/${product.id}`}
              className="block p-2.5 transition-transform hover:-translate-y-1"
              style={{ background: '#F1E9D2', border: '1px solid #C7BB98' }}
            >
              <div
                className="h-24 md:h-28 mb-2 bg-cover bg-center"
                style={{
                  background: product.imageUrl ? undefined : '#3A2E1E',
                  backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                }}
              />
              <div
                className="text-xs md:text-sm truncate"
                style={{ color: '#3A2E1E', fontFamily: 'var(--font-fraunces)' }}
              >
                {product.name}
              </div>
              <div className="flex justify-between items-center mt-1.5">
                {product.hsn_code && (
                  <span
                    className="text-[7px]"
                    style={{ color: '#8A7B55', fontFamily: 'var(--font-plex-mono)' }}
                  >
                    HSN {product.hsn_code}
                  </span>
                )}
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    border: '1px solid #B5502F',
                    color: '#B5502F',
                    fontSize: 6,
                    fontFamily: 'var(--font-plex-mono)',
                  }}
                >
                  EX
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center py-20" style={{ color: '#8A7B55' }}>
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}