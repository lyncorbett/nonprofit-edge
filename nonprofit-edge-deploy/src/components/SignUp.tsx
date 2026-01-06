/**
 * THE NONPROFIT EDGE - Signup Page
 * Brand Colors: Navy #0D2C54 | Teal #0097A9
 */

import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const NAVY = '#0D2C54'
const TEAL = '#0097A9'

interface SignupProps {
  onNavigate: (page: string) => void
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert([{
            name: formData.organizationName || `${formData.fullName}'s Organization`,
            tier: 'trial',
            seats_total: 1,
            subscription_status: 'trialing',
          }])
          .select()
          .single()

        if (orgError) throw orgError

        // Create user profile
        const { error: userError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            organization_id: orgData.id,
            role: 'owner',
            is_active: true,
          }])

        if (userError) throw userError

        // Redirect to dashboard
        onNavigate('dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <button onClick={() => onNavigate('')} className="flex items-center">
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

          <h1 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Start Your Free Trial</h1>
          <p className="text-gray-600 mb-6">Get 3 days of full access. No credit card required.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="Dr. Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="jane@nonprofit.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="Community Foundation of San Diego"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: TEAL }}
            >
              {loading ? 'Creating Account...' : 'Start Free Trial →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-medium hover:underline" style={{ color: TEAL }}>
              Sign in
            </button>
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <button onClick={() => onNavigate('terms')} className="underline">Terms of Service</button>
            {' '}and{' '}
            <button onClick={() => onNavigate('privacy')} className="underline">Privacy Policy</button>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8" style={{ backgroundColor: NAVY }}>
        <div className="max-w-md text-white">
          <h2 className="text-2xl font-bold mb-6">What you'll get with your trial:</h2>
          <ul className="space-y-4">
            {[
              'Full access to all 6 AI-powered tools',
              'Unlimited Ask the Professor sessions',
              'Complete template library',
              'Board Assessment & Strategic Plan tools',
              'No credit card required',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#0097A9] text-xl">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4 bg-white/10 rounded-xl">
            <p className="text-sm italic mb-2">
              "The Nonprofit Edge transformed how we approach strategic planning. The AI tools saved us months of work."
            </p>
            <p className="text-xs text-white/70">— Sarah M., Executive Director</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
