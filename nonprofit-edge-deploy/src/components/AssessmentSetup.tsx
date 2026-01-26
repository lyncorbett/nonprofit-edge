// File: src/components/AssessmentSetup.tsx
// Admin setup page for Board Assessment and CEO Evaluation

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, User, Plus, Trash2, Upload, Mail, Calendar, 
  ChevronRight, Check, AlertCircle, ArrowLeft
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  group?: string;
}

interface AssessmentSetupProps {
  type: 'board-assessment' | 'ceo-evaluation';
  onComplete?: (assessmentId: string) => void;
}

const AssessmentSetup: React.FC<AssessmentSetupProps> = ({ type, onComplete }) => {
  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '', role: '', group: '' });
  const [deadline, setDeadline] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isBoardAssessment = type === 'board-assessment';
  const title = isBoardAssessment ? 'Board Assessment' : 'CEO Evaluation';
  const icon = isBoardAssessment ? Users : User;
  const color = isBoardAssessment ? '#0097A9' : '#0D2C54';

  const roleOptions = isBoardAssessment 
    ? ['Board Chair', 'Vice Chair', 'Treasurer', 'Secretary', 'Board Member', 'Ex-Officio']
    : ['Board Member', 'Direct Report', 'Peer', 'External Stakeholder'];

  const groupOptions = isBoardAssessment
    ? []
    : ['Board', 'Staff', 'External'];

  const addParticipant = () => {
    if (!newParticipant.name || !newParticipant.email) {
      setError('Name and email are required');
      return;
    }
    if (!newParticipant.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setParticipants([
      ...participants,
      { 
        id: Date.now().toString(), 
        ...newParticipant,
        group: newParticipant.group || (isBoardAssessment ? 'Board' : 'Board')
      }
    ]);
    setNewParticipant({ name: '', email: '', role: '', group: '' });
    setError('');
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const newParticipants: Participant[] = [];

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const [name, email, role, group] = lines[i].split(',').map(s => s.trim());
        if (name && email) {
          newParticipants.push({
            id: Date.now().toString() + i,
            name,
            email,
            role: role || 'Board Member',
            group: group || 'Board'
          });
        }
      }

      setParticipants([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (participants.length === 0) {
      setError('Please add at least one participant');
      return;
    }
    if (!deadline) {
      setError('Please set a deadline');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get or create organization
      const { data: orgData } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      const orgId = orgData?.organization_id || user.id; // Fallback to user id

      // Create assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          organization_id: orgId,
          type: type,
          title: `${title} - ${new Date().toLocaleDateString()}`,
          admin_user_id: user.id,
          deadline: deadline,
          is_anonymous: isAnonymous,
          status: 'active',
          settings: {
            reminder_days: [7, 3, 1],
            min_responses_for_report: type === 'ceo-evaluation' ? 3 : 1
          }
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Add participants
      const participantInserts = participants.map(p => ({
        assessment_id: assessment.id,
        name: p.name,
        email: p.email,
        role: p.role,
        group_type: p.group || 'Board',
        status: 'invited'
      }));

      const { error: participantError } = await supabase
        .from('assessment_participants')
        .insert(participantInserts);

      if (participantError) throw participantError;

      // Trigger email invitations (this would call an API endpoint)
      // await fetch('/api/send-assessment-invites', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ assessmentId: assessment.id })
      // });

      if (onComplete) {
        onComplete(assessment.id);
      } else {
        // Navigate to admin dashboard
        window.location.href = `/${type}/admin/${assessment.id}`;
      }

    } catch (err: any) {
      console.error('Setup error:', err);
      setError(err.message || 'Failed to create assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {React.createElement(icon, { size: 20 })}
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2C54', margin: 0 }}>
                {title} Setup
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Configure and launch your assessment
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= s ? color : '#e2e8f0',
                color: step >= s ? 'white' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 3 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: step > s ? color : '#e2e8f0'
                }} />
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Step 1: Add Participants */}
        {step === 1 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>
              Add {isBoardAssessment ? 'Board Members' : 'Evaluators'}
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              {isBoardAssessment 
                ? 'Add the board members who will complete the assessment.'
                : 'Add evaluators from different groups for a 360° view.'}
            </p>

            {/* CSV Upload */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '2px dashed #e2e8f0',
              textAlign: 'center'
            }}>
              <Upload size={24} style={{ color: '#64748b', marginBottom: '8px' }} />
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                Upload a CSV file with columns: Name, Email, Role{!isBoardAssessment && ', Group'}
              </p>
              <label style={{
                padding: '10px 20px',
                background: color,
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}>
                Choose File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Manual Add Form */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: !isBoardAssessment ? '1fr 1fr 1fr 1fr auto' : '1fr 1fr 1fr auto',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <input
                type="text"
                placeholder="Name"
                value={newParticipant.name}
                onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newParticipant.email}
                onChange={e => setNewParticipant({ ...newParticipant, email: e.target.value })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px'
                }}
              />
              <select
                value={newParticipant.role}
                onChange={e => setNewParticipant({ ...newParticipant, role: e.target.value })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="">Select Role</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {!isBoardAssessment && (
                <select
                  value={newParticipant.group}
                  onChange={e => setNewParticipant({ ...newParticipant, group: e.target.value })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="">Select Group</option>
                  {groupOptions.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              )}
              <button
                onClick={addParticipant}
                style={{
                  padding: '12px 16px',
                  background: color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={18} />
              </button>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#fef2f2',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Participant List */}
            {participants.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                  {participants.length} {participants.length === 1 ? 'Participant' : 'Participants'} Added
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {participants.map(p => (
                    <div key={p.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#0D2C54' }}>{p.name}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {p.email} • {p.role} {p.group && `• ${p.group}`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeParticipant(p.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={participants.length === 0}
              style={{
                marginTop: '32px',
                padding: '14px 28px',
                background: participants.length === 0 ? '#e2e8f0' : color,
                color: participants.length === 0 ? '#94a3b8' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: participants.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: 'auto'
              }}
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Settings */}
        {step === 2 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>
              Assessment Settings
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Configure deadline and anonymity settings.
            </p>

            {/* Deadline */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                <Calendar size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  width: '100%',
                  maxWidth: '300px'
                }}
              />
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                We recommend 2 weeks for completion.
              </p>
            </div>

            {/* Anonymity */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>
                Response Anonymity
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  background: isAnonymous ? `${color}10` : '#f8fafc',
                  border: isAnonymous ? `2px solid ${color}` : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(true)}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#0D2C54' }}>Anonymous Responses</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {type === 'ceo-evaluation' 
                        ? 'Evaluators will remain anonymous. Minimum 3 responses per group required.'
                        : 'Board members can respond anonymously. Individual responses won\'t be identified.'}
                    </div>
                  </div>
                </label>
                {type === 'board-assessment' && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    background: !isAnonymous ? `${color}10` : '#f8fafc',
                    border: !isAnonymous ? `2px solid ${color}` : '2px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      checked={!isAnonymous}
                      onChange={() => setIsAnonymous(false)}
                      style={{ marginTop: '2px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0D2C54' }}>Identified Responses</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        Responses will be attributed to each board member in the report.
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '14px 28px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!deadline}
                style={{
                  padding: '14px 28px',
                  background: !deadline ? '#e2e8f0' : color,
                  color: !deadline ? '#94a3b8' : 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: !deadline ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: 'auto'
                }}
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Launch */}
        {step === 3 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D2C54', marginBottom: '8px' }}>
              Review & Launch
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Review your settings and launch the assessment.
            </p>

            {/* Summary */}
            <div style={{ 
              background: '#f8fafc', 
              borderRadius: '12px', 
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Participants</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#0D2C54' }}>
                    {participants.length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Deadline</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#0D2C54' }}>
                    {new Date(deadline).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Anonymity</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#0D2C54' }}>
                    {isAnonymous ? 'Anonymous' : 'Identified'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Reminders</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#0D2C54' }}>
                    7, 3, and 1 day before deadline
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>
                What happens when you launch:
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  Email invitations will be sent to all {participants.length} participants
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Each participant receives a unique link (no login required)
                </li>
                <li style={{ marginBottom: '8px' }}>
                  You'll be able to track progress and send reminders
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Report will be generated when {type === 'ceo-evaluation' ? 'minimum responses are received' : 'assessment closes'}
                </li>
              </ul>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#fef2f2',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '14px 28px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '14px 32px',
                  background: isSubmitting ? '#94a3b8' : color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: 'auto'
                }}
              >
                {isSubmitting ? (
                  <>Launching...</>
                ) : (
                  <>
                    <Mail size={18} /> Launch Assessment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssessmentSetup;
