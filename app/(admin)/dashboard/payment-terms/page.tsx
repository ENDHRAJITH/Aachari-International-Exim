'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, CreditCard, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentTerm {
  id: string
  number: string
  title: string
  description: string | null
  points: string[]
  is_active: boolean
  sort_order: number
}

const emptyForm = {
  number: '',
  title: '',
  description: '',
  points: [''],
  is_active: true,
  sort_order: 0
}

export default function PaymentTermsPage() {
  const router = useRouter()
  const [terms, setTerms] = useState<PaymentTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchTerms(token)
  }, [])

  const fetchTerms = async (token: string) => {
    try {
      const res = await fetch('/api/admin/payment-terms', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) { router.push('/admin/login'); return }
      setTerms(data.data)
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

  const openEditForm = (term: PaymentTerm) => {
    setForm({
      number: term.number,
      title: term.title,
      description: term.description || '',
      points: term.points?.length > 0 ? term.points : [''],
      is_active: term.is_active,
      sort_order: term.sort_order
    })
    setEditingId(term.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handlePointChange = (idx: number, value: string) => {
    const updated = [...form.points]
    updated[idx] = value
    setForm({ ...form, points: updated })
  }

  const addPoint = () => setForm({ ...form, points: [...form.points, ''] })

  const removePoint = (idx: number) => {
    setForm({ ...form, points: form.points.filter((_, i) => i !== idx) })
  }

  const handleSubmit = async () => {
    if (!form.title) { toast.error('Title is required'); return }

    const token = localStorage.getItem('admin_token')
    setSaving(true)

    try {
      const url = editingId
        ? `/api/admin/payment-terms/${editingId}`
        : '/api/admin/payment-terms'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          points: form.points.filter((p) => p.trim() !== '')
        })
      })

      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? 'Updated successfully' : 'Added successfully')
        closeForm()
        fetchTerms(token!)
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return

    const token = localStorage.getItem('admin_token')
    setDeletingId(id)

    try {
      const res = await fetch(`/api/admin/payment-terms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setTerms(terms.filter((t) => t.id !== id))
        toast.success('Deleted successfully')
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Payment Terms</h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>Manage payment methods shown on the website</p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#C1622A', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8521F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1622A'}
          >
            <Plus size={16} /> Add Term
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E8E0D8', padding: '22px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              {editingId ? 'Edit Payment Term' : 'Add Payment Term'}
            </p>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Number</label>
              <input style={inputStyle} placeholder="01" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} {...focusHandlers} />
            </div>
            <div>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} placeholder="e.g. Letter of Credit" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} {...focusHandlers} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              {...focusHandlers}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ ...labelStyle, margin: 0 }}>Points</label>
              <button
                onClick={addPoint}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '6px', border: '1px solid #C1622A', backgroundColor: 'transparent', color: '#C1622A', fontSize: '12px', cursor: 'pointer' }}
              >
                <Plus size={12} /> Add Point
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {form.points.map((point, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 36px', gap: '8px', alignItems: 'center' }}>
                  <input
                    style={inputStyle}
                    placeholder={`Point ${idx + 1}`}
                    value={point}
                    onChange={(e) => handlePointChange(idx, e.target.value)}
                    {...focusHandlers}
                  />
                  <button
                    onClick={() => removePoint(idx)}
                    style={{ padding: '8px', borderRadius: '7px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#C1622A' }} />
              <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Active</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={closeForm} style={{ padding: '10px 20px', borderRadius: '9px', border: '1px solid #E8E0D8', backgroundColor: '#ffffff', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', backgroundColor: saving ? '#A8521F80' : '#C1622A', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Term'}
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
                {['#', 'Title', 'Description', 'Points', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', color: '#6B6B6B', fontWeight: 600, borderBottom: '1px solid #F0EBE3', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>Loading...</td>
                </tr>
              ) : terms.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>
                    <CreditCard size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No payment terms added yet</p>
                  </td>
                </tr>
              ) : terms.map((term, idx) => (
                <tr key={term.id}
                  style={{ borderBottom: idx < terms.length - 1 ? '1px solid #F0EBE3' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 700, color: '#C1622A' }}>{term.number || '-'}</td>
                  <td style={{ padding: '13px 16px', fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{term.title}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: '#6B6B6B', maxWidth: '200px' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {term.description || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: '#6B6B6B' }}>
                    {term.points?.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {term.points.slice(0, 2).map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                        {term.points.length > 2 && <li style={{ color: '#C1622A' }}>+{term.points.length - 2} more</li>}
                      </ul>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ backgroundColor: term.is_active ? '#16A34A15' : '#F0EBE3', color: term.is_active ? '#16A34A' : '#6B6B6B', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {term.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditForm(term)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #E8E0D8', backgroundColor: '#ffffff', color: '#1A1A1A', fontSize: '12px', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#1A1A1A'; e.currentTarget.style.borderColor = '#E8E0D8' }}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(term.id, term.title)}
                        disabled={deletingId === term.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '12px', cursor: deletingId === term.id ? 'not-allowed' : 'pointer', opacity: deletingId === term.id ? 0.6 : 1 }}
                      >
                        <Trash2 size={13} /> {deletingId === term.id ? '...' : 'Delete'}
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