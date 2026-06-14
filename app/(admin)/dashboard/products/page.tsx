'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

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

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this product?')
    if (!confirm) return

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
      }
    } finally {
      setDeleting(null)
    }
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h1 style={{ color: '#3D2314', fontSize: '22px', fontWeight: 700, margin: 0 }}>
          Products
        </h1>
        <button
          onClick={() => router.push('/dashboard/products/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#C1622A',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '20px',
        maxWidth: '400px'
      }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9c7a6a'
          }}
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            borderRadius: '8px',
            border: '1px solid #E8D5C0',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#ffffff'
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #E8D5C0',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf8f5' }}>
                {['Product', 'Category', 'HSN Code', 'Featured', 'Active', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: '#9c7a6a',
                    fontWeight: 600,
                    borderBottom: '1px solid #E8D5C0',
                    whiteSpace: 'nowrap'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#9c7a6a' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f0e8df' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#3D2314', margin: '0 0 2px' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9c7a6a', margin: 0 }}>
                        /{product.slug}
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#3D2314' }}>
                      {product.category?.name || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#3D2314' }}>
                      {product.hsn_code || '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: product.is_featured ? '#C1622A20' : '#f0e8df',
                        color: product.is_featured ? '#C1622A' : '#9c7a6a',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {product.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: product.is_active ? '#2E7D3220' : '#f0e8df',
                        color: product.is_active ? '#2E7D32' : '#9c7a6a',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => router.push(`/dashboard/products/${product.id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #E8D5C0',
                            backgroundColor: '#ffffff',
                            color: '#3D2314',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '12px',
                            cursor: 'pointer'
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
    </div>
  )
}