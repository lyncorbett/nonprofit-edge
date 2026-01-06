/**
 * THE NONPROFIT EDGE - App.tsx
 * Minimal version - only core components
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// Only import components we KNOW exist
import Homepage from './components/Homepage'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard'
import MarketingDashboard from './components/MarketingDashboard'
import LinkManager from './components/LinkManager'

const TEAL = '#0097A9'
const NAVY = '#0D2C54'

// Placeholder for missing pages
const ComingSoon = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>{title}</h1>
      <p className="text-gray-500 mb-6">This page is coming soon!</p>
      <button onClick={onBack} className="px-6 py-2 text-white rounded-lg" style={{ backgroundColor: TEAL }}>Back to Dashboard</button>
    </div>
  </div>
)

function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserData(session.user.id)
      }
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setOrganization(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*, organization:organizations(*)')
        .eq('id', userId)
        .single()

      if (userData) {
        setUser(userData)
        setOrganization(userData.organization)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setOrganization(null)
    navigate('/login')
  }

  const handleNavigate = (page: string) => {
    navigate(`/${page}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Homepage onNavigate={handleNavigate} />} />
      <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
      <Route path="/signup" element={<SignUp onNavigate={handleNavigate} />} />
      
      {/* Placeholder public pages */}
      <Route path="/why-we-exist" element={<ComingSoon title="Why We Exist" onBack={() => navigate('/')} />} />
      <Route path="/board-assessment" element={<ComingSoon title="Board Assessment" onBack={() => navigate('/')} />} />
      <Route path="/strategic-plan-checkup" element={<ComingSoon title="Strategic Plan Check-Up" onBack={() => navigate('/')} />} />
      <Route path="/scenario-planner" element={<ComingSoon title="Scenario Planner" onBack={() => navigate('/')} />} />
      <Route path="/grant-review" element={<ComingSoon title="Grant Review" onBack={() => navigate('/')} />} />
      <Route path="/ceo-evaluation" element={<ComingSoon title="CEO Evaluation" onBack={() => navigate('/')} />} />
      <Route path="/ask-the-professor" element={<ComingSoon title="Ask the Professor" onBack={() => navigate('/')} />} />
      
      {/* Member Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            <Dashboard 
              user={user} 
              organization={organization} 
              supabase={supabase}
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
            />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      {/* Placeholder member pages */}
      <Route path="/templates" element={user ? <ComingSoon title="Templates" onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />
      <Route path="/resources" element={user ? <ComingSoon title="Resources" onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />
      <Route path="/events" element={user ? <ComingSoon title="Events" onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />
      <Route path="/certifications" element={user ? <ComingSoon title="Certifications" onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />
      <Route path="/book-summaries" element={user ? <ComingSoon title="Book Summaries" onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />
      <Route path="/playbooks" element={user ? <ComingSoon title="Playbooks" onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />

      {/* Admin Dashboard */}
      <Route 
        path="/admin" 
        element={
          user?.role === 'admin' || user?.role === 'owner' ? (
            <AdminDashboard 
              user={user}
              onBack={() => navigate('/dashboard')} 
              onNavigate={handleNavigate} 
            />
          ) : (
            <Navigate to="/dashboard" />
          )
        } 
      />

      {/* Owner Dashboard */}
      <Route 
        path="/owner-dashboard" 
        element={
          user?.role === 'owner' ? (
            <EnhancedOwnerDashboard 
              user={user}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/dashboard" />
          )
        } 
      />

      {/* Marketing Analytics */}
      <Route 
        path="/marketing" 
        element={
          user?.role === 'owner' || user?.role === 'admin' ? (
            <MarketingDashboard 
              user={user}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/dashboard" />
          )
        } 
      />

      {/* Link Manager */}
      <Route 
        path="/link-manager" 
        element={
          user?.role === 'owner' || user?.role === 'admin' ? (
            <LinkManager 
              user={user}
              supabase={supabase}
              onNavigate={handleNavigate}
            />
          ) : (
            <Navigate to="/dashboard" />
          )
        } 
      />

      {/* Legal pages */}
      <Route path="/privacy" element={<ComingSoon title="Privacy Policy" onBack={() => navigate('/')} />} />
      <Route path="/terms" element={<ComingSoon title="Terms of Service" onBack={() => navigate('/')} />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
