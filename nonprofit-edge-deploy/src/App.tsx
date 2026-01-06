/**
 * THE NONPROFIT EDGE - App.tsx
 * Main routing and app structure
 * 
 * UPDATED: Routes for Marketing Analytics and Link Manager
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// Pages
import Homepage from './components/Homepage'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import OwnerDashboard from './components/EnhancedOwnerDashboard'
import MarketingDashboard from './components/MarketingDashboard'
import LinkManager from './components/LinkManager'

// Member Pages
import Templates from './components/Templates'
import ResourcesLibrary from './components/ResourcesLibrary'
import EventsCalendar from './components/EventsCalendar'
import Certifications from './components/Certifications'
import BookSummaries from './components/BookSummaries'
import Playbooks from './components/Playbooks'
import CompletedAssessments from './components/CompletedAssessments'

// Landing Pages
import WhyWeExist from './components/WhyWeExist'
import CertificationsLanding from './components/CertificationsLanding'
import BoardAssessmentLanding from './components/BoardAssessmentLanding'
import StrategicPlanLanding from './components/StrategicPlanCheckup.landing'
import ScenarioPlannerLanding from './components/ScenarioPlanner.landing'
import GrantReviewLanding from './components/GrantReviewLanding'
import CEOEvaluationLanding from './components/CEOEvaluationLanding'

// Tool Pages (if you have separate tool interfaces)
// import AskTheProfessor from './components/AskTheProfessor'

function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserData(session.user.id)
      }
      setLoading(false)
    }

    checkSession()

    // Listen for auth changes
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
      // Get user profile
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
      <Route path="/signup" element={<Signup onNavigate={handleNavigate} />} />
      <Route path="/why-we-exist" element={<WhyWeExist onNavigate={handleNavigate} />} />
      <Route path="/certifications-info" element={<CertificationsLanding onNavigate={handleNavigate} />} />
      
      {/* Tool Landing Pages (Public) */}
      <Route path="/board-assessment" element={<BoardAssessmentLanding onNavigate={handleNavigate} />} />
      <Route path="/strategic-plan-checkup" element={<StrategicPlanLanding onNavigate={handleNavigate} />} />
      <Route path="/scenario-planner" element={<ScenarioPlannerLanding onNavigate={handleNavigate} />} />
      <Route path="/grant-review" element={<GrantReviewLanding onNavigate={handleNavigate} />} />
      <Route path="/ceo-evaluation" element={<CEOEvaluationLanding onNavigate={handleNavigate} />} />
      
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

      {/* Member Pages */}
      <Route path="/templates" element={user ? <Templates user={user} organization={organization} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/resources" element={user ? <ResourcesLibrary user={user} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/events" element={user ? <EventsCalendar user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/certifications" element={user ? <Certifications user={user} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/book-summaries" element={user ? <BookSummaries user={user} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/playbooks" element={user ? <Playbooks user={user} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/completed-assessments" element={user ? <CompletedAssessments user={user} organization={organization} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />

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

      {/* Marketing Analytics - Owner/Admin only */}
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

      {/* Link Manager - Owner/Admin only */}
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
      <Route path="/privacy" element={<div className="p-8">Privacy Policy - Coming Soon</div>} />
      <Route path="/terms" element={<div className="p-8">Terms of Service - Coming Soon</div>} />

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
