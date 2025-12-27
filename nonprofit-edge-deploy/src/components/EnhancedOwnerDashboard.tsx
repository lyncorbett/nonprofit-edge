/**
 * THE NONPROFIT EDGE - Enhanced Owner Dashboard
 * 
 * Financial command center with GHL integration
 * - Revenue & MRR tracking
 * - Event registration → platform usage → conversion pipeline
 * - Cross-platform analytics (GHL + Supabase)
 * - At-risk account alerts
 * 
 * GHL Webhook Setup:
 * 1. Create webhooks in GHL Settings → Webhooks
 * 2. Update GHL_CONFIG below with your webhook URLs
 * 3. Create automations in GHL to handle incoming data
 */

import React, { useState } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface EnhancedOwnerDashboardProps {
  user: any;
  supabase?: any;
  onNavigate: (page: string) => void;
}

// ============================================
// GHL WEBHOOK CONFIGURATION
// Update these with your actual GHL webhook URLs
// ============================================
const GHL_CONFIG = {
  eventRegistrationWebhook: 'YOUR_GHL_EVENT_WEBHOOK_URL',
  weeklyReportWebhook: 'YOUR_GHL_REPORT_WEBHOOK_URL',
  newMemberWebhook: 'YOUR_GHL_MEMBER_WEBHOOK_URL',
  churnAlertWebhook: 'YOUR_GHL_CHURN_WEBHOOK_URL',
};

