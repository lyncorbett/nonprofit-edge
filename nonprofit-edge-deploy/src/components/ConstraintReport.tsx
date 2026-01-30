'use client';

import React, { useEffect, useState } from 'react';
import { 
  Target, Calendar, RefreshCw, Mail, Package, Users, Moon, 
  MessageSquare, FileText, Smile, BarChart3, Share2, Zap, 
  HelpCircle, Heart, PieChart, ChevronRight, Download, Loader2,
  ArrowLeft
} from 'lucide-react';

// Types
interface ConstraintReportProps {
  onNavigate?: (route: string) => void;
}

interface DomainScore {
  domain: string;
  name: string;
  score: string;
}

interface AssessmentResults {
  intake: {
    name: string;
    email: string;
    organization: string;
    role: string;
    staffSize: string;
    budget: string;
  };
  domainScores: DomainScore[];
  primaryConstraint: {
    domain: string;
    name: string;
    score: string;
    pattern: string;
  };
  secondaryConstraint: {
    domain: string;
    name: string;
    score: string;
  };
  interactionPattern: string;
  strength: {
    domain: string;
    name: string;
    score: string;
  };
  completedAt: string;
}

// Pattern content library
const patternContent: Record<string, {
  tagline: string;
  recognition: string[];
  symptoms: { icon: React.ReactNode; title: string; description: string }[];
  stories: { quote: string; reality: string }[];
  feeling: { title: string; paragraphs: string[] };
  whyNotFixed: { title: string; description: string }[];
  actions: { timeframe: string; title: string; description: string }[];
  strengthMessage: string;
}> = {
  "Priority Diffusion": {
    tagline: "Everything matters, so nothing matters enough.",
    recognition: [
      "Your team is busy—probably too busy. But when you step back and ask what you actually accomplished last quarter, the answer feels thinner than the effort deserved.",
      "Meetings end with more action items than decisions. The same conversations happen again three weeks later because nothing got resolved. People are working hard, but the work doesn't add up to something you can point to with pride.",
      "You've got a strategic plan somewhere—probably in a binder, maybe on a shared drive nobody opens. But the day-to-day doesn't feel connected to it. When a new grant opportunity appears, you chase it. When a board member has an idea, you explore it. You're saying yes to everything because you can't figure out how to say no.",
      "Meanwhile, there's a quiet voice in the back of your head asking: Are we actually making a difference? Or are we just staying busy?"
    ],
    symptoms: [
      { icon: <RefreshCw className="w-5 h-5" />, title: "The meeting that happens twice", description: "You discuss something, seem to reach agreement, then find yourself having the same conversation a month later because no one felt authorized to move forward—or everyone moved forward in different directions." },
      { icon: <Mail className="w-5 h-5" />, title: "The email chain that won't die", description: "A simple question spirals into 27 replies with 11 people cc'd. Nobody wants to make the call because nobody's sure what matters most. So everyone weighs in, and nothing gets decided." },
      { icon: <Package className="w-5 h-5" />, title: "The grant you chased because it was there", description: "The RFP landed in your inbox, the deadline was tight, the money was real. You didn't stop to ask if it fit your strategy because you weren't sure what your strategy actually was. Now you're managing a program that doesn't quite belong." },
      { icon: <Users className="w-5 h-5" />, title: "The good person who quietly left", description: "They didn't make a fuss. Said the right things about new opportunities. But you suspect they left because they got tired of working hard without knowing if it mattered." },
      { icon: <Moon className="w-5 h-5" />, title: "The Sunday night anxiety", description: "You're not behind on any one thing. But you're vaguely behind on everything. There's a low-grade hum of unfinished business that follows you home." }
    ],
    stories: [
      { quote: "We're a small team. Everyone has to wear multiple hats.", reality: "Small teams have to be more focused, not less. You don't have the margin to spread across everything. The hats aren't the problem—it's wearing all of them at once." },
      { quote: "We have to be responsive to our funders and community.", reality: "Responsiveness without strategy is reactivity. The organizations that keep funders longest are the ones who can say \"here's what we do brilliantly\"—not \"we'll do whatever you need.\"" },
      { quote: "Our work is complex. It's not that simple.", reality: "Your work is complex. That's exactly why you need a clear hierarchy of priorities. Complexity without clarity is chaos. Complexity with clarity is strategy." },
      { quote: "We can't say no—the need is too great.", reality: "You're already saying no. You're saying no to depth, to excellence, to breakthrough impact—because you're spreading so thin. The question isn't whether to say no. It's what to say no to." }
    ],
    feeling: {
      title: "The weight you carry that others don't see",
      paragraphs: [
        "It's not just the wasted money or the inefficiency. It's the feeling of running on a treadmill that's tilted slightly uphill. You're working hard. Your team is working hard. But at the end of the quarter, the end of the year, you can't quite explain what changed because of all that effort.",
        "There's a tax you pay every day: the mental energy spent wondering if you're working on the right thing. The conversations you have to have again because nothing was decided the first time. The low-grade guilt of knowing there are important things you're not getting to.",
        "And there's something worse: your best people feel it too. The ones who want to make a difference, who chose mission over money—they came here to matter. When they can't tell if their work is mattering, they start to wonder if maybe they'd matter more somewhere else."
      ]
    },
    whyNotFixed: [
      { title: "Choosing feels like losing", description: "If you say these 3 things are THE priorities, you're implicitly saying other important things are NOT. That feels like abandonment, like letting people down. So you avoid the choice by keeping everything important." },
      { title: "The urgent keeps winning", description: "Strategic clarity is important but never urgent. There's always a grant deadline, a board meeting, a crisis, a request. The work of deciding priorities keeps getting bumped by the work that exists because priorities weren't decided." },
      { title: "You're not sure you have permission", description: "Maybe the board expects you to do everything. Maybe funders have requirements that feel like mandates. Maybe the founder's legacy includes programs you don't feel authorized to sunset." },
      { title: "You've tried before and it didn't stick", description: "Maybe you made a strategic plan. Maybe you had an offsite where priorities were declared. But then reality set in, exceptions were made, and here you are again." }
    ],
    actions: [
      { timeframe: "This Week — 20 Minutes", title: "The Alignment Test", description: "Email your leadership team: \"Without discussing with anyone, please write down what you believe are our organization's top 3 priorities for the next 90 days. Send them directly to me.\" Collect the lists. Don't average them—compare them. If 3 people give you 5+ different answers, you've just proven the constraint exists." },
      { timeframe: "This Month — One Meeting", title: "Force the Choice", description: "Gather your leadership. Say: \"We're going to leave this room with THREE priorities for the next 90 days. Not five. Not three-plus-supporting-initiatives. Three.\" This will be uncomfortable. That's the point. If it feels easy, you didn't actually choose." },
      { timeframe: "This Quarter — New Habit", title: "The \"Not Now\" List", description: "Create a visible document called \"Not Now.\" Everything that matters but isn't in the top 3 goes here. It's not killed—it's parked with respect. Review it every 90 days when you reset priorities." }
    ],
    strengthMessage: "Your team is tougher than you might realize. Despite the diffusion, despite the unclear priorities, they've held together. They still believe in the mission and in each other. When you finally create clarity about where you're going, these are the people who will run through walls to get there."
  },
  // Add more patterns as needed...
  "default": {
    tagline: "Your organization has a clear constraint to address.",
    recognition: [
      "Based on your responses, we've identified a specific area that's limiting your organization's impact.",
      "This isn't about being broken—it's about finding the leverage point that unlocks everything else."
    ],
    symptoms: [],
    stories: [],
    feeling: {
      title: "The cost of not addressing this",
      paragraphs: [
        "Every day this constraint remains unaddressed, your organization pays a tax—in wasted effort, in unrealized potential, in good people wondering if their work matters.",
        "The good news: constraints are specific and addressable. Unlike vague problems, a constraint gives you something concrete to fix."
      ]
    },
    whyNotFixed: [
      { title: "It's been normalized", description: "When something has been true for long enough, it stops feeling like a problem and starts feeling like 'just how things are.'" },
      { title: "Other things felt more urgent", description: "Constraints are often important but not urgent—until they suddenly become crises." }
    ],
    actions: [
      { timeframe: "This Week", title: "Name it publicly", description: "Share this diagnosis with your leadership team. The first step to fixing a constraint is making it undeniable." },
      { timeframe: "This Month", title: "Dig deeper", description: "Use The Nonprofit Edge tools to understand the specific dynamics of your constraint." }
    ],
    strengthMessage: "Your organization has real strengths to build on. The constraint isn't everything—it's just the thing that's limiting how much your strengths can accomplish."
  }
};

