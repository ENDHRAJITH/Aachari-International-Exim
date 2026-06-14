'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Mail, MailOpen, Tag } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalEnquiries: number
  newEnquiries: number
  totalCategories: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalCategories: 0
  })
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData(token)
  }, [])

  const fetchData = async (token: string) => {
    try {
      const [productsRes, enquiriesRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/enquiries', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/categories')
      ])

      const products = await productsRes.json()
      const enquiries = await enquiriesRes.json()
      const categories = await categoriesRes.json()

      if (enquiries.success === false) {
        router.push('/admin/login')
        return
      }

      setStats({
        totalProducts: products.data?.length || 0,
        totalEnquiries: enquiries.data?.length || 0,
        newEnquiries: enquiries.data?.filter((e: any) => e.status === 'new').length || 0,
        totalCategories: categories.data?.length || 0
      })

      setRecentEnquiries(enquiries.data?.slice(0, 5) || [])
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: '#C1622A' },
    { label: 'Total Enquiries', value: stats.totalEnquiries, icon: Mail, color: '#3D7A8A' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: MailOpen, color: '#2E7D32' },
    { label: 'Categories', value: stats.totalCategories, icon: Tag, color: '#7B4F9E' }
  ]

  const statusColor: Record<string, string> = {
    new: '#C1622A',
    seen: '#3D7A8A',
    replied: '#2E7D32'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#3D2314', fontSize: '16px' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ color: '#3D2314', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #E8D5C0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: card.color + '20',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex'
              }}>
                <Icon size={22} color={card.color} />
              </div>
              <div>
                <p style={{ color: '#9c7a6a', fontSize: '12px', margin: '0 0 4px' }}>
                  {card.label}
                </p>
                <p style={{ color: '#3D2314', fontSize: '24px', fontWeight: 700, margin: 0 }}>
                  {card.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Enquiries */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #E8D5C0',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E8D5C0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#3D2314', fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Recent Enquiries
          </h2>
          <a href="/dashboard/enquiries" style={{ color: '#C1622A', fontSize: '13px', textDecoration: 'none' }}>
            View all →
          </a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf8f5' }}>
                {['Name', 'Product', 'Country', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: '#9c7a6a',
                    fontWeight: 600,
                    borderBottom: '1px solid #E8D5C0'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#9c7a6a' }}>
                    No enquiries yet
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq.id} style={{ borderBottom: '1px solid #f0e8df' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D2314' }}>
                      {enq.name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D2314' }}>
                      {enq.product?.name || 'General'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D2314' }}>
                      {enq.country || '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: statusColor[enq.status] + '20',
                        color: statusColor[enq.status],
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {enq.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9c7a6a' }}>
                      {new Date(enq.created_at).toLocaleDateString()}
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