'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const statusColor: Record<string, { bg: string; text: string }> = {
  new: { bg: '#C1622A20', text: '#C1622A' },
  seen: { bg: '#3D7A8A20', text: '#3D7A8A' },
  replied: { bg: '#2E7D3220', text: '#2E7D32' }
}

export default function EnquiryDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [enquiryId, setEnquiryId] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }

    params.then(({ id }) => {
      setEnquiryId(id)
      fetchEnquiry(id, token)
    })
  }, [])

  const fetchEnquiry = async (id: string, token: string) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const found = data.data.find((e: any) => e.id === id)
        setEnquiry(found || null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (status: string) => {
    const token = localStorage.getItem('admin_token')
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        setEnquiry({ ...enquiry, status })
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#3D2314' }}>Loading...</p>
      </div>
    )
  }

  if (!enquiry) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#9c7a6a' }}>Enquiry not found</p>
      </div>
    )
  }

  const rows = [
    { label: 'Name', value: enquiry.name },
    { label: 'Email', value: enquiry.email },
    { label: 'Phone', value: enquiry.phone || '-' },
    { label: 'Country', value: enquiry.country || '-' },
    { label: 'City', value: enquiry.city || '-' },
    { label: 'Product', value: enquiry.product?.name || 'General Enquiry' },
    { label: 'Submitted', value: new Date(enquiry.created_at).toLocaleString() }
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/dashboard/enquiries')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#3D2314',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: '#3D2314', fontSize: '22px', fontWeight: 700, margin: 0 }}>
          Enquiry Detail
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

        {/* Left — Details */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E8D5C0',
          overflow: 'hidden'
        }}>
          {rows.map((row) => (
            <div key={row.label} style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              borderBottom: '1px solid #f0e8df',
              padding: '14px 20px'
            }}>
              <span style={{ fontSize: '13px', color: '#9c7a6a', fontWeight: 500 }}>
                {row.label}
              </span>
              <span style={{ fontSize: '14px', color: '#3D2314' }}>
                {row.value}
              </span>
            </div>
          ))}

          {/* Message */}
          <div style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: '13px', color: '#9c7a6a', fontWeight: 500, margin: '0 0 8px' }}>
              Message
            </p>
            <p style={{
              fontSize: '14px',
              color: '#3D2314',
              lineHeight: 1.7,
              margin: 0,
              backgroundColor: '#faf8f5',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E8D5C0'
            }}>
              {enquiry.message || 'No message provided'}
            </p>
          </div>
        </div>

        {/* Right — Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E8D5C0',
          padding: '20px',
          height: 'fit-content'
        }}>
          <p style={{ fontSize: '13px', color: '#9c7a6a', fontWeight: 500, margin: '0 0 12px' }}>
            Current Status
          </p>

          <span style={{
            display: 'inline-block',
            backgroundColor: statusColor[enquiry.status].bg,
            color: statusColor[enquiry.status].text,
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            textTransform: 'capitalize'
          }}>
            {enquiry.status}
          </span>

          <p style={{ fontSize: '13px', color: '#9c7a6a', fontWeight: 500, margin: '0 0 10px' }}>
            Update Status
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['new', 'seen', 'replied'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusUpdate(s)}
                disabled={enquiry.status === s || updating}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: enquiry.status === s ? statusColor[s].text : '#E8D5C0',
                  backgroundColor: enquiry.status === s ? statusColor[s].bg : '#ffffff',
                  color: enquiry.status === s ? statusColor[s].text : '#3D2314',
                  fontSize: '13px',
                  fontWeight: enquiry.status === s ? 600 : 400,
                  cursor: enquiry.status === s ? 'default' : 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {updating && enquiry.status !== s ? 'Updating...' : s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}