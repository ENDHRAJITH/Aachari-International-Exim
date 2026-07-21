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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch product
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

  // GSAP ScrollTrigger Video Scrub
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

  // Scroll-spy — highlights whichever step is nearest viewport center
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-2xl">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">Product not found</div>;
  }

  const STEPS = [
    { title: "HSN code" },
    { title: "Description" },
    { title: "Enquire" },
  ];

  return (
    <div className="bg-[#F5F0E8] min-h-screen">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/catalogue"
          className="flex items-center gap-2 px-6 py-3 bg-black/80 hover:bg-black text-white rounded-full text-sm font-medium transition-all"
        >
          ← Back to Catalogue
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
      <div className="relative bg-[#F5F0E8] -mt-20 rounded-t-[3rem] pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-16">
            {product.name}
          </h1>

          {/* Vertical Timeline — spine + dots, scroll-spy highlights active step */}
          <div className="relative">
            {/* base line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-[#EEDFC8]" />
            {/* filled progress line — grows as active step advances */}
            <div
              className="absolute left-[19px] top-2 w-[2px] bg-[#C1622A] transition-all duration-700 ease-out"
              style={{ height: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
            />

            <div className="flex flex-col">
              {STEPS.map((step, idx) => {
                const active = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    ref={(el) => {
                      sectionRefs.current[idx] = el;
                    }}
                    onClick={() => setActiveIndex(idx)}
                    className="relative cursor-pointer pb-14 pl-16 last:pb-0"
                  >
                    {/* dot */}
                    <div
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-black transition-all duration-300"
                      style={{
                        backgroundColor: active ? "#C1622A" : "#ffffff",
                        color: active ? "#ffffff" : "#9a8a76",
                        border: active ? "none" : "2px solid #E7D9C4",
                        boxShadow: active ? "0 6px 18px rgba(193,98,42,0.35)" : "none",
                        transform: active ? "scale(1.08)" : "scale(1)",
                      }}
                    >
                      {active && (
                        <span
                          className="pointer-events-none absolute inline-flex h-full w-full rounded-full"
                          style={{
                            backgroundColor: "#C1622A",
                            animation: "liveWave 1.8s ease-out infinite",
                          }}
                        />
                      )}
                      <span className="relative z-10">{String(idx + 1).padStart(2, "0")}</span>
                    </div>

                    {/* title */}
                    <h3
                      className="font-black leading-tight transition-all duration-300"
                      style={{
                        fontSize: active ? "20px" : "15px",
                        color: active ? "#1A1A1A" : "#8a7a68",
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* content — only active step's content shows */}
                    {active && (
                      <div
                        className="mt-3 max-w-[640px]"
                        style={{ animation: "fadeInText 0.5s ease 0.1s both" }}
                      >
                        {idx === 0 && product.hsn_code && (
                          <div className="inline-flex items-center gap-3 bg-[#C1622A] text-white px-8 py-3 rounded-full text-xl font-semibold">
                            HSN : {product.hsn_code}
                          </div>
                        )}

                        {idx === 1 && (
                          <p
                            className="text-[16px] font-medium leading-8 text-justify"
                            style={{
                              color: "#4a4038",
                              hyphens: "none",
                              overflowWrap: "normal",
                              wordBreak: "normal",
                            }}
                          >
                            {product.description}
                          </p>
                        )}

                        {idx === 2 && product.slug && (
                          <Link
                            href={`/products/${product.slug}`}
                            className="inline-flex items-center gap-2 bg-[#C1622A] hover:bg-[#A8521F] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all active:scale-95"
                            style={{ boxShadow: "0 6px 18px rgba(193,98,42,0.35)" }}
                          >
                            View full details & enquire →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-20">
              <h3 className="text-3xl font-semibold mb-8">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-white p-8 rounded-3xl">
                    <p className="uppercase text-sm tracking-widest text-neutral-500 mb-2">{key}</p>
                    <p className="text-2xl font-medium text-neutral-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes liveWave {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}