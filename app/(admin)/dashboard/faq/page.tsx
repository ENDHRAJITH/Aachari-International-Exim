'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  is_active: boolean
  sort_order: number
}

const emptyForm = {
  question: '',
  answer: '',
  category: 'general',
  is_active: true,
  sort_order: 0
}

const categories = ['general', 'ordering', 'payment', 'shipping', 'quality']

const categoryColors: Record<string, { bg: string; text: string }> = {
  general: { bg: '#F0EBE3', text: '#6B6B6B' },
  ordering: { bg: '#EFF6FF', text: '#2563EB' },
  payment: { bg: '#F0FDF4', text: '#16A34A' },
  shipping: { bg: '#FFF7ED', text: '#D97706' },
  quality: { bg: '#FDF4FF', text: '#9333EA' }
}

export default function FAQAdminPage() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchFAQs(token)
  }, [])

  const fetchFAQs = async (token: string) => {
    try {
      const res = await fetch('/api/admin/faqs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) { router.push('/admin/login'); return }
      setFaqs(data.data)
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

  const openEditForm = (faq: FAQ) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      is_active: faq.is_active,
      sort_order: faq.sort_order
    })
    setEditingId(faq.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async () => {
    if (!form.question || !form.answer) {
      toast.error('Question and answer are required')
      return
    }
    const token = localStorage.getItem('admin_token')
    setSaving(true)
    try {
      const url = editingId ? `/api/admin/faqs/${editingId}` : '/api/admin/faqs'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        toast.success(editingId ? 'FAQ updated' : 'FAQ added')
        closeForm()
        fetchFAQs(token!)
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this FAQ?')) return
    const token = localStorage.getItem('admin_token')
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setFaqs(faqs.filter(f => f.id !== id))
        toast.success('FAQ deleted')
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (faq: FAQ) => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !faq.is_active })
      })
      const data = await res.json()
      if (data.success) {
        setFaqs(faqs.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f))
        toast.success(faq.is_active ? 'FAQ hidden' : 'FAQ visible')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  const filtered = filterCategory === 'all' ? faqs : faqs.filter(f => f.category === filterCategory)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    borderRadius: '9px', border: '1.5px solid #E8E0D8',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#FAFAF8', color: '#1A1A1A',
    fontFamily: 'inherit', transition: 'border-color 0.15s'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 600,
    color: '#1A1A1A', display: 'block', marginBottom: '6px'
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div>
          <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
            FAQs
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
            Manage frequently asked questions shown on the website
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#C1622A', color: '#ffffff',
              border: 'none', borderRadius: '10px',
              padding: '11px 20px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8521F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1622A'}
          >
            <Plus size={16} /> Add FAQ
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '12px',
          border: '1px solid #E8E0D8', padding: '22px', marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              {editingId ? 'Edit FAQ' : 'Add New FAQ'}
            </p>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Question *</label>
              <input
                style={inputStyle}
                placeholder="e.g. What is your Minimum Order Quantity?"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
              />
            </div>

            <div>
              <label style={labelStyle}>Answer *</label>
              <textarea
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                placeholder="Detailed answer..."
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Sort Order</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#C1622A' }}
              />
              <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Active (show on website)</span>
            </label>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeForm}
                style={{ padding: '10px 20px', borderRadius: '9px', border: '1px solid #E8E0D8', backgroundColor: '#ffffff', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', backgroundColor: saving ? '#A8521F80' : '#C1622A', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['all', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filterCategory === cat ? '#C1622A' : '#E8E0D8',
              backgroundColor: filterCategory === cat ? '#C1622A' : '#ffffff',
              color: filterCategory === cat ? '#ffffff' : '#1A1A1A',
              fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
              textTransform: 'capitalize'
            }}
          >
            {cat === 'all' ? `All (${faqs.length})` : `${cat} (${faqs.filter(f => f.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '12px',
        border: '1px solid #E8E0D8', overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAF8' }}>
                {['Question', 'Category', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '11px 16px', textAlign: 'left',
                    fontSize: '11px', color: '#6B6B6B', fontWeight: 600,
                    borderBottom: '1px solid #F0EBE3',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    whiteSpace: 'nowrap'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '48px', textAlign: 'center' }}>
                    <HelpCircle size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No FAQs found</p>
                  </td>
                </tr>
              )}

              {!loading && filtered.map((faq, idx) => (
                <tr
                  key={faq.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? '1px solid #F0EBE3' : 'none',
                    transition: 'background 0.1s',
                    opacity: faq.is_active ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', maxWidth: '400px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>
                      {faq.question}
                    </p>
                    <p style={{
                      fontSize: '12px', color: '#6B6B6B', margin: 0,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {faq.answer}
                    </p>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: 600,
                      textTransform: 'capitalize',
                      backgroundColor: categoryColors[faq.category]?.bg || '#F0EBE3',
                      color: categoryColors[faq.category]?.text || '#6B6B6B'
                    }}>
                      {faq.category}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleToggleActive(faq)}
                      style={{
                        padding: '4px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        border: 'none',
                        backgroundColor: faq.is_active ? '#16A34A15' : '#F0EBE3',
                        color: faq.is_active ? '#16A34A' : '#6B6B6B'
                      }}
                    >
                      {faq.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => openEditForm(faq)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', borderRadius: '7px',
                          border: '1px solid #E8E0D8', backgroundColor: '#ffffff',
                          color: '#1A1A1A', fontSize: '12px', cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#1A1A1A'; e.currentTarget.style.borderColor = '#E8E0D8' }}
                      >
                        <Pencil size={13} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(faq.id)}
                        disabled={deletingId === faq.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', borderRadius: '7px',
                          border: '1px solid #FECACA', backgroundColor: '#FEF2F2',
                          color: '#DC2626', fontSize: '12px',
                          cursor: deletingId === faq.id ? 'not-allowed' : 'pointer',
                          opacity: deletingId === faq.id ? 0.6 : 1
                        }}
                      >
                        <Trash2 size={13} /> {deletingId === faq.id ? '...' : 'Delete'}
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