import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, Mail, Send, Check, X, Clock, RefreshCw, 
  Plus, Trash2, Copy, ExternalLink, Search, Filter,
  Download, Upload, AlertCircle, CheckCircle, Link,
  UserPlus, Loader, Edit3, Save, ChevronDown
} from 'lucide-react';

interface BetaTester {
  id: string;
  email: string;
  name: string;
  organization?: string;
  status: 'pending' | 'invited' | 'active' | 'expired';
  invited_at?: string;
  activated_at?: string;
  created_at: string;
  notes?: string;
  magic_link?: string;
}

const MagicLinkAdmin: React.FC = () => {
  const [testers, setTesters] = useState<BetaTester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error'; message: string} | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New tester form
  const [newTester, setNewTester] = useState({
    name: '',
    email: '',
    organization: '',
    notes: ''
  });

  // Bulk add
  const [bulkText, setBulkText] = useState('');

  // Fetch testers on mount
  useEffect(() => {
    fetchTesters();
  }, []);

  const fetchTesters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('beta_testers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTesters(data || []);
    } catch (error) {
      console.error('Error fetching testers:', error);
      // Use mock data if table doesn't exist yet
      setTesters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const addTester = async () => {
    if (!newTester.name || !newTester.email) {
      showNotification('error', 'Name and email are required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('beta_testers')
        .insert({
          name: newTester.name,
          email: newTester.email.toLowerCase().trim(),
          organization: newTester.organization || null,
          notes: newTester.notes || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setTesters([data, ...testers]);
      setNewTester({ name: '', email: '', organization: '', notes: '' });
      setShowAddModal(false);
      showNotification('success', `Added ${newTester.name} to beta testers`);
    } catch (error: any) {
      if (error.code === '23505') {
        showNotification('error', 'This email is already in the beta tester list');
      } else {
        showNotification('error', 'Failed to add beta tester');
      }
    }
  };

  const addBulkTesters = async () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newTesters: { name: string; email: string }[] = [];

    for (const line of lines) {
      // Support formats: "name, email" or "name <email>" or just "email"
      const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        const email = emailMatch[0].toLowerCase().trim();
        let name = line.replace(emailMatch[0], '').replace(/[<>,]/g, '').trim();
        if (!name) {
          name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        newTesters.push({ name, email });
      }
    }

    if (newTesters.length === 0) {
      showNotification('error', 'No valid emails found');
      return;
    }

    let addedCount = 0;
    for (const tester of newTesters) {
      try {
        const { error } = await supabase
          .from('beta_testers')
          .insert({
            name: tester.name,
            email: tester.email,
            status: 'pending'
          });
        
        if (!error) addedCount++;
      } catch (e) {
        // Skip duplicates
      }
    }

    await fetchTesters();
    setBulkText('');
    setShowBulkModal(false);
    showNotification('success', `Added ${addedCount} beta testers`);
  };

  const deleteTester = async (id: string) => {
    if (!confirm('Are you sure you want to remove this beta tester?')) return;

    try {
      const { error } = await supabase
        .from('beta_testers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTesters(testers.filter(t => t.id !== id));
      showNotification('success', 'Beta tester removed');
    } catch (error) {
      showNotification('error', 'Failed to remove beta tester');
    }
  };

  const generateMagicLink = async (tester: BetaTester) => {
    // Generate a Supabase magic link
    try {
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: tester.email,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      // Update tester record with magic link
      await supabase
        .from('beta_testers')
        .update({ 
          magic_link: data.properties?.action_link,
          status: 'invited',
          invited_at: new Date().toISOString()
        })
        .eq('id', tester.id);

      return data.properties?.action_link;
    } catch (error) {
      console.error('Error generating magic link:', error);
      // Fallback: Create a simple signup link
      return `${window.location.origin}/signup?email=${encodeURIComponent(tester.email)}&beta=true`;
    }
  };

  const sendInviteEmail = async (tester: BetaTester) => {
    setSendingEmail(tester.id);

    try {
      // Generate magic link first
      const magicLink = await generateMagicLink(tester);

      // Send via ActiveCampaign API
      const response = await fetch('/api/send-beta-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: tester.email,
          name: tester.name,
          magicLink: magicLink || `${window.location.origin}/login`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Update status
      await supabase
        .from('beta_testers')
        .update({ 
          status: 'invited',
          invited_at: new Date().toISOString()
        })
        .eq('id', tester.id);

      setTesters(testers.map(t => 
        t.id === tester.id ? { ...t, status: 'invited', invited_at: new Date().toISOString() } : t
      ));

      showNotification('success', `Invite sent to ${tester.email}`);
    } catch (error) {
      console.error('Error sending invite:', error);
      showNotification('error', 'Failed to send invite email');
    } finally {
      setSendingEmail(null);
    }
  };

  const sendAllPendingInvites = async () => {
    const pending = testers.filter(t => t.status === 'pending');
    if (pending.length === 0) {
      showNotification('info', 'No pending invites to send');
      return;
    }

    if (!confirm(`Send invites to ${pending.length} beta testers?`)) return;

    for (const tester of pending) {
      await sendInviteEmail(tester);
      // Small delay between sends
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const copyMagicLink = async (tester: BetaTester) => {
    const link = tester.magic_link || await generateMagicLink(tester);
    if (link) {
      navigator.clipboard.writeText(link);
      showNotification('success', 'Magic link copied to clipboard');
    }
  };

  const filteredTesters = testers.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.organization?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: testers.length,
    pending: testers.filter(t => t.status === 'pending').length,
    invited: testers.filter(t => t.status === 'invited').length,
    active: testers.filter(t => t.status === 'active').length
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          borderRadius: '12px',
          background: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D2C54', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link size={28} style={{ color: '#0097A9' }} />
                Beta Tester Magic Links
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>
                Manage your 12 founding beta testers and send magic link invites
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowBulkModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <Upload size={18} />
                Bulk Add
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#0097A9',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <UserPlus size={18} />
                Add Tester
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Testers', value: stats.total, color: '#0D2C54', icon: Users },
            { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: Clock },
            { label: 'Invited', value: stats.invited, color: '#6366f1', icon: Mail },
            { label: 'Active', value: stats.active, color: '#10b981', icon: Check }
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px 24px',
              border: '1px solid #e2e8f0',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: `${stat.color}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          background: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, email, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white',
              minWidth: '150px'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
            <option value="active">Active</option>
          </select>
          {stats.pending > 0 && (
            <button
              onClick={sendAllPendingInvites}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#10b981',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
              Send All Pending ({stats.pending})
            </button>
          )}
        </div>

        {/* Tester List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 200px',
            padding: '16px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>Name</div>
            <div>Email</div>
            <div>Organization</div>
            <div>Status</div>
            <div>Invited</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Loader size={32} style={{ color: '#94a3b8', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '16px', color: '#64748b' }}>Loading beta testers...</p>
            </div>
          ) : filteredTesters.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Users size={48} style={{ color: '#e2e8f0', marginBottom: '16px' }} />
              <p style={{ color: '#64748b' }}>No beta testers found</p>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  background: '#0097A9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Add Your First Tester
              </button>
            </div>
          ) : (
            filteredTesters.map(tester => (
              <div
                key={tester.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 200px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: 500, color: '#0D2C54' }}>{tester.name}</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{tester.email}</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{tester.organization || '-'}</div>
                <div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: 
                      tester.status === 'pending' ? '#fef3c7' :
                      tester.status === 'invited' ? '#ddd6fe' :
                      tester.status === 'active' ? '#d1fae5' : '#fee2e2',
                    color:
                      tester.status === 'pending' ? '#92400e' :
                      tester.status === 'invited' ? '#6d28d9' :
                      tester.status === 'active' ? '#065f46' : '#991b1b'
                  }}>
                    {tester.status.charAt(0).toUpperCase() + tester.status.slice(1)}
                  </span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>{formatDate(tester.invited_at)}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => sendInviteEmail(tester)}
                    disabled={sendingEmail === tester.id}
                    title="Send Invite Email"
                    style={{
                      padding: '8px',
                      background: '#e0f2fe',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: sendingEmail === tester.id ? 'not-allowed' : 'pointer',
                      color: '#0369a1'
                    }}
                  >
                    {sendingEmail === tester.id ? <Loader size={16} /> : <Send size={16} />}
                  </button>
                  <button
                    onClick={() => copyMagicLink(tester)}
                    title="Copy Magic Link"
                    style={{
                      padding: '8px',
                      background: '#f0fdf4',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#16a34a'
                    }}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => deleteTester(tester.id)}
                    title="Remove Tester"
                    style={{
                      padding: '8px',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#dc2626'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Single Tester Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(13,44,84,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowAddModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0D2C54', marginBottom: '24px' }}>
              Add Beta Tester
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={newTester.name}
                  onChange={(e) => setNewTester({ ...newTester, name: e.target.value })}
                  placeholder="Jane Smith"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newTester.email}
                  onChange={(e) => setNewTester({ ...newTester, email: e.target.value })}
                  placeholder="jane@nonprofit.org"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Organization
                </label>
                <input
                  type="text"
                  value={newTester.organization}
                  onChange={(e) => setNewTester({ ...newTester, organization: e.target.value })}
                  placeholder="Community Foundation"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Notes
                </label>
                <textarea
                  value={newTester.notes}
                  onChange={(e) => setNewTester({ ...newTester, notes: e.target.value })}
                  placeholder="How you know them, why they're a good fit..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addTester}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0097A9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Add Tester
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(13,44,84,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowBulkModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>
              Bulk Add Beta Testers
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Paste a list of names and emails, one per line. Supports formats like:
            </p>
            <div style={{ 
              background: '#f8fafc', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              color: '#475569',
              marginBottom: '16px',
              fontFamily: 'monospace'
            }}>
              Jane Smith, jane@nonprofit.org<br/>
              John Doe &lt;john@foundation.org&gt;<br/>
              sarah@community.org
            </div>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Paste names and emails here..."
              rows={8}
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowBulkModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addBulkTesters}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0097A9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Add All
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MagicLinkAdmin;
