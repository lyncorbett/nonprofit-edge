import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2, X, FileSearch } from 'lucide-react';

interface GrantReviewProps {
  onNavigate?: (route: string) => void;
  onBack?: () => void;
}

const GrantReview: React.FC<GrantReviewProps> = ({ onNavigate, onBack }) => {
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [rfpFile, setRfpFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

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

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('/dashboard');
    } else if (onBack) {
      onBack();
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 10 * 1024 * 1024;

      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

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
        const result = await response.json();
        setAnalysisResult(result.analysis || result.output || JSON.stringify(result));
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

  const handleReset = () => {
    setProposalFile(null);
    setRfpFile(null);
    setIsSubmitted(false);
    setAnalysisResult(null);
    setError(null);
    setFormData({
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
  };

  // Results screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Grant Proposal Review</h1>
              <p className="text-sm text-gray-500">Analysis Complete</p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Complete!</h2>
              <p className="text-gray-500">Here's our review of your grant proposal</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Grant Proposal Review</h3>
              <div
                className="text-gray-700 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: analysisResult || '' }}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg transition-colors"
              >
                Review Another Proposal
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Grant Proposal Review</h1>
            <p className="text-sm text-gray-500">AI-powered feedback on your grant proposals</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Organization Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Organization Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="Your organization"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Grant Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Grant Details</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grant/RFP Name</label>
                <input
                  type="text"
                  value={formData.grantName}
                  onChange={(e) => handleInputChange('grantName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="Name of the grant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funder Name</label>
                <input
                  type="text"
                  value={formData.funderName}
                  onChange={(e) => handleInputChange('funderName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
                  placeholder="Foundation or agency name"
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
                  placeholder="$50,000"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent bg-white"
              >
                <option value="">Select stage...</option>
                <option value="early_draft">Early Draft</option>
                <option value="mid_draft">Mid-Stage Draft</option>
                <option value="near_final">Near Final</option>
                <option value="final_review">Final Review Before Submission</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What feedback are you looking for?</label>
              <select
                value={formData.feedbackFocus}
                onChange={(e) => handleInputChange('feedbackFocus', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent bg-white"
              >
                <option value="">Select focus area...</option>
                <option value="overall">Overall Strength Assessment</option>
                <option value="narrative">Narrative & Storytelling</option>
                <option value="alignment">Funder Alignment</option>
                <option value="budget">Budget & Financials</option>
                <option value="logic_model">Logic Model / Theory of Change</option>
                <option value="competitiveness">Competitiveness Review</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Upload Documents</h3>

            {/* Proposal Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Grant Proposal *</label>
              <div
                onDrop={(e) => handleDrop(e, setProposalFile)}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  proposalFile
                    ? 'border-[#0097A9] bg-[#0097A9]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  id="proposal-upload"
                  onChange={(e) => handleFileChange(e, setProposalFile)}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <label htmlFor="proposal-upload" className="cursor-pointer">
                  {proposalFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-10 h-10 text-[#0097A9]" />
                      <span className="text-gray-800 font-medium">{proposalFile.name}</span>
                      <span className="text-gray-400 text-sm">Click to change file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-gray-400" />
                      <span className="text-gray-700 font-medium">Drop your proposal here</span>
                      <span className="text-gray-400 text-sm">or click to browse (PDF, Word, TXT — max 10MB)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* RFP Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RFP / Funder Guidelines (Optional)</label>
              <div
                onDrop={(e) => handleDrop(e, setRfpFile)}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  rfpFile
                    ? 'border-[#0097A9] bg-[#0097A9]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  id="rfp-upload"
                  onChange={(e) => handleFileChange(e, setRfpFile)}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <label htmlFor="rfp-upload" className="cursor-pointer">
                  {rfpFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileSearch className="w-10 h-10 text-[#0097A9]" />
                      <span className="text-gray-800 font-medium">{rfpFile.name}</span>
                      <span className="text-gray-400 text-sm">Click to change file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileSearch className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-500 text-sm">Upload the RFP for alignment scoring</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Specific Questions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Specific Questions (Optional)</h3>
            <textarea
              value={formData.specificQuestions}
              onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0097A9] focus:border-transparent"
              rows={4}
              placeholder="Any specific questions you'd like addressed in the review? E.g., 'Is our budget realistic?' or 'Does our logic model flow clearly?'"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center mb-6">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !proposalFile}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isSubmitting || !proposalFile
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#0097A9] hover:bg-[#007f8f] text-white shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Your Proposal...
              </span>
            ) : (
              'Get AI Review'
            )}
          </button>

          {/* What You'll Get */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-gray-800 font-semibold mb-3">What You'll Get:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#0097A9] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">Strengths and weaknesses analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#0097A9] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">Alignment with funder priorities</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#0097A9] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">Budget and timeline feedback</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#0097A9] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">Specific recommendations for improvement</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default GrantReview;