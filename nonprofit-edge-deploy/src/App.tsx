/**
 * THE NONPROFIT EDGE - App.tsx
 * With Homepage, Auth Modal, and AI Chatbot
 */

import React, { useState, useEffect } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

// Components
import Homepage from './components/Homepage'
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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true)
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*, organization:organizations(*)')
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

      setUsage(usageData || { downloads_this_month: 0, professor_sessions_this_month: 0, tools_used_this_month: 0 })
      setError(null)
    } catch (err: any) {
      console.error('Error loading user data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setShowAuthModal(false)
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
    return true // Return success for showing confirmation message
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

  const openLogin = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const openSignup = (tier?: string) => {
    setAuthMode('signup')
    setSelectedTier(tier || null)
    setShowAuthModal(true)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: TEAL, borderTopColor: 'transparent' }} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in - show Homepage
  if (!session) {
    return (
      <>
        <Homepage onLogin={openLogin} onSignup={openSignup} />
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            selectedTier={selectedTier}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          />
        )}
      </>
    )
  }

  // Has session but no user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>Account Setup Required</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <p className="text-gray-600 mb-4">Your account is being set up. If this persists, please contact support.</p>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: TEAL }}>Sign Out</button>
        </div>
      </div>
    )
  }

  // Route handling
  const routes: Record<string, JSX.Element> = {
    'team': <TeamAdmin organization={userData.organization} currentUser={userData} teamMembers={teamMembers} onBack={() => setCurrentPage('dashboard')} onRefresh={() => loadUserData(session.user.id)} />,
    'admin': <AdminDashboard onBack={() => setCurrentPage('dashboard')} />,
    'content-manager': <ContentManager supabase={supabase} onNavigate={setCurrentPage} onLogout={handleLogout} />,
    'owner-dashboard': <PlatformOwnerDashboard supabase={supabase} onNavigate={setCurrentPage} onLogout={handleLogout} />,
    'enhanced-owner': <EnhancedOwnerDashboard user={userData} supabase={supabase} onNavigate={setCurrentPage} />,
    'marketing': <MarketingDashboard user={userData} onNavigate={setCurrentPage} onLogout={handleLogout} />,
    'link-manager': <LinkManager user={userData} supabase={supabase} onNavigate={setCurrentPage} />,
    'team-access': <TeamAccessManager supabase={supabase} currentUserEmail={userData.email} onNavigate={setCurrentPage} />,
    'library': <ResourceLibrary user={userData} organization={userData.organization} onNavigate={setCurrentPage} onLogout={handleLogout} />,
    'events': <EventsCalendar user={userData} organization={userData.organization} onNavigate={setCurrentPage} onLogout={handleLogout} />,
  }

  if (routes[currentPage]) {
    return (
      <>
        {routes[currentPage]}
        <AIGuideChatbot user={userData} organization={userData.organization} onNavigate={setCurrentPage} />
      </>
    )
  }

  // Default: Dashboard
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
      <AIGuideChatbot user={userData} organization={userData.organization} onNavigate={setCurrentPage} />
    </>
  )
}

// Auth Modal Component
interface AuthModalProps {
  mode: 'login' | 'signup'
  selectedTier: string | null
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string, fullName: string) => Promise<boolean>
  onSwitchMode: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, selectedTier, onClose, onLogin, onSignUp, onSwitchMode }) => {
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
      if (mode === 'signup') {
        await onSignUp(email, password, fullName)
        setSuccess('Account created! Check your email to confirm your account.')
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        
        {selectedTier && mode === 'signup' && (
          <p className="text-sm text-gray-500 mb-4">
            Selected plan: <span className="font-semibold capitalize">{selectedTier}</span>
          </p>
        )}

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
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              placeholder="you@organization.org"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
            style={{ backgroundColor: TEAL }}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitchMode} className="text-sm hover:underline" style={{ color: TEAL }}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
