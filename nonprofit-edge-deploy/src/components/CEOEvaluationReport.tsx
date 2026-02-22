import React from 'react';

interface CEOEvaluationReportProps {
  evaluationId?: string;
  onNavigate?: (route: string) => void;
}

const CEOEvaluationReport: React.FC<CEOEvaluationReportProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm p-12 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-[#0D2C54] mb-4">CEO Evaluation Report</h1>
        <p className="text-gray-500 mb-8">Your evaluation report is being generated. Check back shortly.</p>
        <button
          onClick={() => onNavigate && onNavigate('/dashboard')}
          className="bg-[#0097A9] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#007a8a] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CEOEvaluationReport;
