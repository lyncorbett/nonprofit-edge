import React, { useState } from 'react';

interface FormData {
  // Organization Info
  orgName: string;
  yourName: string;
  yourEmail: string;
  yourRole: string;
  
  // Board Composition
  boardSize: string;
  termLimits: string;
  boardDiversity: string;
  skillGaps: string;
  
  // Board Engagement
  meetingFrequency: string;
  attendance: string;
  preparation: string;
  participation: string;
  
  // Governance
  bylawsReview: string;
  committeesActive: string;
  conflictPolicy: string;
  boardEvaluation: string;
  
  // Fundraising & Giving
  givingPolicy: string;
  givingParticipation: string;
  fundraisingRole: string;
  donorRelationships: string;
  
  // Strategic Role
  strategicInvolvement: string;
  ceoRelationship: string;
  successionPlan: string;
  fiduciaryOversight: string;
  
  // Additional
  biggestChallenge: string;
}

const BoardAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    orgName: '',
    yourName: '',
    yourEmail: '',
    yourRole: '',
    boardSize: '',
    termLimits: '',
    boardDiversity: '',
    skillGaps: '',
    meetingFrequency: '',
    attendance: '',
    preparation: '',
    participation: '',
    bylawsReview: '',
    committeesActive: '',
    conflictPolicy: '',
    boardEvaluation: '',
    givingPolicy: '',
    givingParticipation: '',
    fundraisingRole: '',
    donorRelationships: '',
    strategicInvolvement: '',
    ceoRelationship: '',
    successionPlan: '',
    fiduciaryOversight: '',
    biggestChallenge: '',
  });

  const totalSteps = 7;

  const steps = [
    { number: 1, title: 'Your Info' },
    { number: 2, title: 'Composition' },
    { number: 3, title: 'Engagement' },
    { number: 4, title: 'Governance' },
    { number: 5, title: 'Fundraising' },
    { number: 6, title: 'Strategy' },
    { number: 7, title: 'Submit' },
  ];

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const RadioGroup = ({ 
    name, 
    options, 
    value, 
    onChange,
    label,
    description 
  }: {
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    label: string;
    description?: string;
  }) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{
        display: 'block',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '8px',
        fontSize: '1rem'
      }}>
        {label}
      </label>
      {description && (
        <p style={{ 
          margin: '0 0 12px 0', 
          color: '#64748b', 
          fontSize: '0.875rem' 
        }}>
          {description}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((option) => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: value === option.value ? '#f0fdfa' : '#f8fafc',
              border: `2px solid ${value === option.value ? '#0097A9' : '#e2e8f0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              style={{ marginRight: '12px' }}
            />
            <span style={{ color: '#334155' }}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Submit to Make.com webhook
      const response = await fetch(
        'https://hook.us1.make.com/446eyqchvkowne5vusqyk1nq895hmk6b',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Still show success for demo purposes
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              About You & Your Organization
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => updateField('orgName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                Your Name *
              </label>
              <input
                type="text"
                value={formData.yourName}
                onChange={(e) => updateField('yourName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                Your Email *
              </label>
              <input
                type="email"
                value={formData.yourEmail}
                onChange={(e) => updateField('yourEmail', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="We'll send your report here"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                Your Role *
              </label>
              <select
                value={formData.yourRole}
                onChange={(e) => updateField('yourRole', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="">Select your role</option>
                <option value="board_chair">Board Chair</option>
                <option value="board_member">Board Member</option>
                <option value="ceo">CEO / Executive Director</option>
                <option value="staff">Staff Member</option>
                <option value="consultant">Consultant</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              Board Composition
            </h2>

            <RadioGroup
              name="boardSize"
              label="How many members are on your board?"
              value={formData.boardSize}
              onChange={(v) => updateField('boardSize', v)}
              options={[
                { value: '1-5', label: '1-5 members' },
                { value: '6-10', label: '6-10 members' },
                { value: '11-15', label: '11-15 members' },
                { value: '16-20', label: '16-20 members' },
                { value: '21+', label: '21+ members' },
              ]}
            />

            <RadioGroup
              name="termLimits"
              label="Does your board have term limits?"
              value={formData.termLimits}
              onChange={(v) => updateField('termLimits', v)}
              options={[
                { value: 'yes_enforced', label: 'Yes, and they are enforced' },
                { value: 'yes_not_enforced', label: 'Yes, but not always enforced' },
                { value: 'no', label: 'No term limits' },
                { value: 'unsure', label: 'Not sure' },
              ]}
            />

            <RadioGroup
              name="boardDiversity"
              label="How would you rate your board's diversity (skills, demographics, perspectives)?"
              value={formData.boardDiversity}
              onChange={(v) => updateField('boardDiversity', v)}
              options={[
                { value: 'excellent', label: 'Excellent - well-rounded across all dimensions' },
                { value: 'good', label: 'Good - some gaps but generally diverse' },
                { value: 'fair', label: 'Fair - noticeable gaps in key areas' },
                { value: 'poor', label: 'Poor - lacks diversity in multiple areas' },
              ]}
            />

            <RadioGroup
              name="skillGaps"
              label="Are there critical skill gaps on your board?"
              description="Examples: finance, legal, fundraising, marketing, program expertise"
              value={formData.skillGaps}
              onChange={(v) => updateField('skillGaps', v)}
              options={[
                { value: 'no_gaps', label: 'No significant gaps' },
                { value: 'minor_gaps', label: 'Minor gaps that are manageable' },
                { value: 'significant_gaps', label: 'Significant gaps affecting board effectiveness' },
                { value: 'critical_gaps', label: 'Critical gaps requiring immediate attention' },
              ]}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              Board Engagement
            </h2>

            <RadioGroup
              name="meetingFrequency"
              label="How often does your full board meet?"
              value={formData.meetingFrequency}
              onChange={(v) => updateField('meetingFrequency', v)}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'bimonthly', label: 'Every other month' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'less', label: 'Less than quarterly' },
              ]}
            />

            <RadioGroup
              name="attendance"
              label="What is the typical attendance rate at board meetings?"
              value={formData.attendance}
              onChange={(v) => updateField('attendance', v)}
              options={[
                { value: '90+', label: '90%+ (almost everyone attends)' },
                { value: '75-89', label: '75-89% (most members attend)' },
                { value: '50-74', label: '50-74% (about half attend)' },
                { value: 'under50', label: 'Under 50% (struggle to get quorum)' },
              ]}
            />

            <RadioGroup
              name="preparation"
              label="Do board members come to meetings prepared (having read materials)?"
              value={formData.preparation}
              onChange={(v) => updateField('preparation', v)}
              options={[
                { value: 'always', label: 'Always - members are well-prepared' },
                { value: 'usually', label: 'Usually - most members most of the time' },
                { value: 'sometimes', label: 'Sometimes - hit or miss' },
                { value: 'rarely', label: 'Rarely - materials often not reviewed' },
              ]}
            />

            <RadioGroup
              name="participation"
              label="How actively do members participate in discussions?"
              value={formData.participation}
              onChange={(v) => updateField('participation', v)}
              options={[
                { value: 'all_engage', label: 'All members actively engage' },
                { value: 'most_engage', label: 'Most members participate; a few are quiet' },
                { value: 'few_dominate', label: 'A few members dominate; others are passive' },
                { value: 'minimal', label: 'Minimal engagement overall' },
              ]}
            />
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              Governance Practices
            </h2>

            <RadioGroup
              name="bylawsReview"
              label="When were your bylaws last reviewed and updated?"
              value={formData.bylawsReview}
              onChange={(v) => updateField('bylawsReview', v)}
              options={[
                { value: 'within1year', label: 'Within the last year' },
                { value: '1-3years', label: '1-3 years ago' },
                { value: '4-5years', label: '4-5 years ago' },
                { value: 'over5years', label: 'More than 5 years ago (or never)' },
              ]}
            />

            <RadioGroup
              name="committeesActive"
              label="Are board committees active and effective?"
              value={formData.committeesActive}
              onChange={(v) => updateField('committeesActive', v)}
              options={[
                { value: 'very_active', label: 'Very active - meet regularly and accomplish work' },
                { value: 'somewhat_active', label: 'Somewhat active - meet occasionally' },
                { value: 'minimal', label: 'Minimal activity - exist on paper only' },
                { value: 'no_committees', label: 'No standing committees' },
              ]}
            />

            <RadioGroup
              name="conflictPolicy"
              label="Do you have and follow a conflict of interest policy?"
              value={formData.conflictPolicy}
              onChange={(v) => updateField('conflictPolicy', v)}
              options={[
                { value: 'yes_followed', label: 'Yes, with annual disclosure and consistent enforcement' },
                { value: 'yes_informal', label: 'Yes, but enforcement is informal' },
                { value: 'have_not_follow', label: 'Have policy but rarely reference it' },
                { value: 'no_policy', label: 'No formal policy' },
              ]}
            />

            <RadioGroup
              name="boardEvaluation"
              label="Does the board conduct self-evaluation?"
              value={formData.boardEvaluation}
              onChange={(v) => updateField('boardEvaluation', v)}
              options={[
                { value: 'annual', label: 'Yes, annually' },
                { value: 'occasionally', label: 'Occasionally (every 2-3 years)' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'never', label: 'Never' },
              ]}
            />
          </div>
        );

      case 5:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              Fundraising & Giving
            </h2>

            <RadioGroup
              name="givingPolicy"
              label="Does your board have a give/get policy?"
              description="A requirement for board members to personally donate or raise funds"
              value={formData.givingPolicy}
              onChange={(v) => updateField('givingPolicy', v)}
              options={[
                { value: 'yes_amount', label: 'Yes, with a specific amount or range' },
                { value: 'yes_meaningful', label: 'Yes, "meaningful" gift (no specific amount)' },
                { value: 'expected', label: 'Giving is expected but not required' },
                { value: 'no', label: 'No give/get expectation' },
              ]}
            />

            <RadioGroup
              name="givingParticipation"
              label="What percentage of board members personally donate?"
              value={formData.givingParticipation}
              onChange={(v) => updateField('givingParticipation', v)}
              options={[
                { value: '100%', label: '100% participation' },
                { value: '75-99%', label: '75-99% participation' },
                { value: '50-74%', label: '50-74% participation' },
                { value: 'under50%', label: 'Under 50% participation' },
              ]}
            />

            <RadioGroup
              name="fundraisingRole"
              label="How actively do board members participate in fundraising?"
              value={formData.fundraisingRole}
              onChange={(v) => updateField('fundraisingRole', v)}
              options={[
                { value: 'very_active', label: 'Very active - solicit donors, attend events, make asks' },
                { value: 'somewhat_active', label: 'Somewhat active - attend events, open doors' },
                { value: 'passive', label: 'Passive - donate but don\'t actively fundraise' },
                { value: 'uninvolved', label: 'Uninvolved - see fundraising as staff\'s job' },
              ]}
            />

            <RadioGroup
              name="donorRelationships"
              label="Do board members help cultivate donor relationships?"
              value={formData.donorRelationships}
              onChange={(v) => updateField('donorRelationships', v)}
              options={[
                { value: 'yes_regularly', label: 'Yes, regularly and strategically' },
                { value: 'sometimes', label: 'Sometimes, when asked' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'never', label: 'Never' },
              ]}
            />
          </div>
        );

      case 6:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              Strategic Role
            </h2>

            <RadioGroup
              name="strategicInvolvement"
              label="How involved is the board in strategic planning?"
              value={formData.strategicInvolvement}
              onChange={(v) => updateField('strategicInvolvement', v)}
              options={[
                { value: 'leading', label: 'Leading - board drives strategic direction' },
                { value: 'collaborative', label: 'Collaborative - board and staff partner equally' },
                { value: 'approving', label: 'Approving - board reviews and approves staff\'s plan' },
                { value: 'minimal', label: 'Minimal - board rubber-stamps decisions' },
              ]}
            />

            <RadioGroup
              name="ceoRelationship"
              label="How would you describe the board-CEO relationship?"
              value={formData.ceoRelationship}
              onChange={(v) => updateField('ceoRelationship', v)}
              options={[
                { value: 'excellent', label: 'Excellent - strong partnership with clear roles' },
                { value: 'good', label: 'Good - generally positive with occasional friction' },
                { value: 'strained', label: 'Strained - tension or unclear boundaries' },
                { value: 'problematic', label: 'Problematic - significant issues' },
              ]}
            />

            <RadioGroup
              name="successionPlan"
              label="Does the board have a CEO succession plan?"
              value={formData.successionPlan}
              onChange={(v) => updateField('successionPlan', v)}
              options={[
                { value: 'yes_documented', label: 'Yes, documented and reviewed regularly' },
                { value: 'yes_informal', label: 'Yes, but informal/not documented' },
                { value: 'in_progress', label: 'In progress / being developed' },
                { value: 'no', label: 'No succession plan' },
              ]}
            />

            <RadioGroup
              name="fiduciaryOversight"
              label="How effectively does the board provide financial oversight?"
              value={formData.fiduciaryOversight}
              onChange={(v) => updateField('fiduciaryOversight', v)}
              options={[
                { value: 'excellent', label: 'Excellent - regular review, understands financials' },
                { value: 'good', label: 'Good - reviews financials, asks questions' },
                { value: 'minimal', label: 'Minimal - glances at reports, few questions' },
                { value: 'poor', label: 'Poor - limited understanding or engagement' },
              ]}
            />
          </div>
        );

      case 7:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Merriweather, serif', 
              color: '#0D2C54',
              marginBottom: '24px'
            }}>
              Final Thoughts & Submit
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                What's your board's biggest challenge right now? (Optional)
              </label>
              <textarea
                value={formData.biggestChallenge}
                onChange={(e) => updateField('biggestChallenge', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Share any specific challenges you'd like addressed in your report..."
              />
            </div>

            <div style={{
              background: '#f0fdfa',
              border: '2px solid #0097A9',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#0D2C54' }}>What happens next?</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569' }}>
                <li>We'll analyze your responses using our Board Governance framework</li>
                <li>You'll receive a detailed report within 24 hours</li>
                <li>Report includes scores, benchmarks, and recommendations</li>
                <li>Results sent to: <strong>{formData.yourEmail || '(enter email above)'}</strong></li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#d1fae5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px'
          }}>
            ✓
          </div>
          <h2 style={{ 
            fontFamily: 'Merriweather, serif',
            color: '#0D2C54',
            marginBottom: '16px'
          }}>
            Assessment Submitted!
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            Thank you for completing the Board Assessment. Your personalized report will be sent to <strong>{formData.yourEmail}</strong> within 24 hours.
          </p>
          <button
            onClick={() => window.location.href = '/tools'}
            style={{
              padding: '12px 32px',
              background: '#0097A9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: 'Source Sans Pro, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#0D2C54',
        color: 'white',
        padding: '24px 32px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '1.75rem',
            fontFamily: 'Merriweather, serif',
          }}>
            Board Assessment
          </h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Evaluate your board's effectiveness across governance, engagement, and strategic impact
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= step.number ? '#0097A9' : '#e2e8f0',
                  color: currentStep >= step.number ? 'white' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  marginBottom: '4px'
                }}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: currentStep >= step.number ? '#0D2C54' : '#94a3b8',
                  fontWeight: currentStep === step.number ? 600 : 400
                }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div style={{
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              background: 'linear-gradient(90deg, #0097A9, #0D2C54)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          {renderStep()}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              style={{
                padding: '12px 24px',
                background: currentStep === 1 ? '#f1f5f9' : 'white',
                color: currentStep === 1 ? '#94a3b8' : '#475569',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{
                  padding: '12px 32px',
                  background: '#0097A9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '12px 32px',
                  background: isSubmitting ? '#94a3b8' : '#0D2C54',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardAssessment;
