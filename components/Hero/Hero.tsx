'use client'

import { useEffect, useRef, useState } from 'react'
import HeroLeft from "./HeroLeft"

const videos = [
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783272941/15068368_1920_1080_25fps_eylns2.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783275293/Video_Project_2_q01tiz.mp4",
  "https://res.cloudinary.com/ddwphfegj/video/upload/q_auto/v1783274727/Video_Project_pp6nda.mp4",
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
    <section className="relative min-h-screen overflow-hidden px-6 lg:px-12 pt-[140px] pb-20">

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
            height: "20px",
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
      <div className="mx-auto max-w-[1320px] grid items-center gap-[60px] lg:grid-cols-[1.15fr_1fr] relative z-10">
        <HeroLeft />
      </div>

    </section>
  )
}