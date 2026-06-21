'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor: Record<string, { bg: string; text: string }> = {
  new: { bg: '#C1622A15', text: '#C1622A' },
  seen: { bg: '#2563EB15', text: '#2563EB' },
  replied: { bg: '#16A34A15', text: '#16A34A' }
}

export default function EnquiriesPage() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchEnquiries(token)
  }, [])

  const fetchEnquiries = async (token: string) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) { router.push('/admin/login'); return }
      setEnquiries(data.data)
      setFiltered(data.data)
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (status: string) => {
    setActiveFilter(status)
    if (status === 'all') {
      setFiltered(enquiries)
    } else {
      setFiltered(enquiries.filter((e) => e.status === status))
    }
  }

  const handleStatusUpdate = async (id: string, status: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation()
    const token = localStorage.getItem('admin_token')
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        const updated = enquiries.map((en) =>
          en.id === id ? { ...en, status } : en
        )
        setEnquiries(updated)
        setFiltered(
          activeFilter === 'all'
            ? updated
            : updated.filter((en) => en.status === activeFilter)
        )
        toast.success('Status updated')
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setUpdating(null)
    }
  }

  const filterButtons = ['all', 'new', 'seen', 'replied']

  const SkeletonRow = () => (
    <tr>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <td key={i} style={{ padding: '13px 16px' }}>
          <div style={{
            height: '14px',
            backgroundColor: '#F0EBE3',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite'
          }} />
        </td>
      ))}
    </tr>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
            Enquiries
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
            Customer enquiries from your website
          </p>
        </div>
        <span style={{ color: '#6B6B6B', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid #E8E0D8', padding: '6px 14px', borderRadius: '20px' }}>
          {filtered.length} results
        </span>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {filterButtons.map((f) => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: activeFilter === f ? '#C1622A' : '#E8E0D8',
              backgroundColor: activeFilter === f ? '#C1622A' : '#ffffff',
              color: activeFilter === f ? '#ffffff' : '#1A1A1A',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s'
            }}
          >
            {f === 'all' ? `All (${enquiries.length})` : `${f} (${enquiries.filter(e => e.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #E8E0D8',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAF8' }}>
                {['Name', 'Email', 'Phone', 'Product', 'Country', 'Message', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding: '11px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    color: '#6B6B6B',
                    fontWeight: 600,
                    borderBottom: '1px solid #F0EBE3',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center' }}>
                    <Mail size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No enquiries found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((enq, idx) => (
                  <tr
                    key={enq.id}
                    onClick={() => router.push(`/dashboard/enquiries/${enq.id}`)}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid #F0EBE3' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', fontSize: '14px', color: '#1A1A1A', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {enq.name}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A' }}>
                      {enq.email}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                      {enq.phone || '-'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                      {enq.product?.name || 'General'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                      {enq.country || '-'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', maxWidth: '200px' }}>
                      <span style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {enq.message || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <select
                        value={enq.status}
                        disabled={updating === enq.id}
                        onChange={(e) => handleStatusUpdate(enq.id, e.target.value, e)}
                        style={{
                          backgroundColor: statusColor[enq.status].bg,
                          color: statusColor[enq.status].text,
                          border: 'none',
                          borderRadius: '20px',
                          padding: '5px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="new">new</option>
                        <option value="seen">seen</option>
                        <option value="replied">replied</option>
                      </select>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}