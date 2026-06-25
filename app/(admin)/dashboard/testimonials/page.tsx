'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, MessageSquareQuote, X, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface Testimonial {
  id: string
  name: string
  country: string
  country_code: string | null
  role: string | null
  review: string
  rating: number
  is_active: boolean
  sort_order: number
}

const emptyForm = {
  name: '',
  country: '',
  country_code: '',
  role: '',
  review: '',
  rating: 5,
  is_active: true,
  sort_order: 0
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchTestimonials(token)
  }, [])

  const fetchTestimonials = async (token: string) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) { router.push('/admin/login'); return }
      setTestimonials(data.data)
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const openAddForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (t: Testimonial) => {
    setForm({
      name: t.name,
      country: t.country,
      country_code: t.country_code || '',
      role: t.role || '',
      review: t.review,
      rating: t.rating,
      is_active: t.is_active,
      sort_order: t.sort_order
    })
    setEditingId(t.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.country || !form.review) {
      toast.error('Name, country and review are required')
      return
    }
    const token = localStorage.getItem('admin_token')
    setSaving(true)
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : '/api/admin/testimonials'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        toast.success(editingId ? 'Testimonial updated' : 'Testimonial added')
        closeForm()
        fetchTestimonials(token!)
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return
    const token = localStorage.getItem('admin_token')
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setTestimonials(testimonials.filter((t) => t.id !== id))
        toast.success('Testimonial deleted')
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '9px',
    border: '1.5px solid #E8E0D8',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FAFAF8',
    color: '#1A1A1A',
    transition: 'border-color 0.15s'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#1A1A1A',
    fontWeight: 600,
    display: 'block',
    marginBottom: '6px'
  }

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#C1622A'
      e.target.style.backgroundColor = '#ffffff'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#E8E0D8'
      e.target.style.backgroundColor = '#FAFAF8'
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
            Testimonials
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
            Manage customer reviews shown on the website
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#C1622A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8521F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1622A'}
          >
            <Plus size={16} />
            Add Testimonial
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E8E0D8',
          padding: '22px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </p>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Customer Name *</label>
              <input style={inputStyle} placeholder="e.g. Ahmed Al Mansouri" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} {...focusHandlers} />
            </div>
            <div>
              <label style={labelStyle}>Role / Designation</label>
              <input style={inputStyle} placeholder="e.g. Wholesale Importer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} {...focusHandlers} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Country *</label>
              <input style={inputStyle} placeholder="e.g. Dubai, UAE" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} {...focusHandlers} />
            </div>
            <div>
              <label style={labelStyle}>Country Code</label>
              <input style={inputStyle} placeholder="e.g. AE" value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value })} {...focusHandlers} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Review *</label>
            <textarea
              style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' as const }}
              placeholder="Write the customer review here..."
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              {...focusHandlers}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Rating</label>
              <select
                style={inputStyle}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input
                type="number"
                style={inputStyle}
                placeholder="0"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                {...focusHandlers}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#C1622A' }} />
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Active (show on website)</span>
          </label>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={closeForm} style={{ padding: '10px 20px', borderRadius: '9px', border: '1px solid #E8E0D8', backgroundColor: '#ffffff', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={saving} style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', backgroundColor: saving ? '#A8521F80' : '#C1622A', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : editingId ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E8E0D8', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAF8' }}>
                {['Name', 'Country', 'Role', 'Review', 'Rating', 'Status', 'Actions'].map((h) => (
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
              {loading && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>Loading...</td>
                </tr>
              )}

              {!loading && testimonials.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>
                    <MessageSquareQuote size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No testimonials added yet</p>
                  </td>
                </tr>
              )}

              {!loading && testimonials.map((t, idx) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: idx < testimonials.length - 1 ? '1px solid #F0EBE3' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '13px 16px', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap' }}>{t.name}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', whiteSpace: 'nowrap' }}>{t.country}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', whiteSpace: 'nowrap' }}>{t.role || '-'}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A', maxWidth: '220px' }}>
                    <span style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {t.review}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={13} color="#C1622A" fill="#C1622A" />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      backgroundColor: t.is_active ? '#16A34A15' : '#F0EBE3',
                      color: t.is_active ? '#16A34A' : '#6B6B6B',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => openEditForm(t)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #E8E0D8', backgroundColor: '#ffffff', color: '#1A1A1A', fontSize: '12px', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#1A1A1A'; e.currentTarget.style.borderColor = '#E8E0D8' }}
                      >
                        <Pencil size={13} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        disabled={deletingId === t.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '12px', cursor: deletingId === t.id ? 'not-allowed' : 'pointer', opacity: deletingId === t.id ? 0.6 : 1 }}
                      >
                        <Trash2 size={13} /> {deletingId === t.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}