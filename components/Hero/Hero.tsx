'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from 'react'

interface Stat {
  id: string;
  label: string;
  number: string;
  sort_order: number;
}

const videos = [
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272941/15068368_1920_1080_25fps_eylns2.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783275293/Video_Project_2_q01tiz.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783274727/Video_Project_pp6nda.mp4",
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = 2.0
    const handleEnded = () => {
      setFading(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length)
        setFading(false)
      }, 800)
    }
    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [currentIndex])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = 2.0
    video.load()
    video.play().catch(() => {})
  }, [currentIndex])

  return (
    <section className="relative min-h-screen overflow-hidden px-6 lg:px-12 pt-[180px] pb-20">

      {/* Video background */}
      <div style={{ position: "absolute", inset: 0, zIndex: -1, backgroundColor: "#f7f1e3" }}>
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
      </div>

      {/* Text-readability fade — strong/opaque directly behind the text (left),
          tapering to fully transparent by the right so the video stays visible there */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            90deg,
            rgba(247,241,227,0.97) 0%,
            rgba(247,241,227,0.94) 30%,
            rgba(247,241,227,0.75) 45%,
            rgba(247,241,227,0.35) 60%,
            rgba(247,241,227,0.08) 75%,
            transparent 90%
          )`,
          zIndex: 1,
        }}
      />

      {/* Dots */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {videos.map((_, idx) => (
          <div
            key={idx}
            onClick={() => {
              setFading(true)
              setTimeout(() => {
                setCurrentIndex(idx)
                setFading(false)
              }, 400)
            }}
            style={{
              width: idx === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: idx === currentIndex ? '#C1622A' : 'rgba(193,98,42,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1320px] grid items-center gap-[60px] mt-15 lg:grid-cols-[1.15fr_1fr] relative z-10">
        <div className="relative z-10 max-w-4xl" style={{ zIndex: 100 }}>

          {/* Main Heading */}
          <h1
            className="max-w-[950px] text-[clamp(2.5rem,4.5vw,4rem)] font-black leading-[0.95] tracking-[-0.04em]"
            style={{ color: '#000000' }}
          >
            Where{" "}
            <span className="italic" style={{ color: '#C1622A' }}>
              Quality
            </span>{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Leads</span>
            </span>
          </h1>

          {/* Description */}
          <p
            className="mt-8 max-w-[720px] text-[19px] leading-8"
            style={{ color: '#000000', fontWeight: 700 }}
          >
            Aachari International Exim is a trusted partner for premium
            exports and imports, connecting Indian craftsmanship with
            world-class hardware, electronics, and spices to buyers
            across more than forty countries.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: '#C1622A',
                boxShadow: '0 12px 32px rgba(193,98,42,0.45), 0 4px 12px rgba(193,98,42,0.3)'
              }}
            >
              Explore Our Range
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:-translate-y-1"
              style={{
                border: '2.5px solid #1A1A1A',
                color: '#1A1A1A',
                backgroundColor: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              Get Quote →
            </Link>
          </div>

        </div>
      </div>

    </section>
  )
}