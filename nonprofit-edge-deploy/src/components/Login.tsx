/**
 * THE NONPROFIT EDGE - Login Page
 * Brand Colors: Navy #0D2C54 | Teal #0097A9
 */

import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const NAVY = '#0D2C54'
const TEAL = '#0097A9'

interface LoginProps {
  onNavigate: (page: string) => void
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        onNavigate('dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <button onClick={() => onNavigate('')} className="inline-flex items-center">
            <img 
              src="/logo.svg" 
              alt="The Nonprofit Edge" 
              style={{ height: '50px', width: 'auto' }}
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = '/logo.png'
              }}
            />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: NAVY }}>Welcome Back</h1>
          <p className="text-gray-600 mb-6 text-center">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="you@nonprofit.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium hover:underline" style={{ color: TEAL }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: TEAL }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('signup')} className="font-medium hover:underline" style={{ color: TEAL }}>
                Start your free trial
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  )
}

export default Login
