'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, Calendar, Clock, CheckCircle, Bell, 
  X, ChevronRight, Sparkles, Send, Heart
} from 'lucide-react';

// Types
interface Commitment {
  id: string;
  text: string;
  deadline: 'today' | 'this_week' | 'this_month' | 'custom';
  deadlineDate: Date;
  createdAt: Date;
  completedAt?: Date;
  reminderSent?: boolean;
  status: 'active' | 'completed' | 'missed';
  emailCheckIn?: boolean;
  userEmail?: string;
}

interface CommitmentTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (commitment: Commitment) => void;
  existingCommitments?: Commitment[];
  userEmail?: string;
}

// Helper to calculate deadline date
const getDeadlineDate = (deadline: string): Date => {
  const now = new Date();
  switch (deadline) {
    case 'today':
      return new Date(now.setHours(23, 59, 59, 999));
    case 'this_week':
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      return endOfWeek;
    case 'this_month':
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    default:
      return new Date(now.setDate(now.getDate() + 7));
  }
};

// Get friendly check-in message based on deadline
const getCheckInMessage = (commitment: Commitment, userName: string): string => {
  const firstName = userName.split(' ')[0];
  
  if (commitment.deadline === 'today') {
    return `Hey ${firstName}! 👋

Just checking in on that commitment you made earlier today: "${commitment.text}"

How's it going? Did you get a chance to tackle it?

No pressure at all - I know things can get busy. If you got it done, amazing! 🎉 If not, that's totally okay too. Sometimes the best thing we can do is give ourselves grace and try again tomorrow.

Either way, I'm here if you want to talk through anything.

Cheering you on,
The Professor 🎓`;
  }
  
  if (commitment.deadline === 'this_week') {
    return `Hi ${firstName}! 👋

Hope your week is going well! I wanted to check in on something you committed to earlier this week:

"${commitment.text}"

How's progress going? Sometimes just talking about it helps us move forward.

Remember - progress over perfection. Even small steps count! If you're stuck, let's chat about it. That's what I'm here for.

Wishing you a great rest of your week,
The Professor 🎓`;
  }
  
  if (commitment.deadline === 'this_month') {
    return `Hey ${firstName}! 👋

It's been a few weeks since you set this commitment:

"${commitment.text}"

I wanted to reach out and see how things are going. Are you making progress? Running into any roadblocks?

Sometimes our biggest goals need a little adjustment along the way - and that's completely normal. If you want to revisit the plan or talk through challenges, I'm here.

Keep going - you've got this!

Warmly,
The Professor 🎓`;
  }
  
  return `Hi ${firstName}, checking in on your commitment: "${commitment.text}". How's it going?`;
};

