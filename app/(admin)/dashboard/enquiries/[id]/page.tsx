'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, MapPin, Package, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor: Record<string, { bg: string; text: string }> = {
  new: { bg: '#C1622A15', text: '#C1622A' },
  seen: { bg: '#2563EB15', text: '#2563EB' },
  replied: { bg: '#16A34A15', text: '#16A34A' }
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
        toast.success(`Marked as ${status}`)
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#6B6B6B' }}>Loading...</p>
      </div>
    )
  }

  if (!enquiry) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Mail size={32} color="#E8E0D8" style={{ marginBottom: '12px' }} />
        <p style={{ color: '#6B6B6B', fontSize: '14px' }}>Enquiry not found</p>
      </div>
    )
  }

  const infoRows = [
    { label: 'Email', value: enquiry.email, icon: Mail },
    { label: 'Phone', value: enquiry.phone || '-', icon: Phone },
    { label: 'Location', value: [enquiry.city, enquiry.country].filter(Boolean).join(', ') || '-', icon: MapPin },
    { label: 'Product', value: enquiry.product?.name || 'General Enquiry', icon: Package },
    { label: 'Submitted', value: new Date(enquiry.created_at).toLocaleString('en-IN'), icon: Calendar }
  ]

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/dashboard/enquiries')}
          style={{
            background: '#ffffff',
            border: '1px solid #E8E0D8',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            padding: '8px'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: 700, margin: 0 }}>
            Enquiry Detail
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>
            From {enquiry.name}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }} className="enquiry-grid">

        {/* Left — Details */}
        <div>
          {/* Customer card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #E8E0D8',
            padding: '22px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#C1622A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0
              }}>
                {enquiry.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px' }}>
                  {enquiry.name}
                </p>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0 }}>
                  {enquiry.email}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {infoRows.map((row) => {
                const Icon = row.icon
                return (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      backgroundColor: '#FAFAF8',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      flexShrink: 0
                    }}>
                      <Icon size={14} color="#C1622A" />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6B6B6B', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        {row.label}
                      </p>
                      <p style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500, margin: 0 }}>
                        {row.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Message card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #E8E0D8',
            padding: '22px'
          }}>
            <p style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, margin: '0 0 12px' }}>
              Message
            </p>
            <div style={{
              backgroundColor: '#FAFAF8',
              borderRadius: '10px',
              padding: '16px 18px',
              borderLeft: '3px solid #C1622A'
            }}>
              <p style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: 1.7, margin: 0 }}>
                {enquiry.message || 'No message provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Right — Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E8E0D8',
          padding: '20px',
          height: 'fit-content'
        }}>
          <p style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
            marginBottom: '22px',
            textTransform: 'capitalize'
          }}>
            {enquiry.status}
          </span>

          <p style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 600, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                  borderRadius: '9px',
                  border: '1.5px solid',
                  borderColor: enquiry.status === s ? statusColor[s].text : '#E8E0D8',
                  backgroundColor: enquiry.status === s ? statusColor[s].bg : '#ffffff',
                  color: enquiry.status === s ? statusColor[s].text : '#1A1A1A',
                  fontSize: '13px',
                  fontWeight: enquiry.status === s ? 600 : 400,
                  cursor: enquiry.status === s ? 'default' : 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s'
                }}
              >
                {updating ? 'Updating...' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .enquiry-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}