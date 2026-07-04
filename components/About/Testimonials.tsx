'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, Quote, MapPin, Briefcase } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  country: string
  country_code: string | null
  role: string | null
  review: string
  rating: number
}
interface Stat {
  id: string
  label: string
  number: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [stats, setStats] = useState<Stat[]>([])

// useEffect la fetch pannunga
useEffect(() => {
  fetch('/api/stats')
    .then((r) => r.json())
    .then((data) => {
      if (data.success) setStats(data.data)
    })
}, [])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTestimonials(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const startAuto = () => {
    if (testimonials.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 3500)
  }

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    startAuto()
    return () => stopAuto()
  }, [testimonials])

  useEffect(() => {
    stopAuto()
    if (!isPaused) startAuto()
  }, [isPaused])

  const goTo = (idx: number) => {
    setCurrent(idx)
    stopAuto()
    setIsPaused(false)
    startAuto()
  }

  if (loading) {
    return (
      <section style={{ padding: '64px 24px', backgroundColor: '#F8F7F4' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '260px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #E8E0D8' }} />
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const t = testimonials[current]

  return (
    <section style={{ padding: '64px 24px', backgroundColor: '#F8F7F4' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '13px', color: '#C1622A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Customer Reviews
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1A1A1A', margin: '8px 0 8px' }}>
            What Our Customers Say
          </h2>
          <p style={{ color: '#6B6B6B', fontSize: '15px', margin: 0 }}>
            Trusted by importers and distributors across the Middle East, Asia and Europe
          </p>
        </div>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #E8E0D8',
            padding: '48px',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            minHeight: '260px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ position: 'absolute', top: '28px', right: '32px', opacity: 0.08 }}>
            <Quote size={64} color="#C1622A" />
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={18} color="#C1622A" fill="#C1622A" />
            ))}
          </div>

          <p style={{ fontSize: '16px', color: '#3D3D3D', lineHeight: 1.8, margin: '0 0 28px', fontStyle: 'italic' }}>
            "{t.review}"
          </p>

          <div style={{ height: '1px', backgroundColor: '#E8E0D8', marginBottom: '24px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#C1622A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: '#ffffff', fontWeight: 700, flexShrink: 0
            }}>
              {t.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>
                {t.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B6B6B' }}>
                  <MapPin size={12} color="#C1622A" />
                  {t.country}
                </span>
                {t.role && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B6B6B' }}>
                    <Briefcase size={12} color="#C1622A" />
                    {t.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '28px' }}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              style={{
                width: idx === current ? '28px' : '10px',
                height: '10px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: idx === current ? '#C1622A' : '#E8E0D8',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
            />
          ))}
        </div>

        {/* <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '20px',
  marginTop: '48px',
  backgroundColor: '#1A1A1A',
  borderRadius: '16px',
  padding: '32px'
}}>
  {stats.map((stat) => (
    <div key={stat.id} style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '32px', fontWeight: 700, color: '#C1622A', margin: '0 0 4px' }}>
        {stat.number}
      </p>
      <p style={{ fontSize: '13px', color: '#A8A8A8', margin: 0 }}>
        {stat.label}
      </p>
    </div>
  ))}
</div> */}

 
      </div>
    </section>
  )
}