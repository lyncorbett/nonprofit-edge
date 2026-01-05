import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ============================================
// RESET PASSWORD PAGE
// User lands here after clicking email link
// ============================================

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasValidSession, setHasValidSession] = useState(false)

  // Check if user has a valid recovery session from the email link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If there's a session, user clicked the reset link successfully
      if (session) {
        setHasValidSession(true)
      }
      setSessionChecked(true)
    }

    // Also listen for auth state changes (in case token is in URL)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setHasValidSession(true)
        }
        if (session) {
          setHasValidSession(true)
        }
      }
    )

    checkSession()

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)

    } catch (err: any) {
      console.error('[ResetPassword] Error:', err)
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  // Still checking session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-teal border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // No valid session - link expired or invalid
  if (!hasValidSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-4">Link Expired</h2>
          <p className="text-gray-600 mb-6">
            This password reset link has expired or is invalid. 
            Please request a new one.
          </p>
          <a 
            href="/forgot-password"
            className="inline-block bg-teal hover:bg-teal-dark text-white py-3 px-6 rounded-lg font-bold transition"
          >
            Request New Link
          </a>
          <div className="mt-4">
            <a href="/login" className="text-gray-500 hover:text-teal text-sm">
              ← Back to login
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-4">Password Updated!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. 
            Redirecting to dashboard...
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-teal border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  // Main form
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
            <div className="text-xs font-extrabold text-navy">THE</div>
            <div className="text-sm font-extrabold text-teal">NONPROFIT</div>
            <div className="text-lg font-extrabold text-navy">EDGE</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-navy text-center mb-2">Create New Password</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your new password below.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Password must be at least 8 characters.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal-dark text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
