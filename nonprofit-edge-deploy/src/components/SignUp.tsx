/**
 * THE NONPROFIT EDGE - SignUp Page
 * Multi-step registration with Stripe integration ready
 * Updated: Uses regular anchor tags for navigation
 */

import React, { useState } from 'react';

const NAVY = '#1a365d';
const TEAL = '#0097a7';
const TEAL_LIGHT = '#e0f7fa';

interface SignUpProps {
  onNavigate?: (page: string) => void;
  supabase: any;
  selectedPlan?: string;
}

const SignUp: React.FC<SignUpProps> = ({ supabase, selectedPlan = 'professional' }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Profile
    fullName: '',
    jobTitle: '',
    phone: '',
    // Step 3: Organization
    orgName: '',
    orgType: '',
    orgSize: '',
    website: '',
    // Step 4: Plan
    plan: selectedPlan,
    billingCycle: 'monthly'
  });

  const plans = [
    { id: 'essential', name: 'Essential', price: 79, features: ['1 person', '10 assessments/month'] },
    { id: 'professional', name: 'Professional', price: 159, features: ['Up to 5 team members', 'Unlimited Ask the Professor'] },
    { id: 'premium', name: 'Premium', price: 329, features: ['Up to 10 team members', 'Monthly coaching call'] }
  ];

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.password) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.fullName) {
          setError('Please enter your full name');
          return false;
        }
        break;
      case 3:
        if (!formData.orgName) {
          setError('Please enter your organization name');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      window.location.href = '/';
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (authError) throw authError;

      // 2. Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.orgName,
          org_type: formData.orgType,
          size: formData.orgSize,
          website: formData.website,
          tier: formData.plan,
          billing_cycle: formData.billingCycle,
          trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // 3. Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: formData.email,
          full_name: formData.fullName,
          job_title: formData.jobTitle,
          phone: formData.phone,
          organization_id: orgData.id,
          role: 'admin'
        });

      if (userError) throw userError;

      // 4. Redirect to dashboard
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === formData.plan);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a 
            href="/"
            style={{ fontSize: '1.25rem', fontWeight: 800, color: NAVY, textDecoration: 'none' }}
          >
            The Nonprofit <span style={{ color: TEAL }}>Edge</span>
          </a>
          <a
            href="/signin"
            style={{ color: TEAL, textDecoration: 'none', fontWeight: 500 }}
          >
            Already have an account? Sign in
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                background: s <= step ? TEAL : '#e2e8f0',
                color: s <= step ? 'white' : '#94a3b8'
              }}>
                {s < step ? '✓' : s}
              </div>
              {s < 4 && (
                <div style={{
                  width: 60,
                  height: 2,
                  background: s < step ? TEAL : '#e2e8f0',
                  margin: '0 0.5rem'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: NAVY, marginBottom: '0.5rem' }}>
            {step === 1 && 'Create Your Account'}
            {step === 2 && 'Tell Us About Yourself'}
            {step === 3 && 'Your Organization'}
            {step === 4 && 'Choose Your Plan'}
          </h1>
          <p style={{ color: '#64748b' }}>
            {step === 1 && 'Start your 3-day free trial'}
            {step === 2 && 'Help us personalize your experience'}
            {step === 3 && 'We\'ll set up your workspace'}
            {step === 4 && 'No charge until your trial ends'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: 8,
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem'
        }}>
          {/* Step 1: Account */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Work Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="you@organization.org"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  placeholder="At least 8 characters"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateForm('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateForm('fullName', e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => updateForm('jobTitle', e.target.value)}
                  placeholder="e.g., Executive Director"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 3: Organization */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => updateForm('orgName', e.target.value)}
                  placeholder="Your nonprofit's name"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Organization Type
                </label>
                <select
                  value={formData.orgType}
                  onChange={(e) => updateForm('orgType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select type...</option>
                  <option value="501c3">501(c)(3) Nonprofit</option>
                  <option value="501c4">501(c)(4) Social Welfare</option>
                  <option value="501c6">501(c)(6) Trade Association</option>
                  <option value="foundation">Private Foundation</option>
                  <option value="government">Government Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Organization Size
                </label>
                <select
                  value={formData.orgSize}
                  onChange={(e) => updateForm('orgSize', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select size...</option>
                  <option value="1-5">1-5 employees</option>
                  <option value="6-15">6-15 employees</option>
                  <option value="16-50">16-50 employees</option>
                  <option value="51-100">51-100 employees</option>
                  <option value="100+">100+ employees</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.5rem' }}>
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateForm('website', e.target.value)}
                  placeholder="https://yourorganization.org"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Plan Selection */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => updateForm('plan', plan.id)}
                    style={{
                      border: `2px solid ${formData.plan === plan.id ? TEAL : '#e2e8f0'}`,
                      borderRadius: 12,
                      padding: '1.25rem',
                      cursor: 'pointer',
                      background: formData.plan === plan.id ? TEAL_LIGHT : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: NAVY }}>{plan.name}</span>
                      <span style={{ fontWeight: 700, color: NAVY }}>
                        ${plan.price}<span style={{ fontWeight: 400, color: '#64748b' }}>/mo</span>
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {plan.features.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing Cycle */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: NAVY, marginBottom: '0.75rem' }}>
                  Billing Cycle
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{
                    flex: 1,
                    border: `2px solid ${formData.billingCycle === 'monthly' ? TEAL : '#e2e8f0'}`,
                    borderRadius: 8,
                    padding: '1rem',
                    cursor: 'pointer',
                    background: formData.billingCycle === 'monthly' ? TEAL_LIGHT : 'white',
                    textAlign: 'center'
                  }}>
                    <input
                      type="radio"
                      name="billing"
                      value="monthly"
                      checked={formData.billingCycle === 'monthly'}
                      onChange={(e) => updateForm('billingCycle', e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontWeight: 600, color: NAVY }}>Monthly</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Billed monthly</div>
                  </label>
                  <label style={{
                    flex: 1,
                    border: `2px solid ${formData.billingCycle === 'annual' ? TEAL : '#e2e8f0'}`,
                    borderRadius: 8,
                    padding: '1rem',
                    cursor: 'pointer',
                    background: formData.billingCycle === 'annual' ? TEAL_LIGHT : 'white',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <input
                      type="radio"
                      name="billing"
                      value="annual"
                      checked={formData.billingCycle === 'annual'}
                      onChange={(e) => updateForm('billingCycle', e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: -10,
                      right: 10,
                      background: '#16a34a',
                      color: 'white',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.5rem',
                      borderRadius: 4
                    }}>
                      SAVE 20%
                    </div>
                    <div style={{ fontWeight: 600, color: NAVY }}>Annual</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>2 months free</div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 8,
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>{selectedPlanData?.name} Plan</span>
                  <span style={{ fontWeight: 600, color: NAVY }}>
                    ${formData.billingCycle === 'annual' 
                      ? Math.round((selectedPlanData?.price || 0) * 12 * 0.8) 
                      : selectedPlanData?.price}/
                    {formData.billingCycle === 'annual' ? 'yr' : 'mo'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: '0.875rem' }}>
                  <span>3-day free trial</span>
                  <span>-${selectedPlanData?.price}</span>
                </div>
                <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: NAVY }}>
                  <span>Due today</span>
                  <span>$0.00</span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                Your card will be charged after your 3-day trial ends. Cancel anytime.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                background: 'white',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={loading}
              style={{
                flex: 2,
                padding: '1rem',
                border: 'none',
                borderRadius: 8,
                background: TEAL,
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : step === 4 ? 'Start Free Trial →' : 'Continue →'}
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          <p>🔒 Secure checkout • Cancel anytime • No credit card required for trial</p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
