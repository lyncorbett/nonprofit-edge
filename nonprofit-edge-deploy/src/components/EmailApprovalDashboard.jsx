// File: src/components/EmailApprovalDashboard.jsx
// Simple dashboard to review and approve generated emails

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EmailApprovalDashboard() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending_review');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});

  // Fetch emails
  useEffect(() => {
    fetchEmails();
  }, [filter]);

  const fetchEmails = async () => {
    setLoading(true);
    const query = supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query.eq('status', filter);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching emails:', error);
    } else {
      setEmails(data || []);
    }
    setLoading(false);
  };

  const approveEmail = async (id) => {
    const { error } = await supabase
      .from('email_queue')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      fetchEmails();
      setSelectedEmail(null);
    }
  };

  const rejectEmail = async (id, reason) => {
    const { error } = await supabase
      .from('email_queue')
      .update({ 
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason || 'No reason provided'
      })
      .eq('id', id);

    if (!error) {
      fetchEmails();
      setSelectedEmail(null);
    }
  };

  const saveEdits = async (id) => {
    const { error } = await supabase
      .from('email_queue')
      .update({
        subject_line: editedContent.subject_line,
        body_html: editedContent.body_html,
        body_plain: editedContent.body_plain,
        preview_text: editedContent.preview_text
      })
      .eq('id', id);

    if (!error) {
      setEditMode(false);
      fetchEmails();
      // Update selected email with edits
      setSelectedEmail({ ...selectedEmail, ...editedContent });
    }
  };

  const startEdit = (email) => {
    setEditedContent({
      subject_line: email.subject_line,
      body_html: email.body_html,
      body_plain: email.body_plain,
      preview_text: email.preview_text
    });
    setEditMode(true);
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc'
    },
    sidebar: {
      width: '350px',
      borderRight: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 16px 0'
    },
    filterTabs: {
      display: 'flex',
      gap: '8px'
    },
    filterTab: (active) => ({
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      backgroundColor: active ? '#0f172a' : '#f1f5f9',
      color: active ? '#ffffff' : '#64748b',
      transition: 'all 0.2s'
    }),
    emailList: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px'
    },
    emailCard: (selected) => ({
      padding: '14px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      border: selected ? '2px solid #0f172a' : '1px solid #e2e8f0',
      backgroundColor: selected ? '#f8fafc' : '#ffffff',
      transition: 'all 0.2s'
    }),
    emailSubject: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '6px',
      lineHeight: '1.4'
    },
    emailMeta: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    badge: (type) => ({
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500',
      backgroundColor: type === 'warm' ? '#fef3c7' : type === 'cold' ? '#dbeafe' : '#f1f5f9',
      color: type === 'warm' ? '#92400e' : type === 'cold' ? '#1e40af' : '#475569'
    }),
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    previewHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    actions: {
      display: 'flex',
      gap: '10px'
    },
    button: (variant) => ({
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: variant === 'approve' ? '#059669' : variant === 'reject' ? '#dc2626' : variant === 'edit' ? '#0f172a' : '#f1f5f9',
      color: variant === 'secondary' ? '#475569' : '#ffffff',
      transition: 'opacity 0.2s'
    }),
    previewBody: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px'
    },
    emailPreview: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    previewSubject: {
      padding: '20px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    subjectLine: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    previewText: {
      fontSize: '13px',
      color: '#64748b'
    },
    emailBody: {
      padding: '24px',
      fontSize: '15px',
      lineHeight: '1.7',
      color: '#334155'
    },
    variantsSection: {
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px'
    },
    variantsTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    variantItem: {
      padding: '10px 12px',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
      cursor: 'pointer'
    },
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#94a3b8',
      fontSize: '15px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '100px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      marginBottom: '12px'
    },
    editLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '6px',
      display: 'block'
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

  return (
    <div style={styles.container}>
      {/* Sidebar - Email List */}
      <div style={styles.sidebar}>
        <div style={styles.header}>
          <h1 style={styles.title}>Email Approval</h1>
          <div style={styles.filterTabs}>
            {['pending_review', 'approved', 'rejected', 'all'].map((f) => (
              <button
                key={f}
                style={styles.filterTab(filter === f)}
                onClick={() => setFilter(f)}
              >
                {f === 'pending_review' ? 'Pending' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.emailList}>
          {loading ? (
            <div style={styles.emptyState}>Loading...</div>
          ) : emails.length === 0 ? (
            <div style={styles.emptyState}>No emails found</div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                style={styles.emailCard(selectedEmail?.id === email.id)}
                onClick={() => {
                  setSelectedEmail(email);
                  setEditMode(false);
                }}
              >
                <div style={styles.emailSubject}>{email.subject_line}</div>
                <div style={styles.emailMeta}>
                  <span style={styles.badge(email.list_type)}>{email.list_type}</span>
                  <span style={styles.badge()}>{email.email_type}</span>
                  {email.sequence_position && (
                    <span style={styles.badge()}>#{email.sequence_position}</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  {formatDate(email.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Preview */}
      <div style={styles.mainContent}>
        {selectedEmail ? (
          <>
            <div style={styles.previewHeader}>
              <div>
                <span style={styles.badge(selectedEmail.list_type)}>
                  {selectedEmail.list_type} list
                </span>
                {selectedEmail.campaign_name && (
                  <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px' }}>
                    Campaign: {selectedEmail.campaign_name}
                  </span>
                )}
              </div>
              <div style={styles.actions}>
                {editMode ? (
                  <>
                    <button 
                      style={styles.button('secondary')}
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      style={styles.button('approve')}
                      onClick={() => saveEdits(selectedEmail.id)}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      style={styles.button('edit')}
                      onClick={() => startEdit(selectedEmail)}
                    >
                      Edit
                    </button>
                    {selectedEmail.status === 'pending_review' && (
                      <>
                        <button 
                          style={styles.button('reject')}
                          onClick={() => {
                            const reason = prompt('Rejection reason (optional):');
                            rejectEmail(selectedEmail.id, reason);
                          }}
                        >
                          Reject
                        </button>
                        <button 
                          style={styles.button('approve')}
                          onClick={() => approveEmail(selectedEmail.id)}
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div style={styles.previewBody}>
              {editMode ? (
                /* Edit Mode */
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <label style={styles.editLabel}>Subject Line</label>
                  <input
                    style={styles.input}
                    value={editedContent.subject_line}
                    onChange={(e) => setEditedContent({ ...editedContent, subject_line: e.target.value })}
                  />

                  <label style={styles.editLabel}>Preview Text</label>
                  <input
                    style={styles.input}
                    value={editedContent.preview_text}
                    onChange={(e) => setEditedContent({ ...editedContent, preview_text: e.target.value })}
                  />

                  <label style={styles.editLabel}>Email Body (Plain Text)</label>
                  <textarea
                    style={{ ...styles.textarea, minHeight: '300px' }}
                    value={editedContent.body_plain}
                    onChange={(e) => setEditedContent({ 
                      ...editedContent, 
                      body_plain: e.target.value,
                      body_html: `<p>${e.target.value.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
                    })}
                  />
                </div>
              ) : (
                /* Preview Mode */
                <>
                  <div style={styles.emailPreview}>
                    <div style={styles.previewSubject}>
                      <div style={styles.subjectLine}>{selectedEmail.subject_line}</div>
                      <div style={styles.previewText}>{selectedEmail.preview_text}</div>
                    </div>
                    <div 
                      style={styles.emailBody}
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }}
                    />
                  </div>

                  {/* Subject Line Variants */}
                  {selectedEmail.subject_line_variants?.length > 1 && (
                    <div style={styles.variantsSection}>
                      <div style={styles.variantsTitle}>Subject Line Variants (for A/B testing)</div>
                      {selectedEmail.subject_line_variants.map((variant, i) => (
                        <div 
                          key={i} 
                          style={{
                            ...styles.variantItem,
                            backgroundColor: variant === selectedEmail.subject_line ? '#f0fdf4' : '#ffffff',
                            borderColor: variant === selectedEmail.subject_line ? '#22c55e' : '#e2e8f0'
                          }}
                          onClick={() => {
                            // Update the selected subject line
                            supabase
                              .from('email_queue')
                              .update({ subject_line: variant })
                              .eq('id', selectedEmail.id)
                              .then(() => {
                                setSelectedEmail({ ...selectedEmail, subject_line: variant });
                              });
                          }}
                        >
                          {variant}
                          {variant === selectedEmail.subject_line && (
                            <span style={{ marginLeft: '8px', color: '#22c55e' }}>✓ Selected</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Strategic Notes */}
                  {selectedEmail.notes && (
                    <div style={{ ...styles.variantsSection, marginTop: '16px' }}>
                      <div style={styles.variantsTitle}>Strategic Notes</div>
                      <div style={{ fontSize: '14px', color: '#475569' }}>
                        {selectedEmail.notes}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            Select an email to preview
          </div>
        )}
      </div>
    </div>
  );
}
