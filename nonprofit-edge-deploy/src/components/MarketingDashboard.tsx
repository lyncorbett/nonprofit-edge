/**
 * THE NONPROFIT EDGE - Marketing Analytics Dashboard
 * 
 * Embeds third-party analytics (Databox, AgencyAnalytics, etc.)
 * Plus custom tracking for GHL events and conversions
 * 
 * Tracks: Facebook/Instagram Ads, LinkedIn Ads, YouTube/Google Ads
 */

import React, { useState } from 'react';

// Brand colors
const NAVY = '#1a365d';
const TEAL = '#00a0b0';
const TEAL_LIGHT = '#e6f7f9';

interface MarketingDashboardProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface CampaignMetric {
  platform: string;
  campaign: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpc: number;
  cpa: number;
  roas: number;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  user,
  onNavigate,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'attribution' | 'settings'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedProvider, setEmbedProvider] = useState<'custom' | 'databox' | 'agencyAnalytics'>('custom');

  const adPlatforms = [
    { name: 'Meta (Facebook/Instagram)', icon: '📘', color: '#1877F2', isConnected: false },
    { name: 'LinkedIn Ads', icon: '💼', color: '#0A66C2', isConnected: false },
    { name: 'Google Ads (YouTube)', icon: '🎬', color: '#EA4335', isConnected: false },
    { name: 'GoHighLevel', icon: '🚀', color: '#10B981', isConnected: true }
  ];

  // Sample campaign data
  const sampleCampaigns: CampaignMetric[] = [
    { platform: 'Meta', campaign: 'Board Assessment - Awareness', spend: 1250, impressions: 45000, clicks: 890, ctr: 1.98, conversions: 23, cpc: 1.40, cpa: 54.35, roas: 2.8 },
    { platform: 'Meta', campaign: 'Strategic Planning - Retargeting', spend: 850, impressions: 12000, clicks: 420, ctr: 3.5, conversions: 18, cpc: 2.02, cpa: 47.22, roas: 3.4 },
    { platform: 'LinkedIn', campaign: 'Nonprofit Leaders - Decision Makers', spend: 2100, impressions: 28000, clicks: 310, ctr: 1.11, conversions: 12, cpc: 6.77, cpa: 175.00, roas: 1.9 },
    { platform: 'Google', campaign: 'YouTube - Ask the Professor Demo', spend: 680, impressions: 52000, clicks: 1240, ctr: 2.38, conversions: 8, cpc: 0.55, cpa: 85.00, roas: 2.1 }
  ];

  const formatCurrency = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (n: number) => n.toLocaleString();
  const formatPercent = (n: number) => `${n.toFixed(2)}%`;

  const totals = sampleCampaigns.reduce((acc, c) => ({
    spend: acc.spend + c.spend,
    impressions: acc.impressions + c.impressions,
    clicks: acc.clicks + c.clicks,
    conversions: acc.conversions + c.conversions
  }), { spend: 0, impressions: 0, clicks: 0, conversions: 0 });

  const avgCPA = totals.spend / totals.conversions;
  const overallCTR = (totals.clicks / totals.impressions) * 100;

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
            <a onClick={() => onNavigate('owner-dashboard')} className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer">Owner Dashboard</a>
            <a className="block px-4 py-2 text-sm font-semibold cursor-pointer" style={{ color: TEAL, backgroundColor: TEAL_LIGHT }}>Marketing Analytics</a>
            <a onClick={() => onNavigate('link-manager')} className="block px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 cursor-pointer">Link Manager</a>
          </nav>
        </div>

        <div className="py-4 border-t border-gray-300">
          <div className="px-4 mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: NAVY }}>Ad Platforms</div>
          <div className="px-4 space-y-2">
            {adPlatforms.map((platform, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{platform.icon}</span>
                <span className={platform.isConnected ? 'text-gray-700' : 'text-gray-400'}>{platform.name.split(' ')[0]}</span>
                <span className={`ml-auto w-2 h-2 rounded-full ${platform.isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: `linear-gradient(135deg, ${TEAL}, #008090)` }}>LC</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">{user?.full_name || 'Lyn Corbett'}</div>
              <div className="text-[10px] text-gray-400">Owner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Marketing Analytics</h1>
            <p className="text-gray-600">Track ad performance across all platforms</p>
          </div>
          
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${dateRange === range ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                style={dateRange === range ? { background: NAVY } : {}}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {(['overview', 'campaigns', 'attribution', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Ad Spend</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{formatCurrency(totals.spend)}</p>
                <p className="text-sm text-gray-400 mt-1">This period</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Conversions</p>
                <p className="text-3xl font-bold" style={{ color: TEAL }}>{totals.conversions}</p>
                <p className="text-sm text-gray-400 mt-1">Signups + Trials</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Avg. Cost per Acquisition</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{formatCurrency(avgCPA)}</p>
                <p className="text-sm text-gray-400 mt-1">Target: $75</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Click-Through Rate</p>
                <p className="text-3xl font-bold" style={{ color: NAVY }}>{formatPercent(overallCTR)}</p>
                <p className="text-sm text-gray-400 mt-1">Industry avg: 1.5%</p>
              </div>
            </div>

            {embedProvider !== 'custom' && embedUrl ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-bold" style={{ color: NAVY }}>{embedProvider === 'databox' ? 'Databox' : 'AgencyAnalytics'} Dashboard</h2>
                  <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline" style={{ color: TEAL }}>Open Full Dashboard →</a>
                </div>
                <iframe src={embedUrl} className="w-full h-[600px] border-0" title="Marketing Analytics" />
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-200">
                    <h2 className="font-bold" style={{ color: NAVY }}>Performance by Platform</h2>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-4">
                    {[
                      { name: 'Meta (FB/IG)', icon: '📘', spend: 2100, conversions: 41, color: '#1877F2' },
                      { name: 'LinkedIn', icon: '💼', spend: 2100, conversions: 12, color: '#0A66C2' },
                      { name: 'Google/YouTube', icon: '🎬', spend: 680, conversions: 8, color: '#EA4335' }
                    ].map((p, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{p.icon}</span>
                          <span className="font-semibold" style={{ color: NAVY }}>{p.name}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Spend</span><span className="font-semibold">{formatCurrency(p.spend)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Conversions</span><span className="font-semibold">{p.conversions}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">CPA</span><span className="font-semibold">{formatCurrency(p.spend / p.conversions)}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-amber-800 mb-2">🚀 Ready to Connect Your Ad Platforms?</h3>
                  <p className="text-amber-700 text-sm mb-4">Connect your ad accounts in the Settings tab to see real-time data.</p>
                  <div className="space-y-2 text-sm text-amber-700">
                    <p><strong>1.</strong> Sign up for <a href="https://databox.com" target="_blank" rel="noopener noreferrer" className="underline">Databox</a> or <a href="https://agencyanalytics.com" target="_blank" rel="noopener noreferrer" className="underline">AgencyAnalytics</a></p>
                    <p><strong>2.</strong> Connect Meta, LinkedIn, Google Ads</p>
                    <p><strong>3.</strong> Paste your embed URL in Settings</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200">
              <h2 className="font-bold" style={{ color: NAVY }}>All Campaigns</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Platform', 'Campaign', 'Spend', 'Impressions', 'Clicks', 'CTR', 'Conversions', 'CPA', 'ROAS'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sampleCampaigns.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${c.platform === 'Meta' ? 'bg-blue-100 text-blue-700' : c.platform === 'LinkedIn' ? 'bg-sky-100 text-sky-700' : 'bg-red-100 text-red-700'}`}>{c.platform}</span></td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: NAVY }}>{c.campaign}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(c.spend)}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatNumber(c.impressions)}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatNumber(c.clicks)}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatPercent(c.ctr)}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold" style={{ color: TEAL }}>{c.conversions}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(c.cpa)}</td>
                      <td className="px-4 py-3 text-sm text-right"><span className={`font-semibold ${c.roas >= 2.5 ? 'text-green-600' : c.roas >= 1.5 ? 'text-amber-600' : 'text-red-600'}`}>{c.roas.toFixed(1)}x</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attribution' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ color: NAVY }}>Conversion Funnel</h2>
              <div className="space-y-4">
                {[
                  { stage: 'Ad Impression', count: 137000, percent: 100 },
                  { stage: 'Ad Click', count: 2860, percent: 2.1 },
                  { stage: 'Landing Page Visit', count: 2450, percent: 1.8 },
                  { stage: 'Free Trial Signup', count: 61, percent: 0.04 },
                  { stage: 'Paid Conversion', count: 23, percent: 0.02 }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium" style={{ color: NAVY }}>{s.stage}</span>
                      <span className="text-gray-500">{formatNumber(s.count)} ({s.percent}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.max(s.percent, 1)}%`, background: `linear-gradient(90deg, ${TEAL}, ${NAVY})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ color: NAVY }}>Revenue by Channel</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { channel: 'Meta Ads', revenue: 6970, percent: 57, color: '#1877F2' },
                  { channel: 'LinkedIn Ads', revenue: 3420, percent: 28, color: '#0A66C2' },
                  { channel: 'Google/YouTube', revenue: 1840, percent: 15, color: '#EA4335' }
                ].map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: NAVY }}>{c.channel}</span>
                      <span className="text-sm text-gray-500">{c.percent}%</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: c.color }}>{formatCurrency(c.revenue)}</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.percent}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ color: NAVY }}>Dashboard Embed Settings</h2>
              <p className="text-gray-600 mb-6">Connect your analytics dashboard to display real-time metrics.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Embed Provider</label>
                  <select 
                    value={embedProvider}
                    onChange={(e) => setEmbedProvider(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="custom">Custom (Sample Data)</option>
                    <option value="databox">Databox</option>
                    <option value="agencyAnalytics">AgencyAnalytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Embed URL</label>
                  <input 
                    type="text"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://app.databox.com/datawall/share/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Get this from your Databox or AgencyAnalytics sharing settings</p>
                </div>

                <button className="px-6 py-2 rounded-lg font-semibold text-white" style={{ background: TEAL }}>
                  Save Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ color: NAVY }}>Connected Ad Platforms</h2>
              <div className="space-y-3">
                {adPlatforms.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <button className={`px-4 py-1.5 rounded-lg text-sm font-medium ${p.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                      {p.isConnected ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Connections managed through Databox/AgencyAnalytics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingDashboard;
