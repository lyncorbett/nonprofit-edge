/**
 * THE NONPROFIT EDGE - Signup Flow
 * Multi-step: Select Plan → Create Account → Stripe Checkout
 * Pricing loaded from Supabase (editable without code changes)
 */

import React, { useState, useEffect } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';

interface PricingPlan {
  id: string;
  plan_key: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  is_popular: boolean;
  display_order: number;
  team_seats: number;
  features?: { feature_text: string; display_order: number }[];
}

interface SignupFlowProps {
  onComplete: () => void;
  onBack: () => void;
  supabase: any;
}

type BillingCycle = 'monthly' | 'annual';

const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete, onBack, supabase }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('professional');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [formData, setFormData] = useState({
    fullName: '',
    orgName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load pricing plans from Supabase
  useEffect(() => {
    loadPricingPlans();
  }, []);

  const loadPricingPlans = async () => {
    try {
      // Get plans with features
      const { data: plansData, error: plansError } = await supabase
        .from('pricing_plans')
        .select(`
          *,
          features:plan_features(feature_text, display_order)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (plansError) throw plansError;

      // Sort features by display_order
      const plansWithSortedFeatures = plansData?.map((plan: PricingPlan) => ({
        ...plan,
        features: plan.features?.sort((a, b) => a.display_order - b.display_order)
      }));

      setPlans(plansWithSortedFeatures || []);
      
      // Set default to popular plan or first plan
      const popularPlan = plansWithSortedFeatures?.find((p: PricingPlan) => p.is_popular);
      if (popularPlan) {
        setSelectedPlanKey(popularPlan.plan_key);
      } else if (plansWithSortedFeatures?.length > 0) {
        setSelectedPlanKey(plansWithSortedFeatures[0].plan_key);
      }
    } catch (err) {
      console.error('Error loading plans:', err);
      setError('Unable to load pricing plans. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.plan_key === selectedPlanKey);
  
  const getPrice = (plan: PricingPlan) => {
    return billingCycle === 'monthly' ? plan.monthly_price : plan.annual_price;
  };

  const getMonthlyEquivalent = (plan: PricingPlan) => {
    return billingCycle === 'annual' 
      ? Math.round(plan.annual_price / 12) 
      : plan.monthly_price;
  };

  const handlePlanSelect = (planKey: string) => {
    setSelectedPlanKey(planKey);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinueToAccount = () => {
    setStep(2);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            org_name: formData.orgName,
            selected_plan: selectedPlanKey,
            billing_cycle: billingCycle
          }
        }
      });

      if (authError) throw authError;

      // Move to payment step
      setStep(3);
      
      // Initiate Stripe Checkout
      await initiateStripeCheckout(authData.user?.id);

    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const initiateStripeCheckout = async (userId?: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlanKey,
          billingCycle,
          email: formData.email,
          userId,
          price: selectedPlan ? getPrice(selectedPlan) : 0,
          planName: selectedPlan?.name || '',
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/signup?canceled=true`
        }),
      });

      const { url, error } = await response.json();
      
      if (error) throw new Error(error);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
    } catch (err: any) {
      console.error('Stripe error:', err);
      setError('Unable to start checkout. Please try again.');
      setSubmitting(false);
      setStep(2);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: TEAL, borderTopColor: 'transparent' }}
          />
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img 
            src="/logo.svg" 
            alt="The Nonprofit Edge" 
            className="h-10"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src.includes('.svg')) {
                img.src = '/logo.jpg';
              } else if (img.src.includes('logo.jpg')) {
                img.src = '/SVG file-01.svg';
              } else {
                img.src = '/JPG file-01.jpg';
              }
            }}
          />
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to login
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                    step >= s 
                      ? 'text-white' 
                      : 'text-gray-400 border-2 border-gray-300'
                  }`}
                  style={{ backgroundColor: step >= s ? TEAL : 'transparent' }}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm hidden sm:inline ${step >= s ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'Select Plan' : s === 2 ? 'Create Account' : 'Payment'}
                </span>
                {s < 3 && (
                  <div className={`w-6 sm:w-12 h-0.5 mx-2 sm:mx-4 ${step > s ? 'bg-teal-500' : 'bg-gray-300'}`} style={{ backgroundColor: step > s ? TEAL : undefined }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Step 1: Select Plan */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: NAVY }}>
                Choose Your Plan
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Start with a 3-day free trial. Cancel anytime.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className={`text-xs sm:text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors"
                style={{ backgroundColor: billingCycle === 'annual' ? TEAL : '#d1d5db' }}
              >
                <div 
                  className={`absolute top-1 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6 sm:translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs sm:text-sm ${billingCycle === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: TEAL }}>
                  Save 2 months
                </span>
              )}
            </div>

            {/* Plan Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {plans.map((plan) => {
                const isSelected = selectedPlanKey === plan.plan_key;
                const monthlyEq = getMonthlyEquivalent(plan);
                const totalPrice = getPrice(plan);

                return (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.plan_key)}
                    className={`relative rounded-2xl p-4 sm:p-6 cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 shadow-lg' 
                        : 'border border-gray-200 hover:border-gray-300'
                    } ${plan.is_popular ? 'bg-gradient-to-b from-[#1a365d] to-[#0f1f33] text-white' : 'bg-white'}`}
                    style={{ 
                      ringColor: isSelected ? TEAL : undefined,
                      borderColor: isSelected && !plan.is_popular ? TEAL : undefined
                    }}
                  >
                    {plan.is_popular && (
                      <div 
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: TEAL }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <h3 className={`text-lg sm:text-xl font-bold mb-1 ${plan.is_popular ? 'text-white' : ''}`} style={{ color: plan.is_popular ? undefined : NAVY }}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${plan.is_popular ? 'text-gray-300' : 'text-gray-500'}`}>
                      {plan.description}
                    </p>

                    <div className="mb-3 sm:mb-4">
                      <span className={`text-3xl sm:text-4xl font-bold ${plan.is_popular ? 'text-white' : ''}`} style={{ color: plan.is_popular ? undefined : NAVY }}>
                        ${monthlyEq}
                      </span>
                      <span className={`text-xs sm:text-sm ${plan.is_popular ? 'text-gray-300' : 'text-gray-500'}`}>/month</span>
                      {billingCycle === 'annual' && (
                        <div className={`text-[10px] sm:text-xs ${plan.is_popular ? 'text-gray-400' : 'text-gray-400'}`}>
                          ${totalPrice} billed annually
                        </div>
                      )}
                    </div>

                    <button
                      className={`w-full py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm mb-3 sm:mb-4 transition ${
                        plan.is_popular 
                          ? 'bg-white hover:bg-gray-100' 
                          : isSelected
                            ? 'text-white hover:opacity-90'
                            : 'border border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ 
                        color: plan.is_popular ? NAVY : isSelected ? 'white' : NAVY,
                        backgroundColor: !plan.is_popular && isSelected ? TEAL : undefined
                      }}
                    >
                      {isSelected ? '✓ Selected' : `Start ${plan.name}`}
                    </button>

                    <ul className="space-y-1.5 sm:space-y-2">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                          <span style={{ color: plan.is_popular ? '#4ade80' : TEAL }}>✓</span>
                          <span className={plan.is_popular ? 'text-gray-200' : 'text-gray-600'}>
                            {feature.feature_text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={handleContinueToAccount}
                disabled={!selectedPlan}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white font-semibold text-base sm:text-lg hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: TEAL }}
              >
                Continue with {selectedPlan?.name || 'Plan'} →
              </button>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-3">
                3-day free trial · No charge today · Cancel anytime
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Create Account */}
        {step === 2 && selectedPlan && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: NAVY }}>
                Create Your Account
              </h1>
              <p className="text-gray-600 text-sm">
                {selectedPlan.name} Plan · ${getMonthlyEquivalent(selectedPlan)}/month
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent focus:outline-none"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent focus:outline-none"
                  placeholder="Community Foundation of San Diego"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent focus:outline-none"
                  placeholder="jane@nonprofit.org"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent focus:outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: TEAL }}
              >
                {submitting ? 'Creating Account...' : 'Continue to Payment →'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to plan selection
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Payment Redirect */}
        {step === 3 && selectedPlan && (
          <div className="max-w-md mx-auto text-center py-8">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: TEAL }}
            >
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: NAVY }}>
              Redirecting to Secure Checkout...
            </h2>
            <p className="text-gray-600 mb-6">
              You'll be taken to Stripe to complete your payment.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{selectedPlan.name} Plan ({billingCycle})</span>
                <span className="font-semibold">
                  ${getPrice(selectedPlan)}/{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>3-day free trial</span>
                <span>-${getPrice(selectedPlan)}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
                <span>Due today</span>
                <span className="text-green-600">$0.00</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              🔒 Secured by Stripe · 256-bit encryption
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupFlow;
