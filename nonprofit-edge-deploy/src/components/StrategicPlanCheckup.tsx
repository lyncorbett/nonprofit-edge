import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, X } from 'lucide-react';

interface StrategicPlanCheckupProps {
  onNavigate?: (route: string) => void;
}

const StrategicPlanCheckup: React.FC<StrategicPlanCheckupProps> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orgName: '',
    yourName: '',
    yourEmail: '',
    yourRole: '',
    planYear: '',
    
    // Mission & Vision
    missionReviewed: '',
    missionAlignment: '',
    valuesReflected: '',
    
    // Stakeholder Engagement
    stakeholderInvolvement: '',
    boardMonitoring: '',
    communityInput: '',
    
    // Goals & Priorities
    strategicPriorities: '',
    metricsDefined: '',
    goalsOutdated: '',
    
    // Implementation
    teamActionPlans: '',
    timelinesMilestones: '',
    resourcesAligned: '',
    
    // Financial Sustainability
    revenueConcentration: '',
    operatingReserves: '',
    sustainabilityPlan: '',
    
    // Leadership & Capacity
    successionPlan: '',
    execTurnover: '',
    staffCapacity: '',
    
    additionalInfo: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.yourEmail) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Add file if present
      if (file) {
        submitData.append('file', file);
      }

      const response = await fetch(
        'https://thenonprofitedge.app.n8n.cloud/webhook/strategic_plan',
        {
          method: 'POST',
          body: submitData,
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectField = ({ 
    label, 
    field, 
    options,
    description
  }: { 
    label: string; 
    field: string; 
    options: { value: string; label: string }[];
    description?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <select
        value={formData[field as keyof typeof formData]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-Up Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your strategic plan is being analyzed. You'll receive a comprehensive diagnostic report at <strong>{formData.yourEmail}</strong> within 24-48 hours.
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

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'not_sure', label: 'Not sure' },
  ];

  const frequencyOptions = [
    { value: 'regularly', label: 'Regularly (quarterly or more)' },
    { value: 'occasionally', label: 'Occasionally (1-2 times/year)' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'never', label: 'Never' },
  ];

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
            <h1 className="text-xl font-bold text-gray-800">Strategic Plan Check-Up</h1>
            <p className="text-sm text-gray-500">Get a diagnostic analysis of your strategic plan</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Your Strategic Plan</h2>
            
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-[#0097A9]'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your strategic plan here</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, Word, or PowerPoint (max 10MB)</p>
                  <label className="inline-block px-4 py-2 bg-[#1B365D] text-white rounded-lg cursor-pointer hover:bg-[#142847] transition-colors">
                    Browse Files
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * File upload is optional. You can still receive a diagnostic based on your questionnaire responses.
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => handleInputChange('orgName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.yourName}
                  onChange={(e) => handleInputChange('yourName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={formData.yourEmail}
                  onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="We'll send your report here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                <input
                  type="text"
                  value={formData.yourRole}
                  onChange={(e) => handleInputChange('yourRole', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="e.g., Executive Director, Board Chair"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Mission & Vision Alignment</h2>
            
            <SelectField
              label="Has your mission statement been reviewed in the last 3 years?"
              field="missionReviewed"
              options={yesNoOptions}
            />
            <SelectField
              label="How well does your current work align with your stated mission?"
              field="missionAlignment"
              options={[
                { value: 'strongly', label: 'Strongly aligned' },
                { value: 'somewhat', label: 'Somewhat aligned' },
                { value: 'not_aligned', label: 'Not well aligned' },
              ]}
            />
            <SelectField
              label="Are your organizational values clearly reflected in daily operations?"
              field="valuesReflected"
              options={[
                { value: 'yes', label: 'Yes, consistently' },
                { value: 'somewhat', label: 'Somewhat' },
                { value: 'no', label: 'No' },
                { value: 'no_values', label: "We don't have defined values" },
              ]}
            />
          </div>

          {/* Stakeholder Engagement */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Stakeholder Engagement</h2>
            
            <SelectField
              label="Were key stakeholders involved in developing the strategic plan?"
              field="stakeholderInvolvement"
              options={[
                { value: 'yes', label: 'Yes, extensively' },
                { value: 'partially', label: 'Partially' },
                { value: 'no', label: 'No' },
              ]}
            />
            <SelectField
              label="How often does your board monitor progress on strategic goals?"
              field="boardMonitoring"
              options={frequencyOptions}
            />
            <SelectField
              label="Do you regularly gather community/client input on your services?"
              field="communityInput"
              options={yesNoOptions}
            />
          </div>

          {/* Goals & Implementation */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Goals & Implementation</h2>
            
            <SelectField
              label="How many strategic priorities does your plan have?"
              field="strategicPriorities"
              options={[
                { value: '1-3', label: '1-3 priorities' },
                { value: '4-6', label: '4-6 priorities' },
                { value: '7-10', label: '7-10 priorities' },
                { value: '10+', label: 'More than 10' },
              ]}
            />
            <SelectField
              label="Do your goals have defined success metrics?"
              field="metricsDefined"
              options={[
                { value: 'yes_all', label: 'Yes, for all goals' },
                { value: 'yes_some', label: 'Yes, for some goals' },
                { value: 'no', label: 'No' },
              ]}
            />
            <SelectField
              label="Do staff have clear action plans tied to strategic goals?"
              field="teamActionPlans"
              options={yesNoOptions}
            />
            <SelectField
              label="Do you have timelines and milestones for implementation?"
              field="timelinesMilestones"
              options={yesNoOptions}
            />
          </div>

          {/* Financial Sustainability */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Financial Sustainability</h2>
            
            <SelectField
              label="What percentage of revenue comes from your largest funding source?"
              field="revenueConcentration"
              options={[
                { value: 'under_25', label: 'Under 25%' },
                { value: '25-50', label: '25-50%' },
                { value: '51-75', label: '51-75%' },
                { value: 'over_75', label: 'Over 75%' },
              ]}
            />
            <SelectField
              label="How many months of operating reserves do you have?"
              field="operatingReserves"
              options={[
                { value: '0-2', label: '0-2 months' },
                { value: '3-5', label: '3-5 months' },
                { value: '6+', label: '6+ months' },
              ]}
            />
            <SelectField
              label="Do you have a financial sustainability plan?"
              field="sustainabilityPlan"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'in_progress', label: 'In progress' },
                { value: 'no', label: 'No' },
              ]}
            />
          </div>

          {/* Additional Context */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Additional Context</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What specific questions do you want answered about your strategic plan?
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                rows={4}
                placeholder="Share any specific concerns or areas you'd like us to focus on..."
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => onNavigate?.('/dashboard')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-[#0097A9] text-white rounded-lg hover:bg-[#007a8a] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Submit for Analysis'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StrategicPlanCheckup;
