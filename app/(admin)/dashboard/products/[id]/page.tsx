'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, Package, FileText, ListPlus, ImageIcon, Star, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface Spec {
  id?: string
  spec_key: string
  spec_value: string
}

interface ProductImage {
  id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
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
  const [updatedAt, setUpdatedAt] = useState('')

  // Image states
  const [images, setImages] = useState<ProductImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

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
      fetchImages(id, token)
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
        setUpdatedAt(product.updated_at || '')
        setSpecs(product.specs?.length > 0
          ? product.specs
          : [{ spec_key: '', spec_value: '' }]
        )
      } else {
        toast.error('Product not found')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async (id: string, token: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/images`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setImages(data.data)
    } catch {
      // silent fail — non-blocking
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB')
      return
    }

    const token = localStorage.getItem('admin_token')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('is_primary', images.length === 0 ? 'true' : 'false')
      formData.append('alt_text', form.name)

      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        setImages([...images.map(img => data.data.is_primary ? { ...img, is_primary: false } : img), data.data])
        toast.success('Image uploaded successfully')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    const confirmDelete = window.confirm('Delete this image?')
    if (!confirmDelete) return

    const token = localStorage.getItem('admin_token')
    setDeletingImageId(imageId)

    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()

      if (data.success) {
        setImages(images.filter((img) => img.id !== imageId))
        toast.success('Image deleted')
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    const token = localStorage.getItem('admin_token')

    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_primary: true })
      })

      const data = await res.json()

      if (data.success) {
        setImages(images.map((img) => ({ ...img, is_primary: img.id === imageId })))
        toast.success('Primary image updated')
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch {
      toast.error('Something went wrong')
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
      toast.error('Name and slug are required')
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
        toast.success('Product updated successfully')
        router.push('/dashboard/products')
      } else {
        toast.error(data.error || 'Failed to update product')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#6B6B6B' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '760px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              Edit Product
            </h1>
            <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>
              Update product information
            </p>
          </div>
        </div>

        {updatedAt && (
          <span style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '6px' }}>
            Last updated: {new Date(updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Basic Info */}
      <SectionCard icon={Package} title="Basic Information" subtitle="Name, category, and identification">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              {...focusHandlers}
            />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              style={inputStyle}
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
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            {...focusHandlers}
          />
        </div>
        <div>
          <label style={labelStyle}>Full Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
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
                placeholder="Spec name"
                value={spec.spec_key}
                onChange={(e) => handleSpecChange(index, 'spec_key', e.target.value)}
                {...focusHandlers}
              />
              <input
                style={inputStyle}
                placeholder="Spec value"
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

      {/* Images */}
      <SectionCard icon={ImageIcon} title="Product Images" subtitle="Upload up to 5 images — first image is shown on cards">

        {/* Upload button */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            borderRadius: '10px',
            border: '1.5px dashed #C1622A',
            backgroundColor: images.length >= 5 ? '#F0EBE3' : '#FFF8F3',
            color: images.length >= 5 ? '#6B6B6B' : '#C1622A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: images.length >= 5 || uploading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          <Upload size={15} />
          {uploading ? 'Uploading...' : images.length >= 5 ? 'Maximum 5 images reached' : 'Click to upload image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={images.length >= 5 || uploading}
            style={{ display: 'none' }}
          />
        </label>

        {/* Image grid */}
        {images.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: '#6B6B6B',
            fontSize: '13px'
          }}>
            No images uploaded yet
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {images.map((img) => (
              <div
                key={img.id}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: img.is_primary ? '2px solid #C1622A' : '1px solid #E8E0D8',
                  aspectRatio: '1',
                  backgroundColor: '#FAFAF8'
                }}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || 'Product image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {img.is_primary && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    backgroundColor: '#C1622A',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Star size={9} fill="#fff" />
                    Primary
                  </span>
                )}

                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      title="Set as primary"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: '#C1622A',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Star size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={deletingImageId === img.id}
                    title="Delete image"
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: deletingImageId === img.id ? 0.5 : 1
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
          disabled={saving}
          style={{
            padding: '11px 26px',
            borderRadius: '9px',
            border: 'none',
            backgroundColor: saving ? '#A8521F80' : '#C1622A',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#A8521F' }}
          onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#C1622A' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}