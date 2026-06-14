'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Mail,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Enquiries', href: '/dashboard/enquiries', icon: Mail }
]

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5EDE0' }}>

      {/* Overlay — mobile-la sidebar open aana bg click close pannurom */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 90
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: '#3D2314',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-250px)',
        transition: 'transform 0.3s ease'
      }}>

        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#F5EDE0',
            cursor: 'pointer',
            display: 'flex'
          }}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #5a3520',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Image
            src="/logo.png"
            alt="Aachari International"
            width={45}
            height={45}
          />
          <div>
            <p style={{ color: '#F5EDE0', fontSize: '13px', fontWeight: 600, margin: 0 }}>
              Aachari International
            </p>
            <p style={{ color: '#C1622A', fontSize: '11px', margin: 0 }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  backgroundColor: active ? '#C1622A' : 'transparent',
                  color: active ? '#ffffff' : '#c9b5a8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #5a3520' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#c9b5a8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content — always full width, sidebar overlaps */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top Header */}
        <header style={{
          backgroundColor: '#ffffff',
          padding: '16px 24px',
          borderBottom: '1px solid #E8D5C0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Menu toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3D2314',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <Menu size={24} />
          </button>

          <p style={{ color: '#3D2314', fontSize: '14px', margin: 0, fontWeight: 500 }}>
            Welcome, Admin
          </p>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, sans-serif; }
      `}</style>
    </div>
  )
}