'use client'

import { Target, Rocket, ShieldCheck, Handshake, Leaf, Zap,EyeIcon, Phone } from 'lucide-react'

export default function VisionMission() {
  const cards = [
    {
      icon: EyeIcon,
      title: 'Our Vision',
      content: 'To establish a legacy where trust is earned, quality is expected, and relationships are valued.'
    },
    {
      icon: Rocket,
      title: 'Our Mission',
      content: 'In the place to satisfy your requirements, we choose quality over convenience, trust over uncertainty, and long-term relationships over temporary gains.'
    }
  ]

 const values = [
  { icon: ShieldCheck, title: 'Quality First', desc: 'Every product undergoes strict quality checks before export.' },
  { icon: Handshake, title: 'Trust & Transparency', desc: 'Honest pricing and clear communication with every buyer.' },
  { icon: Phone, title: '24/7 Support', desc: 'Round-the-clock support for all your export queries and requirements.' },
  { icon: Zap, title: 'Reliability', desc: 'On-time delivery and consistent supply for long-term partnerships.' }
]

  return (
    <section style={{ padding: '64px 24px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontSize: '13px',
            color: '#C1622A',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Who We Are
          </span>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '8px 0 0'
          }}>
            Vision & Mission
          </h2>
        </div>

        {/* Vision + Mission Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '64px'
        }}>
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                style={{
                  backgroundColor: '#F8F7F4',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid #E8E0D8',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(193,98,42,0.1)'
                  e.currentTarget.style.borderColor = '#C1622A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#E8E0D8'
                }}
              >
                {/* Icon Box */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#C1622A15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Icon size={24} color="#C1622A" />
                </div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  margin: '0 0 12px'
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#6B6B6B',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  {card.content}
                </p>
              </div>
            )
          })}
        </div>

        {/* Values Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: 0
          }}>
            Why Aachari?
          </h2>
        </div>

        {/* Values Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {values.map((val) => {
            const Icon = val.icon
            return (
              <div
                key={val.title}
                className="value-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '28px 24px',
                  border: '1px solid #E8E0D8',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C1622A'
                  e.currentTarget.style.borderColor = '#C1622A'
                  // Icon + text color change
                  const icon = e.currentTarget.querySelector('.val-icon') as HTMLElement
                  const title = e.currentTarget.querySelector('.val-title') as HTMLElement
                  const desc = e.currentTarget.querySelector('.val-desc') as HTMLElement
                  const iconWrap = e.currentTarget.querySelector('.val-icon-wrap') as HTMLElement
                  if (icon) icon.style.color = '#ffffff'
                  if (title) title.style.color = '#ffffff'
                  if (desc) desc.style.color = '#FFE0CC'
                  if (iconWrap) iconWrap.style.backgroundColor = 'rgba(255,255,255,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.borderColor = '#E8E0D8'
                  const icon = e.currentTarget.querySelector('.val-icon') as HTMLElement
                  const title = e.currentTarget.querySelector('.val-title') as HTMLElement
                  const desc = e.currentTarget.querySelector('.val-desc') as HTMLElement
                  const iconWrap = e.currentTarget.querySelector('.val-icon-wrap') as HTMLElement
                  if (icon) icon.style.color = '#C1622A'
                  if (title) title.style.color = '#1A1A1A'
                  if (desc) desc.style.color = '#6B6B6B'
                  if (iconWrap) iconWrap.style.backgroundColor = '#C1622A15'
                }}
              >
                {/* Icon */}
                <div
                  className="val-icon-wrap"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: '#C1622A15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    transition: 'background 0.2s'
                  }}
                >
                  <Icon
                    className="val-icon"
                    size={22}
                    color="#C1622A"
                    style={{ transition: 'color 0.2s' }}
                  />
                </div>

                <h4
                  className="val-title"
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    margin: '0 0 8px',
                    transition: 'color 0.2s'
                  }}
                >
                  {val.title}
                </h4>
                <p
                  className="val-desc"
                  style={{
                    fontSize: '13px',
                    color: '#6B6B6B',
                    lineHeight: 1.6,
                    margin: 0,
                    transition: 'color 0.2s'
                  }}
                >
                  {val.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}