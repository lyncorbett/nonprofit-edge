/**
 * THE NONPROFIT EDGE - App.tsx
 * Updated with Role-Based Access Routes
 * 
 * New routes added:
 *   - content-manager → ContentManager (admin + owner)
 *   - owner-dashboard → PlatformOwnerDashboard (owner only)
 *   - team-access → TeamAccessManager (owner only)
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
// Import your other tool components as needed
// import BoardAssessment from './components/BoardAssessment'
// import StrategicCheckup from './components/StrategicCheckup'
// etc.

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Brand colors
const NAVY = '#0D2C54'
const TEAL = '#0097A9'

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
      (_event, session) => {
        setSession(session)
        if (session) {
          loadUserData(session.user.id)
        } else {
          setUserData(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('id', userId)
        .single()

      if (userError) throw userError

      setUserData(user)

      // Load team members if applicable
      if (user.organization_id) {
        const { data: team } = await supabase
          .from('users')
          .select('*')
          .eq('organization_id', user.organization_id)

        setTeamMembers(team || [])
      }

      // Load usage data
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

    } catch (err: any) {
      console.error('Error loading user data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
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
    await supabase.auth.signOut()
    setCurrentPage('dashboard')
  }

  const handleDownload = async (resourceId: string) => {
    // Track download
    await supabase.from('activity_logs').insert({
      user_id: session?.user.id,
      organization_id: userData?.organization_id,
      action: 'download',
      resource_id: resourceId
    })
    // Refresh usage
    if (session) loadUserData(session.user.id)
  }

  const handleStartProfessor = () => {
    setCurrentPage('professor')
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

  // Login screen
  if (!session) {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />
  }

  // Error state
  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 mb-4">
            If this persists, please contact support.
          </p>
          <button
            onClick={handleLogout}
            className="text-teal hover:underline"
            style={{ color: TEAL }}
          >
            Sign out and try again
          </button>
        </div>
      </div>
    )
  }

  // ============================================
  // ROUTE HANDLING
  // ============================================

  // Team Admin page (for organization team management)
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

  // Platform Admin page
  if (currentPage === 'admin') {
    return (
      <AdminDashboard
        onBack={() => setCurrentPage('dashboard')}
      />
    )
  }

  // Content Manager (for admin team - uploads resources, quotes, events)
  if (currentPage === 'content-manager') {
    return (
      <ContentManager
        supabase={supabase}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    )
  }

  // Owner Dashboard (for Lyn only - financial metrics)
  if (currentPage === 'owner-dashboard') {
    return (
      <PlatformOwnerDashboard
        supabase={supabase}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    )
  }

  // Team Access Manager (for Lyn only - manage who has admin access)
  if (currentPage === 'team-access') {
    return (
      <TeamAccessManager
        supabase={supabase}
        currentUserEmail={userData.email}
        onNavigate={setCurrentPage}
      />
    )
  }

  // Resource Library page
  if (currentPage === 'library') {
    return (
      <ResourceLibrary
        user={userData}
        organization={userData.organization}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    )
  }

  // Main Dashboard
  return (
    <Dashboard
      user={userData}
      organization={userData.organization}
      usage={usage}
      teamCount={teamMembers.length}
      onNavigate={setCurrentPage}
      onDownload={handleDownload}
      onStartProfessor={handleStartProfessor}
      onLogout={handleLogout}
      supabase={supabase}
    />
  )
}

// ============================================
// LOGIN SCREEN COMPONENT
// ============================================
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        await onSignUp(email, password, fullName)
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

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 
            className="text-xl font-semibold mb-6"
            style={{ color: NAVY }}
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition-all"
              style={{ 
                backgroundColor: loading ? '#94A3B8' : TEAL,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm hover:underline"
              style={{ color: TEAL }}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
