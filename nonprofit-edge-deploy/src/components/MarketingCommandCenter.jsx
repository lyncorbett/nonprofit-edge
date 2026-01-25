// File: src/components/MarketingCommandCenter.jsx
// Complete Marketing Admin Dashboard - Email, Video, Content Management

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function MarketingCommandCenter() {
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Email state
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailFilter, setEmailFilter] = useState('pending_review');
  
  // Video state
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFilter, setVideoFilter] = useState('pending_review');
  
  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generationType, setGenerationType] = useState('email');
  const [genForm, setGenForm] = useState({
    topic: '',
    email_type: 'insight',
    video_type: 'ad',
    list_type: 'warm',
    target_platform: 'linkedin',
    num_emails: 5,
    sequence_name: '',
    goal: '',
    offer_details: ''
  });
  
  // Results state
  const [emailResults, setEmailResults] = useState([]);
  const [videoResults, setVideoResults] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    pendingEmails: 0,
    approvedEmails: 0,
    sentEmails: 0,
    pendingVideos: 0,
    totalOpens: 0,
    totalReplies: 0
  });

  // Fetch data on mount and tab change
  useEffect(() => {
    fetchStats();
    if (activeTab === 'emails' || activeTab === 'dashboard') fetchEmails();
    if (activeTab === 'videos' || activeTab === 'dashboard') fetchVideos();
    if (activeTab === 'results') fetchResults();
  }, [activeTab, emailFilter, videoFilter]);

  const fetchStats = async () => {
    const [pending, approved, sent, pendingVids, results] = await Promise.all([
      supabase.from('email_queue').select('id', { count: 'exact' }).eq('status', 'pending_review'),
      supabase.from('email_queue').select('id', { count: 'exact' }).eq('status', 'approved'),
      supabase.from('email_queue').select('id', { count: 'exact' }).eq('status', 'sent'),
      supabase.from('video_queue').select('id', { count: 'exact' }).eq('status', 'pending_review'),
      supabase.from('email_results').select('opens, replies')
    ]);

    const totalOpens = results.data?.reduce((sum, r) => sum + (r.opens || 0), 0) || 0;
    const totalReplies = results.data?.reduce((sum, r) => sum + (r.replies || 0), 0) || 0;

    setStats({
      pendingEmails: pending.count || 0,
      approvedEmails: approved.count || 0,
      sentEmails: sent.count || 0,
      pendingVideos: pendingVids.count || 0,
      totalOpens,
      totalReplies
    });
  };

  const fetchEmails = async () => {
    setLoading(true);
    const query = supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (emailFilter !== 'all') query.eq('status', emailFilter);

    const { data } = await query;
    setEmails(data || []);
    setLoading(false);
  };

  const fetchVideos = async () => {
    const query = supabase
      .from('video_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (videoFilter !== 'all') query.eq('status', videoFilter);

    const { data } = await query;
    setVideos(data || []);
  };

  const fetchResults = async () => {
    const [emailRes, videoRes] = await Promise.all([
      supabase.from('email_results').select('*, email_campaigns(*)').order('created_at', { ascending: false }).limit(20),
      supabase.from('video_results').select('*, video_campaigns(*)').order('created_at', { ascending: false }).limit(20)
    ]);
    setEmailResults(emailRes.data || []);
    setVideoResults(videoRes.data || []);
  };

  // Generation functions
  const generateSingleEmail = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: genForm.topic,
          email_type: genForm.email_type,
          list_type: genForm.list_type
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Email generated! Check the Emails tab.');
        setGenForm({ ...genForm, topic: '' });
        fetchEmails();
        fetchStats();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error generating email: ' + err.message);
    }
    setGenerating(false);
  };

  const generateSequence = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequence_name: genForm.sequence_name,
          goal: genForm.goal,
          list_type: genForm.list_type,
          num_emails: genForm.num_emails,
          offer_details: genForm.offer_details
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Sequence generated! ${data.emails.length} emails created.`);
        setGenForm({ ...genForm, sequence_name: '', goal: '', offer_details: '' });
        fetchEmails();
        fetchStats();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error generating sequence: ' + err.message);
    }
    setGenerating(false);
  };

  const generateVideo = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase
        .from('video_queue')
        .insert({
          title: genForm.topic,
          script: '', // Will be generated
          video_type: genForm.video_type,
          target_platform: genForm.target_platform,
          list_type: genForm.list_type,
          status: 'draft',
          generated_by: 'pending'
        })
        .select()
        .single();

      // Call Claude to generate script
      const scriptResponse = await fetch('/api/generate-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: data.id,
          topic: genForm.topic,
          video_type: genForm.video_type,
          target_platform: genForm.target_platform,
          list_type: genForm.list_type
        })
      });

      if (scriptResponse.ok) {
        alert('Video script generated! Check the Videos tab.');
        fetchVideos();
        fetchStats();
      }
    } catch (err) {
      alert('Error generating video: ' + err.message);
    }
    setGenerating(false);
  };

  // Approval functions
  const approveEmail = async (id) => {
    await supabase
      .from('email_queue')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', id);
    fetchEmails();
    fetchStats();
    setSelectedEmail(null);
  };

  const rejectEmail = async (id) => {
    const reason = prompt('Rejection reason (optional):');
    await supabase
      .from('email_queue')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString(), rejection_reason: reason })
      .eq('id', id);
    fetchEmails();
    fetchStats();
    setSelectedEmail(null);
  };

  const approveVideo = async (id) => {
    await supabase
      .from('video_queue')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', id);
    fetchVideos();
    fetchStats();
    setSelectedVideo(null);
  };

  const rejectVideo = async (id) => {
    const reason = prompt('Rejection reason (optional):');
    await supabase
      .from('video_queue')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString(), rejection_reason: reason })
      .eq('id', id);
    fetchVideos();
    fetchStats();
    setSelectedVideo(null);
  };

  // Push to platforms
  const pushToInstantly = async (emailId) => {
    setPushing(true);
    try {
      const response = await fetch('/api/push-to-instantly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: emailId, send_immediately: false })
      });
      const data = await response.json();
      if (data.success) {
        alert('Pushed to Instantly! Campaign created.');
        fetchEmails();
        fetchStats();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error pushing to Instantly: ' + err.message);
    }
    setPushing(false);
  };

  const renderToHeyGen = async (videoId) => {
    setPushing(true);
    try {
      const response = await fetch('/api/render-heygen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId })
      });
      const data = await response.json();
      if (data.success) {
        alert('Sent to HeyGen for rendering! Check back in a few minutes.');
        fetchVideos();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error sending to HeyGen: ' + err.message);
    }
    setPushing(false);
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      padding: '20px 32px',
      borderBottom: '1px solid #1e293b',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#ffffff'
    },
    nav: {
      display: 'flex',
      gap: '8px'
    },
    navButton: (active) => ({
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: active ? '#3b82f6' : 'transparent',
      color: active ? '#ffffff' : '#94a3b8',
      transition: 'all 0.2s'
    }),
    main: {
      padding: '32px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #334155'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#94a3b8'
    },
    section: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid #334155'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '20px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#94a3b8',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #334155',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #334155',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #334155',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '100px',
      fontFamily: 'inherit'
    },
    button: (variant) => ({
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: variant === 'primary' ? '#3b82f6' : variant === 'success' ? '#10b981' : variant === 'danger' ? '#ef4444' : '#334155',
      color: '#ffffff',
      transition: 'opacity 0.2s',
      opacity: generating || pushing ? 0.6 : 1
    }),
    buttonRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #334155'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #1e293b',
      fontSize: '14px',
      color: '#e2e8f0'
    },
    badge: (type) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: 
        type === 'warm' ? '#422006' :
        type === 'cold' ? '#172554' :
        type === 'pending_review' ? '#713f12' :
        type === 'approved' ? '#14532d' :
        type === 'sent' ? '#1e3a8a' :
        type === 'completed' ? '#134e4a' :
        '#334155',
      color: 
        type === 'warm' ? '#fbbf24' :
        type === 'cold' ? '#60a5fa' :
        type === 'pending_review' ? '#fbbf24' :
        type === 'approved' ? '#4ade80' :
        type === 'sent' ? '#60a5fa' :
        type === 'completed' ? '#2dd4bf' :
        '#94a3b8'
    }),
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px'
    },
    tab: (active) => ({
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      backgroundColor: active ? '#334155' : 'transparent',
      color: active ? '#ffffff' : '#64748b'
    }),
    preview: {
      backgroundColor: '#0f172a',
      borderRadius: '8px',
      padding: '24px',
      marginTop: '16px',
      border: '1px solid #334155'
    },
    previewSubject: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '8px'
    },
    previewBody: {
      fontSize: '14px',
      lineHeight: '1.7',
      color: '#cbd5e1'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px'
    },
    smallButton: (variant) => ({
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      backgroundColor: variant === 'approve' ? '#10b981' : variant === 'reject' ? '#ef4444' : variant === 'push' ? '#3b82f6' : '#334155',
      color: '#ffffff'
    }),
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748b'
    },
    videoCard: {
      backgroundColor: '#0f172a',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid #334155'
    },
    videoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '8px'
    },
    videoMeta: {
      display: 'flex',
      gap: '12px',
      marginBottom: '12px'
    },
    scriptPreview: {
      fontSize: '13px',
      color: '#94a3b8',
      lineHeight: '1.6',
      maxHeight: '100px',
      overflow: 'hidden'
    },
    resultCard: {
      backgroundColor: '#0f172a',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid #334155'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginTop: '16px'
    },
    metric: {
      textAlign: 'center'
    },
    metricValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff'
    },
    metricLabel: {
      fontSize: '12px',
      color: '#64748b'
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Render Dashboard
  const renderDashboard = () => (
    <>
      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.pendingEmails}</div>
          <div style={styles.statLabel}>Emails Pending Review</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.approvedEmails}</div>
          <div style={styles.statLabel}>Emails Approved</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.sentEmails}</div>
          <div style={styles.statLabel}>Emails Sent</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.pendingVideos}</div>
          <div style={styles.statLabel}>Videos Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalOpens.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Opens</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalReplies.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Replies</div>
        </div>
      </div>

      {/* Quick Generate */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Generate</h2>
        <div style={styles.tabs}>
          <button style={styles.tab(generationType === 'email')} onClick={() => setGenerationType('email')}>Single Email</button>
          <button style={styles.tab(generationType === 'sequence')} onClick={() => setGenerationType('sequence')}>Email Sequence</button>
          <button style={styles.tab(generationType === 'video')} onClick={() => setGenerationType('video')}>Video Script</button>
        </div>

        {generationType === 'email' && (
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Topic / Main Idea</label>
              <input
                style={styles.input}
                placeholder="e.g., Why strategic plans collect dust"
                value={genForm.topic}
                onChange={(e) => setGenForm({ ...genForm, topic: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Type</label>
              <select style={styles.select} value={genForm.email_type} onChange={(e) => setGenForm({ ...genForm, email_type: e.target.value })}>
                <option value="insight">Insight</option>
                <option value="story">Story</option>
                <option value="offer">Offer</option>
                <option value="question">Question</option>
                <option value="resource">Resource</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target List</label>
              <select style={styles.select} value={genForm.list_type} onChange={(e) => setGenForm({ ...genForm, list_type: e.target.value })}>
                <option value="warm">Warm (3,000)</option>
                <option value="cold">Cold (10,000)</option>
              </select>
            </div>
          </div>
        )}

        {generationType === 'sequence' && (
          <>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sequence Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g., Founding Member Launch"
                  value={genForm.sequence_name}
                  onChange={(e) => setGenForm({ ...genForm, sequence_name: e.target.value })}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Target List</label>
                <select style={styles.select} value={genForm.list_type} onChange={(e) => setGenForm({ ...genForm, list_type: e.target.value })}>
                  <option value="warm">Warm (3,000)</option>
                  <option value="cold">Cold (10,000)</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Number of Emails</label>
                <select style={styles.select} value={genForm.num_emails} onChange={(e) => setGenForm({ ...genForm, num_emails: parseInt(e.target.value) })}>
                  <option value={3}>3 emails</option>
                  <option value={5}>5 emails</option>
                  <option value={7}>7 emails</option>
                </select>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Goal</label>
              <input
                style={styles.input}
                placeholder="e.g., Convert warm list to founding members"
                value={genForm.goal}
                onChange={(e) => setGenForm({ ...genForm, goal: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Offer Details (optional)</label>
              <textarea
                style={styles.textarea}
                placeholder="e.g., Founding member pricing $97/mo, closes Feb 24"
                value={genForm.offer_details}
                onChange={(e) => setGenForm({ ...genForm, offer_details: e.target.value })}
              />
            </div>
          </>
        )}

        {generationType === 'video' && (
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Video Topic</label>
              <input
                style={styles.input}
                placeholder="e.g., Why hope is not a strategy"
                value={genForm.topic}
                onChange={(e) => setGenForm({ ...genForm, topic: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Video Type</label>
              <select style={styles.select} value={genForm.video_type} onChange={(e) => setGenForm({ ...genForm, video_type: e.target.value })}>
                <option value="ad">Ad (30-60 sec)</option>
                <option value="explainer">Explainer (1-2 min)</option>
                <option value="testimonial">Testimonial Style</option>
                <option value="educational">Educational</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target Platform</label>
              <select style={styles.select} value={genForm.target_platform} onChange={(e) => setGenForm({ ...genForm, target_platform: e.target.value })}>
                <option value="linkedin">LinkedIn</option>
                <option value="meta">Meta (Facebook/Instagram)</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="website">Website</option>
              </select>
            </div>
          </div>
        )}

        <div style={styles.buttonRow}>
          <button
            style={styles.button('primary')}
            disabled={generating}
            onClick={() => {
              if (generationType === 'email') generateSingleEmail();
              else if (generationType === 'sequence') generateSequence();
              else if (generationType === 'video') generateVideo();
            }}
          >
            {generating ? 'Generating...' : `Generate ${generationType === 'sequence' ? 'Sequence' : generationType === 'video' ? 'Video Script' : 'Email'}`}
          </button>
        </div>
      </div>

      {/* Recent Pending */}
      {stats.pendingEmails > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⏳ Needs Your Approval</h2>
          {emails.filter(e => e.status === 'pending_review').slice(0, 3).map(email => (
            <div key={email.id} style={styles.preview}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={styles.previewSubject}>{email.subject_line}</div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <span style={styles.badge(email.list_type)}>{email.list_type}</span>
                    <span style={styles.badge(email.email_type)}>{email.email_type}</span>
                  </div>
                </div>
                <div style={styles.actionButtons}>
                  <button style={styles.smallButton('approve')} onClick={() => approveEmail(email.id)}>Approve</button>
                  <button style={styles.smallButton('reject')} onClick={() => rejectEmail(email.id)}>Reject</button>
                </div>
              </div>
              <div style={styles.previewBody} dangerouslySetInnerHTML={{ __html: email.body_html?.substring(0, 300) + '...' }} />
            </div>
          ))}
          <button style={{ ...styles.button('secondary'), marginTop: '16px' }} onClick={() => setActiveTab('emails')}>
            View All Pending ({stats.pendingEmails})
          </button>
        </div>
      )}
    </>
  );

  // Render Emails Tab
  const renderEmails = () => (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Email Queue</h2>
        <div style={styles.tabs}>
          {['pending_review', 'approved', 'sent', 'rejected', 'all'].map(filter => (
            <button key={filter} style={styles.tab(emailFilter === filter)} onClick={() => setEmailFilter(filter)}>
              {filter === 'pending_review' ? 'Pending' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={styles.emptyState}>Loading...</div>
      ) : emails.length === 0 ? (
        <div style={styles.emptyState}>No emails found</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>List</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map(email => (
              <tr key={email.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedEmail(email)}>
                <td style={styles.td}>{email.subject_line}</td>
                <td style={styles.td}><span style={styles.badge(email.email_type)}>{email.email_type}</span></td>
                <td style={styles.td}><span style={styles.badge(email.list_type)}>{email.list_type}</span></td>
                <td style={styles.td}><span style={styles.badge(email.status)}>{email.status.replace('_', ' ')}</span></td>
                <td style={styles.td}>{formatDate(email.created_at)}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {email.status === 'pending_review' && (
                      <>
                        <button style={styles.smallButton('approve')} onClick={() => approveEmail(email.id)}>✓</button>
                        <button style={styles.smallButton('reject')} onClick={() => rejectEmail(email.id)}>✗</button>
                      </>
                    )}
                    {email.status === 'approved' && (
                      <button style={styles.smallButton('push')} onClick={() => pushToInstantly(email.id)} disabled={pushing}>
                        {pushing ? '...' : 'Push'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Email Preview Modal */}
      {selectedEmail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedEmail(null)}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={styles.badge(selectedEmail.list_type)}>{selectedEmail.list_type}</span>
                <span style={styles.badge(selectedEmail.email_type)}>{selectedEmail.email_type}</span>
                <span style={styles.badge(selectedEmail.status)}>{selectedEmail.status}</span>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }} onClick={() => setSelectedEmail(null)}>✕</button>
            </div>
            <div style={styles.previewSubject}>{selectedEmail.subject_line}</div>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>{selectedEmail.preview_text}</div>
            <div style={{ ...styles.previewBody, backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px' }} dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }} />
            
            {selectedEmail.subject_line_variants?.length > 1 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Subject Variants</div>
                {selectedEmail.subject_line_variants.map((v, i) => (
                  <div key={i} style={{ padding: '8px 12px', backgroundColor: '#0f172a', borderRadius: '6px', marginBottom: '4px', fontSize: '14px' }}>{v}</div>
                ))}
              </div>
            )}

            <div style={{ ...styles.actionButtons, marginTop: '24px' }}>
              {selectedEmail.status === 'pending_review' && (
                <>
                  <button style={styles.smallButton('approve')} onClick={() => approveEmail(selectedEmail.id)}>Approve</button>
                  <button style={styles.smallButton('reject')} onClick={() => rejectEmail(selectedEmail.id)}>Reject</button>
                </>
              )}
              {selectedEmail.status === 'approved' && (
                <button style={styles.smallButton('push')} onClick={() => pushToInstantly(selectedEmail.id)} disabled={pushing}>
                  {pushing ? 'Pushing...' : 'Push to Instantly'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render Videos Tab
  const renderVideos = () => (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Video Queue</h2>
        <div style={styles.tabs}>
          {['pending_review', 'approved', 'rendering', 'completed', 'all'].map(filter => (
            <button key={filter} style={styles.tab(videoFilter === filter)} onClick={() => setVideoFilter(filter)}>
              {filter === 'pending_review' ? 'Pending' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {videos.length === 0 ? (
        <div style={styles.emptyState}>No videos found. Generate your first video script above!</div>
      ) : (
        videos.map(video => (
          <div key={video.id} style={styles.videoCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={styles.videoTitle}>{video.title}</div>
                <div style={styles.videoMeta}>
                  <span style={styles.badge(video.video_type)}>{video.video_type}</span>
                  <span style={styles.badge(video.target_platform)}>{video.target_platform}</span>
                  <span style={styles.badge(video.status)}>{video.status}</span>
                </div>
              </div>
              <div style={styles.actionButtons}>
                {video.status === 'pending_review' && (
                  <>
                    <button style={styles.smallButton('approve')} onClick={() => approveVideo(video.id)}>Approve</button>
                    <button style={styles.smallButton('reject')} onClick={() => rejectVideo(video.id)}>Reject</button>
                  </>
                )}
                {video.status === 'approved' && (
                  <button style={styles.smallButton('push')} onClick={() => renderToHeyGen(video.id)} disabled={pushing}>
                    {pushing ? 'Sending...' : 'Render with HeyGen'}
                  </button>
                )}
              </div>
            </div>
            {video.script && (
              <div style={styles.scriptPreview}>{video.script.substring(0, 200)}...</div>
            )}
            {video.video_url && (
              <div style={{ marginTop: '16px' }}>
                <video 
                  src={video.video_url} 
                  controls 
                  style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  // Render Results Tab
  const renderResults = () => (
    <>
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📧 Email Performance</h2>
        {emailResults.length === 0 ? (
          <div style={styles.emptyState}>No email results yet. Send some campaigns first!</div>
        ) : (
          emailResults.map(result => (
            <div key={result.id} style={styles.resultCard}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                {result.email_campaigns?.instantly_campaign_name || 'Campaign'}
              </div>
              <div style={styles.metricsGrid}>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.emails_sent?.toLocaleString() || 0}</div>
                  <div style={styles.metricLabel}>Sent</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.open_rate || 0}%</div>
                  <div style={styles.metricLabel}>Open Rate</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.click_rate || 0}%</div>
                  <div style={styles.metricLabel}>Click Rate</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.replies || 0}</div>
                  <div style={styles.metricLabel}>Replies</div>
                </div>
              </div>
              {result.winning_subject_line && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#14532d', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#4ade80', marginBottom: '4px' }}>🏆 Winning Subject</div>
                  <div style={{ color: '#ffffff' }}>{result.winning_subject_line}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎬 Video Performance</h2>
        {videoResults.length === 0 ? (
          <div style={styles.emptyState}>No video results yet. Create and publish some videos first!</div>
        ) : (
          videoResults.map(result => (
            <div key={result.id} style={styles.resultCard}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                {result.video_campaigns?.name || 'Video Campaign'}
              </div>
              <div style={styles.metricsGrid}>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.views?.toLocaleString() || 0}</div>
                  <div style={styles.metricLabel}>Views</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.view_rate || 0}%</div>
                  <div style={styles.metricLabel}>View Rate</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>{result.clicks || 0}</div>
                  <div style={styles.metricLabel}>Clicks</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricValue}>${result.cost_per_lead || 0}</div>
                  <div style={styles.metricLabel}>Cost/Lead</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>📊 Marketing Command Center</div>
        <nav style={styles.nav}>
          <button style={styles.navButton(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button style={styles.navButton(activeTab === 'emails')} onClick={() => setActiveTab('emails')}>Emails</button>
          <button style={styles.navButton(activeTab === 'videos')} onClick={() => setActiveTab('videos')}>Videos</button>
          <button style={styles.navButton(activeTab === 'results')} onClick={() => setActiveTab('results')}>Results</button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'emails' && renderEmails()}
        {activeTab === 'videos' && renderVideos()}
        {activeTab === 'results' && renderResults()}
      </main>
    </div>
  );
}