const EnhancedOwnerDashboard: React.FC<EnhancedOwnerDashboardProps> = ({ user, supabase, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'events' | 'pipeline' | 'alerts'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Sample metrics - in production, fetch from Supabase + GHL
  const metrics = {
    financial: { mrr: 14200, mrrChange: 850, arr: 170400, totalRevenue: 47300, expenses: 8900, netProfit: 38400, profitMargin: 81 },
    members: { total: 147, essential: 52, professional: 73, premium: 22, foundingMembers: 89, newThisMonth: 14, churnedThisMonth: 4, churnRate: 2.7 },
    platform: { activeUsers: 89, toolUsage: { boardAssessment: 34, strategicPlan: 28, scenarioPlanner: 19, grantReview: 23, ceoEvaluation: 12, templates: 156 }, professorSessions: 234, downloads: 567 },
    events: { totalRegistrations: 97, totalAttendees: 71, attendanceRate: 73, postEventEngagement: 56, registrationToTrial: 23, trialToConversion: 15 },
    ghl: { totalContacts: 3420, newLeadsThisMonth: 234, emailOpenRate: 42, emailClickRate: 8.5, automationsTriggered: 1205 }
  };

  const revenueByTier = [
    { tier: 'Essential', members: 52, rate: 79, mrr: 4108, percent: 29 },
    { tier: 'Professional', members: 73, rate: 159, mrr: 11607, percent: 52 },
    { tier: 'Premium', members: 22, rate: 329, mrr: 7238, percent: 19 }
  ];

  const eventPerformance = [
    { name: 'Board Engagement Workshop', registrations: 47, attendees: 32, platformSignups: 12, conversions: 5, revenue: 2845 },
    { name: 'Strategic Planning Masterclass', registrations: 31, attendees: 24, platformSignups: 8, conversions: 7, revenue: 3983 },
    { name: 'CEO Evaluation Best Practices', registrations: 19, attendees: 15, platformSignups: 3, conversions: 3, revenue: 1707 }
  ];

  const atRiskAccounts = [
    { org: 'Harbor Community Center', email: 'director@harborcommunity.org', tier: 'Professional', lastActive: 16, renewalIn: 12, mrr: 159 },
    { org: 'Youth Futures Foundation', email: 'ceo@youthfutures.org', tier: 'Essential', lastActive: 18, renewalIn: 8, mrr: 79 },
    { org: 'Green Valley Arts', email: 'admin@greenvalleyarts.org', tier: 'Professional', lastActive: 21, renewalIn: 5, mrr: 159 }
  ];

  const pipelineStages = [
    { stage: 'Event Registration (GHL)', count: 97, percent: 100 },
    { stage: 'Event Attendance', count: 71, percent: 73 },
    { stage: 'Platform Trial Signup', count: 23, percent: 24 },
    { stage: 'Tool Usage (within 7 days)', count: 18, percent: 78 },
    { stage: 'Paid Conversion', count: 15, percent: 65 }
  ];

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;
  const formatPercent = (n: number) => `${n.toFixed(1)}%`;

  // Send data to GHL webhook
  const sendToGHL = async (webhookUrl: string, data: any) => {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('GHL webhook error:', error);
    }
  };

  // Trigger outreach for at-risk account
  const triggerOutreach = async (account: typeof atRiskAccounts[0]) => {
    await sendToGHL(GHL_CONFIG.churnAlertWebhook, {
      email: account.email,
      orgName: account.org,
      tier: account.tier,
      daysInactive: account.lastActive,
      renewalInDays: account.renewalIn,
      mrrAtRisk: account.mrr,
      action: 'trigger_outreach'
    });
    alert(`Outreach triggered for ${account.org}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-300 flex flex-col fixed h-screen overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-300">
          <div className="text-lg font-extrabold" style={{ color: NAVY }}>The Nonprofit Edge</div>
        </div>
        
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>Navigation</div>
          <nav className="space-y-1">
            <a onClick={() => onNavigate('dashboard')} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">← Back to Dashboard</a>
            <a className="block px-4 py-2 text-sm font-semibold cursor-pointer" style={{ color: TEAL, backgroundColor: TEAL_LIGHT }}>Owner Dashboard</a>
            <a onClick={() => onNavigate('marketing')} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer">Marketing Analytics</a>
            <a onClick={() => onNavigate('link-manager')} className="block px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 cursor-pointer">Link Manager</a>
          </nav>
        </div>

        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>Revenue</div>
          <div className="px-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">MRR</span><span className="font-bold text-green-600">{formatCurrency(metrics.financial.mrr)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">ARR</span><span className="font-bold">{formatCurrency(metrics.financial.arr)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Members</span><span className="font-bold">{metrics.members.total}</span></div>
          </div>
        </div>

        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>GHL Status</div>
          <div className="px-4 space-y-2 text-sm">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-gray-600">Connected</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Contacts</span><span className="font-bold">{metrics.ghl.totalContacts.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">New Leads</span><span className="font-bold text-green-600">+{metrics.ghl.newLeadsThisMonth}</span></div>
          </div>
        </div>

        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: TEAL }}>LC</div>
            <div><div className="font-semibold text-gray-800 text-sm">{user?.full_name || 'Lyn Corbett'}</div><div className="text-[10px] text-gray-400">Owner</div></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Owner Dashboard</h1>
            <p className="text-gray-600">Platform health + GHL analytics</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${timeRange === range ? 'text-white' : 'bg-white border border-gray-200 text-gray-600'}`} style={timeRange === range ? { background: NAVY } : {}}>
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {(['overview', 'revenue', 'events', 'pipeline', 'alerts'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
              {tab === 'alerts' ? `Alerts (${atRiskAccounts.length})` : tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{formatCurrency(metrics.financial.mrr)}</p>
                <p className="text-sm text-green-600 mt-1">↑ {formatCurrency(metrics.financial.mrrChange)} this month</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Members</p>
                <p className="text-3xl font-bold" style={{ color: TEAL }}>{metrics.members.total}</p>
                <p className="text-sm text-green-600 mt-1">↑ {metrics.members.newThisMonth} new this month</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Churn Rate</p>
                <p className="text-3xl font-bold" style={{ color: metrics.members.churnRate > 5 ? '#dc2626' : NAVY }}>{formatPercent(metrics.members.churnRate)}</p>
                <p className="text-sm text-gray-500 mt-1">{metrics.members.churnedThisMonth} churned</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Active Users</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{metrics.platform.activeUsers}</p>
                <p className="text-sm text-gray-500 mt-1">{((metrics.platform.activeUsers / metrics.members.total) * 100).toFixed(0)}% of members</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold mb-4" style={{ color: NAVY }}>Revenue by Tier</h3>
                <div className="space-y-4">
                  {revenueByTier.map((tier, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{tier.tier}</span>
                        <span className="text-gray-500">{tier.members} × {formatCurrency(tier.rate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${tier.percent}%`, background: i === 0 ? NAVY : i === 1 ? TEAL : '#7c3aed' }} />
                        </div>
                        <span className="text-sm font-bold w-20 text-right">{formatCurrency(tier.mrr)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <span className="font-bold">Total MRR</span>
                  <span className="font-bold text-green-600">{formatCurrency(metrics.financial.mrr)}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold mb-4" style={{ color: NAVY }}>GoHighLevel Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold" style={{ color: NAVY }}>{metrics.ghl.totalContacts.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Contacts</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">+{metrics.ghl.newLeadsThisMonth}</p>
                    <p className="text-xs text-gray-500">New Leads (30d)</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold" style={{ color: TEAL }}>{metrics.ghl.emailOpenRate}%</p>
                    <p className="text-xs text-gray-500">Email Open Rate</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold" style={{ color: NAVY }}>{metrics.ghl.automationsTriggered.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Automations Run</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold mb-4" style={{ color: NAVY }}>Platform Tool Usage</h3>
              <div className="grid grid-cols-6 gap-4">
                {Object.entries(metrics.platform.toolUsage).map(([tool, count]) => (
                  <div key={tool} className="text-center">
                    <p className="text-2xl font-bold" style={{ color: NAVY }}>{count}</p>
                    <p className="text-xs text-gray-500 capitalize">{tool.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Revenue (YTD)</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(metrics.financial.totalRevenue)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Expenses (YTD)</p>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(metrics.financial.expenses)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Net Profit</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{formatCurrency(metrics.financial.netProfit)}</p>
                <p className="text-sm text-gray-500 mt-1">{metrics.financial.profitMargin}% margin</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold mb-4" style={{ color: NAVY }}>MRR Projections (8% Monthly Growth)</h3>
              <div className="grid grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((month) => {
                  const projected = Math.round(metrics.financial.mrr * Math.pow(1.08, month));
                  return (
                    <div key={month} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">Month +{month}</p>
                      <p className="text-lg font-bold" style={{ color: NAVY }}>{formatCurrency(projected)}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">Projected ARR in 6 months: {formatCurrency(Math.round(metrics.financial.mrr * Math.pow(1.08, 6) * 12))}</p>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Registrations</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{metrics.events.totalRegistrations}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold" style={{ color: TEAL }}>{metrics.events.attendanceRate}%</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Platform Signups</p>
                <p className="text-3xl font-bold text-green-600">{metrics.events.registrationToTrial}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Paid Conversions</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{metrics.events.trialToConversion}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200">
                <h3 className="font-bold" style={{ color: NAVY }}>Event ROI Analysis</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Registrations</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Attendees</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Signups</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eventPerformance.map((event, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium" style={{ color: NAVY }}>{event.name}</td>
                      <td className="px-4 py-3 text-right">{event.registrations}</td>
                      <td className="px-4 py-3 text-right">{event.attendees}</td>
                      <td className="px-4 py-3 text-right">{event.platformSignups}</td>
                      <td className="px-4 py-3 text-right font-semibold" style={{ color: TEAL }}>{event.conversions}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(event.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right">{eventPerformance.reduce((a, e) => a + e.registrations, 0)}</td>
                    <td className="px-4 py-3 text-right">{eventPerformance.reduce((a, e) => a + e.attendees, 0)}</td>
                    <td className="px-4 py-3 text-right">{eventPerformance.reduce((a, e) => a + e.platformSignups, 0)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: TEAL }}>{eventPerformance.reduce((a, e) => a + e.conversions, 0)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatCurrency(eventPerformance.reduce((a, e) => a + e.revenue, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold mb-6" style={{ color: NAVY }}>Event → Conversion Pipeline</h3>
              <p className="text-sm text-gray-500 mb-6">Track how event registrants flow through to paid memberships</p>
              <div className="space-y-4">
                {pipelineStages.map((stage, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium" style={{ color: NAVY }}>{stage.stage}</span>
                      <span className="text-gray-500">{stage.count} ({stage.percent}%)</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${stage.percent}%`, background: `linear-gradient(90deg, ${TEAL}, ${NAVY})` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div><p className="text-2xl font-bold" style={{ color: NAVY }}>15.5%</p><p className="text-xs text-gray-500">Registration → Conversion</p></div>
                <div><p className="text-2xl font-bold" style={{ color: TEAL }}>21.1%</p><p className="text-xs text-gray-500">Attendance → Conversion</p></div>
                <div><p className="text-2xl font-bold text-green-600">65.2%</p><p className="text-xs text-gray-500">Trial → Paid</p></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-blue-800 mb-2">💡 GHL Integration Active</h3>
              <p className="text-sm text-blue-700">Event registrations sync automatically from GoHighLevel. Conversion tracking updates when users sign up through your platform.</p>
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {atRiskAccounts.length > 0 ? (
              <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                <div className="px-5 py-3 bg-red-50 border-b border-red-200">
                  <h3 className="font-bold text-red-800">⚠️ At-Risk Accounts ({atRiskAccounts.length})</h3>
                  <p className="text-sm text-red-600">Members inactive 14+ days with upcoming renewal</p>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organization</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tier</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Days Inactive</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Renewal In</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">MRR at Risk</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {atRiskAccounts.map((account, i) => (
                      <tr key={i} className="hover:bg-red-50">
                        <td className="px-4 py-3">
                          <div className="font-medium" style={{ color: NAVY }}>{account.org}</div>
                          <div className="text-xs text-gray-500">{account.email}</div>
                        </td>
                        <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">{account.tier}</span></td>
                        <td className="px-4 py-3 text-right"><span className="text-red-600 font-semibold">{account.lastActive} days</span></td>
                        <td className="px-4 py-3 text-right"><span className="text-amber-600 font-semibold">{account.renewalIn} days</span></td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(account.mrr)}/mo</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => triggerOutreach(account)} className="px-3 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90" style={{ background: TEAL }}>
                            Send Outreach
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-3 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Total MRR at Risk:</strong> {formatCurrency(atRiskAccounts.reduce((a, acc) => a + acc.mrr, 0))}/month
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <span className="text-4xl">🎉</span>
                <h3 className="font-bold text-green-800 mt-2">All Clear!</h3>
                <p className="text-sm text-green-600">No at-risk accounts detected. Great job on member engagement!</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold mb-4" style={{ color: NAVY }}>Alert Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Inactivity Threshold</p>
                    <p className="text-sm text-gray-500">Flag accounts inactive for more than X days</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>7 days</option>
                    <option selected>14 days</option>
                    <option>21 days</option>
                    <option>30 days</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Renewal Window</p>
                    <p className="text-sm text-gray-500">Alert when renewal is within X days</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option selected>30 days</option>
                    <option>60 days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedOwnerDashboard;
