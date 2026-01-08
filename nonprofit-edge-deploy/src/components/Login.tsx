import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ============================================
// LOGIN PAGE - FIXED VERSION
// Fixed: Removed double navigation issue
// ============================================

interface LoginProps {
  onLogin?: (email: string) => void  // Callback to parent App - this handles navigation
  onNavigate?: (route: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'magic'>('login')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  // Check if already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('[Login] Already authenticated, redirecting...')
        handleSuccessfulAuth(session.user.email || '')
      }
    }
    checkSession()
  }, [])

  // Listen for auth state changes (handles magic link returns)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Login] Auth event:', event)
        if (event === 'SIGNED_IN' && session) {
          handleSuccessfulAuth(session.user.email || '')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ✅ FIX: Only call onLogin - it handles navigation in App.tsx
  const handleSuccessfulAuth = (userEmail: string) => {
    console.log('[Login] Success! Calling onLogin...')
    
    // Call parent's onLogin - this handles setting user state AND navigation
    if (onLogin) {
      onLogin(userEmail)
    } else {
      // Fallback only if no onLogin provided
      if (onNavigate) {
        onNavigate('/dashboard')
      } else {
        window.location.href = '/dashboard'
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // ✅ FIX: Let handleSuccessfulAuth handle the redirect
      if (data.session) {
        handleSuccessfulAuth(email)
      }
    } catch (err: any) {
      console.error('[Login] Error:', err.message)
      setError(err.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
      setMagicLinkSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const goToForgotPassword = () => {
    if (onNavigate) {
      onNavigate('/forgot-password')
    } else {
      window.location.href = '/forgot-password'
    }
  }

  const goToSignup = () => {
    if (onNavigate) {
      onNavigate('/signup')
    } else {
      window.location.href = '/signup'
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We sent a login link to <strong>{email}</strong>. Click the link to sign in.
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-teal hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32 4 C16.5 4 4 16.5 4 32 C4 47.5 16.5 60 32 60 C40 60 47 56.5 52 51"
              fill="none"
              stroke="#1a365d"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M28 32 L44 16 L44 26 L56 26 L56 38 L44 38 L44 48 Z"
              fill="#00a0b0"
            />
          </svg>
          <div className="leading-none">
            <div className="text-xs font-extrabold" style={{ color: '#1a365d' }}>THE</div>
            <div className="text-sm font-extrabold" style={{ color: '#00a0b0' }}>NONPROFIT</div>
            <div className="text-lg font-extrabold" style={{ color: '#1a365d' }}>EDGE</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#1a365d' }}>Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="you@nonprofit.org"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold transition disabled:opacity-50"
              style={{ 
                background: '#00a0b0', 
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={goToForgotPassword}
                className="text-sm text-gray-500 hover:text-teal-600"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleMagicLink}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="you@nonprofit.org"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold transition disabled:opacity-50"
              style={{ 
                background: '#00a0b0', 
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'magic' : 'login')}
            className="text-sm hover:underline"
            style={{ color: '#00a0b0' }}
          >
            {mode === 'login' ? 'Sign in with magic link instead' : 'Sign in with password instead'}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <span className="text-gray-500 text-sm">Don't have an account? </span>
          <button 
            type="button"
            onClick={goToSignup}
            className="font-medium hover:underline text-sm"
            style={{ color: '#00a0b0' }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
