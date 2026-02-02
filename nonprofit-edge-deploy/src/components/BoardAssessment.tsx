import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, ChevronRight, ChevronLeft, Users } from 'lucide-react';

interface BoardAssessmentProps {
  onNavigate?: (route: string) => void;
}

const BoardAssessment: React.FC<BoardAssessmentProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Contact Info
    orgName: '',
    yourName: '',
    yourEmail: '',
    yourRole: '',
    
    // Board Structure & Composition
    boardSize: '',
    boardDiversity: '',
    boardSkillsMatch: '',
    boardRecruitment: '',
    boardStructureComments: '',
    
    // Governance & Oversight
    missionClarity: '',
    strategicPlanning: '',
    financialOversight: '',
    riskManagement: '',
    governanceComments: '',
    
    // Board Engagement
    meetingAttendance: '',
    meetingPreparation: '',
    participationQuality: '',
    committeeEffectiveness: '',
    engagementComments: '',
    
    // Board Culture
    trustAndRespect: '',
    constructiveDebate: '',
    decisionMaking: '',
    conflictResolution: '',
    cultureComments: '',
    
    // CEO Relations
    ceoSupport: '',
    ceoAccountability: '',
    ceoEvaluation: '',
    successionPlanning: '',
    ceoRelationsComments: '',
    
    // Fundraising & Advocacy
    fundraisingParticipation: '',
    donorRelations: '',
    communityAdvocacy: '',
    ambassadorRole: '',
    fundraisingComments: '',
    
    // Overall
    overallEffectiveness: '',
    topStrengths: '',
    topPriorities: '',
    additionalComments: '',
  });

  const ratingOptions = [
    { value: '5', label: 'Excellent' },
    { value: '4', label: 'Good' },
    { value: '3', label: 'Adequate' },
    { value: '2', label: 'Needs Improvement' },
    { value: '1', label: 'Poor' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        'https://hook.us1.make.com/cstwxmspr9uctfewmr6dcp4tk9mgrjdp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
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
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingField = ({ 
    label, 
    field,
    description
  }: { 
    label: string; 
    field: string;
    description?: string;
  }) => (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {ratingOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleInputChange(field, option.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              formData[field as keyof typeof formData] === option.value
                ? 'bg-[#1B365D] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0097A9]'
            }`}
          >
            {option.value}
          </button>
        ))}
      </div>
    </div>
  );

  const totalSteps = 8;

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the board assessment. Your responses will help identify areas of strength and opportunities for improvement.
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0097A9] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Board Assessment</h1>
              <p className="text-sm text-gray-500">Evaluate your board's effectiveness</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Progress */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0097A9] transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Contact Info */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-6">Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => handleInputChange('orgName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={formData.yourName}
                      onChange={(e) => handleInputChange('yourName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      value={formData.yourEmail}
                      onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Role on the Board</label>
                    <select
                      value={formData.yourRole}
                      onChange={(e) => handleInputChange('yourRole', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    >
                      <option value="">Select your role</option>
                      <option value="chair">Board Chair</option>
                      <option value="vice_chair">Vice Chair</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="secretary">Secretary</option>
                      <option value="member">Board Member</option>
                      <option value="ex_officio">Ex-Officio</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Board Structure & Composition */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Board Structure & Composition</h3>
                <p className="text-gray-600 text-sm mb-6">Rate how well the board is structured for success.</p>
                
                <RatingField 
                  label="Board Size" 
                  field="boardSize"
                  description="The board has an appropriate number of members for effective governance"
                />
                <RatingField 
                  label="Diversity" 
                  field="boardDiversity"
                  description="The board reflects diverse perspectives, backgrounds, and expertise"
                />
                <RatingField 
                  label="Skills Match" 
                  field="boardSkillsMatch"
                  description="Board members have the skills needed to govern effectively"
                />
                <RatingField 
                  label="Recruitment" 
                  field="boardRecruitment"
                  description="The board has an effective process for recruiting new members"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    value={formData.boardStructureComments}
                    onChange={(e) => handleInputChange('boardStructureComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={3}
                    placeholder="Any additional observations about board structure..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Governance & Oversight */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Governance & Oversight</h3>
                <p className="text-gray-600 text-sm mb-6">Rate the board's governance effectiveness.</p>
                
                <RatingField 
                  label="Mission Clarity" 
                  field="missionClarity"
                  description="The board ensures the organization stays true to its mission"
                />
                <RatingField 
                  label="Strategic Planning" 
                  field="strategicPlanning"
                  description="The board actively participates in strategic planning"
                />
                <RatingField 
                  label="Financial Oversight" 
                  field="financialOversight"
                  description="The board effectively monitors financial health and compliance"
                />
                <RatingField 
                  label="Risk Management" 
                  field="riskManagement"
                  description="The board identifies and addresses organizational risks"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    value={formData.governanceComments}
                    onChange={(e) => handleInputChange('governanceComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Board Engagement */}
            {step === 4 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Board Engagement</h3>
                <p className="text-gray-600 text-sm mb-6">Rate member participation and engagement.</p>
                
                <RatingField 
                  label="Meeting Attendance" 
                  field="meetingAttendance"
                  description="Board members consistently attend meetings"
                />
                <RatingField 
                  label="Meeting Preparation" 
                  field="meetingPreparation"
                  description="Members come prepared, having reviewed materials in advance"
                />
                <RatingField 
                  label="Participation Quality" 
                  field="participationQuality"
                  description="Members actively contribute to discussions and decisions"
                />
                <RatingField 
                  label="Committee Effectiveness" 
                  field="committeeEffectiveness"
                  description="Committees function well and report effectively to the full board"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    value={formData.engagementComments}
                    onChange={(e) => handleInputChange('engagementComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Board Culture */}
            {step === 5 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Board Culture</h3>
                <p className="text-gray-600 text-sm mb-6">Rate the quality of board relationships and dynamics.</p>
                
                <RatingField 
                  label="Trust & Respect" 
                  field="trustAndRespect"
                  description="Board members treat each other with trust and respect"
                />
                <RatingField 
                  label="Constructive Debate" 
                  field="constructiveDebate"
                  description="The board encourages healthy debate and diverse viewpoints"
                />
                <RatingField 
                  label="Decision Making" 
                  field="decisionMaking"
                  description="The board makes decisions efficiently and effectively"
                />
                <RatingField 
                  label="Conflict Resolution" 
                  field="conflictResolution"
                  description="Conflicts are addressed constructively when they arise"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    value={formData.cultureComments}
                    onChange={(e) => handleInputChange('cultureComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 6: CEO Relations */}
            {step === 6 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Board-CEO Relations</h3>
                <p className="text-gray-600 text-sm mb-6">Rate the board's relationship with the CEO.</p>
                
                <RatingField 
                  label="CEO Support" 
                  field="ceoSupport"
                  description="The board provides appropriate support to the CEO"
                />
                <RatingField 
                  label="CEO Accountability" 
                  field="ceoAccountability"
                  description="The board holds the CEO accountable for results"
                />
                <RatingField 
                  label="CEO Evaluation" 
                  field="ceoEvaluation"
                  description="The board conducts regular, meaningful CEO evaluations"
                />
                <RatingField 
                  label="Succession Planning" 
                  field="successionPlanning"
                  description="The board has a plan for CEO succession"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    value={formData.ceoRelationsComments}
                    onChange={(e) => handleInputChange('ceoRelationsComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 7: Fundraising & Advocacy */}
            {step === 7 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Fundraising & Advocacy</h3>
                <p className="text-gray-600 text-sm mb-6">Rate board member contribution to resource development.</p>
                
                <RatingField 
                  label="Fundraising Participation" 
                  field="fundraisingParticipation"
                  description="Board members actively participate in fundraising"
                />
                <RatingField 
                  label="Donor Relations" 
                  field="donorRelations"
                  description="Board members help cultivate and steward donors"
                />
                <RatingField 
                  label="Community Advocacy" 
                  field="communityAdvocacy"
                  description="Board members advocate for the organization in the community"
                />
                <RatingField 
                  label="Ambassador Role" 
                  field="ambassadorRole"
                  description="Board members effectively serve as organizational ambassadors"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    value={formData.fundraisingComments}
                    onChange={(e) => handleInputChange('fundraisingComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 8: Overall Assessment */}
            {step === 8 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Assessment</h3>
                <p className="text-gray-600 text-sm mb-6">Provide your overall evaluation and recommendations.</p>
                
                <RatingField 
                  label="Overall Board Effectiveness" 
                  field="overallEffectiveness"
                  description="Rate the board's overall effectiveness"
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top 3 Board Strengths
                  </label>
                  <textarea
                    value={formData.topStrengths}
                    onChange={(e) => handleInputChange('topStrengths', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={4}
                    placeholder="What does the board do well?"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top 3 Priorities for Improvement
                  </label>
                  <textarea
                    value={formData.topPriorities}
                    onChange={(e) => handleInputChange('topPriorities', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={4}
                    placeholder="What should the board focus on improving?"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={formData.additionalComments}
                    onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                    rows={4}
                    placeholder="Any other observations or recommendations..."
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {step < totalSteps ? (
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
                    'Submit Assessment'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardAssessment;
