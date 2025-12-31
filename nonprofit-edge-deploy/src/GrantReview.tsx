import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface GrantReviewProps {
  onBack: () => void;
}

const GrantReview: React.FC<GrantReviewProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

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
      setError('Please upload a grant proposal document');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('https://thenonprofitedge.app.n8n.cloud/webhook/rfp', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit for review');
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

  const handleReset = () => {
    setFile(null);
    setIsSubmitted(false);
    setAnalysisResult(null);
    setError(null);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tools
          </button>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete!</h2>
              <p className="text-slate-400">Here's our review of your grant proposal</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Grant Proposal Review</h3>
              <div 
                className="text-slate-300 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: analysisResult || '' }}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
              >
                Review Another Proposal
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tools
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Grant Proposal Review</h1>
            <p className="text-slate-400">
              Upload your grant proposal and get AI-powered feedback to strengthen your application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-slate-600 hover:border-slate-500'
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
                    <FileText className="w-12 h-12 text-teal-400" />
                    <span className="text-white font-medium">{file.name}</span>
                    <span className="text-slate-400 text-sm">Click to change file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-12 h-12 text-slate-500" />
                    <span className="text-white font-medium">Drop your proposal here</span>
                    <span className="text-slate-400 text-sm">or click to browse</span>
                    <span className="text-slate-500 text-xs mt-2">PDF, Word, or TXT files accepted</span>
                  </div>
                )}
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !file}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isSubmitting || !file
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/25'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Proposal...
                </span>
              ) : (
                'Get AI Review'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-white font-semibold mb-3">What You'll Get:</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                Strengths and weaknesses analysis
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                Alignment with funder priorities
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                Budget and timeline feedback
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                Specific recommendations for improvement
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantReview;
