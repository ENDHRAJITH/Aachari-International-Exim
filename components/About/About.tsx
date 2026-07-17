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
    text: "Our journey began in the domestic market, where years of working closely with customers, suppliers, manufacturers, and producers provided us with valuable expertise in product sourcing, quality assurance, supply chain management, and market expectations. This strong foundation enables us to consistently deliver products that meet customer specifications while fostering long-term business relationships built on trust and reliability.",
  },
  {
    title: "Where We Are Today",
    text: "Today, our diverse product portfolio spans organic agro products, fresh fruits and vegetables, food powders, bakery products, ready-to-eat foods, handicrafts, and knitted and woven garments. We continuously expand our sourcing network to meet evolving global demands, and confidence begins with product evaluation — sample orders, customized packaging, and private labeling are available for most of our products.",
  },
  {
    title: "Where We Are Headed",
    text: "As we continue to expand our global presence, our focus remains simple: to understand our customers' requirements, source products with care, maintain uncompromising quality, and build lasting business relationships founded on trust, consistency, and shared growth.",
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-spy: highlight whichever timeline step is nearest the vertical
  // center of the viewport as the user scrolls past this section.
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
  }, []);

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
    <section id="about" className="relative overflow-hidden mt-25 px-6 py-24 lg:px-12">

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

        {/* Heading — locked to 2 lines */}
        <h2 className="max-w-[820px] text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.08] tracking-[-0.02em] text-ink">
          <span className="block">The Finest of India,</span>
          <span className="block">
            <span className="italic font-light text-saffron">delivered</span>{" "}
            to the world.
          </span>
        </h2>

        {/* Lead paragraph — justified, no mid-word breaks */}
        <p
          className="mt-8 max-w-[720px] text-[19px] leading-8 text-justify"
          style={{
            color: "#000000",
            fontWeight: 700,
            hyphens: "none",
            overflowWrap: "normal",
            wordBreak: "normal",
          }}
        >
          Welcome to Aachari International Exim Pvt. Ltd., an Indian export
          company committed to connecting global buyers with premium-quality
          products through reliable, transparent, and efficient international
          trade. Backed by over a decade of domestic market experience and
          industry expertise, we specialize in sourcing high-quality products
          from trusted manufacturers and producers across India while
          delivering dependable export solutions to customers worldwide.
        </p>

        {/* Vertical Timeline — spine + dots, scroll-spy highlights the active step */}
        <div className="relative mt-16">
          {/* base line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-[#EEDFC8]" />
          {/* filled progress line — grows as the active step advances */}
          <div
            className="absolute left-[19px] top-2 w-[2px] bg-[#F45D06] transition-all duration-700 ease-out"
            style={{ height: `${(activeIndex / (CARDS.length - 1)) * 100}%` }}
          />

          <div className="flex flex-col">
            {CARDS.map((card, idx) => {
              const active = idx === activeIndex;
              return (
                <div
                  key={idx}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className="relative cursor-pointer pb-14 pl-16 last:pb-0"
                >
                  {/* dot */}
                  <div
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-black transition-all duration-300"
                    style={{
                      backgroundColor: active ? "#F45D06" : "#ffffff",
                      color: active ? "#ffffff" : "#9a8a76",
                      border: active ? "none" : "2px solid #E7D9C4",
                      boxShadow: active ? "0 6px 18px rgba(244,93,6,0.35)" : "none",
                      transform: active ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {active && (
                      <span
                        className="pointer-events-none absolute inline-flex h-full w-full rounded-full"
                        style={{
                          backgroundColor: "#F45D06",
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
                    {card.title}
                  </h3>

                  {/* body — only the active step's text is shown, animated in */}
                  {active && (
                    <p
                      className="mt-3 max-w-[640px] text-[16px] font-medium leading-8 text-justify"
                      style={{
                        color: "#4a4038",
                        hyphens: "none",
                        overflowWrap: "normal",
                        wordBreak: "normal",
                        animation: "fadeInText 0.5s ease 0.1s both",
                      }}
                    >
                      {card.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
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