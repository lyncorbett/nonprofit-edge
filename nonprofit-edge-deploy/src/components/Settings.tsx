'use client';

import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield, LogOut, ChevronRight, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#0D2C54] mb-2">Settings</h1>
        <p className="text-slate-500 mb-8">Manage your account preferences</p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
                { id: 'security', label: 'Security', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium border-b border-slate-100 last:border-0 transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#0097A9]/5 text-[#0097A9] border-l-2 border-l-[#0097A9]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <button className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-[#0D2C54] mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0D2C54] to-[#164677] text-white flex items-center justify-center text-2xl font-bold">
                    L
                  </div>
                  <div>
                    <button className="text-sm font-medium text-[#0097A9] hover:underline">
                      Change photo
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        defaultValue="Lyn"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Corbett"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="lyn@pivotalgroupconsultants.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
                    <input
                      type="text"
                      defaultValue="The Pivotal Group"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0097A9]">
                      <option>Executive Director / CEO</option>
                      <option>Senior Leader</option>
                      <option>Manager</option>
                      <option>Board Member</option>
                      <option>Consultant</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button className="bg-[#0097A9] hover:bg-[#007A8A] text-white font-semibold px-6 py-2.5 rounded-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-[#0D2C54] mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'Weekly insights email', description: 'Get a summary of new content and tips', default: true },
                    { label: 'Event reminders', description: 'Reminders for upcoming webinars and sessions', default: true },
                    { label: 'New resource alerts', description: 'When new tools or templates are added', default: false },
                    { label: 'Product updates', description: 'Platform improvements and new features', default: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="font-medium text-slate-700">{item.label}</div>
                        <div className="text-sm text-slate-500">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0097A9]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-[#0D2C54] mb-6">Billing & Plan</h2>
                
                <div className="bg-gradient-to-br from-[#0097A9] to-[#00b4cc] rounded-xl p-6 text-white mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Current Plan</div>
                      <div className="text-2xl font-bold">Professional</div>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      Active
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold">$197</span>
                    <span className="opacity-80">/month</span>
                  </div>
                  <div className="text-sm opacity-80">Next billing date: February 24, 2026</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="w-5 h-5 text-[#0097A9]" />
                    <span>25 downloads per month</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="w-5 h-5 text-[#0097A9]" />
                    <span>All assessment tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="w-5 h-5 text-[#0097A9]" />
                    <span>Ask the Professor (unlimited)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="w-5 h-5 text-[#0097A9]" />
                    <span>Template library access</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="text-sm font-medium text-[#0097A9] hover:underline">
                    Upgrade Plan
                  </button>
                  <span className="text-slate-300">|</span>
                  <button className="text-sm font-medium text-slate-500 hover:underline">
                    Manage Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-[#0D2C54] mb-6">Security</h2>
                
                <div className="space-y-6">
                  <div className="pb-6 border-b border-slate-100">
                    <h3 className="font-medium text-slate-700 mb-1">Change Password</h3>
                    <p className="text-sm text-slate-500 mb-4">Update your password regularly for security</p>
                    <button className="text-sm font-medium text-[#0097A9] hover:underline flex items-center gap-1">
                      Change Password <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pb-6 border-b border-slate-100">
                    <h3 className="font-medium text-slate-700 mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account</p>
                    <button className="text-sm font-medium text-[#0097A9] hover:underline flex items-center gap-1">
                      Enable 2FA <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-700 mb-1">Active Sessions</h3>
                    <p className="text-sm text-slate-500 mb-4">Manage devices where you're logged in</p>
                    <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-700">Current Device</div>
                        <div className="text-sm text-slate-500">Chrome on macOS • San Diego, CA</div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Active Now
                      </span>
                    </div>
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
