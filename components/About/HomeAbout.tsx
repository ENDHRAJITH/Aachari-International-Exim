"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const videos = [
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272446/13244607-uhd_3840_2160_24fps_k2hmbm.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272355/17759086-uhd_3840_2160_30fps_xw6g1z.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272029/13887533_1920_1080_24fps_kzd1ui.mp4",
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

const STORY_TEXT = "Our Story";

export default function HomeAbout() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [typed, setTyped] = useState("");

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

  useEffect(() => {
    let i = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        i++;
        setTyped(STORY_TEXT.slice(0, i));
        if (i === STORY_TEXT.length) {
          timeout = setTimeout(() => {
            deleting = true;
            tick();
          }, 1400);
          return;
        }
        timeout = setTimeout(tick, 130);
      } else {
        i--;
        setTyped(STORY_TEXT.slice(0, i));
        if (i === 0) {
          timeout = setTimeout(() => {
            deleting = false;
            tick();
          }, 500);
          return;
        }
        timeout = setTimeout(tick, 70);
      }
    };

    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, []);

  const loopProducts = [...PRODUCTS, ...PRODUCTS];

  return (
    <section id="about" className="relative overflow-hidden px-6 py-24 lg:px-12">

      {/* Video banner */}
    {/* Video banner */}
<div className="relative mx-auto max-w-[1320px] mb-16 h-[420px] lg:h-[560px] overflow-hidden rounded-3xl">
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
      opacity: fading ? 0 : 0.9,
      transition: "opacity 0.8s ease",
    }}
  >
    <source src={videos[currentIndex]} type="video/mp4" />
  </video>

  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(20,12,6,0.05) 0%, rgba(20,12,6,0.15) 45%, rgba(20,12,6,0.75) 100%)",
    }}
  />

  {/* மாற்றப்பட்ட பகுதி: இப்போ இது Center-Bottom-ல் இருக்கும் */}
  <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 lg:px-12 lg:pb-14 flex justify-center text-center">
    <h2
      className="text-[clamp(2rem,5vw,3.6rem)] font-black tracking-[-0.02em]"
      style={{ color: "#F45D06" }}
    >
      {typed}
      <span
        style={{
          display: "inline-block",
          width: "3px",
          height: "0.9em",
          marginLeft: "4px",
          backgroundColor: "#F45D06",
          verticalAlign: "-0.1em",
          animation: "blinkCaret 0.8s step-end infinite",
        }}
      />
    </h2>
  </div>
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
        <p
          className="mt-8 max-w-[720px] text-[19px] leading-8"
          style={{ color: "#000000", fontWeight: 700 }}
        >
          Welcome to Aachari International Exim Pvt. Ltd. — an Indian export
          company with over a decade of domestic market experience,
          connecting global buyers with quality products through reliable
          international trade.
        </p>

        {/* Responsive Accordion - Mobile: Vertical (Col) | Desktop: Horizontal (Row) */}
        <div 
          className="mt-14 flex flex-col lg:flex-row items-stretch gap-4" 
          style={{ minHeight: "420px" }}
        >
          {CARDS.map((card, idx) => {
            const active = idx === activeIndex;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className="relative overflow-hidden cursor-pointer rounded-[24px]"
                style={{
                  flex: active ? 2.6 : 1,
                  transition: "flex 0.6s cubic-bezier(0.65,0,0.35,1)",
                  backgroundColor: "#ff7322",
                }}
              >
                {active && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[24px]"
                    style={{ animation: "cardPulse 2.4s ease-in-out infinite" }}
                  />
                )}

                <div
                  className="relative h-full flex flex-col p-7 transition-all duration-500"
                  style={{
                    alignItems: active ? "flex-start" : "center",
                    justifyContent: active ? "flex-start" : "center",
                    textAlign: active ? "left" : "center",
                  }}
                >
                  {/* Heading pill */}
                  <div
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white"
                    style={{
                      marginBottom: active ? "16px" : "0",
                      maxWidth: "100%",
                      transition: "padding 0.4s ease",
                    }}
                  >
                    {active && (
                      <span className="relative flex items-center justify-center shrink-0" style={{ width: "10px", height: "10px" }}>
                        <span
                          className="absolute inline-flex h-full w-full rounded-full"
                          style={{
                            backgroundColor: "#22C55E",
                            animation: "liveWave 1.6s ease-out infinite",
                          }}
                        />
                        <span
                          className="relative inline-flex rounded-full shrink-0"
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#22C55E",
                          }}
                        />
                      </span>
                    )}
                    <h3
                      className="font-black leading-tight whitespace-nowrap"
                      style={{
                        color: "#1A1A1A",
                        fontSize: active ? "18px" : "13px",
                        transition: "font-size 0.4s ease",
                      }}
                    >
                      {card.title}
                    </h3>
                  </div>

                  {/* Inactive state line */}
                  {!active && (
                    <div
                      style={{
                        marginTop: "14px",
                        width: "36px",
                        height: "3px",
                        borderRadius: "999px",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        animation: "lineGrow 2.2s ease-in-out infinite",
                      }}
                    />
                  )}

                  {active && (
                    <p
                      className="text-[17px] lg:text-[18px] leading-8 font-medium"
                      style={{
                        color: "rgba(255,255,255,0.95)",
                        animation: "fadeInText 0.5s ease 0.15s both",
                      }}
                    >
                      {card.text}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
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
        @keyframes lineGrow {
          0%, 100% { width: 36px; opacity: 0.6; }
          50% { width: 64px; opacity: 1; }
        }
        @keyframes cardPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          50% { box-shadow: 0 0 0 8px rgba(0,0,0,0); }
        }
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blinkCaret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes liveWave {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </section>
  );
}