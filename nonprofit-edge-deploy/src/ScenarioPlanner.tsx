import React, { useState } from 'react';

const ScenarioPlanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    orgName: '',
    yourName: '',
    yourEmail: '',
    scenarioTopic: '',
    timeframe: '',
    currentSituation: '',
    keyVariables: '',
    bestCase: '',
    worstCase: '',
    constraints: '',
    additionalContext: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scenarioTopics = [
    { value: 'funding', label: 'Funding Change', desc: 'Major funder increase/decrease' },
    { value: 'expansion', label: 'Program Expansion', desc: 'Adding new services or locations' },
    { value: 'leadership', label: 'Leadership Transition', desc: 'CEO or key staff changes' },
    { value: 'merger', label: 'Merger/Partnership', desc: 'Combining with another org' },
    { value: 'economic', label: 'Economic Shifts', desc: 'Recession, policy changes' },
    { value: 'other', label: 'Other', desc: 'Custom scenario' },
  ];

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '40px' }}>🔮</div>
          <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54' }}>Scenarios Being Generated!</h2>
          <p style={{ color: '#64748b', margin: '16px 0 24px' }}>Your scenario analysis will be sent to <strong>{formData.yourEmail}</strong> within 24 hours.</p>
          <button onClick={() => window.location.href = '/tools'} style={{ padding: '12px 32px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Back to Tools</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Source Sans Pro, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0D2C54', color: 'white', padding: '24px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontFamily: 'Merriweather, serif' }}>Scenario Planner</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Explore best-case, worst-case, and most-likely scenarios for strategic decisions</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{ flex: 1, height: '4px', borderRadius: '2px', background: currentStep >= step ? '#0097A9' : '#e2e8f0' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '24px' }}>Your Organization</h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Organization Name *</label>
                  <input type="text" value={formData.orgName} onChange={(e) => updateField('orgName', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Name *</label>
                    <input type="text" value={formData.yourName} onChange={(e) => updateField('yourName', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Email *</label>
                    <input type="email" value={formData.yourEmail} onChange={(e) => updateField('yourEmail', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>What type of scenario are you planning for?</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {scenarioTopics.map((topic) => (
                      <label
                        key={topic.value}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '16px',
                          background: formData.scenarioTopic === topic.value ? '#f0fdfa' : '#f8fafc',
                          border: `2px solid ${formData.scenarioTopic === topic.value ? '#0097A9' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="scenarioTopic"
                            value={topic.value}
                            checked={formData.scenarioTopic === topic.value}
                            onChange={(e) => updateField('scenarioTopic', e.target.value)}
                          />
                          <span style={{ fontWeight: 600 }}>{topic.label}</span>
                        </div>
                        <span style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px', marginLeft: '24px' }}>{topic.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '24px' }}>Scenario Details</h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Planning Timeframe</label>
                  <select value={formData.timeframe} onChange={(e) => updateField('timeframe', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', background: 'white' }}>
                    <option value="">Select timeframe</option>
                    <option value="6months">6 months</option>
                    <option value="1year">1 year</option>
                    <option value="2years">2 years</option>
                    <option value="3-5years">3-5 years</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Describe your current situation</label>
                  <textarea value={formData.currentSituation} onChange={(e) => updateField('currentSituation', e.target.value)} rows={3} placeholder="What's your current state regarding this scenario? Revenue, staffing, programs, etc." style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Key variables/uncertainties</label>
                  <textarea value={formData.keyVariables} onChange={(e) => updateField('keyVariables', e.target.value)} rows={3} placeholder="What factors could significantly impact the outcome? (e.g., funder decisions, policy changes, leadership)" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', color: '#0D2C54', marginBottom: '24px' }}>Your Perspective</h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>What does "best case" look like to you?</label>
                  <textarea value={formData.bestCase} onChange={(e) => updateField('bestCase', e.target.value)} rows={3} placeholder="If everything goes well, what's the ideal outcome?" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>What does "worst case" look like?</label>
                  <textarea value={formData.worstCase} onChange={(e) => updateField('worstCase', e.target.value)} rows={3} placeholder="What's the downside scenario you're trying to prepare for?" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Known constraints</label>
                  <textarea value={formData.constraints} onChange={(e) => updateField('constraints', e.target.value)} rows={2} placeholder="Budget limits, board restrictions, timeline requirements, etc." style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
                </div>

                <div style={{ background: '#f0fdfa', border: '2px solid #0097A9', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#0D2C54' }}>What you'll receive:</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569' }}>
                    <li>Best-case scenario with strategic actions</li>
                    <li>Worst-case scenario with contingency plans</li>
                    <li>Most-likely scenario with probabilities</li>
                    <li>Key decision triggers and milestones</li>
                    <li>Recommended preparation steps</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1} style={{ padding: '12px 24px', background: currentStep === 1 ? '#f1f5f9' : 'white', color: currentStep === 1 ? '#94a3b8' : '#475569', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}>
              ← Back
            </button>
            {currentStep < 3 ? (
              <button onClick={() => setCurrentStep(prev => prev + 1)} style={{ padding: '12px 32px', background: '#0097A9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '12px 32px', background: isSubmitting ? '#94a3b8' : '#0D2C54', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                {isSubmitting ? 'Generating...' : 'Generate Scenarios'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;
