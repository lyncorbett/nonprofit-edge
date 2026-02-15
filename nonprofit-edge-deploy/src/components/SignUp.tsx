/**
 * THE NONPROFIT EDGE - SignUp Page
 * Matches homepage pricing section styling exactly
 * Pick Plan → Stripe Checkout → Email → Onboarding → Dashboard
 * Monthly only. Enterprise goes to contact form.
 */

import React, { useState } from 'react';

const NAVY = '#0D2C54';
const TEAL = '#0097A9';

interface SignUpProps {
  onNavigate: (page: string) => void;
  onSignUpSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async (planId: string) => {
    setLoading(planId);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          billingCycle: 'monthly',
          successUrl: `${window.location.origin}/signup/success?plan=${planId}`,
          cancelUrl: `${window.location.origin}/signup`,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('Unable to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => onNavigate('/')}>
            <img src="/logo.svg" alt="The Nonprofit Edge" className="h-10" />
          </div>
          <button onClick={() => onNavigate('/login')} className="text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" style={{ color: TEAL }}>
            Already have an account? Sign in
          </button>
        </div>
      </header>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>Start Your Free Trial</h1>
            <p className="text-lg text-gray-600">3 days free. No charge until your trial ends. Cancel anytime.</p>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">{error}</div>
          )}

          <div className="grid md:grid-cols-4 gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Essential</h3>
              <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$79<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 1 user</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 10 assessments/mo</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 10 coaching sessions/mo</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Full Resource Library</li>
              </ul>
              <button onClick={() => handleStartTrial('essential')} disabled={loading === 'essential'} className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white cursor-pointer disabled:opacity-50" style={{ color: NAVY }}>
                {loading === 'essential' ? 'Redirecting...' : 'Start 3–Day Trial'}
              </button>
            </div>

            <div className="bg-white border-2 rounded-2xl p-6 relative shadow-lg" style={{ borderColor: TEAL }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: TEAL }}>MOST POPULAR</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Professional</h3>
              <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$159<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Up to 5 team members</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 25 assessments/mo</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 25 coaching sessions per person/mo</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Full Resource Library</li>
              </ul>
              <button onClick={() => handleStartTrial('professional')} disabled={loading === 'professional'} className="block w-full py-2.5 text-center text-sm font-bold rounded-lg text-white transition cursor-pointer disabled:opacity-50" style={{ backgroundColor: TEAL }}>
                {loading === 'professional' ? 'Redirecting...' : 'Start 3–Day Trial'}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Premium</h3>
              <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>$329<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Founding Member Rate</div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Everything in Professional</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Up to 10 team members</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Unlimited assessments</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> 500 coaching sessions/mo</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Monthly coaching call</li>
              </ul>
              <button onClick={() => handleStartTrial('premium')} disabled={loading === 'premium'} className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white cursor-pointer disabled:opacity-50" style={{ color: NAVY }}>
                {loading === 'premium' ? 'Redirecting...' : 'Start 3–Day Trial'}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Enterprise</h3>
              <div className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>Let's Talk</div>
              <div className="text-xs font-semibold mb-5" style={{ color: TEAL }}>Custom solutions</div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Everything in Premium</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Unlimited users</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Custom integrations</li>
                <li className="flex items-start gap-2 text-gray-600"><span style={{ color: TEAL }}>✓</span> Dedicated success manager</li>
              </ul>
              <button onClick={() => onNavigate('/contact')} className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white cursor-pointer" style={{ color: NAVY }}>
                Contact Sales
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-gray-500">
            🔒 <strong className="text-gray-700">Founding Member Rate:</strong> Lock in these prices forever. When we raise rates, yours stays the same.
          </p>
          <div className="text-center mt-6 text-xs text-gray-400">
            Secure checkout powered by Stripe · 256-bit encryption · Cancel anytime
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
