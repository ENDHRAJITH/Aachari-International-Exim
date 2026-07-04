'use client'

import { useEffect, useState } from 'react'
import TermsHeader from './TermsHeader'
import TermsCard from './TermsCard'

interface PaymentTerm {
  id: string
  number: string
  title: string
  description: string
  points: string[]
}

export default function Terms() {
  const [terms, setTerms] = useState<PaymentTerm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/payment-terms')
      .then(r => r.json())
      .then(data => { if (data.success) setTerms(data.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="terms" className="bg-cream px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <TermsHeader />

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                height: '200px',
                backgroundColor: '#F0EBE3',
                borderRadius: '14px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {terms.map((term) => (
              <TermsCard
                key={term.id}
                number={term.number}
                title={term.title}
                description={term.description}
                points={term.points}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}