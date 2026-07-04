'use client'
import { Toaster } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Package, Mail, LogOut, Menu, X, ChevronRight, ChevronLeft, Award, Tag, MessageSquareQuote, BarChart2, FileText, CreditCard, HelpCircle } from 'lucide-react'

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Enquiries', href: '/dashboard/enquiries', icon: Mail },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { label: 'Payment Terms', href: '/dashboard/payment-terms', icon: CreditCard },
  { label: 'Inco Terms', href: '/dashboard/inco-terms', icon: FileText },
  { label: 'FAQ', href: '/dashboard/faq', icon: HelpCircle }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setAdminEmail(payload.email || 'Admin')
      } catch {
        setAdminEmail('Admin')
      }
    }
  }, [isLoginPage])

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isLoginPage) return
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, isLoginPage])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar_collapsed', String(next))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const initials = adminEmail
    ? adminEmail.substring(0, 2).toUpperCase()
    : 'AD'

  // ── LOGIN PAGE — no sidebar ──
  if (isLoginPage) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '14px', fontWeight: 500 },
            success: { style: { background: '#16A34A', color: '#fff' } },
            error: { style: { background: '#DC2626', color: '#fff' } }
          }}
        />
        {children}
      </>
    )
  }

  // ── SIDEBAR CONTENT ──
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const showLabels = isMobile || !collapsed

    return (
      <>
        <div style={{
          padding: showLabels ? '20px' : '20px 0',
          borderBottom: '2px solid #C1622A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: showLabels ? 'flex-start' : 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          <Image
            src="/logo.png"
            alt="Aachari International"
            width={38}
            height={38}
            style={{ borderRadius: '8px', flexShrink: 0 }}
          />
          {showLabels && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
                Aachari International
              </p>
              <p style={{ color: '#C1622A', fontSize: '11px', margin: 0, fontWeight: 500 }}>
                Admin Panel
              </p>
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '8px',
                color: '#A8A8A8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                flexShrink: 0
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <nav style={{
          flex: '1 1 auto',
          minHeight: 0,
          padding: showLabels ? '12px 10px' : '12px 8px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {showLabels && (
            <p style={{
              color: '#4A4A4A',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              padding: '8px 12px 4px',
              margin: 0,
              whiteSpace: 'nowrap'
            }}>
              MAIN MENU
            </p>
          )}
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!showLabels ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: showLabels ? 'flex-start' : 'center',
                  gap: '12px',
                  padding: showLabels ? '11px 14px' : '11px 0',
                  borderRadius: '10px',
                  marginBottom: '3px',
                  backgroundColor: active ? '#C1622A' : 'transparent',
                  color: active ? '#ffffff' : '#A8A8A8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease',
                  boxShadow: active ? '0 4px 12px #C1622A40' : 'none'
                }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {showLabels && (
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1
                  }}>
                    {item.label}
                  </span>
                )}
                {showLabels && active && (
                  <ChevronRight size={14} style={{ opacity: 0.8, flexShrink: 0 }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: showLabels ? 'flex-start' : 'center',
              gap: '10px',
              margin: '0 10px 8px',
              padding: showLabels ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              backgroundColor: '#242424',
              color: '#A8A8A8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2E2E2E' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#242424' }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {showLabels && 'Collapse'}
          </button>
        )}

        <div style={{
          borderTop: '1px solid #2A2A2A',
          padding: showLabels ? '14px 10px calc(14px + env(safe-area-inset-bottom))' : '14px 8px calc(14px + env(safe-area-inset-bottom))',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: showLabels ? 'flex-start' : 'center',
            gap: '10px',
            padding: showLabels ? '10px 14px' : '10px 0',
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
            {showLabels && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 600, margin: 0 }}>Admin</p>
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
            )}
          </div>

          <button
            onClick={handleLogout}
            title={!showLabels ? 'Logout' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: showLabels ? 'flex-start' : 'center',
              gap: '10px',
              padding: showLabels ? '10px 14px' : '10px 0',
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
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {showLabels && 'Logout'}
          </button>
        </div>
      </>
    )
  }

  // ── DASHBOARD LAYOUT ──
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', backgroundColor: '#F8F7F4' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '14px', fontWeight: 500 },
          success: { style: { background: '#16A34A', color: '#fff' } },
          error: { style: { background: '#DC2626', color: '#fff' } }
        }}
      />

      {/* Desktop Sidebar */}
      <aside
        className="desktop-sidebar"
        style={{
          width: collapsed ? '76px' : '260px',
          backgroundColor: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          zIndex: 100,
          transition: 'width 0.2s ease'
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            zIndex: 110,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Mobile Drawer — always full width, collapse doesn't apply */}
      <aside
        className="mobile-sidebar"
        style={{
          width: '260px',
          maxWidth: '80vw',
          backgroundColor: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          zIndex: 120,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <SidebarContent isMobile />
      </aside>

      {/* Main */}
      <div
        className="main-content"
        style={{
          marginLeft: collapsed ? '76px' : '260px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.2s ease'
        }}
      >
        {/* Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          padding: '0 20px',
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

          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1A1A1A',
              padding: '6px',
              borderRadius: '8px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span style={{ fontSize: '13px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>Admin</span>
            <ChevronRight size={14} color="#6B6B6B" />
            <span style={{
              fontSize: '13px',
              color: '#1A1A1A',
              fontWeight: 600,
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>

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
            flexShrink: 0
          }}>
            {initials}
          </div>
        </header>

        <main style={{ flex: 1, padding: '20px', maxWidth: '1400px', width: '100%' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }

        .desktop-sidebar { display: flex !important; }
        .mobile-sidebar  { display: none !important; }
        .mobile-menu-btn { display: none !important; }

        nav {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        nav:hover {
          scrollbar-color: #3A3A3A transparent;
        }
        nav::-webkit-scrollbar { width: 4px; }
        nav::-webkit-scrollbar-track { background: transparent; }
        nav::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
        nav:hover::-webkit-scrollbar-thumb {
          background: #3A3A3A;
        }

        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar  { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
          .main-content    { margin-left: 0 !important; }
        }

        @media (max-width: 480px) {
          main { padding: 14px !important; }
          .mobile-sidebar { width: 240px !important; }
        }
      `}</style>
    </div>
  )
}