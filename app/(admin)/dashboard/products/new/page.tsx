'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, Package, FileText, ListPlus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Spec {
  spec_key: string
  spec_value: string
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '9px',
  border: '1.5px solid #E8E0D8',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#FAFAF8',
  color: '#1A1A1A',
  transition: 'border-color 0.15s'
}

const labelStyle = {
  fontSize: '13px',
  color: '#1A1A1A',
  fontWeight: 600,
  display: 'block',
  marginBottom: '6px'
}

const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#C1622A'
    e.target.style.backgroundColor = '#ffffff'
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#E8E0D8'
    e.target.style.backgroundColor = '#FAFAF8'
  }
}

// ✅ Moved outside the component — stable reference across re-renders
const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children
}: { icon: any; title: string; subtitle: string; children: React.ReactNode }) => (
  <div style={{
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #E8E0D8',
    padding: '22px',
    marginBottom: '16px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
      <div style={{
        backgroundColor: '#C1622A15',
        borderRadius: '8px',
        padding: '8px',
        display: 'flex'
      }}>
        <Icon size={16} color="#C1622A" />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{title}</p>
        <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
)

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [specs, setSpecs] = useState<Spec[]>([{ spec_key: '', spec_value: '' }])

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    slug: '',
    hsn_code: '',
    description: '',
    short_description: '',
    is_active: true,
    is_featured: false,
    sort_order: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    if (data.success) setCategories(data.data)
  }

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    })
  }

  const handleSpecChange = (index: number, field: 'spec_key' | 'spec_value', value: string) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

  const addSpec = () => setSpecs([...specs, { spec_key: '', spec_value: '' }])

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      toast.error('Name and slug are required')
      return
    }

    const token = localStorage.getItem('admin_token')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          specs: specs.filter((s) => s.spec_key && s.spec_value)
        })
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Product created successfully')
        router.push('/dashboard/products')
      } else {
        toast.error(data.error || 'Failed to create product')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '760px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => router.push('/dashboard/products')}
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
            Add New Product
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>
            Fill in the details to list a new export product
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <SectionCard icon={Package} title="Basic Information" subtitle="Name, category, and identification">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Moringa Powder"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              {...focusHandlers}
            />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              style={inputStyle}
              placeholder="e.g. moringa-powder"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              {...focusHandlers}
            />
            <p style={{ fontSize: '11px', color: '#6B6B6B', margin: '5px 0 0' }}>
              URL: /products/{form.slug || '...'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              {...focusHandlers}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>HSN Code</label>
            <input
              style={inputStyle}
              placeholder="e.g. 12119029"
              value={form.hsn_code}
              onChange={(e) => setForm({ ...form, hsn_code: e.target.value })}
              {...focusHandlers}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#C1622A' }}
            />
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Active</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#C1622A' }}
            />
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Featured (show on homepage)</span>
          </label>
        </div>
      </SectionCard>

      {/* Description */}
      <SectionCard icon={FileText} title="Description" subtitle="Product summary and full details">
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Short Description</label>
          <input
            style={inputStyle}
            placeholder="Brief summary for product card"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            {...focusHandlers}
          />
        </div>
        <div>
          <label style={labelStyle}>Full Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            placeholder="Full product description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            {...focusHandlers}
          />
        </div>
      </SectionCard>

      {/* Specs */}
      <SectionCard icon={ListPlus} title="Specifications" subtitle="Technical details — moisture, size, packaging etc.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          {specs.map((spec, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '10px', alignItems: 'center' }}>
              <input
                style={inputStyle}
                placeholder="Spec name (e.g. Moisture Content)"
                value={spec.spec_key}
                onChange={(e) => handleSpecChange(index, 'spec_key', e.target.value)}
                {...focusHandlers}
              />
              <input
                style={inputStyle}
                placeholder="Spec value (e.g. Below 8%)"
                value={spec.spec_value}
                onChange={(e) => handleSpecChange(index, 'spec_value', e.target.value)}
                {...focusHandlers}
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                style={{
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1px solid #FECACA',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSpec}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1.5px dashed #C1622A',
            backgroundColor: 'transparent',
            color: '#C1622A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Plus size={14} />
          Add Specification
        </button>
      </SectionCard>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          type="button"
          onClick={() => router.push('/dashboard/products')}
          style={{
            padding: '11px 22px',
            borderRadius: '9px',
            border: '1px solid #E8E0D8',
            backgroundColor: '#ffffff',
            color: '#1A1A1A',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '11px 26px',
            borderRadius: '9px',
            border: 'none',
            backgroundColor: loading ? '#A8521F80' : '#C1622A',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#A8521F' }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#C1622A' }}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </div>
  )
}