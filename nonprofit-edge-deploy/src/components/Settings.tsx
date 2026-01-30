'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Bell, CreditCard, Shield, Check, 
  Eye, EyeOff, Smartphone, Mail, LogOut,
  ArrowLeft
} from 'lucide-react';

interface SettingsProps {
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    phone: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    toolReminders: true,
    newResources: true,
    eventReminders: true,
    productUpdates: false,
  });

  // Security / 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'app' | 'sms' | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  
  // Password change
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Load saved data
  useEffect(() => {
    const savedUser = localStorage.getItem('nonprofit_edge_user');
    const savedSettings = localStorage.getItem('nonprofit_edge_settings');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setProfile({
        name: user.name || user.full_name || '',
        email: user.email || '',
        organization: 'Your Organization',
        role: user.role || 'member',
        phone: user.phone || '',
      });
    }
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.notifications) setNotifications(settings.notifications);
      if (settings.twoFactorEnabled) setTwoFactorEnabled(settings.twoFactorEnabled);
    }
  }, []);

  // Save settings
  const saveSettings = () => {
    const settings = {
      notifications,
      twoFactorEnabled,
    };
    localStorage.setItem('nonprofit_edge_settings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  // Handle 2FA setup
  const startTwoFactorSetup = (method: 'app' | 'sms') => {
    setTwoFactorMethod(method);
    setTwoFactorStep(2);
  };

  const verifyTwoFactor = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setTwoFactorStep(1);
      setVerificationCode('');
      
      const settings = JSON.parse(localStorage.getItem('nonprofit_edge_settings') || '{}');
      settings.twoFactorEnabled = true;
      settings.twoFactorMethod = twoFactorMethod;
      localStorage.setItem('nonprofit_edge_settings', JSON.stringify(settings));
      
      alert('Two-factor authentication enabled!');
    } else {
      alert('Please enter a valid 6-digit code');
    }
  };

  const disableTwoFactor = () => {
    if (confirm('Are you sure you want to disable two-factor authentication?')) {
      setTwoFactorEnabled(false);
      const settings = JSON.parse(localStorage.getItem('nonprofit_edge_settings') || '{}');
      settings.twoFactorEnabled = false;
      localStorage.setItem('nonprofit_edge_settings', JSON.stringify(settings));
    }
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    alert('Password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const navigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              color: '#475569',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
            Settings
          </h1>
        </div>
        
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#fee2e2',
              border: 'none',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        )}
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px',
          flexWrap: 'wrap',
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: isActive ? '#0D2C54' : 'white',
                  color: isActive ? 'white' : '#64748b',
                  border: isActive ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '32px',
        }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '24px' }}>
                Profile Information
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Organization
                  </label>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Phone Number (for 2FA)
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              
              <button
                onClick={saveSettings}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#0097A9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '24px' }}>
                Email Preferences
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Get a summary of your activity and new resources' },
                  { key: 'toolReminders', label: 'Tool Completion Reminders', desc: 'Reminders to complete assessments you started' },
                  { key: 'newResources', label: 'New Resources', desc: 'Be notified when new templates and guides are added' },
                  { key: 'eventReminders', label: 'Event Reminders', desc: 'Upcoming webinars and live sessions' },
                  { key: 'productUpdates', label: 'Product Updates', desc: 'New features and platform improvements' },
                ].map((item) => (
                  <div 
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications({ 
                        ...notifications, 
                        [item.key]: !notifications[item.key as keyof typeof notifications] 
                      })}
                      style={{
                        width: '48px',
                        height: '28px',
                        borderRadius: '14px',
                        border: 'none',
                        background: notifications[item.key as keyof typeof notifications] ? '#0097A9' : '#cbd5e1',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '3px',
                        left: notifications[item.key as keyof typeof notifications] ? '23px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={saveSettings}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#0097A9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '24px' }}>
                Your Plan
              </h2>
              
              <div style={{
                background: 'linear-gradient(135deg, #0D2C54 0%, #1e4976 100%)',
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Current Plan</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Professional</div>
                <div style={{ fontSize: '16px', opacity: 0.9 }}>$197/month</div>
                
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['All Assessment Tools', 'Unlimited Downloads', '10 Professor Sessions/mo', 'Priority Support'].map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <Check size={14} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  style={{
                    padding: '12px 24px',
                    background: '#0097A9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Upgrade to Premium
                </button>
                <button
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Manage Payment Method
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54', marginBottom: '24px' }}>
                Security Settings
              </h2>
              
              {/* Two-Factor Authentication */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: twoFactorEnabled ? '2px solid #10b981' : '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <Shield size={20} color={twoFactorEnabled ? '#10b981' : '#64748b'} />
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                        Two-Factor Authentication
                      </span>
                      {twoFactorEnabled && (
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}>
                          Enabled
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Add an extra layer of security by requiring a verification code when you sign in.
                    </p>
                  </div>
                </div>

                {!twoFactorEnabled && !showTwoFactorSetup && (
                  <button
                    onClick={() => setShowTwoFactorSetup(true)}
                    style={{
                      padding: '10px 20px',
                      background: '#0D2C54',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Enable Two-Factor Authentication
                  </button>
                )}

                {twoFactorEnabled && (
                  <button
                    onClick={disableTwoFactor}
                    style={{
                      padding: '10px 20px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Disable Two-Factor Authentication
                  </button>
                )}

                {/* 2FA Setup Flow */}
                {showTwoFactorSetup && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    {twoFactorStep === 1 && (
                      <>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
                          Choose your verification method:
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => startTwoFactorSetup('app')}
                            style={{
                              flex: '1 1 200px',
                              padding: '16px',
                              background: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <Smartphone size={24} color="#0097A9" />
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '8px' }}>
                              Authenticator App
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                              Use Google Authenticator, Authy, or similar
                            </div>
                          </button>
                          <button
                            onClick={() => startTwoFactorSetup('sms')}
                            style={{
                              flex: '1 1 200px',
                              padding: '16px',
                              background: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <Mail size={24} color="#0097A9" />
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '8px' }}>
                              SMS / Text Message
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                              Receive codes via text message
                            </div>
                          </button>
                        </div>
                        <button
                          onClick={() => setShowTwoFactorSetup(false)}
                          style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {twoFactorStep === 2 && (
                      <>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
                          {twoFactorMethod === 'app' ? 'Scan QR Code with your authenticator app' : 'Enter the code sent to your phone'}
                        </h4>
                        
                        {twoFactorMethod === 'app' && (
                          <div style={{
                            width: '160px',
                            height: '160px',
                            background: '#e2e8f0',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                            fontSize: '12px',
                            color: '#64748b',
                          }}>
                            [QR Code]
                          </div>
                        )}
                        
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                            Enter 6-digit verification code
                          </label>
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength={6}
                            style={{
                              width: '200px',
                              padding: '12px 16px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '20px',
                              letterSpacing: '8px',
                              textAlign: 'center',
                            }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            onClick={verifyTwoFactor}
                            style={{
                              padding: '10px 20px',
                              background: '#0097A9',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            Verify & Enable
                          </button>
                          <button
                            onClick={() => { setTwoFactorStep(1); setVerificationCode(''); }}
                            style={{
                              padding: '10px 20px',
                              background: 'white',
                              color: '#64748b',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px',
                              cursor: 'pointer',
                            }}
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
                  Change Password
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                        }}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={handlePasswordChange}
                    style={{
                      padding: '12px 24px',
                      background: '#0D2C54',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: 'fit-content',
                    }}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
