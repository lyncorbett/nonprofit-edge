import React, { useState } from 'react';
import { ArrowLeft, User, Users, Loader2, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface CEOEvaluationProps {
  onNavigate?: (route: string) => void;
}

type EvaluatorRole = 'ceo' | 'board_member' | null;

const CEOEvaluation: React.FC<CEOEvaluationProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<EvaluatorRole>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Contact Info
    orgName: '',
    yourName: '',
    yourEmail: '',
    ceoName: '',
    
    // Leadership & Vision (1-5 scale)
    strategicVision: '',
    strategicVisionComments: '',
    missionAlignment: '',
    missionAlignmentComments: '',
    decisionMaking: '',
    decisionMakingComments: '',
    
    // Organizational Management
    operationalEffectiveness: '',
    operationalEffectivenessComments: '',
    financialManagement: '',
    financialManagementComments: '',
    teamDevelopment: '',
    teamDevelopmentComments: '',
    
    // Board Relations
    boardCommunication: '',
    boardCommunicationComments: '',
    boardPartnership: '',
    boardPartnershipComments: '',
    transparency: '',
    transparencyComments: '',
    
    // External Relations
    communityRelations: '',
    communityRelationsComments: '',
    fundraising: '',
    fundraisingComments: '',
    publicRepresentation: '',
    publicRepresentationComments: '',
    
    // Overall
    overallPerformance: '',
    strengths: '',
    areasForImprovement: '',
    additionalComments: '',
  });

  const ratingOptions = [
    { value: '5', label: 'Exceptional' },
    { value: '4', label: 'Exceeds Expectations' },
    { value: '3', label: 'Meets Expectations' },
    { value: '2', label: 'Needs Improvement' },
    { value: '1', label: 'Unsatisfactory' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        'https://hook.us1.make.com/446eyqchvkowne5vusqyk1nq895hmk6b',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            evaluatorRole: role,
            submittedAt: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('There was an error submitting your evaluation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingField = ({ 
    label, 
    field, 
    commentsField 
  }: { 
    label: string; 
    field: string; 
    commentsField: string;
  }) => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {ratingOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleInputChange(field, option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              formData[field as keyof typeof formData] === option.value
                ? 'bg-[#1B365D] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0097A9]'
            }`}
          >
            {option.value} - {option.label}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Comments (optional)"
        value={formData[commentsField as keyof typeof formData]}
        onChange={(e) => handleInputChange(commentsField, e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
        rows={2}
      />
    </div>
  );

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Evaluation Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the CEO evaluation. Your feedback has been recorded and will be included in the comprehensive report.
          </p>
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="px-6 py-3 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">CEO Performance Evaluation</h1>
            <p className="text-sm text-gray-500">
              {role === 'ceo' ? 'Self-Assessment' : role === 'board_member' ? 'Board Member Evaluation' : 'Select your role'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Role Selection */}
        {!role && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">What is your role?</h2>
            <p className="text-gray-600 text-center mb-8">
              Select your role to begin the appropriate evaluation form.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setRole('ceo')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#0097A9] transition-colors text-left group"
              >
                <div className="w-12 h-12 bg-[#1B365D] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0097A9] transition-colors">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">I am the CEO</h3>
                <p className="text-sm text-gray-600">Complete a self-assessment of your performance</p>
              </button>
              
              <button
                onClick={() => setRole('board_member')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#0097A9] transition-colors text-left group"
              >
                <div className="w-12 h-12 bg-[#1B365D] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0097A9] transition-colors">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">I am a Board Member</h3>
                <p className="text-sm text-gray-600">Evaluate the CEO's performance</p>
              </button>
            </div>
          </div>
        )}

        {/* Evaluation Form */}
        {role && (
          <div className="bg-white rounded-2xl shadow-sm">
            {/* Progress */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Step {step} of 5</span>
                <span className="text-sm text-gray-500">{step * 20}% Complete</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0097A9] transition-all duration-300"
                  style={{ width: `${step * 20}%` }}
                />
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                      <input
                        type="text"
                        value={formData.orgName}
                        onChange={(e) => handleInputChange('orgName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                        placeholder="Your organization"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={formData.yourName}
                        onChange={(e) => handleInputChange('yourName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                      <input
                        type="email"
                        value={formData.yourEmail}
                        onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    {role === 'board_member' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CEO's Name</label>
                        <input
                          type="text"
                          value={formData.ceoName}
                          onChange={(e) => handleInputChange('ceoName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                          placeholder="CEO's full name"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Leadership & Vision */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Leadership & Vision</h3>
                  <RatingField 
                    label="Strategic Vision - Sets clear direction and inspires others toward organizational goals"
                    field="strategicVision"
                    commentsField="strategicVisionComments"
                  />
                  <RatingField 
                    label="Mission Alignment - Ensures all activities align with the organization's mission"
                    field="missionAlignment"
                    commentsField="missionAlignmentComments"
                  />
                  <RatingField 
                    label="Decision Making - Makes timely, well-informed decisions"
                    field="decisionMaking"
                    commentsField="decisionMakingComments"
                  />
                </div>
              )}

              {/* Step 3: Organizational Management */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Organizational Management</h3>
                  <RatingField 
                    label="Operational Effectiveness - Manages day-to-day operations efficiently"
                    field="operationalEffectiveness"
                    commentsField="operationalEffectivenessComments"
                  />
                  <RatingField 
                    label="Financial Management - Demonstrates fiscal responsibility and sound financial practices"
                    field="financialManagement"
                    commentsField="financialManagementComments"
                  />
                  <RatingField 
                    label="Team Development - Builds, mentors, and retains a strong team"
                    field="teamDevelopment"
                    commentsField="teamDevelopmentComments"
                  />
                </div>
              )}

              {/* Step 4: Board & External Relations */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Board & External Relations</h3>
                  <RatingField 
                    label="Board Communication - Keeps the board informed with timely, relevant information"
                    field="boardCommunication"
                    commentsField="boardCommunicationComments"
                  />
                  <RatingField 
                    label="Community Relations - Builds strong relationships with stakeholders and community"
                    field="communityRelations"
                    commentsField="communityRelationsComments"
                  />
                  <RatingField 
                    label="Fundraising & Development - Effectively leads resource development efforts"
                    field="fundraising"
                    commentsField="fundraisingComments"
                  />
                </div>
              )}

              {/* Step 5: Overall Assessment */}
              {step === 5 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Overall Assessment</h3>
                  <RatingField 
                    label="Overall Performance Rating"
                    field="overallPerformance"
                    commentsField="additionalComments"
                  />
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Strengths
                    </label>
                    <textarea
                      value={formData.strengths}
                      onChange={(e) => handleInputChange('strengths', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                      rows={4}
                      placeholder="What are the CEO's greatest strengths?"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Areas for Improvement
                    </label>
                    <textarea
                      value={formData.areasForImprovement}
                      onChange={(e) => handleInputChange('areasForImprovement', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                      rows={4}
                      placeholder="What areas should the CEO focus on improving?"
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => step === 1 ? setRole(null) : setStep(step - 1)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {step === 1 ? 'Change Role' : 'Previous'}
                </button>

                {step < 5 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 px-6 py-2 bg-[#1B365D] text-white rounded-lg hover:bg-[#142847] transition-colors"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-[#0097A9] text-white rounded-lg hover:bg-[#007a8a] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Evaluation'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CEOEvaluation;
