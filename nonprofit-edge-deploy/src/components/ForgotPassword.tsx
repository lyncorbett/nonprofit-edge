/**
 * FORGOT PASSWORD COMPONENT
 * For The Nonprofit Edge - Uses Supabase Auth
 */

import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Brand colors
const NAVY = '#1a365d'
const TEAL = '#00a0b0'

interface ForgotPasswordProps {
  onBack: () => void
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>
            Check Your Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>. 
            Click the link in the email to reset your password.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Try a different email
            </button>
            
            <button
              onClick={onBack}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition"
              style={{ backgroundColor: TEAL }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.svg" 
            alt="The Nonprofit Edge" 
            className="h-12 mx-auto mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png'
            }}
          />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: NAVY }}>
          Reset Your Password
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@organization.org"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: TEAL }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-sm font-medium hover:underline"
            style={{ color: TEAL }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
