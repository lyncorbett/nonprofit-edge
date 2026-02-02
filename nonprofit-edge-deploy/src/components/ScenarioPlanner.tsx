import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, ChevronRight, ChevronLeft, GitBranch } from 'lucide-react';

interface ScenarioPlannerProps {
  onNavigate?: (route: string) => void;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orgName: '',
    yourName: '',
    yourEmail: '',
    annualBudget: '',
    staffSize: '',
    primaryServices: '',
    scenarioTopic: '',
    timeHorizon: '',
    keyUncertainties: '',
    bestCaseDescription: '',
    bestCaseEnablers: '',
    worstCaseDescription: '',
    worstCaseTriggers: '',
    currentTrajectoryDescription: '',
    criticalDecisions: '',
    resourceConstraints: '',
    additionalContext: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.yourEmail) {
      setError('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        'https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }),
        }
      );
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 5;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scenarios Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your PIVOT scenario analysis is being processed. You'll receive a comprehensive report at <strong>{formData.yourEmail}</strong> within 24-48 hours.
          </p>
          <button onClick={() => onNavigate?.('/dashboard')} className="px-6 py-3 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847]">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => onNavigate?.('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PIVOT Scenario Planner</h1>
              <p className="text-sm text-gray-500">Plan for multiple futures</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#27ae60] transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} />
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-6">Organization Overview</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                      <input type="text" value={formData.orgName} onChange={(e) => handleInputChange('orgName', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input type="text" value={formData.yourName} onChange={(e) => handleInputChange('yourName', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                      <input type="email" value={formData.yourEmail} onChange={(e) => handleInputChange('yourEmail', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" placeholder="Report will be sent here" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Budget</label>
                      <select value={formData.annualBudget} onChange={(e) => handleInputChange('annualBudget', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]">
                        <option value="">Select range</option>
                        <option value="under_500k">Under $500K</option>
                        <option value="500k_1m">$500K - $1M</option>
                        <option value="1m_5m">$1M - $5M</option>
                        <option value="5m_10m">$5M - $10M</option>
                        <option value="over_10m">Over $10M</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Services/Programs</label>
                    <textarea value={formData.primaryServices} onChange={(e) => handleInputChange('primaryServices', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="Briefly describe your main programs or services..." />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-6">Scenario Focus</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What topic or decision do you want to explore?</label>
                    <textarea value={formData.scenarioTopic} onChange={(e) => handleInputChange('scenarioTopic', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="e.g., Expanding to a new location, launching a new program, responding to funding changes..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon</label>
                    <select value={formData.timeHorizon} onChange={(e) => handleInputChange('timeHorizon', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]">
                      <option value="">Select timeframe</option>
                      <option value="1_year">1 Year</option>
                      <option value="2_3_years">2-3 Years</option>
                      <option value="5_years">5 Years</option>
                      <option value="10_years">10+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Uncertainties</label>
                    <textarea value={formData.keyUncertainties} onChange={(e) => handleInputChange('keyUncertainties', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="What factors are most uncertain that could affect outcomes? (e.g., funding, policy changes, community needs...)" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Best Case Scenario</h3>
                <p className="text-gray-600 text-sm mb-6">Describe what success looks like if everything goes well.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Best Case Scenario</label>
                    <textarea value={formData.bestCaseDescription} onChange={(e) => handleInputChange('bestCaseDescription', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={4} placeholder="What does success look like? What outcomes would you achieve?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What Would Enable This Scenario?</label>
                    <textarea value={formData.bestCaseEnablers} onChange={(e) => handleInputChange('bestCaseEnablers', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="What conditions, resources, or actions would make this happen?" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Worst Case Scenario</h3>
                <p className="text-gray-600 text-sm mb-6">Describe what could go wrong and how to prepare.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Worst Case Scenario</label>
                    <textarea value={formData.worstCaseDescription} onChange={(e) => handleInputChange('worstCaseDescription', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={4} placeholder="What challenges or failures could occur? What would be the impact?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What Would Trigger This Scenario?</label>
                    <textarea value={formData.worstCaseTriggers} onChange={(e) => handleInputChange('worstCaseTriggers', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="What events, decisions, or conditions would lead to this outcome?" />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Strategic Considerations</h3>
                <p className="text-gray-600 text-sm mb-6">Help us understand your constraints and priorities.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Trajectory</label>
                    <textarea value={formData.currentTrajectoryDescription} onChange={(e) => handleInputChange('currentTrajectoryDescription', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="If nothing changes, where will your organization be in the time horizon you selected?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Critical Decisions</label>
                    <textarea value={formData.criticalDecisions} onChange={(e) => handleInputChange('criticalDecisions', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="What key decisions need to be made? What options are you considering?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource Constraints</label>
                    <textarea value={formData.resourceConstraints} onChange={(e) => handleInputChange('resourceConstraints', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="What limitations do you face? (budget, staff, time, expertise, etc.)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Context</label>
                    <textarea value={formData.additionalContext} onChange={(e) => handleInputChange('additionalContext', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27ae60]" rows={3} placeholder="Anything else we should know to provide better scenario analysis?" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <button onClick={() => setStep(step - 1)} disabled={step === 1} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              {step < totalSteps ? (
                <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-2 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847]">
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#27ae60] text-white rounded-lg hover:bg-[#219a52] disabled:opacity-50">
                  {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>) : 'Generate Scenarios'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScenarioPlanner;
