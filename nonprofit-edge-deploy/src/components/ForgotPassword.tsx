import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

// ============================================
// FORGOT PASSWORD PAGE
// ============================================

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // ✅ CRITICAL: Redirect to reset-password page, NOT homepage
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We sent a password reset link to <strong>{email}</strong>. 
            Click the link in your email to create a new password.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-teal hover:underline"
          >
            Try a different email
          </button>
          <div className="mt-4">
            <a href="/login" className="text-gray-500 hover:text-teal text-sm">
              ← Back to login
            </a>
          </div>
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
            <div className="text-xs font-extrabold text-navy">THE</div>
            <div className="text-sm font-extrabold text-teal">NONPROFIT</div>
            <div className="text-lg font-extrabold text-navy">EDGE</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-navy text-center mb-2">Reset Password</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="you@nonprofit.org"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal-dark text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-teal hover:underline text-sm">
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
