// ============================================
// FIX FOR APP.TSX - Replace the handleLogin function
// ============================================

// REPLACE THIS (around line 230-250 in your App.tsx):

const handleLogin = async (email: string) => {
  // Get the actual session from Supabase
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    const newUser: User = {
      id: session.user.id,  // Use real Supabase user ID
      email: session.user.email || email,
      name: session.user.email?.split('@')[0] || 'User',
      full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      role: 'member',  // Default role, can be updated from database
      organization_id: 'org_1',
      created_at: session.user.created_at || new Date().toISOString(),
    }
    
    const newOrg: Organization = {
      id: 'org_1',
      name: 'Your Organization',
      tier: 'professional',
    }
    
    setUser(newUser)
    setOrganization(newOrg)
    localStorage.setItem('nonprofit_edge_user', JSON.stringify(newUser))
    localStorage.setItem('nonprofit_edge_org', JSON.stringify(newOrg))
    navigate('/dashboard')
  } else {
    // Fallback if no session (shouldn't happen if Login.tsx worked)
    console.error('No Supabase session found after login')
  }
}

// ============================================
// ALSO ADD: Check Supabase session on app load
// Add this inside the useEffect that runs on mount (around line 180)
// ============================================

useEffect(() => {
  const initializeAuth = async () => {
    // Check for existing Supabase session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // User is logged in via Supabase
      const newUser: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.email?.split('@')[0] || 'User',
        full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        role: 'member',
        organization_id: 'org_1',
        created_at: session.user.created_at || new Date().toISOString(),
      }
      
      setUser(newUser)
      localStorage.setItem('nonprofit_edge_user', JSON.stringify(newUser))
    } else {
      // Check localStorage as fallback
      try {
        const savedUser = localStorage.getItem('nonprofit_edge_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (e) {
        console.error('Error loading saved user:', e)
      }
    }
    
    setIsLoading(false)
  }
  
  initializeAuth()
  
  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        localStorage.removeItem('nonprofit_edge_user')
        navigate('/')
      }
    }
  )
  
  return () => subscription.unsubscribe()
}, [])

// ============================================
// MAKE SURE TO IMPORT SUPABASE AT THE TOP
// ============================================

import { supabase } from './lib/supabase'
