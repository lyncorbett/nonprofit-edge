/**
 * Usage Tracking Utilities
 * Location: src/lib/tracking.ts
 */

export const TIER_LIMITS: Record<string, { tools: number; downloads: number; professor: number }> = {
  essential: { tools: 5, downloads: 10, professor: 3 },
  professional: { tools: 15, downloads: 30, professor: 10 },
  premium: { tools: 999, downloads: 999, professor: 999 },
};

export const trackToolStart = async (
  userId: string,
  orgId: string,
  toolId: string,
  toolName: string
): Promise<string> => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    console.log(`[Tracking] Tool started: ${toolName} (${toolId}) by ${userId}, session: ${sessionId}`);
  } catch (e) {
    console.error('Tracking error:', e);
  }
  return sessionId;
};

export const trackToolComplete = async (
  userId: string,
  orgId: string,
  sessionId: string,
  toolName: string,
  score?: number
): Promise<void> => {
  try {
    console.log(`[Tracking] Tool completed: ${toolName}, session: ${sessionId}, score: ${score || 'N/A'}`);
  } catch (e) {
    console.error('Tracking error:', e);
  }
};

export const trackDownload = async (
  userId: string,
  orgId: string,
  resourceName: string,
  resourceType: 'report' | 'template' = 'report'
): Promise<void> => {
  try {
    console.log(`[Tracking] Download: ${resourceName} (${resourceType}) by ${userId}`);
  } catch (e) {
    console.error('Tracking error:', e);
  }
};

export const trackProfessorSession = async (
  userId: string,
  orgId: string
): Promise<void> => {
  try {
    console.log(`[Tracking] Professor session started by ${userId}`);
  } catch (e) {
    console.error('Tracking error:', e);
  }
};