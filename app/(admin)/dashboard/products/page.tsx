'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.data)
        setFiltered(data.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    const q = value.toLowerCase()
    setFiltered(
      products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.hsn_code?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      )
    )
  }

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Delete "${name}"? This cannot be undone.`)
    if (!confirmDelete) return

    const token = localStorage.getItem('admin_token')
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const updated = products.filter((p) => p.id !== id)
        setProducts(updated)
        setFiltered(updated)
        toast.success('Product deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeleting(null)
    }
  }

  const SkeletonRow = () => (
    <tr>
      {[1, 2, 3, 4, 5, 6].map((i) => (
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
            Products
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
            Manage your export products catalog
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/products/new')}
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
            cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8521F'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1622A'}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '20px',
        maxWidth: '380px'
      }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6B6B6B'
          }}
        />
        <input
          type="text"
          placeholder="Search by name, HSN code, category..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 14px 11px 40px',
            borderRadius: '10px',
            border: '1.5px solid #E8E0D8',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#ffffff',
            color: '#1A1A1A',
            transition: 'border-color 0.15s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#C1622A'}
          onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
        />
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
                {['Product', 'Category', 'HSN Code', 'Featured', 'Active', 'Actions'].map((h) => (
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
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>
                    <Package size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
                      {search ? 'No products match your search' : 'No products yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((product, idx) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid #F0EBE3' : 'none',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 2px' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>
                        /{product.slug}
                      </p>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A' }}>
                      {product.category?.name || '-'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A' }}>
                      {product.hsn_code || '-'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        backgroundColor: product.is_featured ? '#C1622A15' : '#F0EBE3',
                        color: product.is_featured ? '#C1622A' : '#6B6B6B',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {product.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        backgroundColor: product.is_active ? '#16A34A15' : '#F0EBE3',
                        color: product.is_active ? '#16A34A' : '#6B6B6B',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => router.push(`/dashboard/products/${product.id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '7px',
                            border: '1px solid #E8E0D8',
                            backgroundColor: '#ffffff',
                            color: '#1A1A1A',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563EB'
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.borderColor = '#2563EB'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff'
                            e.currentTarget.style.color = '#1A1A1A'
                            e.currentTarget.style.borderColor = '#E8E0D8'
                          }}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '7px',
                            border: '1px solid #FECACA',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '12px',
                            cursor: deleting === product.id ? 'not-allowed' : 'pointer',
                            opacity: deleting === product.id ? 0.6 : 1
                          }}
                        >
                          <Trash2 size={13} />
                          {deleting === product.id ? '...' : 'Delete'}
                        </button>
                      </div>
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