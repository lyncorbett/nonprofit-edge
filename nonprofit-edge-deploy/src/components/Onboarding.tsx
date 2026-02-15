/**
 * THE NONPROFIT EDGE - Onboarding Questionnaire
 * First page new users see after signing in
 * Collects org info, role, challenges, LinkedIn
 * Saves to profiles table for personalization
 */

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface OnboardingProps {
  user: { id: string; name?: string; email?: string };
  onComplete: () => void;
}

const ORG_SIZES = [
  'Under $250K',
  '$250K – $500K',
  '$500K – $1M',
  '$1M – $5M',
  '$5M – $10M',
  '$10M+',
];

const ROLES = [
  'Executive Director / CEO',
  'Deputy Director / COO',
  'Development Director',
  'Program Director',
  'Board Chair / Board Member',
  'Consultant',
  'Other',
];

const CHALLENGES = [
  'Board engagement & governance',
  'Fundraising & revenue growth',
  'Strategic planning',
  'Team management & capacity',
  'Program evaluation & impact',
  'Financial sustainability',
  'Leadership development',
  'Succession planning',
];

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    orgBudget: '',
    role: '',
    yearsInRole: '',
    topChallenges: [] as string[],
    linkedin: '',
  });

  const firstName = user.name?.split(' ')[0] || 'there';

  const toggleChallenge = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      topChallenges: prev.topChallenges.includes(challenge)
        ? prev.topChallenges.filter(c => c !== challenge)
        : prev.topChallenges.length < 3
          ? [...prev.topChallenges, challenge]
          : prev.topChallenges,
    }));
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await supabase
        .from('profiles')
        .update({
          organization: formData.orgName,
          org_budget: formData.orgBudget,
          role: formData.role,
          years_in_role: formData.yearsInRole,
          top_challenges: formData.topChallenges,
          linkedin_url: formData.linkedin,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      onComplete();
    } catch (err) {
      console.error('Onboarding save error:', err);
      onComplete(); // Don't block them if save fails
    }
  };

  const canProceedStep1 = formData.orgName && formData.orgBudget && formData.role;
  const canProceedStep2 = formData.topChallenges.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>The Nonprofit</span>
          <span style={{ color: TEAL, fontSize: '18px', fontWeight: 700 }}>Edge</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: step >= s ? TEAL : '#e2e8f0',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>Step {step} of 3</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 20px 60px' }}>

        {/* Step 1: About Your Organization */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: NAVY, marginBottom: '8px' }}>
              Welcome, {firstName}! 👋
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
              Let's set up your experience. This helps us personalize your tools and recommendations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '6px' }}>
                  Organization Name
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                  placeholder="e.g., Community Foundation of San Diego"
                  style={{
                    width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '6px' }}>
                  Annual Operating Budget
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {ORG_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setFormData({ ...formData, orgBudget: size })}
                      style={{
                        padding: '10px 8px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        border: formData.orgBudget === size ? `2px solid ${TEAL}` : '1px solid #d1d5db',
                        background: formData.orgBudget === size ? '#f0fdfa' : 'white',
                        color: formData.orgBudget === size ? TEAL : '#475569',
                        transition: 'all 0.15s',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '6px' }}>
                  Your Role
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => setFormData({ ...formData, role })}
                      style={{
                        padding: '10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', textAlign: 'left',
                        border: formData.role === role ? `2px solid ${TEAL}` : '1px solid #d1d5db',
                        background: formData.role === role ? '#f0fdfa' : 'white',
                        color: formData.role === role ? TEAL : '#475569',
                        fontWeight: formData.role === role ? 600 : 400,
                        transition: 'all 0.15s',
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              style={{
                width: '100%', padding: '14px', background: canProceedStep1 ? TEAL : '#d1d5db',
                color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700,
                cursor: canProceedStep1 ? 'pointer' : 'default', marginTop: '32px',
                transition: 'background 0.2s',
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Challenges */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: NAVY, marginBottom: '8px' }}>
              What keeps you up at night?
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
              Select up to 3 challenges you're facing. This helps The Professor give you better advice.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CHALLENGES.map(challenge => {
                const selected = formData.topChallenges.includes(challenge);
                const disabled = !selected && formData.topChallenges.length >= 3;
                return (
                  <button
                    key={challenge}
                    onClick={() => toggleChallenge(challenge)}
                    disabled={disabled}
                    style={{
                      padding: '14px 16px', borderRadius: '10px', fontSize: '14px', cursor: disabled ? 'default' : 'pointer',
                      textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
                      border: selected ? `2px solid ${TEAL}` : '1px solid #d1d5db',
                      background: selected ? '#f0fdfa' : 'white',
                      color: disabled ? '#cbd5e1' : selected ? TEAL : '#475569',
                      fontWeight: selected ? 600 : 400,
                      opacity: disabled ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                      border: selected ? `2px solid ${TEAL}` : '2px solid #d1d5db',
                      background: selected ? TEAL : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '12px', fontWeight: 700,
                    }}>
                      {selected ? '✓' : ''}
                    </span>
                    {challenge}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
              {formData.topChallenges.length}/3 selected
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1, padding: '14px', background: 'white', color: '#64748b',
                  border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                style={{
                  flex: 2, padding: '14px', background: canProceedStep2 ? TEAL : '#d1d5db',
                  color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px',
                  fontWeight: 700, cursor: canProceedStep2 ? 'pointer' : 'default',
                }}
              >
                Almost done →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Optional Info */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: NAVY, marginBottom: '8px' }}>
              One more thing (optional)
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
              Help us connect you with the right resources and community.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '6px' }}>
                  How long have you been in your current role?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['Under 1 year', '1–3 years', '3–7 years', '7+ years'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setFormData({ ...formData, yearsInRole: yr })}
                      style={{
                        padding: '10px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                        border: formData.yearsInRole === yr ? `2px solid ${TEAL}` : '1px solid #d1d5db',
                        background: formData.yearsInRole === yr ? '#f0fdfa' : 'white',
                        color: formData.yearsInRole === yr ? TEAL : '#475569',
                      }}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '6px' }}>
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourname"
                  style={{
                    width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Optional — helps us personalize your experience
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1, padding: '14px', background: 'white', color: '#64748b',
                  border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                style={{
                  flex: 2, padding: '14px', background: TEAL, color: 'white',
                  border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700,
                  cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Setting up...' : 'Take Me to My Dashboard →'}
              </button>
            </div>

            <button
              onClick={handleComplete}
              style={{
                width: '100%', marginTop: '12px', padding: '8px', background: 'none',
                border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
