/**
 * THE NONPROFIT EDGE - Supabase Tracking Functions
 * Add these functions to your existing supabase.ts file
 * 
 * These handle:
 * - Usage tracking (downloads, professor sessions, tools)
 * - Activity logging
 * - Tier-based limit enforcement
 */

import { supabase } from './supabase'; // Your existing supabase client

// Tier limits configuration
export const TIER_LIMITS = {
  essential: { downloads: 10, professor: 10, seats: 1 },
  professional: { downloads: 25, professor: 50, seats: 5 },
  premium: { downloads: 100, professor: 999, seats: 10 }
};

// n8n Webhook URLs
export const N8N_WEBHOOKS: Record<string, string> = {
  'board-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/board-assessment',
  'strategic-checkup': 'https://thenonprofitedge.app.n8n.cloud/webhook/strategic-checkup',
  'ceo-evaluation': 'https://thenonprofitedge.app.n8n.cloud/webhook/ceo-evaluation',
  'scenario-planner': 'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
  'grant-review': 'https://thenonprofitedge.app.n8n.cloud/webhook/grant-review',
  'constraint-assessment': 'https://thenonprofitedge.app.n8n.cloud/webhook/constraint-assessment',
  'ask-professor': 'https://thenonprofitedge.app.n8n.cloud/webhook/ask-professor'
};

// ==========================================
// USAGE TRACKING FUNCTIONS
// ==========================================

/**
 * Get current month's usage for an organization
 */
export async function getMonthlyUsage(organizationId: string) {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('monthly_usage')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('month_year', monthYear)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching usage:', error);
  }

  return data || {
    report_downloads: 0,
    templates_downloaded: 0,
    professor_sessions: 0,
    tools_started: 0,
    tools_completed: 0
  };
}

/**
 * Track a tool start - creates session, logs activity, and notifies n8n
 */
export async function trackToolStart(
  organizationId: string,
  userId: string,
  toolId: string,
  toolName: string,
  userData?: { email?: string; name?: string; orgName?: string }
) {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  try {
    // Upsert monthly usage record
    await supabase.rpc('increment_usage', {
      p_org_id: organizationId,
      p_user_id: userId,
      p_month_year: monthYear,
      p_field: 'tools_started'
    });

    // Log activity
    await supabase.from('activity_log').insert({
      organization_id: organizationId,
      user_id: userId,
      action_type: 'tool_start',
      action_detail: { tool_id: toolId, tool_name: toolName }
    });

    // Create tool session
    const { data: session } = await supabase
      .from('tool_sessions')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        tool_type: toolId,
        status: 'in_progress'
      })
      .select()
      .single();

    // Trigger n8n webhook if configured for this tool
    if (N8N_WEBHOOKS[toolId]) {
      // Fire and forget - don't wait for response
      triggerN8nWebhook(toolId, {
        event: 'tool_started',
        sessionId: session?.id,
        toolId,
        toolName,
        organizationId,
        userId,
        userEmail: userData?.email,
        userName: userData?.name,
        orgName: userData?.orgName,
        timestamp: now.toISOString()
      }).catch(err => console.warn('Webhook notification failed:', err));
    }

    return { success: true, sessionId: session?.id };
  } catch (err) {
    console.error('Error tracking tool start:', err);
    return { success: false, error: err };
  }
}

/**
 * Track tool completion - updates session and logs
 */
export async function trackToolComplete(
  organizationId: string,
  userId: string,
  sessionId: string,
  toolName: string,
  score?: number
) {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  try {
    // Update monthly usage
    await supabase.rpc('increment_usage', {
      p_org_id: organizationId,
      p_user_id: userId,
      p_month_year: monthYear,
      p_field: 'tools_completed'
    });

    // Update tool session
    await supabase
      .from('tool_sessions')
      .update({
        status: 'completed',
        completed_at: now.toISOString(),
        score: score
      })
      .eq('id', sessionId);

    // Log activity
    await supabase.from('activity_log').insert({
      organization_id: organizationId,
      user_id: userId,
      action_type: 'tool_complete',
      action_detail: { session_id: sessionId, tool_name: toolName, score }
    });

    return { success: true };
  } catch (err) {
    console.error('Error tracking tool completion:', err);
    return { success: false, error: err };
  }
}

