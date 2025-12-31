import React, { useState } from 'react';
import { ArrowLeft, GitBranch, CheckCircle, Loader2, Plus, Trash2 } from 'lucide-react';

interface ScenarioPlannerProps {
  onBack?: () => void;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  assumptions: string[];
  likelihood: 'low' | 'medium' | 'high';
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [organizationContext, setOrganizationContext] = useState({
    name: '',
    mission: '',
    currentChallenges: '',
    strategicGoals: '',
    timeHorizon: '3-years',
  });

  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Best Case',
      description: '',
      assumptions: [''],
      likelihood: 'medium',
    },
    {
      id: '2',
      name: 'Worst Case',
      description: '',
      assumptions: [''],
      likelihood: 'medium',
    },
    {
      id: '3',
      name: 'Most Likely',
      description: '',
      assumptions: [''],
      likelihood: 'high',
    },
  ]);

  const handleContextChange = (field: string, value: string) => {
    setOrganizationContext(prev => ({ ...prev, [field]: value }));
  };

  const handleScenarioChange = (id: string, field: string, value: any) => {
    setScenarios(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAssumptionChange = (scenarioId: string, index: number, value: string) => {
    setScenarios(prev =>
      prev.map(s => {
        if (s.id === scenarioId) {
          const newAssumptions = [...s.assumptions];
          newAssumptions[index] = value;
          return { ...s, assumptions: newAssumptions };
        }
        return s;
      })
    );
  };

  const addAssumption = (scenarioId: string) => {
    setScenarios(prev =>
      prev.map(s => {
        if (s.id === scenarioId) {
          return { ...s, assumptions: [...s.assumptions, ''] };
        }
        return s;
      })
    );
  };

  const removeAssumption = (scenarioId: string, index: number) => {
    setScenarios(prev =>
      prev.map(s => {
        if (s.id === scenarioId && s.assumptions.length > 1) {
          const newAssumptions = s.assumptions.filter((_, i) => i !== index);
          return { ...s, assumptions: newAssumptions };
        }
        return s;
      })
    );
  };

  const addScenario = () => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: `Scenario ${scenarios.length + 1}`,
      description: '',
      assumptions: [''],
      likelihood: 'medium',
    };
    setScenarios(prev => [...prev, newScenario]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 1) {
      setScenarios(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        organization: organizationContext,
        scenarios: scenarios,
      };

      const response = await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/scenario-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze scenarios');
      }

      const result = await response.json();
      setAnalysisResult(result.analysis || result.output || JSON.stringify(result));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit scenarios. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setAnalysisResult(null);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tools
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Scenario Analysis Complete!</h2>
              <p className="text-gray-600">Here's your strategic scenario analysis</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: analysisResult || '' }}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                Plan Another Scenario
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Back to Tools
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <GitBranch className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Scenario Planner</h1>
              <p className="text-sm text-gray-500">Model different strategic futures</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Organization Context */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Context</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={organizationContext.name}
                onChange={(e) => handleContextChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Planning Horizon
              </label>
              <select
                value={organizationContext.timeHorizon}
                onChange={(e) => handleContextChange('timeHorizon', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="1-year">1 Year</option>
                <option value="3-years">3 Years</option>
                <option value="5-years">5 Years</option>
                <option value="10-years">10 Years</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission Statement
            </label>
            <textarea
              value={organizationContext.mission}
              onChange={(e) => handleContextChange('mission', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What is your organization's mission?"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Challenges
            </label>
            <textarea
              value={organizationContext.currentChallenges}
              onChange={(e) => handleContextChange('currentChallenges', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What challenges are you currently facing?"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strategic Goals
            </label>
            <textarea
              value={organizationContext.strategicGoals}
              onChange={(e) => handleContextChange('strategicGoals', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What are your key strategic goals?"
            />
          </div>
        </div>

        {/* Scenarios */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Scenarios</h2>
            <button
              onClick={addScenario}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Scenario
            </button>
          </div>

          {scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <input
                  type="text"
                  value={scenario.name}
                  onChange={(e) => handleScenarioChange(scenario.id, 'name', e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                  placeholder="Scenario Name"
                />
                {scenarios.length > 1 && (
                  <button
                    onClick={() => removeScenario(scenario.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={scenario.description}
                  onChange={(e) => handleScenarioChange(scenario.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe this scenario..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Likelihood
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleScenarioChange(scenario.id, 'likelihood', level)}
                      className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-colors ${
                        scenario.likelihood === level
                          ? level === 'low'
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : level === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                            : 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Assumptions
                </label>
                {scenario.assumptions.map((assumption, aIndex) => (
                  <div key={aIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={assumption}
                      onChange={(e) => handleAssumptionChange(scenario.id, aIndex, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter an assumption..."
                    />
                    {scenario.assumptions.length > 1 && (
                      <button
                        onClick={() => removeAssumption(scenario.id, aIndex)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addAssumption(scenario.id)}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Assumption
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Scenarios...
              </>
            ) : (
              <>
                <GitBranch className="w-5 h-5" />
                Analyze Scenarios
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ScenarioPlanner;
