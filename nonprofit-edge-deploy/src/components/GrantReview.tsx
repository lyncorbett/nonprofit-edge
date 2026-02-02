import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, X, FileSearch } from 'lucide-react';

interface GrantReviewProps {
  onNavigate?: (route: string) => void;
}

const GrantReview: React.FC<GrantReviewProps> = ({ onNavigate }) => {
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [rfpFile, setRfpFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    organization: '',
    email: '',
    grantName: '',
    funderName: '',
    deadline: '',
    amountRequested: '',
    stage: '',
    feedbackFocus: '',
    specificQuestions: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proposalFile) {
      setError('Please upload your grant proposal');
      return;
    }

    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Add files
      submitData.append('proposal', proposalFile);
      if (rfpFile) {
        submitData.append('rfp', rfpFile);
      }

      const response = await fetch(
        'https://thenonprofitedge.app.n8n.cloud/webhook/rfp',
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

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your grant proposal is being reviewed. You'll receive detailed feedback at <strong>{formData.email}</strong> within 24-48 hours.
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

  const FileUploadBox = ({
    file,
    setFile,
    label,
    description,
    required = false,
  }: {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    label: string;
    description: string;
    required?: boolean;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-[#0097A9]'
        }`}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800 text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">{description}</p>
            <label className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm">
              Choose File
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setFile)}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </label>
          </>
        )}
      </div>
    </div>
  );

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
            <div className="w-10 h-10 bg-[#C4A052] rounded-lg flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Grant/RFP Review</h1>
              <p className="text-sm text-gray-500">Get expert feedback on your proposal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Introduction */}
          <div className="bg-gradient-to-r from-[#1B365D] to-[#2a4a7a] rounded-2xl p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-2">How It Works</h2>
            <ol className="space-y-2 text-blue-100">
              <li className="flex items-start gap-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <span>Upload your grant proposal (and RFP if available)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <span>Our AI analyzes alignment, clarity, and competitiveness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <span>Receive detailed feedback within 24-48 hours</span>
              </li>
            </ol>
          </div>

          {/* File Uploads */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Documents</h2>
            
            <FileUploadBox
              file={proposalFile}
              setFile={setProposalFile}
              label="Your Grant Proposal"
              description="Upload your draft or final proposal (PDF or Word)"
              required
            />
            
            <FileUploadBox
              file={rfpFile}
              setFile={setRfpFile}
              label="RFP/Guidelines (Optional)"
              description="Upload the funder's RFP or guidelines for better alignment analysis"
            />
          </div>

          {/* Grant Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Grant Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="We'll send feedback here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grant/Opportunity Name</label>
                <input
                  type="text"
                  value={formData.grantName}
                  onChange={(e) => handleInputChange('grantName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="e.g., Community Health Initiative Grant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funder Name</label>
                <input
                  type="text"
                  value={formData.funderName}
                  onChange={(e) => handleInputChange('funderName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="e.g., Robert Wood Johnson Foundation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submission Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Requested</label>
                <input
                  type="text"
                  value={formData.amountRequested}
                  onChange={(e) => handleInputChange('amountRequested', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="e.g., $50,000"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
              >
                <option value="">Select stage</option>
                <option value="early_draft">Early Draft - Just getting started</option>
                <option value="mid_draft">Mid Draft - Main content complete</option>
                <option value="final_draft">Final Draft - Ready for polish</option>
                <option value="resubmission">Resubmission - Previously declined</option>
              </select>
            </div>
          </div>

          {/* Feedback Focus */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">What Feedback Do You Need?</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Focus Area</label>
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  { value: 'overall', label: 'Overall Quality & Competitiveness' },
                  { value: 'alignment', label: 'Alignment with Funder Priorities' },
                  { value: 'narrative', label: 'Narrative & Storytelling' },
                  { value: 'budget', label: 'Budget Justification' },
                  { value: 'outcomes', label: 'Outcomes & Evaluation' },
                  { value: 'technical', label: 'Technical/Grammar Review' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.feedbackFocus === option.value
                        ? 'border-[#0097A9] bg-[#0097A9]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="feedbackFocus"
                      value={option.value}
                      checked={formData.feedbackFocus === option.value}
                      onChange={(e) => handleInputChange('feedbackFocus', e.target.value)}
                      className="text-[#0097A9]"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific Questions (Optional)
              </label>
              <textarea
                value={formData.specificQuestions}
                onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                rows={4}
                placeholder="What specific aspects would you like feedback on? Any concerns about your proposal?"
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
              className="flex items-center gap-2 px-8 py-3 bg-[#C4A052] text-white rounded-lg hover:bg-[#a8863f] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Review'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default GrantReview;
