import React, { useState } from 'react';
import { ArrowLeft, User, CheckCircle, Loader2, Star } from 'lucide-react';

interface CEOEvaluationProps {
  onBack?: () => void;
}

interface EvaluationData {
  ceoName: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluationPeriod: string;
  
  // Leadership & Vision
  strategicVision: number;
  organizationalLeadership: number;
  changeManagement: number;
  
  // Board Relations
  boardCommunication: number;
  boardPartnership: number;
  governance: number;
  
  // Operations & Finance
  financialManagement: number;
  operationalEfficiency: number;
  riskManagement: number;
  
  // External Relations
  fundraising: number;
  communityRelations: number;
  partnerships: number;
  
  // People & Culture
  staffDevelopment: number;
  culturalLeadership: number;
  diversityEquityInclusion: number;
  
  // Comments
  strengths: string;
  areasForGrowth: string;
  additionalComments: string;
}

const CEOEvaluation: React.FC<CEOEvaluationProps> = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EvaluationData>({
    ceoName: '',
    evaluatorName: '',
    evaluatorRole: '',
    evaluationPeriod: '',
    strategicVision: 0,
    organizationalLeadership: 0,
    changeManagement: 0,
    boardCommunication: 0,
    boardPartnership: 0,
    governance: 0,
    financialManagement: 0,
    operationalEfficiency: 0,
    riskManagement: 0,
    fundraising: 0,
    communityRelations: 0,
    partnerships: 0,
    staffDevelopment: 0,
    culturalLeadership: 0,
    diversityEquityInclusion: 0,
    strengths: '',
    areasForGrowth: '',
    additionalComments: '',
  });

  const sections = [
    { id: 'info', title: 'Basic Information' },
    { id: 'leadership', title: 'Leadership & Vision' },
    { id: 'board', title: 'Board Relations' },
    { id: 'operations', title: 'Operations & Finance' },
    { id: 'external', title: 'External Relations' },
    { id: 'people', title: 'People & Culture' },
    { id: 'comments', title: 'Additional Comments' },
  ];

  const handleInputChange = (field: keyof EvaluationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://hook.us2.make.com/446eyqrwl19wgqhbhgb5saub5paa5vvc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit evaluation');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit evaluation. Please try again.');
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

  const RatingScale: React.FC<{
    label: string;
    description?: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ label, description, value, onChange }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
              value === rating
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-400'
            }`}
          >
            <Star className={`w-5 h-5 ${value >= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>Needs Improvement</span>
        <span>Exceptional</span>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the CEO performance evaluation. The results will be compiled and shared with the appropriate parties.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">CEO Name</label>
              <input
                type="text"
                value={formData.ceoName}
                onChange={(e) => handleInputChange('ceoName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter CEO's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Your Name</label>
              <input
                type="text"
                value={formData.evaluatorName}
                onChange={(e) => handleInputChange('evaluatorName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Your Role</label>
              <select
                value={formData.evaluatorRole}
                onChange={(e) => handleInputChange('evaluatorRole', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select your role</option>
                <option value="board_chair">Board Chair</option>
                <option value="board_member">Board Member</option>
                <option value="direct_report">Direct Report</option>
                <option value="peer">Peer Executive</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Evaluation Period</label>
              <input
                type="text"
                value={formData.evaluationPeriod}
                onChange={(e) => handleInputChange('evaluationPeriod', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., FY 2024 or Jan-Dec 2024"
              />
            </div>
          </div>
        );

      case 1: // Leadership & Vision
        return (
          <div>
            <RatingScale
              label="Strategic Vision"
              description="Ability to articulate and advance a compelling vision for the organization"
              value={formData.strategicVision}
              onChange={(v) => handleInputChange('strategicVision', v)}
            />
            <RatingScale
              label="Organizational Leadership"
              description="Effectiveness in leading and inspiring the organization"
              value={formData.organizationalLeadership}
              onChange={(v) => handleInputChange('organizationalLeadership', v)}
            />
            <RatingScale
              label="Change Management"
              description="Ability to lead organizational change and adaptation"
              value={formData.changeManagement}
              onChange={(v) => handleInputChange('changeManagement', v)}
            />
          </div>
        );

      case 2: // Board Relations
        return (
          <div>
            <RatingScale
              label="Board Communication"
              description="Quality and timeliness of communication with the board"
              value={formData.boardCommunication}
              onChange={(v) => handleInputChange('boardCommunication', v)}
            />
            <RatingScale
              label="Board Partnership"
              description="Effectiveness in working collaboratively with the board"
              value={formData.boardPartnership}
              onChange={(v) => handleInputChange('boardPartnership', v)}
            />
            <RatingScale
              label="Governance Support"
              description="Support for good governance practices"
              value={formData.governance}
              onChange={(v) => handleInputChange('governance', v)}
            />
          </div>
        );

      case 3: // Operations & Finance
        return (
          <div>
            <RatingScale
              label="Financial Management"
              description="Stewardship of financial resources and fiscal responsibility"
              value={formData.financialManagement}
              onChange={(v) => handleInputChange('financialManagement', v)}
            />
            <RatingScale
              label="Operational Efficiency"
              description="Effectiveness in managing day-to-day operations"
              value={formData.operationalEfficiency}
              onChange={(v) => handleInputChange('operationalEfficiency', v)}
            />
            <RatingScale
              label="Risk Management"
              description="Identification and mitigation of organizational risks"
              value={formData.riskManagement}
              onChange={(v) => handleInputChange('riskManagement', v)}
            />
          </div>
        );

      case 4: // External Relations
        return (
          <div>
            <RatingScale
              label="Fundraising & Development"
              description="Effectiveness in resource development and donor relations"
              value={formData.fundraising}
              onChange={(v) => handleInputChange('fundraising', v)}
            />
            <RatingScale
              label="Community Relations"
              description="Building and maintaining community relationships"
              value={formData.communityRelations}
              onChange={(v) => handleInputChange('communityRelations', v)}
            />
            <RatingScale
              label="Strategic Partnerships"
              description="Development of beneficial partnerships and collaborations"
              value={formData.partnerships}
              onChange={(v) => handleInputChange('partnerships', v)}
            />
          </div>
        );

      case 5: // People & Culture
        return (
          <div>
            <RatingScale
              label="Staff Development"
              description="Investment in staff growth and professional development"
              value={formData.staffDevelopment}
              onChange={(v) => handleInputChange('staffDevelopment', v)}
            />
            <RatingScale
              label="Cultural Leadership"
              description="Fostering a positive and productive organizational culture"
              value={formData.culturalLeadership}
              onChange={(v) => handleInputChange('culturalLeadership', v)}
            />
            <RatingScale
              label="Diversity, Equity & Inclusion"
              description="Commitment to DEI principles and practices"
              value={formData.diversityEquityInclusion}
              onChange={(v) => handleInputChange('diversityEquityInclusion', v)}
            />
          </div>
        );

      case 6: // Comments
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Key Strengths
              </label>
              <textarea
                value={formData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="What are the CEO's greatest strengths?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Areas for Growth
              </label>
              <textarea
                value={formData.areasForGrowth}
                onChange={(e) => handleInputChange('areasForGrowth', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="What areas could benefit from development?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Additional Comments
              </label>
              <textarea
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Any other feedback or observations?"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <User className="w-5 h-5 text-teal-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">CEO Performance Evaluation</h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`flex-1 text-center text-xs font-medium py-2 ${
                  index === currentSection
                    ? 'text-teal-600'
                    : index < currentSection
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {sections[currentSection].title}
          </h2>
          
          {renderSection()}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentSection(prev => prev - 1)}
              disabled={currentSection === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentSection === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            
            {currentSection === sections.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Evaluation'
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentSection(prev => prev + 1)}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CEOEvaluation;
