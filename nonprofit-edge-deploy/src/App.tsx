/**
 * THE NONPROFIT EDGE - App.tsx
 * Routes matching actual component file names in repo
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// Core Pages - matching actual file names
import Homepage from './components/Homepage'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'

// Owner/Admin Pages
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard'
import MarketingDashboard from './components/MarketingDashboard'
import LinkManager from './components/LinkManager'

// Member Resource Pages
import Templates from './components/Templates'
import ResourcesLibrary from './components/ResourcesLibrary'
import EventsCalendar from './components/EventsCalendar'
import Certifications from './components/Certifications'
import Playbooks from './components/Playbooks'
import CompletedAssessments from './components/CompletedAssessments'
import TheoryOfConstraints from './components/TheoryOfConstraints'

// Tool Landing Pages
import BoardAssessmentLanding from './components/BoardAssessmentLanding'
import StrategicPlanCheckupLanding from './components/StrategicPlanCheckupLanding'
import ScenarioPlannerLanding from './components/ScenarioPlannerLanding'
import GrantReviewLanding from './components/GrantReviewLanding'
import CEOEvaluationLanding from './components/CEOEvaluationLanding'
import CertificationsLanding from './components/CertificationsLanding'

// Tool Pages
import AskTheProfessor from './components/AskTheProfessor'
import BoardAssessment from './components/BoardAssessment'
import StrategicPlanCheckup from './components/StrategicPlanCheckup'
import ScenarioPlanner from './components/ScenarioPlanner'
import GrantReview from './components/GrantReview'
import CEOEvaluation from './components/CEOEvaluation'

// Other Pages
import ToolsPage from './components/ToolsPage'

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
      
      {/* Tool Landing Pages (Public) */}
      <Route path="/board-assessment" element={<BoardAssessmentLanding onNavigate={handleNavigate} />} />
      <Route path="/strategic-plan-checkup" element={<StrategicPlanCheckupLanding onNavigate={handleNavigate} />} />
      <Route path="/scenario-planner" element={<ScenarioPlannerLanding onNavigate={handleNavigate} />} />
      <Route path="/grant-review" element={<GrantReviewLanding onNavigate={handleNavigate} />} />
      <Route path="/ceo-evaluation" element={<CEOEvaluationLanding onNavigate={handleNavigate} />} />
      <Route path="/certifications-info" element={<CertificationsLanding onNavigate={handleNavigate} />} />
      <Route path="/tools" element={<ToolsPage onNavigate={handleNavigate} />} />
      
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

      {/* Member Resource Pages */}
      <Route path="/templates" element={user ? <Templates user={user} organization={organization} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/resources" element={user ? <ResourcesLibrary user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/events" element={user ? <EventsCalendar user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/certifications" element={user ? <Certifications user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/playbooks" element={user ? <Playbooks user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/completed-assessments" element={user ? <CompletedAssessments user={user} organization={organization} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/theory-of-constraints" element={user ? <TheoryOfConstraints user={user} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />

      {/* Tool Pages (Authenticated) */}
      <Route path="/ask-the-professor" element={user ? <AskTheProfessor user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/tools/board-assessment" element={user ? <BoardAssessment user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/tools/strategic-plan" element={user ? <StrategicPlanCheckup user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/tools/scenario-planner" element={user ? <ScenarioPlanner user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/tools/grant-review" element={user ? <GrantReview user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />
      <Route path="/tools/ceo-evaluation" element={user ? <CEOEvaluation user={user} supabase={supabase} onNavigate={handleNavigate} /> : <Navigate to="/login" />} />

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
