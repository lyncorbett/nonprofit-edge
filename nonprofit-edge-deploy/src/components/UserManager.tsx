/**
 * THE NONPROFIT EDGE - User Manager
 * Owner-only page to add users, admins, and manage access
 * No Supabase or code required!
 */

import React, { useState, useEffect } from 'react';

const COLORS = {
  navy: '#0D2C54',
  navyLight: '#1a4175',
  teal: '#0097A9',
  tealDark: '#007d8c',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
  red500: '#ef4444',
  green500: '#22c55e',
  amber500: '#f59e0b',
};

interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin' | 'owner';
  organization?: string;
  tier?: string;
  status: 'active' | 'invited' | 'suspended';
  created_at: string;
  last_login?: string;
}

interface UserManagerProps {
  supabase?: any;
  onNavigate?: (path: string) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ supabase, onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'admins' | 'invites'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New user form
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'member' as 'member' | 'admin' | 'owner',
    organization: '',
    tier: 'professional',
    sendInvite: true,
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [supabase]);

  const fetchUsers = async () => {
    setLoading(true);
    
    if (supabase) {
      try {
        // Fetch regular users from profiles or organizations
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (userData) {
          setUsers(userData.map((u: any) => ({
            id: u.id,
            email: u.email,
            name: u.full_name || u.email?.split('@')[0] || 'Unknown',
            role: 'member',
            organization: u.organization_name,
            tier: u.tier || 'professional',
            status: 'active',
            created_at: u.created_at,
            last_login: u.last_login,
          })));
        }

        // Fetch platform admins
        const { data: adminData, error: adminError } = await supabase
          .from('platform_admins')
          .select('*')
          .order('created_at', { ascending: false });

        if (adminData) {
          setAdmins(adminData.map((a: any) => ({
            id: a.id,
            email: a.email,
            name: a.name || a.email?.split('@')[0] || 'Unknown',
            role: a.role || 'admin',
            status: 'active',
            created_at: a.created_at,
          })));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    } else {
      // Demo data when no Supabase
      setUsers([
        { id: '1', email: 'john@nonprofit.org', name: 'John Smith', role: 'member', organization: 'Hope Foundation', tier: 'professional', status: 'active', created_at: '2024-01-15' },
        { id: '2', email: 'sarah@charity.org', name: 'Sarah Johnson', role: 'member', organization: 'Community Care', tier: 'essential', status: 'active', created_at: '2024-02-20' },
        { id: '3', email: 'mike@foundation.org', name: 'Mike Brown', role: 'member', organization: 'Youth Services', tier: 'premium', status: 'invited', created_at: '2024-03-01' },
      ]);
      setAdmins([
        { id: 'a1', email: 'lyn@thepivotalgroup.com', name: 'Lyn Corbett', role: 'owner', status: 'active', created_at: '2024-01-01' },
      ]);
    }
    
    setLoading(false);
  };

  const handleAddUser = async () => {
    if (!newUser.email) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    setLoading(true);

    if (supabase) {
      try {
        if (newUser.role === 'admin' || newUser.role === 'owner') {
          // Add to platform_admins table
          const { error } = await supabase.from('platform_admins').insert({
            email: newUser.email.toLowerCase(),
            name: newUser.name,
            role: newUser.role,
          });
          
          if (error) throw error;
          
          setMessage({ type: 'success', text: `${newUser.role === 'owner' ? 'Owner' : 'Admin'} added successfully!` });
        } else {
          // Add regular user - create profile
          const { error } = await supabase.from('profiles').insert({
            email: newUser.email.toLowerCase(),
            full_name: newUser.name,
            organization_name: newUser.organization,
            tier: newUser.tier,
          });
          
          if (error) throw error;

          // Optionally send invite email via Supabase Auth
          if (newUser.sendInvite) {
            await supabase.auth.admin.inviteUserByEmail(newUser.email);
          }
          
          setMessage({ type: 'success', text: 'User added successfully!' });
        }

        // Reset form and refresh
        setNewUser({ email: '', name: '', role: 'member', organization: '', tier: 'professional', sendInvite: true });
        setShowAddModal(false);
        fetchUsers();
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to add user' });
      }
    } else {
      // Demo mode - just add to local state
      const newId = Date.now().toString();
      if (newUser.role === 'admin' || newUser.role === 'owner') {
        setAdmins(prev => [...prev, {
          id: newId,
          email: newUser.email,
          name: newUser.name || newUser.email.split('@')[0],
          role: newUser.role,
          status: 'active',
          created_at: new Date().toISOString(),
        }]);
      } else {
        setUsers(prev => [...prev, {
          id: newId,
          email: newUser.email,
          name: newUser.name || newUser.email.split('@')[0],
          role: 'member',
          organization: newUser.organization,
          tier: newUser.tier,
          status: newUser.sendInvite ? 'invited' : 'active',
          created_at: new Date().toISOString(),
        }]);
      }
      setMessage({ type: 'success', text: 'User added (demo mode)' });
      setNewUser({ email: '', name: '', role: 'member', organization: '', tier: 'professional', sendInvite: true });
      setShowAddModal(false);
    }

    setLoading(false);
  };

  const handleDeleteUser = async (user: User, isAdmin: boolean) => {
    if (!confirm(`Are you sure you want to remove ${user.email}?`)) return;

    if (supabase) {
      try {
        if (isAdmin) {
          await supabase.from('platform_admins').delete().eq('id', user.id);
        } else {
          await supabase.from('profiles').delete().eq('id', user.id);
        }
        setMessage({ type: 'success', text: 'User removed successfully' });
        fetchUsers();
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to remove user' });
      }
    } else {
      // Demo mode
      if (isAdmin) {
        setAdmins(prev => prev.filter(a => a.id !== user.id));
      } else {
        setUsers(prev => prev.filter(u => u.id !== user.id));
      }
      setMessage({ type: 'success', text: 'User removed (demo mode)' });
    }
  };

  const handleUpdateRole = async (user: User, newRole: string) => {
    if (supabase) {
      try {
        await supabase.from('platform_admins').update({ role: newRole }).eq('id', user.id);
        setMessage({ type: 'success', text: 'Role updated successfully' });
        fetchUsers();
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to update role' });
      }
    } else {
      setAdmins(prev => prev.map(a => a.id === user.id ? { ...a, role: newRole as any } : a));
      setMessage({ type: 'success', text: 'Role updated (demo mode)' });
    }
  };

  const handleUpdateTier = async (user: User, newTier: string) => {
    if (supabase) {
      try {
        await supabase.from('profiles').update({ tier: newTier }).eq('id', user.id);
        setMessage({ type: 'success', text: 'Tier updated successfully' });
        fetchUsers();
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to update tier' });
      }
    } else {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, tier: newTier } : u));
      setMessage({ type: 'success', text: 'Tier updated (demo mode)' });
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmins = admins.filter(a =>
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
            ← 
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: COLORS.navy, margin: 0 }}>User Manager</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px', background: COLORS.teal, color: COLORS.white,
            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span> Add User
        </button>
      </header>

      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'fixed', top: '80px', right: '32px', padding: '16px 24px',
          background: message.type === 'success' ? COLORS.green500 : COLORS.red500,
          color: COLORS.white, borderRadius: '8px', fontWeight: 500, zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={{ marginLeft: '16px', background: 'none', border: 'none', color: COLORS.white, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Users', value: users.length, color: COLORS.navy },
            { label: 'Active', value: users.filter(u => u.status === 'active').length, color: COLORS.green500 },
            { label: 'Invited', value: users.filter(u => u.status === 'invited').length, color: COLORS.amber500 },
            { label: 'Admins', value: admins.length, color: COLORS.teal },
          ].map((stat, i) => (
            <div key={i} style={{ background: COLORS.white, padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.gray200}` }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: COLORS.gray500, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'users', label: `Members (${users.length})` },
              { key: 'admins', label: `Admins (${admins.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                  background: activeTab === tab.key ? COLORS.navy : COLORS.gray100,
                  color: activeTab === tab.key ? COLORS.white : COLORS.gray600,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or organization..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px', border: `1px solid ${COLORS.gray200}`, borderRadius: '8px',
              width: '300px', fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div style={{ background: COLORS.white, borderRadius: '12px', border: `1px solid ${COLORS.gray200}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.gray50 }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Organization</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Tier</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Joined</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.gray500 }}>Loading...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.gray500 }}>No users found</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', background: COLORS.navy,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 600
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: COLORS.gray900 }}>{user.name}</div>
                            <div style={{ fontSize: '13px', color: COLORS.gray500 }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: COLORS.gray700 }}>{user.organization || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <select
                          value={user.tier}
                          onChange={e => handleUpdateTier(user, e.target.value)}
                          style={{
                            padding: '6px 10px', border: `1px solid ${COLORS.gray200}`, borderRadius: '6px',
                            fontSize: '13px', cursor: 'pointer', background: COLORS.white
                          }}
                        >
                          <option value="essential">Essential</option>
                          <option value="professional">Professional</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                          background: user.status === 'active' ? '#dcfce7' : user.status === 'invited' ? '#fef3c7' : '#fee2e2',
                          color: user.status === 'active' ? '#16a34a' : user.status === 'invited' ? '#d97706' : '#dc2626',
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: COLORS.gray500, fontSize: '13px' }}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteUser(user, false)}
                          style={{
                            padding: '6px 12px', background: COLORS.red500, color: COLORS.white,
                            border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Admins Table */}
        {activeTab === 'admins' && (
          <div style={{ background: COLORS.white, borderRadius: '12px', border: `1px solid ${COLORS.gray200}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.gray50 }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Admin</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Added</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: COLORS.gray500 }}>Loading...</td></tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: COLORS.gray500 }}>No admins found</td></tr>
                ) : (
                  filteredAdmins.map(admin => (
                    <tr key={admin.id} style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: admin.role === 'owner' ? COLORS.amber500 : COLORS.teal,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 600
                          }}>
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: COLORS.gray900 }}>{admin.name}</div>
                            <div style={{ fontSize: '13px', color: COLORS.gray500 }}>{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <select
                          value={admin.role}
                          onChange={e => handleUpdateRole(admin, e.target.value)}
                          disabled={admin.role === 'owner'}
                          style={{
                            padding: '6px 10px', border: `1px solid ${COLORS.gray200}`, borderRadius: '6px',
                            fontSize: '13px', cursor: admin.role === 'owner' ? 'not-allowed' : 'pointer',
                            background: admin.role === 'owner' ? COLORS.gray100 : COLORS.white
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 20px', color: COLORS.gray500, fontSize: '13px' }}>
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        {admin.role !== 'owner' && (
                          <button
                            onClick={() => handleDeleteUser(admin, true)}
                            style={{
                              padding: '6px 12px', background: COLORS.red500, color: COLORS.white,
                              border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowAddModal(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: COLORS.white, borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '480px',
            zIndex: 1001, boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.navy, marginBottom: '24px' }}>Add New User</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>
                Email *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@organization.org"
                style={{
                  width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.gray200}`,
                  borderRadius: '8px', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
                style={{
                  width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.gray200}`,
                  borderRadius: '8px', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>
                Role
              </label>
              <select
                value={newUser.role}
                onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                style={{
                  width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.gray200}`,
                  borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: COLORS.white
                }}
              >
                <option value="member">Member (Regular User)</option>
                <option value="admin">Admin (Platform Access)</option>
                <option value="owner">Owner (Full Access)</option>
              </select>
            </div>

            {newUser.role === 'member' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>
                    Organization
                  </label>
                  <input
                    type="text"
                    value={newUser.organization}
                    onChange={e => setNewUser(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Organization Name"
                    style={{
                      width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray700, marginBottom: '6px' }}>
                    Tier
                  </label>
                  <select
                    value={newUser.tier}
                    onChange={e => setNewUser(prev => ({ ...prev, tier: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: COLORS.white
                    }}
                  >
                    <option value="essential">Essential ($97/mo)</option>
                    <option value="professional">Professional ($197/mo)</option>
                    <option value="premium">Premium ($497/mo)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newUser.sendInvite}
                      onChange={e => setNewUser(prev => ({ ...prev, sendInvite: e.target.checked }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: COLORS.gray700 }}>Send invite email</span>
                  </label>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '12px 24px', background: COLORS.gray100, color: COLORS.gray700,
                  border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={loading}
                style={{
                  padding: '12px 24px', background: COLORS.teal, color: COLORS.white,
                  border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManager;
