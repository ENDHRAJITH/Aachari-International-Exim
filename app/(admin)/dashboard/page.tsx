'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Mail, MailOpen, Tag, ArrowRight, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalCategories: 0
  })
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
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

      if (!enquiries.success) { router.push('/admin/login'); return }

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
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: '#C1622A',
      bg: '#C1622A15',
      href: '/dashboard/products'
    },
    {
      label: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: Mail,
      color: '#2563EB',
      bg: '#2563EB15',
      href: '/dashboard/enquiries'
    },
    {
      label: 'New Enquiries',
      value: stats.newEnquiries,
      icon: MailOpen,
      color: '#16A34A',
      bg: '#16A34A15',
      href: '/dashboard/enquiries'
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: '#D97706',
      bg: '#D9770615',
      href: '/dashboard'
    }
  ]

  const statusConfig: Record<string, { bg: string; color: string }> = {
    new: { bg: '#C1622A15', color: '#C1622A' },
    seen: { bg: '#2563EB15', color: '#2563EB' },
    replied: { bg: '#16A34A15', color: '#16A34A' }
  }

  if (loading) {
    return (
      <div>
        {/* Skeleton Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #E8E0D8',
              height: '100px'
            }}>
              <div style={{
                height: '14px',
                width: '60%',
                backgroundColor: '#F0EBE3',
                borderRadius: '4px',
                marginBottom: '12px',
                animation: 'pulse 1.5s infinite'
              }} />
              <div style={{
                height: '28px',
                width: '40%',
                backgroundColor: '#F0EBE3',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite'
              }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    )
  }

  return (
    <div>

      {/* Page Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              onClick={() => router.push(card.href)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #E8E0D8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = card.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = '#E8E0D8'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#6B6B6B', fontSize: '12px', fontWeight: 500, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {card.label}
                  </p>
                  <p style={{ color: '#1A1A1A', fontSize: '32px', fontWeight: 700, margin: '0 0 8px', lineHeight: 1 }}>
                    {card.value}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} color={card.color} />
                    <span style={{ color: card.color, fontSize: '11px', fontWeight: 500 }}>
                      View all
                    </span>
                  </div>
                </div>
                <div style={{
                  backgroundColor: card.bg,
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex'
                }}>
                  <Icon size={22} color={card.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Enquiries */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E8E0D8',
        overflow: 'hidden'
      }}>

        {/* Table Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F0EBE3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: 600, margin: '0 0 2px' }}>
              Recent Enquiries
            </h2>
            <p style={{ color: '#6B6B6B', fontSize: '12px', margin: 0 }}>
              Latest {recentEnquiries.length} enquiries
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/enquiries')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #E8E0D8',
              backgroundColor: '#FFFFFF',
              color: '#1A1A1A',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C1622A'
              e.currentTarget.style.color = '#FFFFFF'
              e.currentTarget.style.borderColor = '#C1622A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF'
              e.currentTarget.style.color = '#1A1A1A'
              e.currentTarget.style.borderColor = '#E8E0D8'
            }}
          >
            View All
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAF8' }}>
                {['Customer', 'Product', 'Country', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding: '11px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    color: '#6B6B6B',
                    fontWeight: 600,
                    borderBottom: '1px solid #F0EBE3',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                    <Mail size={32} color="#E8E0D8" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No enquiries yet</p>
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq, idx) => (
                  <tr
                    key={enq.id}
                    onClick={() => router.push(`/dashboard/enquiries/${enq.id}`)}
                    style={{
                      borderBottom: idx < recentEnquiries.length - 1 ? '1px solid #F0EBE3' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>
                        {enq.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>
                        {enq.email}
                      </p>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A' }}>
                      {enq.product?.name || 'General'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#1A1A1A' }}>
                      {enq.country || '-'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        backgroundColor: statusConfig[enq.status]?.bg,
                        color: statusConfig[enq.status]?.color,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {enq.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#6B6B6B' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
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