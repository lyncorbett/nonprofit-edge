import { useState, useEffect } from 'react'
import { supabase, fetchUserWithOrg, fetchMonthlyUsage, fetchTeamMembers, trackDownload, trackProfessorSession } from './lib/supabase'
import Dashboard from './components/Dashboard'
import TeamAdmin from './components/TeamAdmin'
import Login from './components/Login'

// ============================================
// THE NONPROFIT EDGE - MAIN APP
// ============================================

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  
  // User & Org data
  const [userData, setUserData] = useState<any>(null)
  const [usage, setUsage] = useState({
    professor_sessions: 0,
    report_downloads: 0,
    templates_downloaded: 0,
    tools_started: 0,
    tools_completed: 0,
  })
  const [teamMembers, setTeamMembers] = useState<any[]>([])

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        loadUserData(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (authUserId: string) => {
    try {
      const data = await fetchUserWithOrg(authUserId)
      setUserData(data)

      if (data.organization_id) {
        const [usageData, teamData] = await Promise.all([
          fetchMonthlyUsage(data.organization_id, data.id),
          fetchTeamMembers(data.organization_id)
        ])
        setUsage(usageData)
        setTeamMembers(teamData)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (resourceName: string, resourceType: 'report' | 'template') => {
    if (!userData) return { success: false, message: 'Not logged in' }
    
    const result = await trackDownload(
      userData.organization_id,
      userData.id,
      usage.report_downloads,
      userData.organization.monthly_downloads_limit,
      resourceName,
      resourceType
    )

    if (result.success) {
      setUsage(prev => ({
        ...prev,
        report_downloads: prev.report_downloads + 1
      }))
    }

    return result
  }

  const handleStartProfessor = async () => {
    if (!userData) return { success: false, message: 'Not logged in' }

    const result = await trackProfessorSession(
      userData.organization_id,
      userData.id,
      usage.professor_sessions,
      userData.organization.monthly_professor_limit
    )

    if (result.success) {
      setUsage(prev => ({
        ...prev,
        professor_sessions: prev.professor_sessions + 1
      }))
    }

    return result
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUserData(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Login />
  }

  // No user data yet (first time login)
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-navy mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">
            Your account is being set up. If this persists, please contact support.
          </p>
          <button
            onClick={handleLogout}
            className="text-teal hover:underline"
          >
            Sign out and try again
          </button>
        </div>
      </div>
    )
  }

  // Team Admin page
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
    />
  )
}

export default App
