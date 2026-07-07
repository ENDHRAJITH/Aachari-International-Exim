"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const videos = [
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272446/13244607-uhd_3840_2160_24fps_k2hmbm.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272355/17759086-uhd_3840_2160_30fps_xw6g1z.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272029/13887533_1920_1080_24fps_kzd1ui.mp4",
];

const PRODUCTS = [
  "Organic Agro Products",
  "Fresh Fruits & Vegetables",
  "Food Powders",
  "Bakery Products",
  "Ready-to-Eat Foods",
  "Handicrafts",
  "Knitted Garments",
  "Woven Garments",
];

const CARDS = [
  {
    title: "Where We Started",
    text: "Our journey began in the domestic market, where years of working closely with customers, suppliers, manufacturers, and producers gave us valuable expertise in product sourcing, quality assurance, and supply chain management.",
  },
  {
    title: "Where We Are Today",
    text: "Today, we extend this expertise to international markets as a trusted exporter from India — serving buyers with organic agro products, fresh produce, food powders, bakery products, ready-to-eat foods, handicrafts, and garments.",
  },
  {
    title: "Where We Are Headed",
    text: "As we continue to expand our global presence, our focus remains simple — to understand our customers' requirements, source products with care, and build business relationships founded on trust, consistency, and shared growth.",
  },
];

export default function HomeAbout() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 2.0;
    const handleEnded = () => {
      setFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setFading(false);
      }, 800);
    };
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [currentIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 2.0;
    video.load();
    video.play().catch(() => {});
  }, [currentIndex]);

  // Auto-slide cards every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % CARDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loopProducts = [...PRODUCTS, ...PRODUCTS];

  return (
    <section id="about" className="relative overflow-hidden px-6 py-24 lg:px-12">
      {/* Video Background - same style as Hero */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundColor: "#f7f1e3" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: fading ? 0 : 0.85,
            transition: "opacity 0.8s ease",
          }}
        >
          <source src={videos[currentIndex]} type="video/mp4" />
        </video>

        {/* Gradient overlay - light, edges only */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(
                135deg,
                rgba(245,237,224,0.35) 0%,
                rgba(245,237,224,0.15) 30%,
                rgba(193,98,42,0.08) 65%,
                rgba(61,35,20,0.15) 100%
              )
            `,
          }}
        />

        {/* Orange glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 80% 50%, rgba(193,98,42,0.1) 0%, transparent 60%)`,
          }}
        />

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "260px",
            background: "linear-gradient(to top, rgba(245,237,224,1) 0%, rgba(245,237,224,0.6) 40%, transparent 100%)",
          }}
        />

        {/* Left fade - text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(245,237,224,0.55) 0%, rgba(245,237,224,0.15) 35%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Eyebrow */}
        <div className="mb-5 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-saffron" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-saffron-deep font-medium">
            About Us
          </span>
        </div>

        {/* Heading */}
        <h2 className="max-w-[820px] text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.08] tracking-[-0.02em] text-ink">
          A decade of trust,{" "}
          <span className="italic font-light text-saffron">now exported</span>{" "}
          to the world.
        </h2>

        {/* Lead paragraph */}
           <p className="mt-8 max-w-[720px] text-[19px] leading-8"
  style={{
    color: '#000000',
    fontWeight: 700,
  }}
>
  Welcome to
    Aachari International Exim Pvt. Ltd.
     
  an Indian export company with over a decade of domestic market experience,
  connecting global buyers with quality products through reliable international trade.
</p>

        {/* Carousel - box with 3 sliding cards + left-side dots */}
        <div className="mt-14 flex items-stretch gap-5 max-w-[600px]">
          {/* Left side dots */}
          <div className="flex flex-col items-center justify-center gap-3">
            {CARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCardIndex(idx)}
                aria-label={`Go to card ${idx + 1}`}
                style={{
                  width: idx === cardIndex ? "8px" : "8px",
                  height: idx === cardIndex ? "24px" : "8px",
                  borderRadius: "999px",
                  backgroundColor: idx === cardIndex ? "#C1622A" : "rgba(193,98,42,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "none",
                }}
              />
            ))}
          </div>

          {/* Carousel box */}
          <div
            className="relative flex-1 overflow-hidden rounded-3xl border border-black/5 bg-white/70 backdrop-blur-sm shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
            style={{ minHeight: "220px" }}
          >
            <div
              style={{
                display: "flex",
                width: `${CARDS.length * 100}%`,
                height: "100%",
                transform: `translateX(-${(cardIndex * 100) / CARDS.length}%)`,
                transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            >
              {CARDS.map((card, idx) => (
                <div
                  key={idx}
                  className="p-8 flex flex-col justify-center"
                  style={{ width: `${100 / CARDS.length}%`, flexShrink: 0 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-2 h-2 rounded-full bg-saffron"
                      style={{
                        boxShadow: "0 0 0 4px rgba(193,98,42,0.15)",
                        animation: "dotPulse 2s ease-in-out infinite",
                      }}
                    />
                    <h3 className="text-[13px] uppercase tracking-[0.2em] text-saffron-deep font-medium">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-[15.5px] leading-7 text-ink-soft">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 rounded-full bg-[#C1622A] px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A84F1D]"
          >
            Discover our story
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Animated Product Marquee */}
        <div
          className="mt-10 overflow-hidden rounded-2xl border border-saffron/20 bg-white/40 backdrop-blur-sm py-4"
          style={{
            maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "productScroll 28s linear infinite",
            }}
          >
            {loopProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-2 px-6 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                <span className="text-[13px] font-medium text-ink-soft">{product}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes productScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(193,98,42,0.15); }
          50% { box-shadow: 0 0 0 7px rgba(193,98,42,0.08); }
        }
      `}</style>
    </section>
  );
}