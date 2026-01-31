'use client';

import React, { useState } from 'react';
import { 
  User, Bell, Lock, CreditCard, Users, Building2,
  ChevronRight, Save, Camera, ArrowLeft
} from 'lucide-react';

interface SettingsProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'organization', label: 'Organization', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('dashboard')}
              className="hover:opacity-80 transition-opacity"
            >
              <svg width="160" height="45" viewBox="0 0 500 140" fill="none"><g transform="translate(0, 10)"><path d="M60 10 A50 50 0 1 1 20 70" stroke="#0D2C54" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M15 45 L45 70 L75 35" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M45 70 L45 25" stroke="#0097A9" strokeWidth="8" fill="none" strokeLinecap="round"/></g><text x="115" y="42" fontFamily="system-ui" fontSize="28" fontWeight="700" fill="#0D2C54">THE</text><text x="115" y="78" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0097A9">NONPROFIT</text><text x="115" y="115" fontFamily="system-ui" fontSize="32" fontWeight="800" fill="#0D2C54">EDGE</text></svg>
            </button>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-bold text-[#0D2C54]">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-[#0097A9] font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-[#0097A9] text-white rounded-lg font-medium hover:bg-[#007f8f] transition-colors"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#0097A9]/10 text-[#0097A9] border-l-3 border-[#0097A9]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-[#0D2C54] mb-6">Profile Settings</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D2C54] to-[#164677] flex items-center justify-center text-white text-3xl font-bold">
                      L
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0097A9] rounded-full flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0D2C54]">Profile Photo</h3>
                    <p className="text-sm text-slate-500">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Lyn"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue=""
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="lyn@thepivotalgroup.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title / Role</label>
                    <input
                      type="text"
                      defaultValue="President"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-[#0D2C54] mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new content', checked: true },
                    { label: 'Weekly digest of platform updates', checked: true },
                    { label: 'Event reminders', checked: true },
                    { label: 'Tool completion summaries', checked: false },
                    { label: 'Team activity updates', checked: false },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-slate-700">{item.label}</span>
                      <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5 text-[#0097A9]" />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-[#0D2C54] mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-[#0D2C54] mb-6">Billing & Subscription</h2>
                <div className="p-4 bg-gradient-to-r from-[#0097A9] to-[#00b4cc] rounded-xl text-white mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-80">Current Plan</p>
                      <p className="text-2xl font-bold">Professional</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">Next billing</p>
                      <p className="font-semibold">Feb 24, 2026</p>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-[#0097A9] text-[#0097A9] rounded-lg font-semibold hover:bg-[#0097A9]/10 transition-colors">
                  Manage Subscription
                </button>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-[#0D2C54] mb-6">Team Members</h2>
                <p className="text-slate-500 mb-4">Manage who has access to your organization's account.</p>
                <button className="px-4 py-2 bg-[#0097A9] text-white rounded-lg font-medium">
                  + Invite Team Member
                </button>
              </div>
            )}

            {activeTab === 'organization' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-[#0D2C54] mb-6">Organization Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="The Pivotal Group"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Organization Type</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]">
                      <option>Nonprofit Consulting</option>
                      <option>501(c)(3) Nonprofit</option>
                      <option>Foundation</option>
                      <option>Government</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
