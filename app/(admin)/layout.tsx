'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Package, Mail, LogOut, Menu, X, ChevronRight, Award, Tag } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Enquiries', href: '/dashboard/enquiries', icon: Mail },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setAdminEmail(payload.email || 'Admin')
      } catch {
        setAdminEmail('Admin')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const initials = adminEmail
    ? adminEmail.substring(0, 2).toUpperCase()
    : 'AD'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F7F4' }}>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '14px', fontWeight: 500 },
          success: { style: { background: '#16A34A', color: '#fff' } },
          error: { style: { background: '#DC2626', color: '#fff' } }
        }}
      />

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90,
            display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside className="sidebar" style={{
        width: '260px',
        backgroundColor: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100
      }}>

        {/* Logo */}
        <div style={{
          padding: '20px 20px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Image
            src="/logo.png"
            alt="Aachari International"
            width={42}
            height={42}
            style={{ borderRadius: '8px' }}
          />
          <div>
            <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, margin: 0, letterSpacing: '0.3px' }}>
              Aachari International
            </p>
            <p style={{ color: '#C1622A', fontSize: '11px', margin: 0, fontWeight: 500 }}>
              Admin Panel
            </p>
          </div>
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="mobile-close"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#A8A8A8',
              cursor: 'pointer',
              display: 'none'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <p style={{ color: '#4A4A4A', fontSize: '10px', fontWeight: 600, letterSpacing: '1px', padding: '8px 12px 4px', margin: 0 }}>
            MAIN MENU
          </p>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  backgroundColor: active ? '#C1622A15' : 'transparent',
                  color: active ? '#C1622A' : '#A8A8A8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease',
                  borderLeft: active ? '3px solid #C1622A' : '3px solid transparent',
                  position: 'relative'
                }}
              >
                <Icon size={17} />
                {item.label}
                {active && (
                  <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Admin info + Logout */}
        <div style={{ borderTop: '1px solid #2A2A2A', padding: '14px 10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: '#242424',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#C1622A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 600, margin: 0 }}>
                Admin
              </p>
              <p style={{
                color: '#6B6B6B',
                fontSize: '11px',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {adminEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#A8A8A8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              width: '100%',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC262615'
              e.currentTarget.style.color = '#DC2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#A8A8A8'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content" style={{
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>

        {/* Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          padding: '0 24px',
          height: '60px',
          borderBottom: '1px solid #E8E0D8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1A1A1A',
              display: 'none',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <Menu size={22} />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6B6B6B' }}>Admin</span>
            <ChevronRight size={14} color="#6B6B6B" />
            <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500, textTransform: 'capitalize' }}>
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#C1622A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer'
            }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
        a { transition: all 0.15s ease; }
        a:hover { color: #C1622A !important; }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-260px) !important;
            transition: transform 0.3s ease !important;
          }
          .sidebar.open {
            transform: translateX(0) !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .mobile-overlay {
            display: block !important;
          }
          .mobile-close {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}