'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  hsn_code?: string | null;
  video_url?: string;
  specs?: Record<string, string>;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching product:', error);
      setProduct(data);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!videoRef.current || !product?.video_url) return;

    const video = videoRef.current;
    let tl: gsap.core.Timeline | null = null;

    function setupScrub() {
      const proxy = { time: 0 };

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.to(proxy, {
              time: self.progress * video.duration,
              duration: 0.5,
              ease: "power2.out",
              overwrite: true,
              onUpdate: () => {
                video.currentTime = proxy.time;
              }
            });
          }
        }
      });
    }

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener('loadedmetadata', setupScrub);
    }

    return () => {
      video.removeEventListener('loadedmetadata', setupScrub);
      ScrollTrigger.getAll().forEach(t => t.kill());
      tl?.kill();
    };
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-xl md:text-2xl">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-6 text-center">Product not found</div>;
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen">
      {/* Back Button */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <Link
          href="/catalogue"
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-black/80 hover:bg-black text-white rounded-full text-xs md:text-sm font-medium transition-all"
        >
          ← Back
        </Link>
      </div>

      {/* Video Section */}
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={product.video_url}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* Product Details */}
      <div className="relative bg-[#F5F0E8] -mt-12 md:-mt-20 rounded-t-[2rem] md:rounded-t-[3rem] pt-12 md:pt-20 pb-20 md:pb-32">
        <div className="max-w-4xl mx-auto px-5 md:px-6">
          {/* 1. Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 md:mb-6 leading-tight">
            {product.name}
          </h1>

          {/* 2. HSN code */}
          {product.hsn_code && (
            <div className="inline-flex items-center gap-2 md:gap-3 bg-[#C1622A] text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-xl font-semibold mb-6 md:mb-8">
              HSN : {product.hsn_code}
            </div>
          )}

          {/* 3. Description */}
          <div className="prose prose-base md:prose-xl text-neutral-700 leading-relaxed mb-8 md:mb-10 max-w-none">
            {product.description}
          </div>

          {/* 4. Enquiry Button */}
          {product.slug && (
            <Link
              href={`/products/${product.slug}`}
              className="flex sm:inline-flex items-center justify-center gap-2 bg-[#C1622A] hover:bg-[#A8521F] text-white px-6 py-3.5 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all active:scale-95 w-full sm:w-auto text-center"
              style={{ boxShadow: "0 6px 18px rgba(193,98,42,0.35)" }}
            >
              View full details & enquire →
            </Link>
          )}

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-12 md:mt-20">
              <h3 className="text-2xl md:text-3xl font-semibold mb-5 md:mb-8">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl">
                    <p className="uppercase text-xs md:text-sm tracking-widest text-neutral-500 mb-1.5 md:mb-2">{key}</p>
                    <p className="text-lg md:text-2xl font-medium text-neutral-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}