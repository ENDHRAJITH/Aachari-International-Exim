'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'

interface Spec {
  id?: string
  spec_key: string
  spec_value: string
}

export default function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [productId, setProductId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [specs, setSpecs] = useState<Spec[]>([])

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

    params.then(({ id }) => {
      setProductId(id)
      fetchProduct(id)
    })

    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    if (data.success) setCategories(data.data)
  }

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`)
      // fetch all products then find by id
      const allRes = await fetch('/api/products')
      const allData = await allRes.json()
      const product = allData.data?.find((p: any) => p.id === id)

      if (product) {
        setForm({
          category_id: product.category_id || '',
          name: product.name || '',
          slug: product.slug || '',
          hsn_code: product.hsn_code || '',
          description: product.description || '',
          short_description: product.short_description || '',
          is_active: product.is_active,
          is_featured: product.is_featured,
          sort_order: product.sort_order || 0
        })
        setSpecs(product.specs?.length > 0
          ? product.specs
          : [{ spec_key: '', spec_value: '' }]
        )
      }
    } finally {
      setLoading(false)
    }
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
      alert('Name and slug are required')
      return
    }

    const token = localStorage.getItem('admin_token')
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
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
        router.push('/dashboard/products')
      } else {
        alert(data.error || 'Failed to update product')
      }
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #E8D5C0',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#faf8f5',
    color: '#3D2314'
  }

  const labelStyle = {
    fontSize: '13px',
    color: '#3D2314',
    fontWeight: 500,
    display: 'block',
    marginBottom: '6px'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#3D2314' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/dashboard/products')}
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
          Edit Product
        </h1>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #E8D5C0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>

        {/* Name + Slug */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              style={inputStyle}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
        </div>

        {/* Category + HSN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={inputStyle}
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
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
              value={form.hsn_code}
              onChange={(e) => setForm({ ...form, hsn_code: e.target.value })}
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label style={labelStyle}>Short Description</label>
          <input
            style={inputStyle}
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Full Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <span style={{ fontSize: '14px', color: '#3D2314' }}>Active</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            <span style={{ fontSize: '14px', color: '#3D2314' }}>Featured (show on homepage)</span>
          </label>
        </div>

        {/* Specs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ ...labelStyle, margin: 0 }}>Product Specifications</label>
            <button
              onClick={addSpec}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #C1622A',
                backgroundColor: 'transparent',
                color: '#C1622A',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              Add Spec
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {specs.map((spec, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '10px', alignItems: 'center' }}>
                <input
                  style={inputStyle}
                  placeholder="Spec name"
                  value={spec.spec_key}
                  onChange={(e) => handleSpecChange(index, 'spec_key', e.target.value)}
                />
                <input
                  style={inputStyle}
                  placeholder="Spec value"
                  value={spec.spec_value}
                  onChange={(e) => handleSpecChange(index, 'spec_value', e.target.value)}
                />
                <button
                  onClick={() => removeSpec(index)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
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
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={() => router.push('/dashboard/products')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #E8D5C0',
              backgroundColor: '#ffffff',
              color: '#3D2314',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: saving ? '#a0522d80' : '#C1622A',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}