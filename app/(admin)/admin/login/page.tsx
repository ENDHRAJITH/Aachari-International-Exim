'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!data.success) {
        toast.error(data.error || 'Invalid credentials')
        return
      }

      localStorage.setItem('admin_token', data.token)
      toast.success('Login successful!')
      router.push('/dashboard')

    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#F8F7F4'
    }}>

      {/* Left Panel — Brand */}
      <div style={{
        width: '45%',
        backgroundColor: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden'
      }}
        className="login-left"
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #C1622A15 0%, transparent 60%), radial-gradient(circle at 80% 20%, #C1622A10 0%, transparent 40%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 28px',
            backgroundColor: '#242424',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #2A2A2A'
          }}>
            <Image
              src="/logo.png"
              alt="Aachari International"
              width={90}
              height={90}
            />
          </div>

          <h1 style={{
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: 700,
            margin: '0 0 8px',
            letterSpacing: '-0.3px'
          }}>
            Aachari International
          </h1>
          <p style={{ color: '#C1622A', fontSize: '14px', margin: '0 0 32px', fontWeight: 500 }}>
            Exim Pvt Ltd
          </p>

          <div style={{
            backgroundColor: '#242424',
            border: '1px solid #2A2A2A',
            borderRadius: '12px',
            padding: '20px 24px',
            textAlign: 'left',
            maxWidth: '280px',
            margin: '0 auto'
          }}>
            {[
              'Manage Products',
              'Track Enquiries',
              'Update Certificates'
            ].map((item) => (
              <div key={item} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#C1622A',
                  flexShrink: 0
                }} />
                <span style={{ color: '#A8A8A8', fontSize: '13px' }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ color: '#4A4A4A', fontSize: '12px', marginTop: '40px' }}>
            © 2025 Aachari International Exim Pvt Ltd
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              color: '#1A1A1A',
              fontSize: '26px',
              fontWeight: 700,
              margin: '0 0 8px',
              letterSpacing: '-0.3px'
            }}>
              Welcome back
            </h2>
            <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
              Sign in to your admin account
            </p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aachariexim.com"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid #E8E0D8',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#1A1A1A',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#C1622A'}
              onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #E8E0D8',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1A1A',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B6B6B',
                  display: 'flex',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: loading ? '#A8521F80' : '#C1622A',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#A8521F' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#C1622A' }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff40',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={17} />
                Sign In
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '12px', marginTop: '24px' }}>
            Protected admin area — unauthorized access prohibited
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .login-left {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}