const interactionDescriptions: Record<string, string> = {
  "Vision Vacuum": "Leaders aren't aligned on direction—so decisions get made, unmade, and remade based on whoever's in the room.",
  "Scattered Scarcity": "You're chasing funding without a clear strategy, taking whatever money comes regardless of fit.",
  "Busy but Lost": "Your operations are humming, but toward what? Efficiency without strategy is just organized chaos.",
  "Rudderless Ship": "Nobody's steering. There's activity everywhere but no clear direction.",
  "Burnout Spiral": "Leaders are absorbing resource gaps with their own effort. It's not sustainable.",
  "Bottleneck at the Top": "Everything flows through one overwhelmed person. Systems never get built because there's no time.",
  "Succession Cliff": "The organization can't survive a leadership change. All the knowledge and relationships are trapped in one person.",
  "Survival Mode": "You can't think strategically—you're too busy surviving. But survival mode makes strategy impossible.",
  "Carrying the Weight": "The ED is doing what the board should share. Fundraising, strategy, governance—all on one set of shoulders.",
  "Infrastructure Deficit": "No investment in systems perpetuates inefficiency which wastes more resources. A vicious cycle.",
  "Fragile Foundation": "One shock away from crisis. No reserves, no cushion, no margin for error."
};

const ConstraintReport: React.FC<ConstraintReportProps> = ({ onNavigate }) => {
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  useEffect(() => {
    // Load from localStorage (in production, fetch from Supabase)
    const stored = localStorage.getItem('constraintAssessmentResults');
    if (stored) {
      setResults(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="text-center px-6">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assessment Found</h2>
          <p className="text-gray-500 mb-6">Take the ONE Thing Assessment to see your diagnosis.</p>
          <button
            onClick={() => navigate('/constraint-assessment')}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            Start Assessment
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const content = patternContent[results.primaryConstraint.pattern] || patternContent["default"];
  const interactionDesc = interactionDescriptions[results.interactionPattern] || "";

  // Calculate cost estimate based on staff size
  const staffMap: Record<string, number> = { "1-5": 3, "6-15": 10, "16-50": 30, "50+": 60 };
  const staffCount = staffMap[results.intake.staffSize] || 12;
  const estimatedCost = Math.round(staffCount * 50000 * 0.35 / 1000) * 1000;

  const getScoreStatus = (score: number, index: number, total: number) => {
    if (index === 0) return { label: 'Constraint', color: 'cyan' };
    if (index === 1) return { label: 'Secondary', color: 'blue' };
    if (index === total - 1) return { label: 'Strength', color: 'green' };
    return { label: 'Stable', color: 'gray' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard */}
        <div className="px-6 pt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
        
        {/* HEADER */}
        <div className="bg-gradient-to-br from-[#1e3a5a] to-[#0f2744] px-12 py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#22d3d8]" />
          
          <div className="relative">
            <p className="text-[#22d3d8] text-xs font-bold tracking-widest uppercase mb-6">
              The Nonprofit Edge — Constraint Diagnosis
            </p>
            
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-12">
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Your ONE Thing</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                  {results.primaryConstraint.name}
                </h1>
                <p className="text-lg text-white/75">
                  Pattern detected: <strong className="text-[#22d3d8]">{results.primaryConstraint.pattern}</strong><br />
                  {content.tagline}
                </p>
              </div>
              
              <div className="border-l border-white/15 pl-12 flex flex-col justify-center">
                <div className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1">Prepared For</p>
                  <p className="text-white font-semibold">{results.intake.name}</p>
                </div>
                <div className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1">Organization</p>
                  <p className="text-white font-semibold">{results.intake.organization}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1">#1 Score</p>
                  <div className="inline-block bg-[#22d3d8] text-[#0f2744] text-2xl font-extrabold px-6 py-3 rounded-lg">
                    {results.primaryConstraint.score} <span className="text-sm font-medium opacity-70">/ 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-12 py-12 bg-white">
          
          {/* RECOGNITION */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-[#1e3a5a] to-[#0f2744] rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-5 left-8 text-[120px] font-serif text-[#22d3d8] opacity-15 leading-none">"</div>
              <p className="text-[#22d3d8] text-sm font-semibold uppercase tracking-wider mb-5">Sound Familiar?</p>
              <div className="space-y-5 relative z-10">
                {content.recognition.map((para, i) => (
                  <p key={i} className="text-lg leading-relaxed">
                    {para.split(/(\[highlight\].*?\[\/highlight\])/).map((part, j) => {
                      if (part.startsWith('[highlight]')) {
                        return <span key={j} className="text-[#22d3d8] font-semibold">{part.replace(/\[highlight\]|\[\/highlight\]/g, '')}</span>;
                      }
                      return part;
                    })}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* SYMPTOMS */}
          {content.symptoms.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#22d3d8]" />
                </div>
                <h2 className="text-xl font-bold text-[#1e3a5a]">What This Looks Like Day-to-Day</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-[#22d3d8]">
                <p className="text-gray-700 mb-6">
                  {results.primaryConstraint.pattern} doesn't announce itself. It shows up in small moments that feel normal until you name the pattern:
                </p>
                
                <div className="space-y-1">
                  {content.symptoms.map((symptom, i) => (
                    <div key={i} className="flex gap-4 py-5 border-b border-gray-200 last:border-0">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-[#22d3d8]">
                        {symptom.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1e3a5a] mb-1">{symptom.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{symptom.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STORIES */}
          {content.stories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#22d3d8]" />
                </div>
                <h2 className="text-xl font-bold text-[#1e3a5a]">The Stories That Keep It in Place</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <p className="text-gray-700 mb-6">
                  {results.primaryConstraint.pattern} survives because we have good explanations for why things are the way they are. These stories aren't wrong—but they're not the whole truth:
                </p>
                
                <div className="space-y-4">
                  {content.stories.map((story, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-5">
                      <p className="text-gray-700 italic border-l-3 border-[#22d3d8] pl-4 mb-3">"{story.quote}"</p>
                      <p className="text-gray-600 text-sm"><strong className="text-[#1e3a5a]">The reality:</strong> {story.reality}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FEELING */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <Smile className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">What This Costs You (Beyond the Spreadsheet)</h2>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-50/50 rounded-xl p-8 border border-red-200/50">
              <h3 className="text-lg font-bold text-red-500 mb-5">{content.feeling.title}</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {content.feeling.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>

          {/* NUMBERS */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">The Numbers (Because Sometimes It Helps to See Them)</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-5 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Team</p>
                  <p className="text-3xl font-extrabold text-[#1e3a5a]">{staffCount}</p>
                  <p className="text-xs text-gray-500 mt-1">staff members</p>
                </div>
                <div className="text-center p-5 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Misaligned Effort</p>
                  <p className="text-3xl font-extrabold text-[#1e3a5a]">30-40%</p>
                  <p className="text-xs text-gray-500 mt-1">typical for this pattern</p>
                </div>
                <div className="text-center p-5 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Annual Cost</p>
                  <p className="text-3xl font-extrabold text-red-500">${(estimatedCost / 1000).toFixed(0)}K+</p>
                  <p className="text-xs text-gray-500 mt-1">in capacity lost</p>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTION PATTERN */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">The Pattern Your Combination Creates</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#1e3a5a] rounded-xl p-5 text-white">
                  <p className="text-[10px] font-semibold tracking-wider text-[#22d3d8] mb-1">YOUR #1 CONSTRAINT</p>
                  <p className="text-lg font-bold">{results.primaryConstraint.name}</p>
                  <p className="text-sm opacity-70 mt-1">{results.primaryConstraint.score} / 5.0</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <p className="text-[10px] font-semibold tracking-wider text-gray-500 mb-1">YOUR #2 CONSTRAINT</p>
                  <p className="text-lg font-bold text-[#1e3a5a]">{results.secondaryConstraint.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{results.secondaryConstraint.score} / 5.0</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#22d3d8] to-[#1ba8ac] rounded-xl p-6 text-[#0f2744] mb-6">
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">This Combination Creates</p>
                <p className="text-2xl font-extrabold mb-2">{results.interactionPattern}</p>
                <p className="text-sm leading-relaxed">{interactionDesc}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm font-bold text-[#1e3a5a] mb-3">What the research says about this pattern:</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  When {results.primaryConstraint.name} is low AND {results.secondaryConstraint.name} is low, organizations experience compounding effects. The two constraints reinforce each other, making both harder to address in isolation.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong>The unlock:</strong> This isn't two problems to fix. It's one problem ({results.primaryConstraint.name.toLowerCase()}) that's manifesting in two places. When you fix the primary constraint, the secondary often improves automatically.
                </p>
              </div>
            </div>
          </div>

          {/* CASCADE */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">What Changes When You Fix This</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                <div className="flex items-center gap-1 bg-[#1e3a5a] text-white px-3 py-1.5 rounded-md text-xs font-semibold">
                  <span className="text-[#22d3d8] text-[8px] uppercase">Fix</span>
                  <span>{results.primaryConstraint.name}</span>
                </div>
                <span className="text-[#22d3d8] font-bold">→</span>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200">
                  <span className="text-gray-500 text-[8px] uppercase">Improves</span>
                  <span className="text-[#1e3a5a]">{results.secondaryConstraint.name}</span>
                </div>
                <span className="text-[#22d3d8] font-bold">→</span>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200">
                  <span className="text-gray-500 text-[8px] uppercase">Improves</span>
                  <span className="text-[#1e3a5a]">Resource Flow</span>
                </div>
                <span className="text-[#22d3d8] font-bold">→</span>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200">
                  <span className="text-gray-500 text-[8px] uppercase">Improves</span>
                  <span className="text-[#1e3a5a]">Team Energy</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                When you address {results.primaryConstraint.name.toLowerCase()}, the downstream effects cascade through your organization. Leaders align, resources focus, and people stop feeling like they're running in circles. <strong>Fix the constraint, and watch the symptoms resolve themselves.</strong>
              </p>
            </div>
          </div>

          {/* WHY NOT FIXED */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">Why You Haven't Fixed This Already</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <p className="text-gray-700 mb-6">
                You're not oblivious. You've probably sensed this for a while. So why hasn't it changed?
              </p>
              
              <div className="space-y-1">
                {content.whyNotFixed.map((reason, i) => (
                  <div key={i} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 bg-[#22d3d8] text-[#1e3a5a] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e3a5a] mb-1">{reason.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">What To Do About It</h2>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-8 border border-green-200/50">
              <div className="space-y-7">
                {content.actions.map((action, i) => (
                  <div key={i}>
                    <span className="inline-block text-xs font-bold text-green-600 uppercase tracking-wider bg-white px-3 py-1.5 rounded-full mb-3">
                      {action.timeframe}
                    </span>
                    <h3 className="text-lg font-bold text-[#1e3a5a] mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALL SCORES */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">Your Complete Profile</h2>
            </div>
            
            <div className="space-y-3">
              {results.domainScores.map((domain, i) => {
                const status = getScoreStatus(parseFloat(domain.score), i, results.domainScores.length);
                const colorClasses: Record<string, { bar: string; value: string; label: string }> = {
                  cyan: { bar: 'from-cyan-400 to-cyan-500', value: 'text-cyan-500', label: 'text-cyan-500' },
                  blue: { bar: 'from-blue-400 to-blue-500', value: 'text-blue-500', label: 'text-blue-500' },
                  green: { bar: 'from-green-400 to-green-500', value: 'text-green-500', label: 'text-green-500' },
                  gray: { bar: 'from-gray-400 to-gray-500', value: 'text-gray-500', label: 'text-gray-500' },
                };
                const colors = colorClasses[status.color];
                
                return (
                  <div key={domain.domain} className="grid grid-cols-[170px_1fr_50px_80px] gap-4 items-center py-2">
                    <span className="text-sm font-semibold text-gray-700">{domain.name}</span>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${colors.bar} rounded-full`}
                        style={{ width: `${(parseFloat(domain.score) / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-base font-extrabold text-right ${colors.value}`}>{domain.score}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${colors.label}`}>{status.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STRENGTH */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/10 to-cyan-400/20 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#22d3d8]" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5a]">What You Have to Build On</h2>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-8 border border-green-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-green-600">{results.strength.name}</h3>
                <span className="text-xl font-extrabold text-green-600">{results.strength.score} / 5.0</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {content.strengthMessage}
              </p>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#1e3a5a] to-[#0f2744] px-12 py-12 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">This Diagnosis is Just the Beginning</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            The Nonprofit Edge gives you the frameworks, templates, and AI-powered guidance to actually fix your constraint—not just name&nbsp;it.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#22d3d8] hover:bg-cyan-400 text-[#0f2744] font-bold px-8 py-4 rounded-xl text-lg transition-all"
          >
            Start Your Transformation
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>

        {/* FOOTER */}
        <div className="bg-white px-12 py-6 flex justify-between items-center border-t border-gray-200">
          <p className="text-sm font-bold text-[#1e3a5a]">The Nonprofit Edge</p>
          <p className="text-xs text-gray-500">© 2026 The Pivotal Group Consultants, Inc.</p>
        </div>

      </div>
    </div>
  );
};

export default ConstraintReport;
