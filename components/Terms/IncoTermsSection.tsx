'use client'

const terms = [
  { label: 'Contract Period', value: '3 Months, 6 Months, 1 Year, 3 Years Available' },
  { label: 'Price Fixation', value: 'No Price Fixation' },
  { label: 'MOQ', value: 'Minimum Order Quantity Available' },
  { label: 'Standard Packing', value: '5 KG, 10 KG Available — at the Importer\'s Discretion' },
  { label: 'Stand By Brand', value: 'Available' },
  { label: 'Third Party Inspection', value: 'Available' },
  { label: 'Quality Control (QC)', value: 'Available' },
]

export default function IncoTermsSection() {
  return (
    <section
      style={{
        backgroundColor: '#F8F7F4',
        borderRadius: '14px',
        border: '1px solid #E8E0D8',
        padding: '32px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <span
          style={{
            fontSize: '13px',
            color: '#C1622A',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Trade Terms
        </span>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '8px 0 0',
          }}
        >
          INCO Terms
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {terms.map((term) => (
          <div
            key={term.label}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E8E0D8',
              borderRadius: '10px',
              padding: '16px 18px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#6B6B6B',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                margin: '0 0 6px',
              }}
            >
              {term.label}
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#1A1A1A',
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {term.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}