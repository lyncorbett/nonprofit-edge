/**
 * THE NONPROFIT EDGE - Team Access Manager
 * 
 * Owner-only interface to manage platform admin access
 * - Add new admins (Ana, Rachel, Norman, etc.)
 * - Remove admin access
 * - View access history
 */

import React, { useState, useEffect } from 'react';

// Brand colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface TeamAccessManagerProps {
  supabase: any;
  currentUserEmail: string;
  onNavigate: (page: string) => void;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
  added_at: string;
  added_by: string;
  is_active: boolean;
}

const TeamAccessManager: React.FC<TeamAccessManagerProps> = ({
  supabase,
  currentUserEmail,
  onNavigate
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for adding new admin
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    name: '',
    role: 'admin' as 'admin' | 'owner'
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_admins')
        .select('*')
        .order('role', { ascending: false })
        .order('name');

      if (error) throw error;
      setAdmins(data || []);
    } catch (err: any) {
      setError('Failed to load admin list: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if email already exists
      const existing = admins.find(a => a.email.toLowerCase() === newAdmin.email.toLowerCase());
      if (existing) {
        if (existing.is_active) {
          setError('This email already has admin access.');
          setSaving(false);
          return;
        }
        // Reactivate existing admin
        const { error } = await supabase
          .from('platform_admins')
          .update({ 
            is_active: true, 
            name: newAdmin.name,
            role: newAdmin.role 
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Add new admin
        const { error } = await supabase
          .from('platform_admins')
          .insert({
            email: newAdmin.email.toLowerCase(),
            name: newAdmin.name,
            role: newAdmin.role,
            added_by: currentUserEmail
          });

        if (error) throw error;
      }

      setSuccess(`${newAdmin.name} has been granted ${newAdmin.role} access.`);
      setNewAdmin({ email: '', name: '', role: 'admin' });
      setShowAddForm(false);
      loadAdmins();
    } catch (err: any) {
      setError('Failed to add admin: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async (admin: AdminUser) => {
    if (admin.role === 'owner') {
      setError('Cannot remove owner access.');
      return;
    }

    if (!confirm(`Remove admin access for ${admin.name}?`)) return;

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('platform_admins')
        .update({ is_active: false })
        .eq('id', admin.id);

      if (error) throw error;

      setSuccess(`${admin.name}'s admin access has been removed.`);
      loadAdmins();
    } catch (err: any) {
      setError('Failed to remove admin: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRole = async (admin: AdminUser) => {
    if (admin.email === currentUserEmail) {
      setError('Cannot change your own role.');
      return;
    }

    const newRole = admin.role === 'owner' ? 'admin' : 'owner';
    if (!confirm(`Change ${admin.name}'s role to ${newRole}?`)) return;

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('platform_admins')
        .update({ role: newRole })
        .eq('id', admin.id);

      if (error) throw error;

      setSuccess(`${admin.name}'s role updated to ${newRole}.`);
      loadAdmins();
    } catch (err: any) {
      setError('Failed to update role: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>
                🔐 Manage Admin Access
              </h1>
              <p className="text-sm text-gray-500">
                Control who can access the Content Manager and Platform Admin
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-6">
        {/* Info Box */}
        <div 
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}
        >
          <h3 className="font-semibold text-sm" style={{ color: NAVY }}>
            Access Levels
          </h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">👑 Owner:</span> Full access - Content Manager, Platform Admin, Owner Dashboard, and this page</p>
            <p><span className="font-medium">🛡️ Admin:</span> Team access - Content Manager and Platform Admin only</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: NAVY }}>
              Platform Admins ({admins.filter(a => a.is_active).length})
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: TEAL }}
            >
              + Add Team Member
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading...
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {admins.filter(a => a.is_active).map(admin => (
                <div 
                  key={admin.id} 
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ 
                        backgroundColor: admin.role === 'owner' ? '#DCFCE7' : '#DBEAFE'
                      }}
                    >
                      {admin.role === 'owner' ? '👑' : '🛡️'}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: NAVY }}>
                        {admin.name}
                      </p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: admin.role === 'owner' ? '#DCFCE7' : '#DBEAFE',
                        color: admin.role === 'owner' ? '#166534' : '#1E40AF'
                      }}
                    >
                      {admin.role === 'owner' ? 'Owner' : 'Admin'}
                    </span>
                    
                    {admin.email !== currentUserEmail && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRole(admin)}
                          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                          disabled={saving}
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleRemoveAdmin(admin)}
                          className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                          disabled={saving}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    
                    {admin.email === currentUserEmail && (
                      <span className="text-xs text-gray-400">(You)</span>
                    )}
                  </div>
                </div>
              ))}

              {admins.filter(a => a.is_active).length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No admins configured yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inactive Admins */}
        {admins.filter(a => !a.is_active).length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Inactive (Previously Removed)
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
              {admins.filter(a => !a.is_active).map(admin => (
                <div 
                  key={admin.id} 
                  className="px-6 py-3 flex items-center justify-between opacity-60"
                >
                  <div>
                    <p className="font-medium text-gray-600">{admin.name}</p>
                    <p className="text-sm text-gray-400">{admin.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewAdmin({ email: admin.email, name: admin.name, role: 'admin' });
                      setShowAddForm(true);
                    }}
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    Restore Access
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Admin Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold" style={{ color: NAVY }}>
                  Add Team Member
                </h2>
              </div>
              
              <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="e.g., Ana Rodriguez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="e.g., ana@thepivotalgroup.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    They must sign up with this exact email to get access
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as 'admin' | 'owner' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="admin">🛡️ Admin - Content Manager & Platform Admin</option>
                    <option value="owner">👑 Owner - Full access including financials</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAdmin({ email: '', name: '', role: 'admin' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: saving ? '#94A3B8' : TEAL }}
                  >
                    {saving ? 'Adding...' : 'Add Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamAccessManager;
