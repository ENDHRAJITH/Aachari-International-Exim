'use client'

import { Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, type Variants } from 'framer-motion'

const standards = [
  { label: 'European Standards' },
  { label: 'Gulf Standards' },
  { label: 'Asian Standards' },
  { label: 'Middle-East Standards' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export default function InternationalStandards() {
  const router = useRouter()

  return (
    <section style={{
      padding: '64px 24px',
      backgroundColor: '#1A1A1A'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px'
          }}>
            <Globe size={14} color="#C1622A" />
            <span style={{
              fontSize: '13px',
              color: '#C1622A',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              International Standards
            </span>
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ffffff',
            margin: '8px 0'
          }}>
            We Provide International Standards
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}
        >
          {standards.map((std) => (
            <motion.div
              key={std.label}
              variants={cardVariants}
              role="button"
              tabIndex={0}
              onClick={() => router.push('/contact')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  router.push('/contact')
                }
              }}
              whileHover={{
                y: -6,
                borderColor: '#C1622A',
                boxShadow: '0 12px 32px rgba(193,98,42,0.15)'
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#242424',
                borderRadius: '14px',
                border: '1px solid #2A2A2A',
                padding: '32px 20px',
                cursor: 'pointer'
              }}
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#C1622A15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  flexShrink: 0
                }}
              >
                <Globe size={24} color="#C1622A" />
              </motion.div>
              <p style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                textAlign: 'center'
              }}>
                {std.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}