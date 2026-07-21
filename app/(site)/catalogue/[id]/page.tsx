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

// Helper: inject Cloudinary transformation params for a lighter mobile version
function getMobileVideoUrl(url: string) {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_720,q_auto:low,f_auto/');
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
          scrub: isMobile ? 0.6 : 1.2, // lighter smoothing lag on mobile
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.to(proxy, {
              time: self.progress * video.duration,
              duration: isMobile ? 0.25 : 0.5, // faster catch-up, less visible lag
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
  }, [product, isMobile]);

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

  const videoSrc = product.video_url
    ? (isMobile ? getMobileVideoUrl(product.video_url) : product.video_url)
    : '';

  return (
    <div className="bg-[#F5F0E8] min-h-screen">
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <Link
          href="/catalogue"
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-black/80 hover:bg-black text-white rounded-full text-xs md:text-sm font-medium transition-all"
        >
          ← Back
        </Link>
      </div>

      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* rest of the page unchanged */}
    </div>
  );
}