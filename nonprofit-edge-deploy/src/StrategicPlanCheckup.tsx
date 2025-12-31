import React, { useState } from 'react';
import { ArrowLeft, ClipboardCheck, CheckCircle, Loader2, Upload, FileText } from 'lucide-react';

interface StrategicPlanCheckupProps {
  onBack?: () => void;
}

const StrategicPlanCheckup: React.FC<StrategicPlanCheckupProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [additionalContext, setAdditionalContext] = useState({
    organizationName: '',
    planYear: '',
    keyQuestions: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload your strategic plan document');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('organizationName', additionalContext.organizationName);
      formDataToSend.append('planYear', additionalContext.planYear);
      formDataToSend.append('keyQuestions', additionalContext.keyQuestions);

      const response = await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/strategic-plan', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze strategic plan');
      }

      const result = await response.json();
      setAnalysisResult(result.analysis || result.output || JSON.stringify(result));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit. Please try again.');
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
    setFile(null);
    setIsSubmitted(false);
    setAnalysisResult(null);
    setError(null);
    setAdditionalContext({
      organizationName: '',
      planYear: '',
      keyQuestions: '',
    });
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
              <p className="text-gray-600">Here's your strategic plan health check</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Plan Review</h3>
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
                Analyze Another Plan
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
              <ClipboardCheck className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Strategic Plan Check-Up</h1>
              <p className="text-sm text-gray-500">Get AI-powered feedback on your strategic plan</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Strategic Plan</h2>
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-teal-600" />
                    <span className="text-gray-900 font-medium">{file.name}</span>
                    <span className="text-gray-500 text-sm">Click to change file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <span className="text-gray-900 font-medium">Drop your strategic plan here</span>
                    <span className="text-gray-500 text-sm">or click to browse</span>
                    <span className="text-gray-400 text-xs mt-2">PDF, Word, or TXT files accepted</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Context (Optional)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={additionalContext.organizationName}
                  onChange={(e) => setAdditionalContext(prev => ({ ...prev, organizationName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Year/Period
                </label>
                <input
                  type="text"
                  value={additionalContext.planYear}
                  onChange={(e) => setAdditionalContext(prev => ({ ...prev, planYear: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., 2024-2027"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Questions or Concerns
                </label>
                <textarea
                  value={additionalContext.keyQuestions}
                  onChange={(e) => setAdditionalContext(prev => ({ ...prev, keyQuestions: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="What specific aspects would you like feedback on?"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !file}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              isSubmitting || !file
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Your Plan...
              </>
            ) : (
              <>
                <ClipboardCheck className="w-5 h-5" />
                Get Strategic Plan Check-Up
              </>
            )}
          </button>
        </form>

        {/* What You'll Get */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Receive</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Overall health assessment of your strategic plan</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Analysis of goals, objectives, and alignment</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Identification of gaps and areas for improvement</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Actionable recommendations for strengthening your plan</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StrategicPlanCheckup;
