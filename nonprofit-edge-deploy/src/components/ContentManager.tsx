/**
 * THE NONPROFIT EDGE - Content Manager
 * 
 * Admin interface for your team to:
 * - Upload resources (templates, playbooks, guides)
 * - Manage daily quotes
 * - See usage analytics
 * - Get content suggestions
 */

import React, { useState, useEffect, useRef } from 'react';

// Brand colors
const NAVY = '#0D2C54';
const TEAL = '#0097A9';

// Supabase client (you'll import from your existing setup)
// import { supabase } from '../lib/supabase';

interface ContentManagerProps {
  supabase: any; // Your Supabase client
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

type TabType = 'resources' | 'quotes' | 'events' | 'analytics';

interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  tier_access: string;
  tags: string[];
  featured: boolean;
  download_count: number;
  created_at: string;
}

interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
  display_date: string | null;
  times_shown: number;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  event_date: string;
  type: string;
  description: string;
  registration_url: string;
  presenter: string;
  tier_access: string;
  status: string;
}

const ContentManager: React.FC<ContentManagerProps> = ({ supabase, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('resources');
  const [resources, setResources] = useState<Resource[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories for resources
  const resourceCategories = [
    'Templates',
    'Playbooks', 
    'Book Summaries',
    'Certifications',
    'Leadership Guides',
    'Facilitation Kits'
  ];

  const quoteCategories = ['Leadership', 'Strategy', 'Perseverance', 'Growth'];
  const eventTypes = ['Webinar', 'Workshop', 'Office Hours', 'Training'];
  const tierOptions = ['All', 'Essential', 'Professional', 'Premium'];

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'resources') {
        const { data } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });
        setResources(data || []);
      } else if (activeTab === 'quotes') {
        const { data } = await supabase
          .from('daily_quotes')
          .select('*')
          .order('created_at', { ascending: false });
        setQuotes(data || []);
      } else if (activeTab === 'events') {
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);

      // Open modal with file info pre-filled
      setEditingItem({
        isNew: true,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: 'Templates',
        description: '',
        tier_access: 'All',
        tags: [],
        featured: false
      });
      setShowAddModal(true);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  // Save resource
  const saveResource = async (resource: Partial<Resource>) => {
    try {
      if (editingItem?.isNew) {
        await supabase.from('resources').insert([{
          name: resource.name,
          category: resource.category,
          description: resource.description,
          file_url: resource.file_url,
          file_name: resource.file_name,
          file_size: resource.file_size,
          tier_access: resource.tier_access,
          tags: resource.tags,
          featured: resource.featured,
          download_count: 0
        }]);
      } else {
        await supabase
          .from('resources')
          .update(resource)
          .eq('id', editingItem.id);
      }
      setShowAddModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Save quote
  const saveQuote = async (quote: Partial<Quote>) => {
    try {
      if (editingItem?.isNew) {
        await supabase.from('daily_quotes').insert([{
          quote: quote.quote,
          author: quote.author,
          category: quote.category,
          display_date: quote.display_date || null,
          times_shown: 0
        }]);
      } else {
        await supabase
          .from('daily_quotes')
          .update(quote)
          .eq('id', editingItem.id);
      }
      setShowAddModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Save event
  const saveEvent = async (event: Partial<Event>) => {
    try {
      if (editingItem?.isNew) {
        await supabase.from('events').insert([event]);
      } else {
        await supabase
          .from('events')
          .update(event)
          .eq('id', editingItem.id);
      }
      setShowAddModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Delete item
  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Auto-assign quotes for next 30 days
  const autoAssignQuotes = async () => {
    const unassignedQuotes = quotes.filter(q => !q.display_date);
    if (unassignedQuotes.length === 0) {
      alert('No unassigned quotes available');
      return;
    }

    const today = new Date();
    const assignments = [];
    
    for (let i = 0; i < 30 && i < unassignedQuotes.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      assignments.push({
        id: unassignedQuotes[i].id,
        display_date: date.toISOString().split('T')[0]
      });
    }

    for (const assignment of assignments) {
      await supabase
        .from('daily_quotes')
        .update({ display_date: assignment.display_date })
        .eq('id', assignment.id);
    }

    alert(`Assigned ${assignments.length} quotes for the next ${assignments.length} days`);
    loadData();
  };

  // Filter resources
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Analytics data
  const getAnalytics = () => {
    const totalResources = resources.length;
    const totalDownloads = resources.reduce((sum, r) => sum + r.download_count, 0);
    const topResources = [...resources].sort((a, b) => b.download_count - a.download_count).slice(0, 5);
    const byCategory = resourceCategories.map(cat => ({
      category: cat,
      count: resources.filter(r => r.category === cat).length,
      downloads: resources.filter(r => r.category === cat).reduce((sum, r) => sum + r.download_count, 0)
    }));
    const lowContent = byCategory.filter(c => c.count < 5);
    
    return { totalResources, totalDownloads, topResources, byCategory, lowContent };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: NAVY,
        color: 'white',
        padding: '24px',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Content Manager</h1>
          <p style={{ fontSize: '13px', opacity: 0.7 }}>The Nonprofit Edge</p>
        </div>

        <nav>
          {[
            { id: 'resources', label: 'Resources', icon: '📁', count: resources.length },
            { id: 'quotes', label: 'Daily Quotes', icon: '💬', count: quotes.length },
            { id: 'events', label: 'Events', icon: '📅', count: events.length },
            { id: 'analytics', label: 'Analytics', icon: '📊', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left'
              }}
            >
              <span>
                <span style={{ marginRight: '10px' }}>{tab.icon}</span>
                {tab.label}
              </span>
              {tab.count !== null && (
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        
        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '4px' }}>
                  Resource Library
                </h2>
                <p style={{ color: '#64748b' }}>
                  Upload and manage templates, playbooks, and guides
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '12px 24px',
                    background: TEAL,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {uploading ? '⏳ Uploading...' : '📤 Upload Resource'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '24px',
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}
              />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  minWidth: '180px'
                }}
              >
                <option value="all">All Categories</option>
                {resourceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Resources Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading...</div>
            ) : filteredResources.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '48px', 
                background: 'white',
                borderRadius: '12px',
                border: '2px dashed #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <h3 style={{ color: NAVY, marginBottom: '8px' }}>No resources yet</h3>
                <p style={{ color: '#64748b', marginBottom: '16px' }}>Upload your first template or playbook</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '12px 24px',
                    background: TEAL,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Upload Resource
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredResources.map(resource => (
                  <div
                    key={resource.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      position: 'relative'
                    }}
                  >
                    {resource.featured && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#FEF3C7',
                        color: '#D97706',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        ⭐ Featured
                      </span>
                    )}
                    <div style={{ 
                      fontSize: '32px', 
                      marginBottom: '12px',
                      width: '48px',
                      height: '48px',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {resource.category === 'Templates' ? '📄' :
                       resource.category === 'Playbooks' ? '📘' :
                       resource.category === 'Book Summaries' ? '📚' :
                       resource.category === 'Certifications' ? '🎓' :
                       resource.category === 'Leadership Guides' ? '🧭' : '🗂️'}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>
                      {resource.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', lineHeight: 1.5 }}>
                      {resource.description || 'No description'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#E0F2FE',
                        color: TEAL,
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {resource.category}
                      </span>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#64748b',
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {resource.tier_access}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        📥 {resource.download_count} downloads
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingItem(resource);
                            setShowAddModal(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('resources', resource.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* QUOTES TAB */}
        {activeTab === 'quotes' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '4px' }}>
                  Daily Quotes
                </h2>
                <p style={{ color: '#64748b' }}>
                  Manage inspirational quotes that rotate daily on member dashboards
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={autoAssignQuotes}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: NAVY,
                    border: `1px solid ${NAVY}`,
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🔄 Auto-Assign 30 Days
                </button>
                <button
                  onClick={() => {
                    setEditingItem({ isNew: true, quote: '', author: '', category: 'Leadership' });
                    setShowAddModal(true);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: TEAL,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Add Quote
                </button>
              </div>
            </div>

            {/* Quote Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Total Quotes', value: quotes.length, icon: '💬' },
                { label: 'Scheduled', value: quotes.filter(q => q.display_date).length, icon: '📅' },
                { label: 'Unscheduled', value: quotes.filter(q => !q.display_date).length, icon: '⏳' },
                { label: 'Days Covered', value: quotes.filter(q => q.display_date && new Date(q.display_date) >= new Date()).length, icon: '✅' }
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '20px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: NAVY }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quotes List */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Quote</th>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Author</th>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Display Date</th>
                    <th style={{ textAlign: 'right', padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map(quote => (
                    <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontSize: '14px', maxWidth: '400px' }}>
                        "{quote.quote.substring(0, 100)}{quote.quote.length > 100 ? '...' : ''}"
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{quote.author}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {quote.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        {quote.display_date ? (
                          <span style={{ color: TEAL }}>{new Date(quote.display_date).toLocaleDateString()}</span>
                        ) : (
                          <span style={{ color: '#D97706' }}>Not scheduled</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setEditingItem(quote);
                            setShowAddModal(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            marginRight: '8px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('daily_quotes', quote.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '4px' }}>
                  Events
                </h2>
                <p style={{ color: '#64748b' }}>
                  Manage webinars, workshops, and office hours
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem({ 
                    isNew: true, 
                    title: '', 
                    event_date: '', 
                    type: 'Webinar',
                    description: '',
                    registration_url: '',
                    presenter: 'Dr. Lyn Corbett',
                    tier_access: 'All',
                    status: 'Upcoming'
                  });
                  setShowAddModal(true);
                }}
                style={{
                  padding: '12px 24px',
                  background: TEAL,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Add Event
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
              {events.map(event => (
                <div
                  key={event.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{
                      background: event.status === 'Upcoming' ? '#DCFCE7' : 
                                 event.status === 'Live' ? '#FEE2E2' : '#f1f5f9',
                      color: event.status === 'Upcoming' ? '#16A34A' :
                             event.status === 'Live' ? '#DC2626' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}>
                      {event.status}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{event.type}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: TEAL, marginBottom: '8px' }}>
                    📅 {new Date(event.event_date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                    👤 {event.presenter}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(event);
                        setShowAddModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('events', event.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '24px' }}>
              Content Analytics
            </h2>

            {(() => {
              const analytics = getAnalytics();
              return (
                <>
                  {/* Overview Stats */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '16px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a5c 100%)`,
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Total Resources</div>
                      <div style={{ fontSize: '36px', fontWeight: 700 }}>{analytics.totalResources}</div>
                    </div>
                    <div style={{
                      background: `linear-gradient(135deg, ${TEAL} 0%, #0284c7 100%)`,
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Total Downloads</div>
                      <div style={{ fontSize: '36px', fontWeight: 700 }}>{analytics.totalDownloads}</div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      borderRadius: '12px',
                      padding: '24px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Avg Downloads/Resource</div>
                      <div style={{ fontSize: '36px', fontWeight: 700 }}>
                        {analytics.totalResources > 0 ? Math.round(analytics.totalDownloads / analytics.totalResources) : 0}
                      </div>
                    </div>
                  </div>

                  {/* Top Resources */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '24px'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>
                        🏆 Top Resources
                      </h3>
                      {analytics.topResources.map((resource, index) => (
                        <div key={resource.id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '12px 0',
                          borderBottom: index < analytics.topResources.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}>
                          <span style={{ fontSize: '14px' }}>
                            <span style={{ 
                              fontWeight: 600, 
                              marginRight: '8px',
                              color: index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#CD7F32' : '#64748b'
                            }}>
                              #{index + 1}
                            </span>
                            {resource.name}
                          </span>
                          <span style={{ fontWeight: 600, color: TEAL }}>{resource.download_count}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '24px'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>
                        📊 By Category
                      </h3>
                      {analytics.byCategory.map(cat => (
                        <div key={cat.category} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px' }}>{cat.category}</span>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>
                              {cat.count} resources • {cat.downloads} downloads
                            </span>
                          </div>
                          <div style={{ 
                            height: '8px', 
                            background: '#f1f5f9', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${analytics.totalResources > 0 ? (cat.count / analytics.totalResources) * 100 : 0}%`,
                              background: TEAL,
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {analytics.lowContent.length > 0 && (
                    <div style={{
                      background: '#FEF3C7',
                      border: '1px solid #F59E0B',
                      borderRadius: '12px',
                      padding: '24px'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#92400E', marginBottom: '12px' }}>
                        💡 Content Suggestions
                      </h3>
                      <p style={{ color: '#92400E', marginBottom: '12px' }}>
                        These categories have fewer than 5 resources. Consider adding more content:
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {analytics.lowContent.map(cat => (
                          <span key={cat.category} style={{
                            background: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                            {cat.category} ({cat.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: NAVY, marginBottom: '24px' }}>
              {editingItem?.isNew ? 'Add New' : 'Edit'} {activeTab === 'resources' ? 'Resource' : activeTab === 'quotes' ? 'Quote' : 'Event'}
            </h2>

            {/* Resource Form */}
            {activeTab === 'resources' && (
              <form onSubmit={e => { e.preventDefault(); saveResource(editingItem); }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Name</label>
                  <input
                    type="text"
                    value={editingItem?.name || ''}
                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Category</label>
                  <select
                    value={editingItem?.category || 'Templates'}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  >
                    {resourceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Description</label>
                  <textarea
                    value={editingItem?.description || ''}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '80px' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Tier Access</label>
                  <select
                    value={editingItem?.tier_access || 'All'}
                    onChange={e => setEditingItem({ ...editingItem, tier_access: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  >
                    {tierOptions.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingItem?.featured || false}
                      onChange={e => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    />
                    <span style={{ fontSize: '14px' }}>Featured in Member Favorites</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: TEAL, color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Quote Form */}
            {activeTab === 'quotes' && (
              <form onSubmit={e => { e.preventDefault(); saveQuote(editingItem); }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Quote</label>
                  <textarea
                    value={editingItem?.quote || ''}
                    onChange={e => setEditingItem({ ...editingItem, quote: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '100px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Author</label>
                  <input
                    type="text"
                    value={editingItem?.author || ''}
                    onChange={e => setEditingItem({ ...editingItem, author: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Category</label>
                  <select
                    value={editingItem?.category || 'Leadership'}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  >
                    {quoteCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Display Date (optional)</label>
                  <input
                    type="date"
                    value={editingItem?.display_date || ''}
                    onChange={e => setEditingItem({ ...editingItem, display_date: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: TEAL, color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Event Form */}
            {activeTab === 'events' && (
              <form onSubmit={e => { e.preventDefault(); saveEvent(editingItem); }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Title</label>
                  <input
                    type="text"
                    value={editingItem?.title || ''}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={editingItem?.event_date?.slice(0, 16) || ''}
                      onChange={e => setEditingItem({ ...editingItem, event_date: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Type</label>
                    <select
                      value={editingItem?.type || 'Webinar'}
                      onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    >
                      {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Description</label>
                  <textarea
                    value={editingItem?.description || ''}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '80px' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Registration URL</label>
                  <input
                    type="url"
                    value={editingItem?.registration_url || ''}
                    onChange={e => setEditingItem({ ...editingItem, registration_url: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Presenter</label>
                    <input
                      type="text"
                      value={editingItem?.presenter || ''}
                      onChange={e => setEditingItem({ ...editingItem, presenter: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Status</label>
                    <select
                      value={editingItem?.status || 'Upcoming'}
                      onChange={e => setEditingItem({ ...editingItem, status: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: TEAL, color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
