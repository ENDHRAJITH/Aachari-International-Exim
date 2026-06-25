'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, BarChart2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Stat {
  id: string
  label: string
  number: string
  sort_order: number
  is_active: boolean
}

const emptyForm = {
  label: '',
  number: '',
  sort_order: 0,
  is_active: true
}

export default function StatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchStats(token)
  }, [])

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) { router.push('/admin/login'); return }
      setStats(data.data)
    } catch {
      toast.error('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const openAddForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (stat: Stat) => {
    setForm({
      label: stat.label,
      number: stat.number,
      sort_order: stat.sort_order,
      is_active: stat.is_active
    })
    setEditingId(stat.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async () => {
    if (!form.label || !form.number) {
      toast.error('Label and number are required')
      return
    }
    const token = localStorage.getItem('admin_token')
    setSaving(true)
    try {
      const url = editingId
        ? `/api/admin/stats/${editingId}`
        : '/api/admin/stats'
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
        toast.success(editingId ? 'Stat updated' : 'Stat added')
        closeForm()
        fetchStats(token!)
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    const token = localStorage.getItem('admin_token')
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/stats/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setStats(stats.filter((s) => s.id !== id))
        toast.success('Stat deleted')
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
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = '#C1622A'
      e.target.style.backgroundColor = '#ffffff'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
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
            Stats
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
            Manage statistics shown on the website
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
            Add Stat
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
              {editingId ? 'Edit Stat' : 'Add New Stat'}
            </p>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Number *</label>
              <input
                style={inputStyle}
                placeholder="e.g. 50+ or 1000+"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                {...focusHandlers}
              />
            </div>
            <div>
              <label style={labelStyle}>Label *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Countries Served"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                {...focusHandlers}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
              {saving ? 'Saving...' : editingId ? 'Update Stat' : 'Add Stat'}
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
                {['Number', 'Label', 'Sort Order', 'Status', 'Actions'].map((h) => (
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
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>Loading...</td>
                </tr>
              )}

              {!loading && stats.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                    <BarChart2 size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No stats added yet</p>
                  </td>
                </tr>
              )}

              {!loading && stats.map((stat, idx) => (
                <tr
                  key={stat.id}
                  style={{ borderBottom: idx < stats.length - 1 ? '1px solid #F0EBE3' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '13px 16px', fontSize: '20px', fontWeight: 700, color: '#C1622A' }}>
                    {stat.number}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                    {stat.label}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#6B6B6B' }}>
                    {stat.sort_order}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      backgroundColor: stat.is_active ? '#16A34A15' : '#F0EBE3',
                      color: stat.is_active ? '#16A34A' : '#6B6B6B',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {stat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => openEditForm(stat)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #E8E0D8', backgroundColor: '#ffffff', color: '#1A1A1A', fontSize: '12px', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#1A1A1A'; e.currentTarget.style.borderColor = '#E8E0D8' }}
                      >
                        <Pencil size={13} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(stat.id, stat.label)}
                        disabled={deletingId === stat.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '12px', cursor: deletingId === stat.id ? 'not-allowed' : 'pointer', opacity: deletingId === stat.id ? 0.6 : 1 }}
                      >
                        <Trash2 size={13} /> {deletingId === stat.id ? '...' : 'Delete'}
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