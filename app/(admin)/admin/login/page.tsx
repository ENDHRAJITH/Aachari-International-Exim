'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Login failed')
        return
      }

      localStorage.setItem('admin_token', data.token)
      router.push('/dashboard')

    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5EDE0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #E8D5C0'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
         <Image
  src="/logo.png"
  alt="Aachari International"
  width={120}        // 80 → 120
  height={120}       // 80 → 120
  style={{ margin: '0 auto 16px' }}
/>
          <h1 style={{ color: '#3D2314', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Aachari International
          </h1>
          <p style={{ color: '#C1622A', fontSize: '13px', margin: 0 }}>
            Admin Panel
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#3D2314', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aachariexim.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E8D5C0',
                fontSize: '14px',
                marginTop: '6px',
                outline: 'none',
                backgroundColor: '#faf8f5'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#3D2314', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E8D5C0',
                fontSize: '14px',
                marginTop: '6px',
                outline: 'none',
                backgroundColor: '#faf8f5'
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#a0522d80' : '#C1622A',
              color: '#ffffff',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#9c7a6a', fontSize: '12px', marginTop: '24px' }}>
          Aachari International Exim Pvt Ltd © 2025
        </p>
      </div>
    </div>
  )
}