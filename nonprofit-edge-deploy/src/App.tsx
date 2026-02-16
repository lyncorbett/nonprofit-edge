/**
 * THE NONPROFIT EDGE - App.tsx
 * Simple login screen version (no Homepage component)
 */

import React, { useState, useEffect } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

// Components
import Dashboard from './components/Dashboard'
import TeamAdmin from './components/TeamAdmin'
import AdminDashboard from './components/AdminDashboard'
import ContentManager from './components/ContentManager'
import PlatformOwnerDashboard from './components/PlatformOwnerDashboard'
import TeamAccessManager from './components/TeamAccessManager'
import ResourceLibrary from './components/ResourceLibrary'
import EventsCalendar from './components/EventsCalendar'
import MarketingDashboard from './components/MarketingDashboard'
import LinkManager from './components/LinkManager'
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard'
import AIGuideChatbot from './components/AIGuideChatbot'

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Brand colors
const NAVY = '#1a365d'
const TEAL = '#00a0b0'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [userData, setUserData] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [usage, setUsage] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        
        if (event === 'SIGNED_OUT') {
          setUserData(null)
          setTeamMembers([])
          setUsage(null)
          setError(null)
          setCurrentPage('dashboard')
          setLoading(false)
        } else if (session) {
          loadUserData(session.user.id)
        } else {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true)
      
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('auth_user_id', userId)
        .single()

      if (userError) throw userError

      setUserData(user)

      if (user.organization_id) {
        const { data: team } = await supabase
          .from('users')
          .select('*')
          .eq('organization_id', user.organization_id)

        setTeamMembers(team || [])
      }

      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: usageData } = await supabase
        .from('monthly_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single()

      setUsage(usageData || {
        downloads_this_month: 0,
        professor_sessions_this_month: 0,
        tools_used_this_month: 0
      })

      setError(null)
    } catch (err: any) {
      console.error('Error loading user data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
  }

  const handleDownload = async (resourceId: string) => {
    await supabase.from('activity_logs').insert({
      user_id: session?.user.id,
      organization_id: userData?.organization_id,
      action: 'download',
      resource_id: resourceId
    })
    if (session) loadUserData(session.user.id)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: TEAL, borderTopColor: 'transparent' }}
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // No session = show login
  if (!session) {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />
  }

  // Has session but no user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>
            Account Setup Required
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <p className="text-gray-600 mb-4">
            Your account is being set up. If this persists, please contact support.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: TEAL }}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // Route handling
  if (currentPage === 'team') {
    return (
      <TeamAdmin
        organization={userData.organization}
        currentUser={userData}
        teamMembers={teamMembers}
        onBack={() => setCurrentPage('dashboard')}
        onRefresh={() => loadUserData(session.user.id)}
      />
    )
  }

  if (currentPage === 'admin') {
    return (
      <AdminDashboard
        onBack={() => setCurrentPage('dashboard')}
      />
    )
  }

  if (currentPage === 'content-manager') {
    return (
      <ContentManager
        supabase={supabase}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    )
  }

  if (currentPage === 'owner-dashboard') {
    return (
      <PlatformOwnerDashboard
        supabase={supabase}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    )
  }

  if (currentPage === 'enhanced-owner') {
    return (
      <EnhancedOwnerDashboard
        user={userData}
        supabase={supabase}
        onNavigate={setCurrentPage}
      />
    )
  }

  if (currentPage === 'marketing') {
    return (
      <MarketingDashboard
        user={userData}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    )
  }

  if (currentPage === 'link-manager') {
    return (
      <LinkManager
        user={userData}
        supabase={supabase}
        onNavigate={setCurrentPage}
      />
    )
  }

  if (currentPage === 'team-access') {
    return (
      <TeamAccessManager
        supabase={supabase}
        currentUserEmail={userData.email}
        onNavigate={setCurrentPage}
      />
    )
  }

  if (currentPage === 'library') {
    return (
      <>
        <ResourceLibrary
          user={userData}
          organization={userData.organization}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
        <AIGuideChatbot
          user={userData}
          organization={userData.organization}
          onNavigate={setCurrentPage}
        />
      </>
    )
  }

  if (currentPage === 'events') {
    return (
      <>
        <EventsCalendar
          user={userData}
          organization={userData.organization}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
        <AIGuideChatbot
          user={userData}
          organization={userData.organization}
          onNavigate={setCurrentPage}
        />
      </>
    )
  }

  // Main Dashboard
  return (
    <>
      <Dashboard
        user={userData}
        organization={userData.organization}
        usage={usage}
        teamCount={teamMembers.length}
        onNavigate={setCurrentPage}
        onDownload={handleDownload}
        onStartProfessor={() => setCurrentPage('professor')}
        onLogout={handleLogout}
        supabase={supabase}
      />
      <AIGuideChatbot
        user={userData}
        organization={userData.organization}
        onNavigate={setCurrentPage}
      />
    </>
  )
}

// Login Screen Component
interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string, fullName: string) => Promise<void>
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        await onSignUp(email, password, fullName)
        setSuccess('Account created! Check your email to confirm your account.')
        setIsSignUp(false)
        setEmail('')
        setPassword('')
        setFullName('')
      } else {
        await onLogin(email, password)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <div className="max-w-md w-full">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: NAVY }}
          >
            The Nonprofit Edge
          </h1>
          <p className="text-gray-600">
            Strategic tools for nonprofit leaders
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 
            className="text-xl font-semibold mb-6"
            style={{ color: NAVY }}
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: TEAL }}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccess(null)
              }}
              className="text-sm hover:underline"
              style={{ color: TEAL }}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 The Pivotal Group Consultants Inc. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default App
