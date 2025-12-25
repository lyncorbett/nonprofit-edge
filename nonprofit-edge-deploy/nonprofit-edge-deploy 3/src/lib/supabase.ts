import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// ==========================================
// TYPES
// ==========================================

export interface Organization {
  id: string
  name: string
  tier: 'starter' | 'professional' | 'enterprise'
  seats_total: number
  monthly_downloads_limit: number
  monthly_professor_limit: number
  subscription_status: string
  created_at: string
}

export interface User {
  id: string
  auth_user_id: string
  organization_id: string
  email: string
  full_name: string
  role: 'owner' | 'admin' | 'member'
  is_active: boolean
  last_login: string
  created_at: string
}

export interface MonthlyUsage {
  id: string
  organization_id: string
  user_id: string
  month_year: string
  professor_sessions: number
  report_downloads: number
  templates_downloaded: number
  tools_started: number
  tools_completed: number
}

export interface ActivityLog {
  id: string
  organization_id: string
  user_id: string
  action_type: string
  action_detail?: Record<string, any>
  resource_type?: string
  resource_id?: string
  resource_name?: string
  created_at: string
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const getCurrentMonthYear = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// ==========================================
// DATA FETCHING
// ==========================================

export const fetchUserWithOrg = async (authUserId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('auth_user_id', authUserId)
    .single()

  if (error) throw error
  return data
}

export const fetchTeamMembers = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('created_at')

  if (error) throw error
  return data
}

export const fetchMonthlyUsage = async (organizationId: string, userId: string) => {
  const monthYear = getCurrentMonthYear()
  
  const { data, error } = await supabase
    .from('monthly_usage')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .eq('month_year', monthYear)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  
  return data || {
    professor_sessions: 0,
    report_downloads: 0,
    templates_downloaded: 0,
    tools_started: 0,
    tools_completed: 0,
  }
}

export const fetchRecentActivity = async (organizationId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// ==========================================
// TRACKING FUNCTIONS
// ==========================================

export const incrementUsage = async (
  organizationId: string,
  userId: string,
  field: keyof MonthlyUsage
) => {
  const monthYear = getCurrentMonthYear()

  // Upsert the record
  const { error: upsertError } = await supabase
    .from('monthly_usage')
    .upsert({
      organization_id: organizationId,
      user_id: userId,
      month_year: monthYear,
    }, {
      onConflict: 'organization_id,user_id,month_year'
    })

  if (upsertError) throw upsertError

  // Call the increment function
  const { error } = await supabase.rpc('increment_usage', {
    p_org_id: organizationId,
    p_user_id: userId,
    p_field: field,
  })

  if (error) throw error
}

export const logActivity = async (
  organizationId: string,
  userId: string,
  actionType: string,
  details?: {
    resourceType?: string
    resourceId?: string
    resourceName?: string
    actionDetail?: Record<string, any>
  }
) => {
  const { error } = await supabase
    .from('activity_log')
    .insert({
      organization_id: organizationId,
      user_id: userId,
      action_type: actionType,
      resource_type: details?.resourceType,
      resource_id: details?.resourceId,
      resource_name: details?.resourceName,
      action_detail: details?.actionDetail,
    })

  if (error) throw error
}

export const trackDownload = async (
  organizationId: string,
  userId: string,
  currentDownloads: number,
  limit: number,
  resourceName: string,
  resourceType: 'report' | 'template'
) => {
  if (currentDownloads >= limit) {
    return {
      success: false,
      message: `You've reached your monthly download limit (${limit}). Upgrade your plan for more.`
    }
  }

  try {
    await incrementUsage(organizationId, userId, 'report_downloads')
    await logActivity(organizationId, userId, 'download', {
      resourceType,
      resourceName,
      actionDetail: { remaining: limit - currentDownloads - 1 }
    })

    return { success: true, remaining: limit - currentDownloads - 1 }
  } catch (error) {
    console.error('Error tracking download:', error)
    return { success: false, message: 'Failed to track download' }
  }
}

export const trackProfessorSession = async (
  organizationId: string,
  userId: string,
  currentSessions: number,
  limit: number
) => {
  if (limit !== -1 && currentSessions >= limit) {
    return {
      success: false,
      message: `You've reached your monthly session limit (${limit}). Upgrade your plan for more.`
    }
  }

  try {
    await incrementUsage(organizationId, userId, 'professor_sessions')
    await logActivity(organizationId, userId, 'professor_session_start')

    return { success: true }
  } catch (error) {
    console.error('Error tracking session:', error)
    return { success: false, message: 'Failed to start session' }
  }
}

// ==========================================
// TEAM MANAGEMENT
// ==========================================

export const fetchPendingInvitations = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('organization_id', organizationId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  return data
}

export const createInvitation = async (
  organizationId: string,
  invitedBy: string,
  email: string,
  role: 'admin' | 'member'
) => {
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      organization_id: organizationId,
      email,
      role,
      invited_by: invitedBy,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const cancelInvitation = async (invitationId: string) => {
  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', invitationId)

  if (error) throw error
}

export const updateMemberRole = async (memberId: string, role: 'admin' | 'member') => {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', memberId)

  if (error) throw error
}

export const deactivateMember = async (memberId: string) => {
  const { error } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', memberId)

  if (error) throw error
}
