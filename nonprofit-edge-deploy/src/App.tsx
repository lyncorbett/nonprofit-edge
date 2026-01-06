/**
 * THE NONPROFIT EDGE - App.tsx
 * Main routing - Only imports existing components
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// Core Pages (these should exist in your repo)
import Homepage from './components/Homepage'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'

// Owner/Admin Pages
import OwnerDashboard from './components/EnhancedOwnerDashboard'
import MarketingDashboard from './components/MarketingDashboard'
import LinkManager from './components/LinkManager'

// Optional: Comment out any that don't exist yet
// import Templates from './components/Templates'
// import ResourcesLibrary from './components/ResourcesLibrary'
// import EventsCalendar from './components/EventsCalendar'
// import Certifications from './components/Certifications'
// import BookSummaries from './components/BookSummaries'
// import Playbooks from './components/Playbooks'
// import CompletedAssessments from './components/CompletedAssessments'
// import WhyWeExist from './components/WhyWeExist'

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

  // Placeholder component for pages that don't exist yet
  const ComingSoon = ({ title }: { title: string }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500 mb-4">This page is coming soon!</p>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-[#0097A9] text-white rounded-lg">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Homepage onNavigate={handleNavigate} />} />
      <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
      <Route path="/signup" element={<Signup onNavigate={handleNavigate} />} />
      
      {/* Placeholder public pages */}
      <Route path="/why-we-exist" element={<ComingSoon title="Why We Exist" />} />
      <Route path="/board-assessment" element={<ComingSoon title="Board Assessment" />} />
      <Route path="/strategic-plan-checkup" element={<ComingSoon title="Strategic Plan Check-Up" />} />
      <Route path="/scenario-planner" element={<ComingSoon title="Scenario Planner" />} />
      <Route path="/grant-review" element={<ComingSoon title="Grant Review" />} />
      <Route path="/ceo-evaluation" element={<ComingSoon title="CEO Evaluation" />} />
      <Route path="/ask-the-professor" element={<ComingSoon title="Ask the Professor" />} />
      
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

      {/* Member Pages - Placeholders */}
      <Route path="/templates" element={user ? <ComingSoon title="Template Vault" /> : <Navigate to="/login" />} />
      <Route path="/resources" element={user ? <ComingSoon title="Resource Library" /> : <Navigate to="/login" />} />
      <Route path="/events" element={user ? <ComingSoon title="Events Calendar" /> : <Navigate to="/login" />} />
      <Route path="/certifications" element={user ? <ComingSoon title="Certifications" /> : <Navigate to="/login" />} />
      <Route path="/book-summaries" element={user ? <ComingSoon title="Book Summaries" /> : <Navigate to="/login" />} />
      <Route path="/playbooks" element={user ? <ComingSoon title="Playbooks" /> : <Navigate to="/login" />} />
      <Route path="/completed-assessments" element={user ? <ComingSoon title="Completed Assessments" /> : <Navigate to="/login" />} />

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
            <OwnerDashboard 
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

      {/* Legal Pages */}
      <Route path="/privacy" element={<ComingSoon title="Privacy Policy" />} />
      <Route path="/terms" element={<ComingSoon title="Terms of Service" />} />

      {/* Catch-all redirect */}
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