// Modal for making a commitment
export const CommitmentModal: React.FC<CommitmentTrackerProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  existingCommitments = [],
  userEmail = ''
}) => {
  const [commitmentText, setCommitmentText] = useState('');
  const [deadline, setDeadline] = useState<'today' | 'this_week' | 'this_month' | 'custom'>('this_week');
  const [step, setStep] = useState<'input' | 'email' | 'confirm'>('input');
  const [emailCheckIn, setEmailCheckIn] = useState(true);
  const [email, setEmail] = useState(userEmail);

  if (!isOpen) return null;

  const handleContinueToEmail = () => {
    if (!commitmentText.trim()) return;
    setStep('email');
  };

  const handleSubmit = () => {
    const newCommitment: Commitment = {
      id: `commit_${Date.now()}`,
      text: commitmentText.trim(),
      deadline,
      deadlineDate: getDeadlineDate(deadline),
      createdAt: new Date(),
      status: 'active',
      emailCheckIn: emailCheckIn,
      userEmail: emailCheckIn ? email : undefined
    };

    // If email check-in enabled, schedule the email
    if (emailCheckIn && email) {
      scheduleCheckInEmail(newCommitment, email);
    }

    onSave(newCommitment);
    setStep('confirm');
  };

  // Schedule email check-in (this would connect to your backend)
  const scheduleCheckInEmail = async (commitment: Commitment, emailAddress: string) => {
    console.log('📧 Scheduling check-in email:', {
      email: emailAddress,
      commitment: commitment.text,
      deadline: commitment.deadline,
      checkInDate: commitment.deadlineDate,
    });
    
    // In production, call your API endpoint:
    // await fetch('/api/schedule-checkin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: emailAddress,
    //     commitment: commitment.text,
    //     deadline: commitment.deadline,
    //     deadlineDate: commitment.deadlineDate,
    //     userId: commitment.id
    //   })
    // });
  };

  const handleClose = () => {
    setCommitmentText('');
    setDeadline('this_week');
    setStep('input');
    setEmailCheckIn(true);
    setEmail(userEmail);
    onClose();
  };

  const deadlineLabels = {
    today: 'Today',
    this_week: 'This week',
    this_month: 'This month',
    custom: 'Custom date'
  };

  const checkInInfo = {
    today: "I'll check in with you this evening",
    this_week: "I'll check in at the end of the week",
    this_month: "I'll check in mid-month and at month end",
    custom: "I'll send you a friendly reminder"
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0D2C54]/70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalSlideIn 0.25s ease' }}
      >
        {step === 'input' ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D2C54] to-[#1a3a5c] p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0097A9]/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#0097A9]" />
                  </div>
                  <h2 className="text-xl font-bold">Make a Commitment</h2>
                </div>
                <button onClick={handleClose} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/70 text-sm">
                What ONE thing will you commit to doing? I'll check in to support you.
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Commitment Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0D2C54] mb-2">
                  I commit to...
                </label>
                <textarea
                  value={commitmentText}
                  onChange={(e) => setCommitmentText(e.target.value)}
                  placeholder="e.g., Schedule a meeting with my board chair to discuss succession planning"
                  className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0097A9] resize-none"
                  rows={3}
                />
              </div>

              {/* Deadline Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0D2C54] mb-3">
                  When will you do this?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['today', 'this_week', 'this_month'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setDeadline(option)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        deadline === option
                          ? 'border-[#0097A9] bg-[#0097A9]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {option === 'today' && <Clock className="w-4 h-4 text-[#0097A9]" />}
                        {option === 'this_week' && <Calendar className="w-4 h-4 text-[#0097A9]" />}
                        {option === 'this_month' && <Target className="w-4 h-4 text-[#0097A9]" />}
                        <span className="font-semibold text-[#0D2C54]">{deadlineLabels[option]}</span>
                      </div>
                      <p className="text-xs text-slate-500">{checkInInfo[option]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-sm mb-1">
                      I've got your back
                    </h4>
                    <p className="text-xs text-amber-700">
                      I'll send you a friendly check-in email to see how you're doing. 
                      No judgment, just encouragement and support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleContinueToEmail}
                disabled={!commitmentText.trim()}
                className="w-full py-3 bg-[#0097A9] text-white rounded-xl font-semibold hover:bg-[#007f8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : step === 'email' ? (
          /* Email Check-In Step */
          <>
            <div className="bg-gradient-to-r from-[#0D2C54] to-[#1a3a5c] p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0097A9]/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#0097A9]" />
                  </div>
                  <h2 className="text-xl font-bold">Stay Accountable</h2>
                </div>
                <button onClick={handleClose} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/70 text-sm">
                Want me to check in on you?
              </p>
            </div>

            <div className="p-6">
              {/* Email Check-In Option */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Send className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-teal-900 mb-1">Friendly Check-In Email</h3>
                    <p className="text-sm text-teal-700 mb-4">
                      I'll send you a supportive email at the end of your deadline to celebrate your progress 
                      and see how things went. No pressure, just encouragement!
                    </p>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailCheckIn}
                        onChange={(e) => setEmailCheckIn(e.target.checked)}
                        className="w-5 h-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-teal-800">
                        Yes, send me a check-in email
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {emailCheckIn && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#0D2C54] mb-2">
                    Your email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.org"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0097A9]"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    📬 Check-in will be sent {deadline === 'today' ? 'this evening' : deadline === 'this_week' ? 'Friday afternoon' : 'at month end'}
                  </p>
                </div>
              )}

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Commitment</h4>
                <p className="text-[#0D2C54] font-medium mb-2">"{commitmentText}"</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {deadlineLabels[deadline]}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={emailCheckIn && !email}
                  className="flex-1 py-3 bg-[#0097A9] text-white rounded-xl font-semibold hover:bg-[#007f8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  I'm Committed!
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#0D2C54] mb-2">
              Commitment Made! 🎉
            </h2>
            
            <p className="text-slate-600 mb-6">
              I'm proud of you for taking this step. 
              {emailCheckIn && email ? (
                <>I'll send you a friendly check-in email {deadline === 'today' ? ' this evening' : deadline === 'this_week' ? ' on Friday' : ' at the end of the month'} to see how it's going.</>
              ) : (
                <>Come back anytime to mark it complete!</>
              )}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-slate-500 mb-1">Your commitment:</p>
              <p className="font-semibold text-[#0D2C54]">"{commitmentText}"</p>
              {emailCheckIn && email && (
                <p className="text-xs text-teal-600 mt-2 flex items-center gap-1">
                  <Send className="w-3 h-3" />
                  Check-in email scheduled for {email}
                </p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#0097A9] text-white rounded-xl font-semibold hover:bg-[#007f8f] transition-colors"
            >
              Got It!
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Mini widget for dashboard showing active commitments
export const CommitmentWidget: React.FC<{
  commitments: Commitment[];
  onMakeCommitment: () => void;
  onMarkComplete: (id: string) => void;
}> = ({ commitments, onMakeCommitment, onMarkComplete }) => {
  const activeCommitments = commitments.filter(c => c.status === 'active').slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0D2C54] flex items-center gap-2">
          <Target className="w-4 h-4 text-[#0097A9]" />
          My Commitments
        </h3>
        <button
          onClick={onMakeCommitment}
          className="text-xs text-[#0097A9] font-semibold hover:underline"
        >
          + New
        </button>
      </div>

      {activeCommitments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 mb-3">No active commitments</p>
          <button
            onClick={onMakeCommitment}
            className="text-sm text-[#0097A9] font-semibold hover:underline"
          >
            Make your first commitment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCommitments.map((commitment) => (
            <div 
              key={commitment.id}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <button
                onClick={() => onMarkComplete(commitment.id)}
                className="w-5 h-5 rounded-full border-2 border-[#0097A9] hover:bg-[#0097A9] hover:text-white flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
              >
                <CheckCircle className="w-3 h-3 opacity-0 hover:opacity-100" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0D2C54] line-clamp-2">{commitment.text}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Due: {commitment.deadline === 'today' ? 'Today' : commitment.deadline === 'this_week' ? 'This week' : 'This month'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Email templates for check-ins (used by backend)
export const emailTemplates = {
  todayCheckIn: (commitment: Commitment, userName: string) => ({
    subject: `Quick check-in on today's commitment 👋`,
    body: getCheckInMessage({ ...commitment, deadline: 'today' }, userName),
    sendTime: 'evening' // Send at 6 PM user's local time
  }),
  
  weeklyCheckIn: (commitment: Commitment, userName: string) => ({
    subject: `End of week check-in - How did it go? 🎯`,
    body: getCheckInMessage({ ...commitment, deadline: 'this_week' }, userName),
    sendTime: 'friday_afternoon' // Send Friday at 3 PM
  }),
  
  monthlyMidCheckIn: (commitment: Commitment, userName: string) => ({
    subject: `Halfway there! Checking in on your goal 💪`,
    body: getCheckInMessage({ ...commitment, deadline: 'this_month' }, userName),
    sendTime: 'mid_month' // Send on the 15th
  }),
  
  completionCelebration: (commitment: Commitment, userName: string) => ({
    subject: `You did it! 🎉`,
    body: `Congratulations ${userName.split(' ')[0]}! 

You completed your commitment: "${commitment.text}"

This is huge! Taking action on our intentions is one of the hardest parts of leadership, and you just proved you can do it.

What's next? Ready to make another commitment?

So proud of you,
The Professor 🎓`,
    sendTime: 'immediate'
  })
};

export default CommitmentModal;
