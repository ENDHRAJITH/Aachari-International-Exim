'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const fraunces = { className: '', variable: '--font-fraunces' };
const plexMono = { className: '', variable: '--font-plex-mono' };

interface ProductImage {
  image_url: string;
  is_primary: boolean | null;
  sort_order: number | null;
}

interface ProductSpec {
  spec_key: string;
  spec_value: string;
  sort_order: number | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hsn_code: string | null;
  product_images: ProductImage[];
  product_specs: ProductSpec[];
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, slug, description, hsn_code,
          product_images ( image_url, is_primary, sort_order ),
          product_specs ( spec_key, spec_value, sort_order )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
        return;
      }

      const images = [...(data.product_images ?? [])].sort(
        (a: ProductImage, b: ProductImage) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
      const primary = images.find((img) => img.is_primary) ?? images[0];

      setProduct(data as Product);
      setActiveImage(primary?.image_url ?? '');
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#EDE4CC', color: '#3A2E1E', fontFamily: 'var(--font-plex-mono)' }}
      >
        <p className="text-sm tracking-widest uppercase">Loading manifest...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 text-center"
        style={{ background: '#EDE4CC', color: '#3A2E1E' }}
      >
        Product not found
      </div>
    );
  }

  const specs = [...(product.product_specs ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const gallery = [...(product.product_images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <div
      className={`${fraunces.variable} ${plexMono.variable} min-h-screen`}
      style={{ background: '#EDE4CC' }}
    >
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <Link
          href="/catalogue"
          className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 text-[10px] md:text-xs tracking-widest uppercase transition-all"
          style={{ background: '#3A2E1E', color: '#EDE4CC', fontFamily: 'var(--font-plex-mono)' }}
        >
          ← Back
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-6 pt-24 pb-20 md:pb-32">

        {/* Image + HSN stamp */}
        <div className="relative mb-4 md:mb-6">
          <div
            className="overflow-hidden"
            style={{ background: '#3A2E1E', border: '1px solid #C7BB98' }}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-[280px] md:h-[420px] object-cover"
            />
          </div>
          {product.hsn_code && (
            <div
              className="absolute -bottom-6 right-4 md:right-8 rounded-full flex flex-col items-center justify-center"
              style={{
                width: 64,
                height: 64,
                border: '1.5px solid #B5502F',
                color: '#B5502F',
                background: '#EDE4CC',
                transform: 'rotate(-8deg)',
                fontFamily: 'var(--font-plex-mono)',
              }}
            >
              <div className="text-[8px] tracking-widest">HSN</div>
              <div className="text-xs font-medium">{product.hsn_code}</div>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {gallery.length > 1 && (
          <div className="flex gap-2 mb-10 md:mb-12 mt-8 overflow-x-auto">
            {gallery.map((img) => (
              <button
                key={img.image_url}
                onClick={() => setActiveImage(img.image_url)}
                className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0"
                style={{
                  border: activeImage === img.image_url ? '2px solid #B5502F' : '1px solid #C7BB98',
                }}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <div
          className="text-[10px] tracking-[2px] uppercase mb-2"
          style={{ color: '#6B7346', fontFamily: 'var(--font-plex-mono)' }}
        >
          Aachari International Exim — Product manifest
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 md:mb-8 leading-tight"
          style={{ color: '#3A2E1E', fontFamily: 'var(--font-fraunces)' }}
        >
          {product.name}
        </h1>

        {/* Description */}
        {product.description && (
          <div
            className="text-sm md:text-lg leading-relaxed mb-10 md:mb-14"
            style={{ color: '#4A3F2A', fontFamily: 'var(--font-fraunces)' }}
          >
            {product.description}
          </div>
        )}

        {/* Specs — manifest table */}
        {specs.length > 0 && (
          <div style={{ borderTop: '1px dashed #A99B6E' }} className="pt-6 md:pt-8">
            <div
              className="text-[10px] tracking-[2px] uppercase mb-4 md:mb-6"
              style={{ color: '#6B7346', fontFamily: 'var(--font-plex-mono)' }}
            >
              Manifest — specifications
            </div>
            <table className="w-full text-xs md:text-sm" style={{ color: '#3A2E1E', fontFamily: 'var(--font-plex-mono)' }}>
              <tbody>
                {specs.map((s, i) => (
                  <tr key={s.spec_key} style={i > 0 ? { borderTop: '1px dotted #C7BB98' } : undefined}>
                    <td className="py-2 md:py-3 pr-4" style={{ color: '#8A7B55' }}>
                      {s.spec_key}
                    </td>
                    <td className="py-2 md:py-3 text-right">{s.spec_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer badge */}
        <div className="flex justify-between items-center mt-10 md:mt-14 pt-4" style={{ borderTop: '2px solid #3A2E1E' }}>
          <div className="text-[9px]" style={{ color: '#8A7B55', fontFamily: 'var(--font-plex-mono)' }}>
            aachariexim.com
          </div>
          <div
            className="text-[9px] tracking-widest uppercase px-3 py-1.5"
            style={{ border: '1px solid #6B7346', color: '#6B7346', fontFamily: 'var(--font-plex-mono)' }}
          >
            Export ready
          </div>
        </div>
      </div>
    </div>
  );
}