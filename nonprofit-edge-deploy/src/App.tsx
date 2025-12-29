/**
 * THE NONPROFIT EDGE - App.tsx
 * With React Router, SignupFlow, and Consistent Navigation
 */

import React, { useState, useEffect } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'

// Components
import Dashboard from './components/Dashboard'
import SignupFlow from './components/SignupFlow'
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

// Main App wrapper with Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

// App content with routing
function AppContent() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [usage, setUsage] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSignup, setShowSignup] = useState(false)
  
  const navigate = useNavigate()

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
      async (event, session) => {
        console.log('[Auth] Event:', event)
        setSession(session)
        
        if (event === 'SIGNED_OUT') {
          setUserData(null)
          setTeamMembers([])
          setUsage(null)
          setError(null)
          setLoading(false)
          setShowSignup(false)
          navigate('/')
        } else if (event === 'SIGNED_IN' && session) {
          await loadUserData(session.user.id)
          setShowSignup(false)
          navigate('/dashboard')
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
      
      // Check if user exists in users table
      let { data: user, error: userError } = await supabase
        .from('users')
        .select(`*, organization:organizations(*)`)
        .eq('auth_user_id', userId)
        .single()

      // If user doesn't exist, create them
      if (userError && userError.code === 'PGRST116') {
        console.log('[Auth] Creating new user record...')
        
        // Get auth user details
        const { data: authUser } = await supabase.auth.getUser()
        const metadata = authUser?.user?.user_metadata || {}
        
        // Create organization for new user
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: metadata.org_name || 'My Organization',
            tier: metadata.selected_plan || 'professional'
          })
          .select()
          .single()

        if (orgError) {
          console.error('Error creating org:', orgError)
          throw orgError
        }

        // Create user record
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            auth_user_id: userId,
            email: authUser?.user?.email,
            full_name: metadata.full_name || 'New User',
            organization_id: newOrg.id,
            role: 'owner'
          })
          .select(`*, organization:organizations(*)`)
          .single()

        if (createError) {
          console.error('Error creating user:', createError)
          throw createError
        }
        
        user = newUser
      } else if (userError) {
        throw userError
      }

      setUserData(user)

      // Load team members
      if (user?.organization_id) {
        const { data: team } = await supabase
          .from('users')
          .select('*')
          .eq('organization_id', user.organization_id)
        setTeamMembers(team || [])
      }

      // Load usage
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: usageData } = await supabase
        .from('monthly_usage')
        .select('*')
        .eq('user_id', user?.id)
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

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
  }

  const handleDownload = async (resourceId: string) => {
    if (!session || !userData) return
    
    await supabase.from('activity_logs').insert({
      user_id: session.user.id,
      organization_id: userData.organization_id,
      action: 'download',
      resource_id: resourceId
    })
    loadUserData(session.user.id)
  }

  const handleNavigate = (page: string) => {
    navigate(`/${page}`)
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

  // Not logged in - show login or signup
  if (!session) {
    if (showSignup) {
      return (
        <SignupFlow
          onComplete={() => {}}
          onBack={() => setShowSignup(false)}
          supabase={supabase}
        />
      )
    }
    return <LoginScreen supabase={supabase} onShowSignup={() => setShowSignup(true)} />
  }

  // Has session but no user data yet
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: TEAL, borderTopColor: 'transparent' }}
          />
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    )
  }

  // Shared props for all routes
  const sharedProps = {
    user: userData,
    organization: userData.organization,
    usage,
    teamCount: teamMembers.length,
    onNavigate: handleNavigate,
    onDownload: handleDownload,
    onStartProfessor: () => handleNavigate('professor'),
    onLogout: handleLogout,
    supabase
  }

  return (
    <>
      <Routes>
        {/* Main Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard {...sharedProps} />} />
        
        {/* Core Features */}
        <Route path="/library" element={
          <ResourceLibrary 
            user={userData}
            organization={userData.organization}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        } />
        <Route path="/events" element={
          <EventsCalendar
            user={userData}
            organization={userData.organization}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        } />
        <Route path="/team" element={
          <TeamAdmin
            organization={userData.organization}
            currentUser={userData}
            teamMembers={teamMembers}
            onBack={() => handleNavigate('dashboard')}
            onRefresh={() => loadUserData(session.user.id)}
          />
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminDashboard onBack={() => handleNavigate('dashboard')} />
        } />
        <Route path="/content-manager" element={
          <ContentManager
            supabase={supabase}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        } />
        <Route path="/owner-dashboard" element={
          <PlatformOwnerDashboard
            supabase={supabase}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        } />
        <Route path="/enhanced-owner" element={
          <EnhancedOwnerDashboard
            user={userData}
            supabase={supabase}
            onNavigate={handleNavigate}
          />
        } />
        <Route path="/marketing" element={
          <MarketingDashboard
            user={userData}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        } />
        <Route path="/link-manager" element={
          <LinkManager
            user={userData}
            supabase={supabase}
            onNavigate={handleNavigate}
          />
        } />
        <Route path="/team-access" element={
          <TeamAccessManager
            supabase={supabase}
            currentUserEmail={userData.email}
            onNavigate={handleNavigate}
          />
        } />

        {/* Tool Routes - Placeholder */}
        <Route path="/board-assessment" element={<ToolPlaceholder name="Board Assessment" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/strategic-checkup" element={<ToolPlaceholder name="Strategic Plan Check-Up" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/ceo-evaluation" element={<ToolPlaceholder name="CEO Evaluation" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/scenario-planner" element={<ToolPlaceholder name="Scenario Planner" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/grant-review" element={<ToolPlaceholder name="Grant & RFP Review" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/templates" element={<Navigate to="/library" replace />} />
        <Route path="/professor" element={<ToolPlaceholder name="Ask the Professor" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/settings" element={<ToolPlaceholder name="Settings" onBack={() => handleNavigate('dashboard')} />} />
        <Route path="/reports" element={<ToolPlaceholder name="My Reports" onBack={() => handleNavigate('dashboard')} />} />

        {/* Signup Route */}
        <Route path="/signup" element={
          <SignupFlow
            onComplete={() => {}}
            onBack={() => navigate('/')}
            supabase={supabase}
          />
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Chatbot - shows on all pages */}
      <AIGuideChatbot
        user={userData}
        organization={userData.organization}
        onNavigate={handleNavigate}
      />
    </>
  )
}

// Tool Placeholder Component
interface ToolPlaceholderProps {
  name: string
  onBack: () => void
}

const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ name, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4"
          style={{ backgroundColor: TEAL }}
        >
          🚧
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>{name}</h1>
        <p className="text-gray-500 mb-6">This tool is coming soon!</p>
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
          style={{ backgroundColor: TEAL }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}

// Login Screen Component
interface LoginScreenProps {
  supabase: any
  onShowSignup: () => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ supabase, onShowSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError
    } catch (err: any) {
      console.error('Auth error:', err)
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
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.svg" 
            alt="The Nonprofit Edge" 
            className="h-16 mx-auto mb-4"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              if (img.src.includes('.svg')) {
                img.src = '/logo.jpg'
              }
            }}
          />
          <p className="text-gray-600">
            Strategic tools for nonprofit leaders
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: NAVY }}>
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent focus:outline-none"
                placeholder="jane@nonprofit.org"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent focus:outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: TEAL }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Please wait...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onShowSignup}
              className="text-sm hover:underline"
              style={{ color: TEAL }}
            >
              Don't have an account? Start free trial
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
