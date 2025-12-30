/**
 * THE NONPROFIT EDGE - App.tsx
 * Complete with browser history, signup flow, and role-based access
 * 
 * Owner: lyn@thepivotalgroup.com
 */

import React, { useState, useEffect, useCallback } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

// Components
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import SignUp from './components/SignUp'
import SignUpSuccess from './components/SignUpSuccess'
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
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Brand colors
const NAVY = '#1a365d'
const TEAL = '#00a0b0'

// Owner email for admin access
const OWNER_EMAIL = 'lyn@thepivotalgroup.com'

// Valid routes for URL handling
const VALID_ROUTES = [
  'home', 'signin', 'signup', 'signup-success', 'forgot', 'reset',
  'dashboard', 'library', 'events', 'team', 'reports', 'settings',
  'content-manager', 'owner-dashboard', 'enhanced-owner', 'marketing',
  'link-manager', 'team-access', 'homepage-editor',
  'strategic-checkup', 'board-assessment', 'ceo-evaluation', 
  'scenario-planner', 'grant-review', 'professor'
]

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [usage, setUsage] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
 const [currentPage, setCurrentPage] = useState('dashboard')
  
  // Auth view: 'login' | 'forgot' | 'reset' | 'signup'
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'reset' | 'signup'>('login')
  
  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Get page from URL
  const getPageFromUrl = (): string => {
    const path = window.location.pathname.slice(1) || 'home'
    return VALID_ROUTES.includes(path) ? path : 'home'
  }

  // Navigate function that updates URL and history
  const navigate = useCallback((page: string, replace: boolean = false) => {
    if (!VALID_ROUTES.includes(page)) {
      console.warn(`Invalid route: ${page}`)
      page = session ? 'dashboard' : 'home'
    }
    
    const url = `/${page === 'home' ? '' : page}`
    
    if (replace) {
      window.history.replaceState({ page }, '', url)
    } else {
      window.history.pushState({ page }, '', url)
    }
    
    setCurrentPage(page)
    
    // Handle auth views
    if (page === 'signin') setAuthView('login')
    if (page === 'forgot') setAuthView('forgot')
    if (page === 'signup') setAuthView('signup')
  }, [session])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || getPageFromUrl()
      setCurrentPage(page)
      
      if (page === 'signin') setAuthView('login')
      if (page === 'forgot') setAuthView('forgot')
      if (page === 'signup') setAuthView('signup')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Initialize page from URL on mount
  useEffect(() => {
    const initialPage = getPageFromUrl()
    setCurrentPage(initialPage)
    window.history.replaceState({ page: initialPage }, '', window.location.pathname)
  }, [])

  // Check for password reset token in URL
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setAuthView('reset')
    }
  }, [])

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] Initial session:', session ? 'Found' : 'None')
      setSession(session)
      if (session) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] State changed:', event, session ? 'Has session' : 'No session')
        setSession(session)
        
        if (event === 'SIGNED_OUT') {
          setUserData(null)
          setTeamMembers([])
          setUsage(null)
          setError(null)
          navigate('home', true)
          setAuthView('login')
        }
        
        if (event === 'SIGNED_IN' && session) {
          loadUserData(session.user.id)
          // Clear reset view after successful password reset
          if (authView === 'reset') {
            setAuthView('login')
            window.location.hash = ''
          }
        }

        if (event === 'PASSWORD_RECOVERY') {
          setAuthView('reset')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [authView, navigate])

  // Load user data
  const loadUserData = async (userId: string) => {
    try {
      setLoading(true)
      
      // Get the user's email from auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser?.email) throw new Error('No email found')
      
      // Get user with organization using email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('email', authUser.email)
        .single()

      if (userError) throw userError

      setUserData(user)

      // Get team members if user has an organization
      if (user.organization_id) {
        const { data: members } = await supabase
          .from('users')
          .select('*')
          .eq('organization_id', user.organization_id)

        setTeamMembers(members || [])
      }

      // Get usage stats
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      setUsage(usageData || [])
      setError(null)
    } catch (err: any) {
      console.error('[App] Error loading user:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      // Navigate to dashboard after successful login
      navigate('dashboard', true)
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in')
    } finally {
      setAuthLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Handle download tracking
  const handleDownload = async (resourceId: string) => {
    if (!userData) return
    
    await supabase.from('usage_tracking').insert({
      user_id: userData.id,
      organization_id: userData.organization_id,
      action_type: 'download',
      resource_id: resourceId
    })
  }

  // Handle professor session
  const handleStartProfessor = async () => {
    if (!userData) return
    
    await supabase.from('usage_tracking').insert({
      user_id: userData.id,
      organization_id: userData.organization_id,
      action_type: 'professor_session'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in - show public pages
  if (!session) {
    // Forgot Password view
    if (authView === 'forgot' || currentPage === 'forgot') {
      return <ForgotPassword onBack={() => navigate('signin')} />
    }

    // Reset Password view (from email link)
    if (authView === 'reset' || currentPage === 'reset') {
      return <ResetPassword onSuccess={() => navigate('signin')} />
    }

    // SignUp flow
    if (currentPage === 'signup') {
      return (
        <SignUp
          onNavigate={navigate}
          supabase={supabase}
        />
      )
    }

    // SignUp Success
    if (currentPage === 'signup-success') {
      return <SignUpSuccess onNavigate={navigate} />
    }

    // Public Homepage
    if (currentPage === 'home' || currentPage === '') {
      return (
        <Homepage 
          onNavigate={navigate}
          isAdmin={false}
          supabase={supabase}
        />
      )
    }

    // Login form (signin or any protected route)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/logo.svg" 
              alt="The Nonprofit Edge" 
              className="w-64 h-auto mx-auto mb-6"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                if (img.src.includes('.svg')) {
                  img.src = '/logo.png'
                } else {
                  img.style.display = 'none'
                }
              }}
            />
            <p className="text-gray-600 text-lg">Strategic tools for nonprofit leaders</p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {authError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@organization.org"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 text-base"
              style={{ backgroundColor: TEAL }}
            >
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('forgot')}
              className="text-base hover:underline"
              style={{ color: TEAL }}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('signup')}
              className="text-base hover:underline"
              style={{ color: NAVY }}
            >
              Don't have an account? Start free trial
            </button>
          </div>

          {/* Back to Homepage Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('home')}
              className="text-sm hover:underline text-gray-500"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleLogout}
            className="text-sm hover:underline"
            style={{ color: TEAL }}
          >
            Sign out and try again
          </button>
        </div>
      </div>
    )
  }

  // No user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>
            Account Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Your account hasn't been set up yet. Please contact support.
          </p>
          <button
            onClick={handleLogout}
            className="text-sm hover:underline"
            style={{ color: TEAL }}
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  // Check if user is owner
  const isOwner = userData.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() || 
                  userData.role === 'owner' || 
                  userData.platform_role === 'owner'

  // Check if user is admin (owner or admin role)
  const isAdmin = isOwner || 
                  userData.role === 'admin' || 
                  userData.platform_role === 'admin'

  // Team Admin page
  if (currentPage === 'team') {
    return (
      <TeamAdmin
        organization={userData.organization}
        currentUser={userData}
        teamMembers={teamMembers}
        onBack={() => navigate('dashboard')}
        onRefresh={() => loadUserData(session.user.id)}
      />
    )
  }

  // Platform Admin page (owner only)
  if (currentPage === 'admin' && isOwner) {
    return (
      <AdminDashboard
        onBack={() => navigate('dashboard')}
      />
    )
  }

  // Content Manager (admin + owner)
  if (currentPage === 'content-manager' && isAdmin) {
    return (
      <ContentManager
        supabase={supabase}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Owner Dashboard (owner only)
  if (currentPage === 'owner-dashboard' && isOwner) {
    return (
      <PlatformOwnerDashboard
        supabase={supabase}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Enhanced Owner Dashboard (owner only)
  if (currentPage === 'enhanced-owner' && isOwner) {
    return (
      <EnhancedOwnerDashboard
        supabase={supabase}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Marketing Dashboard (owner only)
  if (currentPage === 'marketing' && isOwner) {
    return (
      <MarketingDashboard
        supabase={supabase}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Link Manager (owner only)
  if (currentPage === 'link-manager' && isOwner) {
    return (
      <LinkManager
        supabase={supabase}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Team Access Manager (owner only)
  if (currentPage === 'team-access' && isOwner) {
    return (
      <TeamAccessManager
        supabase={supabase}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Homepage Editor (owner only)
  if (currentPage === 'homepage-editor' && isOwner) {
    return (
      <Homepage
        onNavigate={navigate}
        isAdmin={true}
        supabase={supabase}
      />
    )
  }

  // Resource Library page
  if (currentPage === 'library') {
    return (
      <ResourceLibrary
        user={userData}
        organization={userData.organization}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Events Calendar page
  if (currentPage === 'events') {
    return (
      <EventsCalendar
        user={userData}
        organization={userData.organization}
        onNavigate={navigate}
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
      onNavigate={navigate}
      onDownload={handleDownload}
      onStartProfessor={handleStartProfessor}
      onLogout={handleLogout}
      supabase={supabase}
    />
  )
}

export default App