/**
 * Track a download - checks limits first
 */
export async function trackDownload(
  organizationId: string,
  userId: string,
  tier: string,
  resourceName: string,
  resourceType: 'report' | 'template'
) {
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.essential;
  const usage = await getMonthlyUsage(organizationId);
  const currentDownloads = usage.report_downloads + usage.templates_downloaded;

  // Check limit
  if (currentDownloads >= limits.downloads) {
    return {
      success: false,
      message: `You've reached your monthly download limit (${limits.downloads}). Upgrade your plan for more downloads.`,
      remaining: 0
    };
  }

  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const field = resourceType === 'report' ? 'report_downloads' : 'templates_downloaded';

  try {
    // Update monthly usage
    await supabase.rpc('increment_usage', {
      p_org_id: organizationId,
      p_user_id: userId,
      p_month_year: monthYear,
      p_field: field
    });

    // Log activity
    await supabase.from('activity_log').insert({
      organization_id: organizationId,
      user_id: userId,
      action_type: 'download',
      action_detail: { resource_name: resourceName, resource_type: resourceType }
    });

    return {
      success: true,
      remaining: limits.downloads - currentDownloads - 1
    };
  } catch (err) {
    console.error('Error tracking download:', err);
    return { success: false, message: 'Error tracking download' };
  }
}

/**
 * Track a professor session - checks limits first
 */
export async function trackProfessorSession(
  organizationId: string,
  userId: string,
  tier: string
) {
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.essential;
  const usage = await getMonthlyUsage(organizationId);

  // Premium tier has unlimited (999)
  if (tier !== 'premium' && usage.professor_sessions >= limits.professor) {
    return {
      success: false,
      message: `You've reached your monthly Ask the Professor limit (${limits.professor}). Upgrade your plan for more sessions.`,
      remaining: 0
    };
  }

  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  try {
    // Update monthly usage
    await supabase.rpc('increment_usage', {
      p_org_id: organizationId,
      p_user_id: userId,
      p_month_year: monthYear,
      p_field: 'professor_sessions'
    });

    // Log activity
    await supabase.from('activity_log').insert({
      organization_id: organizationId,
      user_id: userId,
      action_type: 'professor_session',
      action_detail: { timestamp: now.toISOString() }
    });

    return {
      success: true,
      remaining: limits.professor - usage.professor_sessions - 1
    };
  } catch (err) {
    console.error('Error tracking professor session:', err);
    return { success: false, message: 'Error tracking session' };
  }
}

/**
 * Get recent activity for an organization
 */
export async function getRecentActivity(organizationId: string, limit = 5) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  return data || [];
}

/**
 * Format activity for display
 */
export function formatActivity(activity: any) {
  const colors: Record<string, string> = {
    'tool_start': '#00a0b0',
    'tool_complete': '#16a34a',
    'download': '#8b5cf6',
    'professor_session': '#f59e0b'
  };

  const labels: Record<string, string> = {
    'tool_start': 'Started',
    'tool_complete': 'Completed',
    'download': 'Downloaded',
    'professor_session': 'Professor session'
  };

  const detail = activity.action_detail || {};
  let text = labels[activity.action_type] || activity.action_type;

  if (detail.tool_name) text += ` ${detail.tool_name}`;
  if (detail.resource_name) text += ` ${detail.resource_name}`;

  return {
    color: colors[activity.action_type] || '#6b7280',
    text,
    time: formatTimeAgo(activity.created_at)
  };
}

/**
 * Format time ago helper
 */
export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ==========================================
// n8n WEBHOOK FUNCTIONS
// ==========================================

/**
 * Send data to n8n webhook
 */
export async function triggerN8nWebhook(
  webhookKey: string,
  data: Record<string, any>
) {
  const webhookUrl = N8N_WEBHOOKS[webhookKey];
  
  if (!webhookUrl) {
    console.warn(`No webhook URL found for key: ${webhookKey}`);
    return { success: false, message: 'Webhook not configured' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (err) {
    console.error('Error triggering webhook:', err);
    return { success: false, error: err };
  }
}
