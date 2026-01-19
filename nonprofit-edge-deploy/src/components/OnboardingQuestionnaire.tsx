import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface OnboardingData {
  role: string;
  organizationSize: string;
  focusArea: string;
  engagementPreference: string;
  leadershipJourneyOptIn: boolean;
  tutorialOptIn: boolean;
}

interface OnboardingQuestionnaireProps {
  onComplete: (data: OnboardingData) => void;
  userName?: string;
}

const OnboardingQuestionnaire: React.FC<OnboardingQuestionnaireProps> = ({ 
  onComplete, 
  userName = 'there' 
}) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    role: '',
    organizationSize: '',
    focusArea: '',
    engagementPreference: 'weekly',
    leadershipJourneyOptIn: false,
    tutorialOptIn: false,
  });

  const totalSteps = 4;

  const roles = [
    { value: 'ed_ceo', label: 'Executive Director / CEO' },
    { value: 'board_member', label: 'Board Member' },
    { value: 'development', label: 'Development Director' },
    { value: 'program', label: 'Program Manager' },
    { value: 'operations', label: 'Operations / Admin' },
    { value: 'other', label: 'Other' },
  ];

  const organizationSizes = [
    { value: 'under_500k', label: 'Under $500K' },
    { value: '500k_2m', label: '$500K - $2M' },
    { value: '2m_10m', label: '$2M - $10M' },
    { value: 'over_10m', label: 'Over $10M' },
  ];

  const focusAreas = [
    { value: 'board_engagement', label: 'Board Engagement', description: 'Strengthen board relationships and governance' },
    { value: 'strategic_planning', label: 'Strategic Planning', description: 'Clarify direction and align priorities' },
    { value: 'funding', label: 'Funding / Development', description: 'Grow revenue and diversify funding' },
    { value: 'team_management', label: 'Team Management', description: 'Build and lead a high-performing team' },
    { value: 'personal_capacity', label: 'Personal Capacity', description: 'Avoid burnout and lead sustainably' },
  ];

  const engagementOptions = [
    { value: 'daily', label: 'Daily', description: 'Daily insights and leadership prompts' },
    { value: 'weekly', label: 'Weekly', description: 'Weekly digest with key resources' },
    { value: 'minimal', label: 'Only when I reach out', description: 'Self-directed, minimal emails' },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.role && data.organizationSize;
      case 2: return data.focusArea;
      case 3: return data.engagementPreference;
      case 4: return true; // Tutorial opt-in is optional
      default: return false;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(13, 44, 84, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 9999,
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0D2C54 0%, #1a4175 100%)',
          padding: '24px 32px',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Sparkles size={24} style={{ color: '#0097A9' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
              {step === 1 && `Welcome, ${userName}!`}
              {step === 2 && "What's your focus?"}
              {step === 3 && "How should we connect?"}
              {step === 4 && "One more thing..."}
            </h2>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            {step === 1 && "Let's personalize your experience"}
            {step === 2 && "We'll tailor your insights to this area"}
            {step === 3 && "Choose what works for your schedule"}
            {step === 4 && "Would you like a quick tour?"}
          </p>

          {/* Progress Bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px',
          }}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: s <= step ? '#0097A9' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Step 1: Role & Organization */}
          {step === 1 && (
            <div>
              <label style={{ display: 'block', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '10px' }}>
                  What's your role?
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setData({ ...data, role: role.value })}
                      style={{
                        padding: '14px 16px',
                        border: data.role === role.value ? '2px solid #0097A9' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        background: data.role === role.value ? 'rgba(0, 151, 169, 0.08)' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: data.role === role.value ? '#0097A9' : '#334155',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '10px' }}>
                  Organization budget size?
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {organizationSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setData({ ...data, organizationSize: size.value })}
                      style={{
                        padding: '14px 16px',
                        border: data.organizationSize === size.value ? '2px solid #0097A9' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        background: data.organizationSize === size.value ? 'rgba(0, 151, 169, 0.08)' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: data.organizationSize === size.value ? '#0097A9' : '#334155',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </label>
            </div>
          )}

          {/* Step 2: Focus Area */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                Which area needs the most attention right now?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {focusAreas.map((focus) => (
                  <button
                    key={focus.value}
                    onClick={() => setData({ ...data, focusArea: focus.value })}
                    style={{
                      padding: '16px 20px',
                      border: data.focusArea === focus.value ? '2px solid #0097A9' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      background: data.focusArea === focus.value ? 'rgba(0, 151, 169, 0.08)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 600, color: data.focusArea === focus.value ? '#0097A9' : '#0D2C54', marginBottom: '4px' }}>
                      {focus.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {focus.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Engagement Preferences */}
          {step === 3 && (
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                How often would you like to hear from us?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {engagementOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, engagementPreference: option.value })}
                    style={{
                      padding: '16px 20px',
                      border: data.engagementPreference === option.value ? '2px solid #0097A9' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      background: data.engagementPreference === option.value ? 'rgba(0, 151, 169, 0.08)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 600, color: data.engagementPreference === option.value ? '#0097A9' : '#0D2C54', marginBottom: '4px' }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Leadership Journey Opt-In */}
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(212, 168, 75, 0.1) 0%, rgba(212, 168, 75, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(212, 168, 75, 0.3)',
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={data.leadershipJourneyOptIn}
                    onChange={(e) => setData({ ...data, leadershipJourneyOptIn: e.target.checked })}
                    style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#D4A84B' }}
                  />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0D2C54', marginBottom: '4px' }}>
                      ✨ Opt-in to Leadership Journey
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      Receive a daily leadership prompt to grow as a leader. You can change this anytime in settings.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Tutorial Opt-In */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <Check size={40} style={{ color: 'white' }} />
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0D2C54', marginBottom: '12px' }}>
                You're all set!
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
                Your dashboard is ready and personalized for {data.focusArea.replace('_', ' ')}.
              </p>

              <div style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '16px',
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={data.tutorialOptIn}
                    onChange={(e) => setData({ ...data, tutorialOptIn: e.target.checked })}
                    style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#0097A9' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0D2C54', marginBottom: '4px' }}>
                      Show me a quick tour
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      A 2-minute walkthrough of the key features (recommended for new users)
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: '#64748b',
                fontFamily: 'inherit',
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              border: 'none',
              background: canProceed() 
                ? 'linear-gradient(135deg, #0097A9 0%, #00b4cc 100%)' 
                : '#e2e8f0',
              borderRadius: '10px',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 600,
              color: canProceed() ? 'white' : '#94a3b8',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            {step === totalSteps ? 'Go to Dashboard' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Footer Helper Text */}
        <div style={{
          padding: '12px 32px 20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#94a3b8',
        }}>
          Takes about 2 minutes • Your answers shape your experience
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
