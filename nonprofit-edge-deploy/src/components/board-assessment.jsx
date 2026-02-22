import { useState } from "react";
import { Users, UserCheck, UserPlus, Sprout, Briefcase, Target, BookOpen, Calendar, MessageSquare, Handshake, DoorOpen, GraduationCap, Library, Search, Heart, DollarSign, TrendingUp, Building2, Shield, Star, Lightbulb, BarChart3, ClipboardList, Award } from "lucide-react";

// Icon wrapper for consistent sizing
const Icon = ({ component: C, size = 18, color, style = {} }) => <C size={size} color={color} strokeWidth={1.8} style={style} />;

// Resolve icon key string to Lucide component
const ICON_MAP = {
  users: Users, usercheck: UserCheck, userplus: UserPlus,
  sprout: Sprout, briefcase: Briefcase, target: Target,
  bookopen: BookOpen, calendar: Calendar, messagesquare: MessageSquare,
  handshake: Handshake, dooropen: DoorOpen, graduationcap: GraduationCap,
  library: Library, search: Search, heart: Heart,
  dollarsign: DollarSign, trendup: TrendingUp, building2: Building2,
  shield: Shield, star: Star, lightbulb: Lightbulb,
  barchart: BarChart3, clipboard: ClipboardList, award: Award,
};
const QIcon = ({ icon, size = 18, color }) => {
  const C = ICON_MAP[icon];
  if (!C) return <span style={{ fontSize: size * 0.9 }}>{icon}</span>;
  return <C size={size} color={color} strokeWidth={1.8} />;
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const BRAND = {
  primary: "#0D2C54",
  accent: "#0097A9",
  dark: "#081A33",
  teal: "#0097A9",
  green: "#1A7A4A",
  red: "#C0392B",
  orange: "#E67E22",
  gold: "#D4A017",
  bg: "#F4F7FA",
  border: "#E2E8F0",
  textBody: "#475569",
  textMuted: "#94A3B8",
};

const ROLES = [
  { id: "board_member", label: "Board Member" },
  { id: "exec_committee", label: "Executive Committee" },
  { id: "board_chair", label: "Board Chair" },
  { id: "ceo", label: "Chief Executive" },
  { id: "other", label: "Other Staff / Observer" },
];

const SHORT_QUESTIONS = [
  { id: "s2a", category: "People", icon: "usercheck", question: "New board members receive a formal orientation that prepares them for their role." },
  { id: "s2b", category: "People", icon: "userplus", question: "New board members are paired with an experienced board buddy for their first year." },
  { id: "s1", category: "People", icon: "users", question: "Our board intentionally recruits members who reflect the diversity of the communities we serve — asking 'Who is missing?' not just 'Who do we know?'", corbett_note: "Dr. Corbett: Board composition should reflect the community you serve." },
  { id: "s3", category: "Culture", icon: "sprout", question: "Our board has a culture of trust and candor — members speak openly, including about difficult issues.", corbett_note: "Dr. Corbett's Trust Triangle: Trust is the foundation of high-performing boards." },
  { id: "s4", category: "Culture", icon: "sprout", question: "Board meetings are an effective use of my time — we focus on what matters most." },
  { id: "s5", category: "Culture", icon: "sprout", question: "My perspective and voice matter in board discussions — I feel heard." },
  { id: "s6", category: "Culture", icon: "sprout", question: "We spend the majority of our meeting time on future direction rather than reports and updates." },
  { id: "s7", category: "Work", icon: "briefcase", question: "Board members share a clear, common understanding of our mission and use it as the filter for key decisions.", corbett_note: "Dr. Corbett: Mission clarity is the single constraint that unlocks everything else." },
  { id: "s8", category: "Work", icon: "briefcase", question: "The full board regularly reviews financial reports and understands the organization's financial health." },
  { id: "s9", category: "Work", icon: "briefcase", question: "The board and CEO have a healthy, trusting partnership with clear boundaries between governance and management.", corbett_note: "The board steers the ship; the CEO operates it. Both roles are essential and distinct." },
  { id: "s10", category: "Work", icon: "briefcase", question: "Board members actively participate in fundraising, advocacy, and serving as mission ambassadors." },
  { id: "s11", category: "Impact", icon: "target", question: "Our board's leadership has a meaningful, positive impact on this organization's direction and effectiveness." },
  { id: "s12", category: "Impact", icon: "target", question: "The board regularly assesses its own performance and takes concrete steps to improve." },
];

const SCALE = [
  { value: 1, label: "Never", color: BRAND.red },
  { value: 2, label: "Rarely", color: BRAND.orange },
  { value: 3, label: "Sometimes", color: BRAND.gold },
  { value: 4, label: "Often", color: BRAND.teal },
  { value: 5, label: "Always", color: BRAND.green },
];

const SELF_CATEGORIES = ["Preparation & Engagement", "Mission Ambassador", "Continuous Learning", "Financial Commitment"];

const CHAIR_CATEGORIES = ["Board Leadership", "CEO Partnership", "Mission Ambassador", "Continuous Learning"];

const CATEGORY_OPENERS = {
  "Financial Commitment": "Being a financial partner means more than writing a check. It's a signal to every donor that the people closest to this mission believe in it enough to invest.",
  "Preparation & Engagement": "Board members who show up prepared don't just perform better — they raise the standard for everyone in the room.",
  "Mission Ambassador": "Your network is one of the most valuable assets you bring to this board. The question is whether you're activating it.",
  "Continuous Learning": "The best board members treat governance as a craft — something you get better at intentionally, not just by showing up.",
  "Board Leadership": "The Chair doesn't just run meetings — you set the culture, protect the health of the full board, and make sure every voice in the room matters.",
  "CEO Partnership": "The most effective board-CEO relationships are built on clarity, trust, and honest conversation. The Chair is the primary steward of that partnership.",
};

const EXCEPTIONAL_STANDARD = {
  "Financial Commitment": "Exceptional board members give at a personally meaningful level every year without being asked, and actively participate in fundraising beyond their own gift.",
  "Preparation & Engagement": "Exceptional board members read all materials in advance, come with questions prepared, and attend every meeting unless there is a true emergency.",
  "Mission Ambassador": "Exceptional ambassadors make 5+ meaningful introductions per year, can explain the mission cold in any setting, and actively recruit donors, partners, and volunteers.",
  "Continuous Learning": "Exceptional board members seek governance education proactively, ask questions when they don't understand something, and share what they're learning with peers.",
  "Board Leadership": "Exceptional chairs run meetings that feel like a genuinely good use of everyone's time, create space for every voice, and address culture or performance issues directly.",
  "CEO Partnership": "Exceptional chairs maintain a regular check-in rhythm with the CEO, provide honest feedback with care, and protect the boundary between governance and management.",
};

const SELF_QUESTIONS = [
  // Financial Commitment
  { id: "self1", category: "Financial Commitment", icon: "dollarsign", question: "There is a clear giving expectation for board members at our organization, and I know what it is.", type: "options", options: [{ value: 4, label: "Yes — it's been clearly communicated to me" }, { value: 3, label: "I think so, but it's been informal or unclear" }, { value: 2, label: "I've heard it mentioned but was never formally told" }, { value: 1, label: "No expectation has ever been communicated to me" }] },
  { id: "self2", category: "Financial Commitment", icon: "heart", question: "My personal financial contribution to this organization this year:", type: "options", options: [{ value: 4, label: "I have met or exceeded my commitment" }, { value: 3, label: "I intend to fulfill it before year-end" }, { value: 2, label: "I've made a partial gift" }, { value: 1, label: "I have not yet given this year" }] },
  { id: "self3", category: "Financial Commitment", icon: "trendup", question: "I participate in fundraising activities beyond my own gift — events, donor introductions, cultivation.", type: "options", options: [{ value: 4, label: "Regularly — it's part of how I show up" }, { value: 3, label: "Occasionally, when I'm asked or see an opening" }, { value: 2, label: "Rarely — I'm not sure how to help" }, { value: 1, label: "Not yet this year" }] },
  // Preparation & Engagement
  { id: "self4", category: "Preparation & Engagement", icon: "bookopen", question: "I read board meeting materials before meetings.", type: "options", options: [{ value: 4, label: "Always — with enough time to reflect and prepare questions" }, { value: 3, label: "Usually, though sometimes just a quick scan" }, { value: 2, label: "Sometimes — it depends on how busy I am" }, { value: 1, label: "Rarely, or I don't receive them with enough lead time" }] },
  { id: "self5", category: "Preparation & Engagement", icon: "calendar", question: "I attend board meetings.", type: "options", options: [{ value: 4, label: "100% of the time" }, { value: 3, label: "About 75% of the time" }, { value: 2, label: "About 50% of the time" }, { value: 1, label: "Less than 50% of the time" }] },
  { id: "self6", category: "Preparation & Engagement", icon: "messagesquare", question: "I actively contribute in board meetings — asking questions, sharing perspectives, and engaging in decisions.", type: "options", options: [{ value: 4, label: "Always — I come ready to engage" }, { value: 3, label: "Usually, though I hold back sometimes" }, { value: 2, label: "Sometimes — I often defer to more vocal members" }, { value: 1, label: "Rarely — I'm not sure my voice adds much" }] },
  // Mission Ambassador
  { id: "self7", category: "Mission Ambassador", icon: "messagesquare", question: "I can clearly articulate this organization's mission and impact in a conversation.", type: "options", options: [{ value: 4, label: "Confidently — I do it regularly" }, { value: 3, label: "Fairly well, though I sometimes stumble" }, { value: 2, label: "I know the basics but struggle to make it compelling" }, { value: 1, label: "Honestly, I'd have a hard time explaining it well" }] },
  { id: "self8", category: "Mission Ambassador", icon: "handshake", question: "I have made introductions or connections for this organization this year.", type: "options", options: [{ value: 4, label: "5 or more people" }, { value: 3, label: "3–4 people" }, { value: 2, label: "1–2 people" }, { value: 1, label: "None yet this year" }] },
  { id: "self9", category: "Mission Ambassador", icon: "dooropen", question: "I use my networks to open doors — for donors, partners, volunteers, or visibility.", type: "options", options: [{ value: 4, label: "Regularly — I'm always thinking about who I can connect" }, { value: 3, label: "Occasionally, when an obvious opportunity comes up" }, { value: 2, label: "Rarely — I'm not sure who to connect or how to ask" }, { value: 1, label: "Not yet this year" }] },
  // Continuous Learning
  { id: "self10", category: "Continuous Learning", icon: "graduationcap", question: "I stay current on this organization's programs, finances, and strategic direction.", type: "options", options: [{ value: 4, label: "Always — I read everything and ask questions when I don't understand" }, { value: 3, label: "Usually, though I sometimes tune out on financial details" }, { value: 2, label: "Somewhat — I rely on meetings to keep me informed" }, { value: 1, label: "Rarely — I often feel behind or disconnected" }] },
  { id: "self11", category: "Continuous Learning", icon: "library", question: "I take steps to grow my governance knowledge — reading, training, peer learning.", type: "options", options: [{ value: 4, label: "Regularly — I actively seek it out" }, { value: 3, label: "Occasionally — when something relevant comes up" }, { value: 2, label: "Rarely — I haven't prioritized it" }, { value: 1, label: "Never — I didn't know that was part of the role" }] },
  { id: "self12", category: "Continuous Learning", icon: "search", question: "When I encounter something I don't understand at a board meeting, I follow up.", type: "options", options: [{ value: 4, label: "Always — I ask after the meeting or do my own research" }, { value: 3, label: "Usually, if it seems important" }, { value: 2, label: "Sometimes — I often let it go" }, { value: 1, label: "Rarely — I don't want to seem uninformed" }] },
];

// Chair-specific questions — same category structure, different lens
const CHAIR_QUESTIONS = [
  // Board Leadership
  { id: "chair1", category: "Board Leadership", icon: "building2", question: "Our board meetings are an effective, energizing use of everyone's time.", type: "options", options: [{ value: 4, label: "Yes — members leave engaged and clear on next steps" }, { value: 3, label: "Mostly, though we drift into the weeds sometimes" }, { value: 2, label: "Hit or miss — some meetings work, others don't" }, { value: 1, label: "Honestly, I hear that members feel it's not worth their time" }] },
  { id: "chair2", category: "Board Leadership", icon: "building2", question: "I actively create space for every board member's voice — not just the most vocal ones.", type: "options", options: [{ value: 4, label: "Always — I facilitate with that intentionality" }, { value: 3, label: "Usually, though certain voices dominate" }, { value: 2, label: "Sometimes — I struggle to balance participation" }, { value: 1, label: "Rarely — I haven't approached it that deliberately" }] },
  { id: "chair3", category: "Board Leadership", icon: "building2", question: "When board culture or member performance issues arise, I address them directly.", type: "options", options: [{ value: 4, label: "Yes — I have those conversations even when they're uncomfortable" }, { value: 3, label: "Usually, though I sometimes wait too long" }, { value: 2, label: "Sometimes — I tend to avoid direct confrontation" }, { value: 1, label: "Rarely — I'm not sure it's my place" }] },
  // CEO Partnership
  { id: "chair4", category: "CEO Partnership", icon: "handshake", question: "I maintain a regular check-in rhythm with the CEO — not just at board meetings.", type: "options", options: [{ value: 4, label: "Yes — we connect consistently and it's genuinely useful" }, { value: 3, label: "Mostly, though it's less structured than I'd like" }, { value: 2, label: "Occasionally — when something comes up" }, { value: 1, label: "Rarely — our relationship is mostly transactional" }] },
  { id: "chair5", category: "CEO Partnership", icon: "handshake", question: "I provide honest, caring feedback to the CEO — including when things aren't going well.", type: "options", options: [{ value: 4, label: "Yes — we have that kind of trust and directness" }, { value: 3, label: "Mostly — I share the positives more easily than the hard stuff" }, { value: 2, label: "Sometimes — I hold back to avoid conflict" }, { value: 1, label: "Rarely — I'm not sure how to approach it" }] },
  { id: "chair6", category: "CEO Partnership", icon: "shield", question: "The boundary between board governance and staff management is clear and respected.", type: "options", options: [{ value: 4, label: "Yes — the board governs and the CEO manages, and we both honor that" }, { value: 3, label: "Mostly, though it gets blurry at times" }, { value: 2, label: "Sometimes — board members sometimes cross into operations" }, { value: 1, label: "It's often unclear, and that creates friction" }] },
  // Mission Ambassador (shared)
  { id: "chair7", category: "Mission Ambassador", icon: "messagesquare", question: "I can clearly and compellingly articulate this organization's mission and impact.", type: "options", options: [{ value: 4, label: "Confidently — I do it regularly and can adapt it to any audience" }, { value: 3, label: "Fairly well, though I sometimes rely on prepared talking points" }, { value: 2, label: "I know the basics but struggle to make it compelling" }, { value: 1, label: "Honestly, I'd have a hard time explaining it well" }] },
  { id: "chair8", category: "Mission Ambassador", icon: "handshake", question: "I have made introductions or connections for this organization this year.", type: "options", options: [{ value: 4, label: "5 or more people" }, { value: 3, label: "3–4 people" }, { value: 2, label: "1–2 people" }, { value: 1, label: "None yet this year" }] },
  { id: "chair9", category: "Mission Ambassador", icon: "star", question: "I model ambassador behavior for the rest of the board — making introductions, opening doors, talking about the mission publicly.", type: "options", options: [{ value: 4, label: "Yes — I lead by example and encourage others to do the same" }, { value: 3, label: "Somewhat — I do it but don't explicitly connect it to board expectations" }, { value: 2, label: "Occasionally — it's not something I've been intentional about" }, { value: 1, label: "Not yet — I need to be more deliberate here" }] },
  // Continuous Learning (shared)
  { id: "chair10", category: "Continuous Learning", icon: "graduationcap", question: "I stay current on this organization's programs, finances, and strategic direction.", type: "options", options: [{ value: 4, label: "Always — I read everything and ask questions when I don't understand" }, { value: 3, label: "Usually, though I sometimes miss details" }, { value: 2, label: "Somewhat — I rely on meetings to keep me informed" }, { value: 1, label: "Rarely — I often feel behind" }] },
  { id: "chair11", category: "Continuous Learning", icon: "library", question: "I invest in my own development as a board leader — not just as a subject matter expert.", type: "options", options: [{ value: 4, label: "Regularly — I seek out governance and leadership learning" }, { value: 3, label: "Occasionally — when something relevant comes up" }, { value: 2, label: "Rarely — I haven't prioritized it" }, { value: 1, label: "Never — I didn't know that was part of the Chair role" }] },
  { id: "chair12", category: "Continuous Learning", icon: "search", question: "I actively look for ways to strengthen the board as a whole — recruitment, culture, development.", type: "options", options: [{ value: 4, label: "Always — board health is one of my core responsibilities" }, { value: 3, label: "Usually — I think about it but don't always act on it" }, { value: 2, label: "Sometimes — when a specific issue forces it" }, { value: 1, label: "Rarely — I focus more on managing meetings than building the board" }] },
];

const SELF_ACTION_PLAN = {
  "Financial Commitment": { low: "Schedule a conversation with the Board Chair or ED about your giving plan. Every board member giving — at whatever level is meaningful — sets a powerful example for donors.", mid: "You're on your way. If you haven't yet met your giving goal, set a date on your calendar to follow through before year-end.", high: "Thank you — your financial commitment models the way. Consider inspiring a peer who may still be working toward their goal." },
  "Preparation & Engagement": { low: "Talk to staff about lead time for materials. If you're consistently not receiving them early enough, that's a structural issue — not a you issue. Advocate for at least 5–7 days advance notice.", mid: "You're engaged but have room to go deeper. Try reading materials the day they arrive and noting one question to bring to the next meeting.", high: "You show up prepared and engaged. That consistency is a gift to your board. Think about how you model that for newer members." },
  "Mission Ambassador": { low: "Identify two people in your network who would care about this mission — and make one introduction before your next board meeting. It doesn't have to be a formal ask.", mid: "You're making connections — keep it going. Set a personal goal for the next quarter. Even one warm introduction a month adds up.", high: "You are a true ambassador. Talk to the CEO or development team about how to channel your connections most effectively." },
  "Continuous Learning": { low: "Start small: read one article about a topic relevant to this board this month. Learning together is a board culture builder.", mid: "Good instincts — keep building. Look for one governance-focused training or peer conversation this year.", high: "You bring learning energy to your role. Consider suggesting a book, article, or training to the full group." },
  "Board Leadership": { low: "Start by asking board members directly: 'What would make our meetings worth your time?' The answers will tell you exactly where to focus.", mid: "You're doing the work — now get more intentional. Pick one facilitation practice to improve this quarter: agenda design, participation balance, or culture-setting.", high: "You're leading well. Document what's working so it outlasts your tenure, and coach your successor." },
  "CEO Partnership": { low: "Set up a standing monthly check-in with the CEO — even 30 minutes changes the relationship. Go in curious, not with an agenda.", mid: "The connection is there — deepen it. Ask the CEO directly: 'Is there anything I could do as Chair that would make your job easier or your work stronger?'", high: "You've built a strong partnership. Make sure the full board benefits from it — model the Chair-CEO dynamic publicly so others understand what healthy governance looks like." },
};

function getAvgScore(responses, questions) {
  const answered = questions.filter(q => responses[q.id] !== undefined);
  if (!answered.length) return 0;
  return answered.reduce((sum, q) => sum + responses[q.id], 0) / answered.length;
}

function getCategoryScores(responses, questions) {
  const cats = {};
  questions.forEach(q => {
    if (!cats[q.category]) cats[q.category] = [];
    if (responses[q.id]) cats[q.category].push(responses[q.id]);
  });
  const result = {};
  Object.entries(cats).forEach(([cat, scores]) => {
    result[cat] = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  });
  return result;
}

function scoreColor(score) {
  if (score >= 4.5) return BRAND.green;
  if (score >= 3.5) return BRAND.teal;
  if (score >= 2.5) return BRAND.gold;
  if (score >= 1.5) return BRAND.orange;
  return BRAND.red;
}

function scoreLabel(score) {
  if (score >= 4.5) return "Exceptional";
  if (score >= 3.5) return "Responsible";
  if (score >= 2.5) return "Functional";
  return "Developing";
}

function generateInsight(cat, score) {
  const insights = {
    "People": { low: "Board composition is a critical gap. Launch a Governance Committee, implement a skills matrix, and begin asking 'Who is missing from this table?' at every recruitment conversation.", mid: "Recruitment is underway but needs to be more intentional. Shift focus from professional credentials to diversity of lived experience and community connection.", high: "Excellent board composition practices. Maintain the discipline of continuous recruitment, term limit enforcement, and mentorship of new members." },
    "Culture": { low: "Board culture is a significant barrier. Without trust and psychological safety, governance cannot reach its potential. Start with a facilitated conversation about how members want to work together — and what's getting in the way.", mid: "Culture is developing. Intentionally redesign meetings so members feel heard and time is used well. The shift from reporting out to thinking together changes everything.", high: "Your board culture is a competitive advantage. You've built trust, voice, and shared purpose. Continue protecting these and coach newer members into the culture." },
    "Work": { low: "Core governance functions need attention across multiple dimensions — strategy, financial oversight, and/or the CEO partnership. Prioritize the weakest sub-area and address it first.", mid: "Governance work is functional but uneven. Identify which specific areas are creating drag and address each directly.", high: "Strong governance across the board's core responsibilities. Continue stress-testing strategic assumptions, sharpening financial oversight, and deepening the CEO partnership." },
    "Impact": { low: "Board members are not yet experiencing their collective leadership as consequential. Start with an honest board conversation about what 'impact' means for this board.", mid: "The board is creating value but not yet at its full potential. Conduct a formal self-assessment and tie board improvement goals directly to the strategic plan.", high: "Your board is operating at a high level of impact. Formalize your self-assessment cycle and consider how your model could benefit peer organizations." },
  };
  const tier = score < 2.5 ? "low" : score < 3.75 ? "mid" : "high";
  return insights[cat]?.[tier] || "Continue strengthening this area through intentional governance practices.";
}

function ScoreGauge({ score, size = 100 }) {
  const pct = ((score - 1) / 4) * 100;
  const color = scoreColor(score);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#E0E8EF" strokeWidth="10" strokeLinecap="round" />
        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${pct * 1.257} 125.7`} />
        <text x="50" y="52" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{score.toFixed(1)}</text>
      </svg>
      <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginTop: -4 }}>{scoreLabel(score)}</div>
    </div>
  );
}

function CategoryBar({ category, score }) {
  const color = scoreColor(score);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: BRAND.dark, fontWeight: 500 }}>{category}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{score.toFixed(1)} / 5</span>
      </div>
      <div style={{ height: 8, background: "#E0E8EF", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: `linear-gradient(90deg, ${color}CC, ${color})`, borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>{scoreLabel(score)}</div>
    </div>
  );
}

function ScaleButton({ value, label, color, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: "10px 4px", border: `2px solid ${selected ? color : "#E2E8F0"}`, borderRadius: 8, background: selected ? color : "white", color: selected ? "white" : "#555", fontWeight: selected ? 700 : 500, fontSize: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: FONT }}>
      <span style={{ fontSize: 16, opacity: selected ? 1 : 0.6 }}>{value === 1 ? "😟" : value === 2 ? "😐" : value === 3 ? "🙂" : value === 4 ? "😊" : "⭐"}</span>
      <span>{value}</span>
      <span style={{ fontSize: 10 }}>{label}</span>
    </button>
  );
}

// ── Self Assessment Screen ──
function SelfAssessmentScreen({ selfResponses, setSelfResponses, selfReflections, setSelfReflections, respondentInfo, onSubmit, onBack }) {
  const [currentCat, setCurrentCat] = useState(0);
  const isChair = respondentInfo.role === "board_chair";
  const categories = isChair ? CHAIR_CATEGORIES : SELF_CATEGORIES;
  const questions = isChair ? CHAIR_QUESTIONS : SELF_QUESTIONS;
  const category = categories[currentCat];
  const catQs = questions.filter(q => q.category === category);
  const totalAnswered = questions.filter(q => selfResponses[q.id] !== undefined).length;
  const allCatAnswered = catQs.every(q => selfResponses[q.id] !== undefined);
  const allAnswered = questions.every(q => selfResponses[q.id] !== undefined);
  const setAnswer = (id, val) => setSelfResponses(r => ({ ...r, [id]: val }));
  const opener = CATEGORY_OPENERS[category];

  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, fontFamily: FONT }}>
      {/* Progress bar */}
      <div style={{ background: BRAND.primary, padding: "12px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            <span>{respondentInfo.name} · {isChair ? "Board Chair" : "Board Member"} Self-Assessment</span>
            <span>{Math.round((totalAnswered / questions.length) * 100)}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${(totalAnswered / questions.length) * 100}%`, background: BRAND.accent, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* Chair notice */}
      {isChair && currentCat === 0 && (
        <div style={{ background: `${BRAND.accent}15`, borderBottom: `1px solid ${BRAND.accent}30`, padding: "10px 24px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", fontSize: 13, color: BRAND.primary, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Building2 size={16} color={BRAND.primary} strokeWidth={2} />
            <span><strong>Because you serve as Board Chair,</strong> some questions in this assessment are tailored specifically to your role — covering board leadership and your partnership with the CEO.</span>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ background: "white", borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex" }}>
          {categories.map((cat, i) => {
            const done = questions.filter(q => q.category === cat).every(q => selfResponses[q.id] !== undefined);
            return (
              <button key={cat} onClick={() => setCurrentCat(i)} style={{ flex: 1, padding: "11px 6px", border: "none", background: "none", borderBottom: `3px solid ${currentCat === i ? BRAND.teal : "transparent"}`, color: currentCat === i ? BRAND.primary : "#888", fontSize: 10, fontWeight: currentCat === i ? 700 : 500, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}>
                {done ? "✓ " : ""}{cat.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        {/* Category opener */}
        {opener && (
          <div style={{ background: `linear-gradient(135deg, ${BRAND.primary}08, ${BRAND.teal}08)`, border: `1px solid ${BRAND.primary}15`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{category}</div>
            <p style={{ color: BRAND.primary, fontSize: 14, margin: 0, lineHeight: 1.7, fontStyle: "italic", fontWeight: 500 }}>"{opener}"</p>
          </div>
        )}

        {/* Questions */}
        {catQs.map(q => (
          <div key={q.id} style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#333", fontSize: 15, margin: "0 0 14px", lineHeight: 1.6, fontWeight: 500 }}>{q.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map(opt => (
                <div key={opt.value} onClick={() => setAnswer(q.id, opt.value)} style={{ padding: "11px 14px", border: `2px solid ${selfResponses[q.id] === opt.value ? BRAND.teal : "#E2E8F0"}`, borderRadius: 8, cursor: "pointer", background: selfResponses[q.id] === opt.value ? `${BRAND.teal}12` : "white", color: selfResponses[q.id] === opt.value ? BRAND.teal : "#444", fontWeight: selfResponses[q.id] === opt.value ? 700 : 500, fontSize: 14, transition: "all 0.15s" }}>
                  {opt.label}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Exceptional standard */}
        {EXCEPTIONAL_STANDARD[category] && (
          <div style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}25`, borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.green, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 5 }}>⭐ What Exceptional Looks Like</div>
            <p style={{ color: "#444", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{EXCEPTIONAL_STANDARD[category]}</p>
          </div>
        )}

        {/* Per-category reflection */}
        <div style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BRAND.teal}25` }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: BRAND.primary, display: "block", marginBottom: 6, lineHeight: 1.5 }}>
            💭 What's one thing you could do differently in this area?
          </label>
          <p style={{ fontSize: 12, color: BRAND.textMuted, margin: "0 0 10px" }}>Optional — but the best insights often come from here.</p>
          <textarea
            value={selfReflections[category] || ""}
            onChange={e => setSelfReflections(r => ({ ...r, [category]: e.target.value }))}
            placeholder="Be honest with yourself..."
            rows={2}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: FONT, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5, color: "#333" }}
          />
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {currentCat > 0 && (
            <button onClick={() => setCurrentCat(c => c - 1)} style={{ padding: "12px 24px", background: "white", color: BRAND.primary, border: `1px solid ${BRAND.border}`, borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: FONT }}>← Back</button>
          )}
          {currentCat < categories.length - 1
            ? <button onClick={() => setCurrentCat(c => c + 1)} disabled={!allCatAnswered} style={{ flex: 1, padding: "12px", background: allCatAnswered ? BRAND.primary : "#E2E8F0", color: allCatAnswered ? "white" : "#aaa", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: allCatAnswered ? "pointer" : "not-allowed", fontFamily: FONT }}>Next Section →</button>
            : <button onClick={onSubmit} disabled={!allAnswered} style={{ flex: 1, padding: "12px", background: allAnswered ? BRAND.accent : "#E2E8F0", color: allAnswered ? "white" : "#aaa", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: allAnswered ? "pointer" : "not-allowed", fontFamily: FONT }}>See My Results →</button>
          }
        </div>
      </div>
    </div>
  );
}
// ── Assessment Screen (needs its own useState) ──
function AssessmentScreen({ responses, setResponses, respondentInfo, openEndedResponses, setOpenEndedResponses, onSubmit }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const qs = SHORT_QUESTIONS;
  const answered = Object.keys(responses).length;
  const pct = Math.round((answered / qs.length) * 100);
  const q = qs[currentQ];
  const allAnswered = answered === qs.length;
  const remaining = qs.length - answered;
  const unansweredInCategory = (cat) => qs.filter(q => q.category === cat && !responses[q.id]).length;

  function handleSubmitAttempt() {
    if (allAnswered) {
      onSubmit();
    } else {
      setAttempted(true);
      const firstUnanswered = qs.findIndex(q => !responses[q.id]);
      if (firstUnanswered >= 0) setCurrentQ(firstUnanswered);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, fontFamily: FONT }}>
      <div style={{ background: BRAND.primary, padding: "12px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: BRAND.accent, transition: "width 0.3s" }} />
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 4 }}>{answered} of {qs.length} answered</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700 }}>{pct}%</div>
        </div>
      </div>
      <div style={{ background: "white", borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex" }}>
          {["People", "Culture", "Work", "Impact"].map(cat => {
            const catQs = qs.filter(q => q.category === cat);
            const done = catQs.filter(q => responses[q.id]).length;
            const active = q?.category === cat;
            const hasGap = attempted && unansweredInCategory(cat) > 0;
            return (
              <button key={cat} onClick={() => setCurrentQ(qs.findIndex(qq => qq.category === cat))} style={{ flex: 1, padding: "10px 8px", border: "none", background: "none", borderBottom: `3px solid ${active ? BRAND.accent : hasGap ? BRAND.orange : "transparent"}`, color: active ? BRAND.primary : hasGap ? BRAND.orange : "#888", fontSize: 11, fontWeight: active || hasGap ? 700 : 500, cursor: "pointer", fontFamily: FONT, position: "relative" }}>
                {cat} {done}/{catQs.length}
                {hasGap && <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: BRAND.orange }} />}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <QIcon icon={q?.icon} size={18} color={BRAND.teal} />
          <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, textTransform: "uppercase", letterSpacing: "1px" }}>{q?.category}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#888" }}>Q{currentQ + 1} of {qs.length}</span>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: attempted && !responses[q?.id] ? `2px solid ${BRAND.orange}` : "2px solid transparent" }}>
          <p style={{ color: BRAND.dark, fontSize: 16, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{q?.question}</p>
          {q?.corbett_note && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: `${BRAND.accent}15`, borderLeft: `3px solid ${BRAND.accent}`, borderRadius: "0 8px 8px 0", fontSize: 12, color: "#705000", fontStyle: "italic" }}>
              💡 {q.corbett_note}
            </div>
          )}
          {attempted && !responses[q?.id] && (
            <div style={{ marginTop: 10, fontSize: 12, color: BRAND.orange, fontWeight: 600 }}>⚠ Please select a response to continue</div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {SCALE.map(s => (
            <ScaleButton key={s.value} value={s.value} label={s.label} color={s.color} selected={responses[q?.id] === s.value} onClick={() => setResponses(p => ({ ...p, [q.id]: s.value }))} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          {currentQ > 0 && (
            <button onClick={() => setCurrentQ(c => c - 1)} style={{ padding: "10px 20px", border: `1px solid ${BRAND.border}`, borderRadius: 8, background: "white", color: "#555", fontSize: 13, cursor: "pointer", fontFamily: FONT }}>← Previous</button>
          )}
          {currentQ < qs.length - 1 && (
            <button onClick={() => setCurrentQ(c => c + 1)} style={{ marginLeft: "auto", padding: "10px 24px", background: BRAND.primary, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Next →</button>
          )}
        </div>

        {currentQ === qs.length - 1 && (
          <div style={{ background: "white", borderRadius: 14, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ color: BRAND.primary, margin: "0 0 4px", fontSize: 17, fontWeight: 800 }}>📝 Reflection Questions</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 }}>Optional but encouraged — your candid responses make the collective report far more useful for the board.</p>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.primary, marginBottom: 4, lineHeight: 1.5 }}>
                What would you like to see our board do more of, less of, or stop doing altogether?
              </div>
              <p style={{ fontSize: 12, color: BRAND.textMuted, margin: "0 0 14px" }}>Complete whichever fields are most relevant to you.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { key: "moreOf", label: "More of…", color: BRAND.green, icon: "↑" },
                  { key: "lessOf", label: "Less of…", color: BRAND.gold, icon: "↓" },
                  { key: "stopDoing", label: "Stop doing altogether…", color: BRAND.red, icon: "✕" },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: `${f.color}20`, border: `1px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: f.color, flexShrink: 0 }}>{f.icon}</span>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{f.label}</label>
                    </div>
                    <textarea value={openEndedResponses[f.key]} onChange={e => setOpenEndedResponses(p => ({ ...p, [f.key]: e.target.value }))} placeholder={`What should we ${f.key === "moreOf" ? "do more of" : f.key === "lessOf" ? "do less of" : "stop doing"}?`} rows={2} style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${openEndedResponses[f.key] ? f.color + "60" : "#E2E8F0"}`, borderRadius: 8, fontSize: 13, fontFamily: FONT, boxSizing: "border-box", resize: "vertical", color: "#333", lineHeight: 1.5 }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${BRAND.border}`, paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { key: "biggestImpact", label: "What is the single most important thing our board could do in the next 12 months to make the biggest difference for this organization?", placeholder: "In the next year, our board could make the biggest impact by..." },
                { key: "neededMost", label: "Right now, what does this organization need most from its board — and are we delivering it?", placeholder: "What we need most right now is..." },
                { key: "longTerm", label: "Looking 3–5 years out, what strategic questions should our board be wrestling with that we aren't yet?", placeholder: "The strategic questions we aren't asking yet are..." },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: BRAND.primary, display: "block", marginBottom: 6, lineHeight: 1.5 }}>{f.label}</label>
                  <textarea value={openEndedResponses[f.key]} onChange={e => setOpenEndedResponses(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3} style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: FONT, boxSizing: "border-box", resize: "vertical", color: "#333", lineHeight: 1.5 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentQ === qs.length - 1 && (
          <div>
            {!allAnswered && attempted && (
              <div style={{ background: `${BRAND.orange}12`, border: `1px solid ${BRAND.orange}40`, borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.orange }}>{remaining} question{remaining !== 1 ? "s" : ""} still need{remaining === 1 ? "s" : ""} a response</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>The tabs above will show you which sections have unanswered questions.</div>
                </div>
              </div>
            )}
            <button onClick={handleSubmitAttempt} style={{ width: "100%", padding: "16px", background: allAnswered ? `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.teal})` : "#CBD5E1", color: allAnswered ? "white" : "#94A3B8", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
              {allAnswered ? "Submit Assessment & View Report →" : `Submit Assessment (${remaining} question${remaining !== 1 ? "s" : ""} remaining)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");

  // Scroll to top on every screen change
  const navigate = (s) => { setScreen(s); window.scrollTo({ top: 0, behavior: "instant" }); };
  const [respondentInfo, setRespondentInfo] = useState({ name: "", email: "", role: "" });
  const [responses, setResponses] = useState({});
  const [selfResponses, setSelfResponses] = useState({});
  const [selfReflections, setSelfReflections] = useState({});
  const [selfCommitment, setSelfCommitment] = useState("");
  const [openEndedResponses, setOpenEndedResponses] = useState({ moreOf: "", lessOf: "", stopDoing: "", biggestImpact: "", neededMost: "", longTerm: "" });
  const [adminData, setAdminData] = useState({ orgName: "" });
  const [allResponses, setAllResponses] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [selfReportData, setSelfReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [finalized, setFinalized] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showEmailScreen, setShowEmailScreen] = useState(false);

  function buildReport(all) {
    const qs = SHORT_QUESTIONS;
    const aggResponses = {};
    qs.forEach(q => {
      const vals = all.map(r => r.responses[q.id]).filter(Boolean);
      aggResponses[q.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    const overall = getAvgScore(aggResponses, qs);
    const catScores = getCategoryScores(aggResponses, qs);
    const byRole = {};
    ROLES.forEach(role => {
      const roleResps = all.filter(r => r.role === role.id);
      if (roleResps.length > 0) {
        const roleAgg = {};
        qs.forEach(q => {
          const vals = roleResps.map(r => r.responses[q.id]).filter(Boolean);
          roleAgg[q.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        });
        byRole[role.id] = { label: role.label, count: roleResps.length, overall: getAvgScore(roleAgg, qs), categories: getCategoryScores(roleAgg, qs) };
      }
    });
    setReportData({ overall, catScores, byRole, questionScores: aggResponses, respondentCount: all.length, qs });
  }

  function addDemoData() {
    setAdminData(p => ({ ...p, orgName: "Community Health Alliance" }));
    const gen = (avg) => {
      const r = {};
      SHORT_QUESTIONS.forEach(q => { r[q.id] = Math.max(1, Math.min(5, Math.round(avg + (Math.random() - 0.5) * 2))); });
      return r;
    };
    const demo = [
      { name: "Maria T.", role: "exec_committee", responses: gen(4.1), openEnded: { moreOf: "Strategic conversation — we have smart people in the room and we rarely use that collective intelligence well.", lessOf: "Time spent reviewing reports line by line. Send them in advance, trust that we've read them, and use meeting time for dialogue.", stopDoing: "Rubber-stamping decisions that were already made before the meeting. If it's truly informational, it doesn't need a vote.", biggestImpact: "Build a 3-year fundraising strategy with clear board roles and accountability — right now philanthropy feels like the CEO's job alone.", neededMost: "Genuine financial literacy across the full board, not just the treasurer. We approve budgets we don't fully understand.", longTerm: "How do we stay relevant and trusted as the communities we serve become more vocal about wanting leadership that looks like them?" } },
      { name: "James R.", role: "board_member", responses: gen(3.2), openEnded: { moreOf: "Honest, unfiltered conversation about what isn't working. We're too polite to be effective.", lessOf: "Agenda items that could have been an email. Our time together is too valuable for updates.", stopDoing: "Starting meetings 10 minutes late — it signals that we don't respect each other's time.", biggestImpact: "Establish a clear board-CEO compact. We cross the line into operations constantly and it creates confusion and friction.", neededMost: "Board members who show up prepared and engaged, not just physically present.", longTerm: "What does this organization need to look like — leadership, structure, partnerships — to serve a community that will look very different in 10 years?" } },
      { name: "Sandra L.", role: "board_chair", responses: gen(4.4), openEnded: { moreOf: "Peer-to-peer accountability. We hold the CEO accountable but rarely hold each other to the same standard.", lessOf: "Deference to the most senior or loudest voices. Every person at the table was recruited for a reason.", stopDoing: "Tolerating chronic disengagement without a direct conversation. It's not kind — it's avoidance.", biggestImpact: "Launch a structured board recruitment effort with a skills matrix and a genuine commitment to community representation.", neededMost: "Trust — between board members, and between the board and the staff. Everything else grows from that.", longTerm: "Are we the right organization to lead this work in the next decade, or do we need to evolve our model — or our partnerships?" } },
      { name: "Kevin P.", role: "ceo", responses: gen(3.7), openEnded: { moreOf: "Board members making introductions without being asked. The best ambassadors do it naturally.", lessOf: "Last-minute agenda additions that haven't been vetted — it disrupts flow and sets a bad precedent.", stopDoing: "Asking me operational questions in the board meeting. Those conversations belong offline.", biggestImpact: "Every board member makes at least one meaningful donor or partner introduction this year. One each would transform our development pipeline.", neededMost: "A board that champions this mission publicly and consistently — not just when they're in the room with me.", longTerm: "How do we build real financial resilience — reserves, diversified revenue, endowment — against the funding volatility we keep experiencing?" } },
      { name: "Priya M.", role: "exec_committee", responses: gen(3.9), openEnded: { moreOf: "Genuine recognition of staff at board meetings — they rarely see the board and it matters more than we realize.", lessOf: "Committee reports that duplicate what's already in the packet. Summarize, don't repeat.", stopDoing: "Treating board development as an afterthought. If we want a stronger organization, we have to invest in a stronger board first.", biggestImpact: "Get serious about board development — orientation, coaching, annual self-assessment. We expect a lot and invest very little.", neededMost: "Strategic clarity. The board can't align its energy if we're not clear on the top two or three priorities.", longTerm: "What mergers, partnerships, or shared services should we be exploring that we're too siloed to even consider right now?" } },
      { name: "Tom W.", role: "board_member", responses: gen(2.8), openEnded: { moreOf: "Informal time for board members to actually get to know each other. We make decisions with people we barely know.", lessOf: "Meetings that feel like compliance exercises. If it's just reporting, why are we all here?", stopDoing: "Avoiding the conversation about financial reserves. We all see it. Pretending otherwise is irresponsible.", biggestImpact: "Have an honest board conversation about long-term sustainability — not to alarm anyone, but because it's our job.", neededMost: "Courage. We are very good at identifying problems and very reluctant to name them out loud.", longTerm: "What would it actually take to double our impact in the next decade — and do we, as a board, have the will and the capacity to get there?" } },
    ];
    setAllResponses(demo);
    buildReport(demo);
    navigate("dashboard");
  }

  function submitAssessment() {
    const submission = { ...respondentInfo, responses: { ...responses }, openEnded: { ...openEndedResponses } };
    const updated = [...allResponses, submission];
    setAllResponses(updated);
    buildReport(updated);
    navigate("report");
  }

  function submitSelfAssessment() {
    const isChair = respondentInfo.role === "board_chair";
    const questions = isChair ? CHAIR_QUESTIONS : SELF_QUESTIONS;
    const cats = isChair ? CHAIR_CATEGORIES : SELF_CATEGORIES;
    const catScores = {};
    cats.forEach(cat => {
      const catQs = questions.filter(q => q.category === cat);
      const vals = catQs.map(q => selfResponses[q.id]).filter(v => v !== undefined);
      catScores[cat] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    setSelfReportData({ catScores, overall: Object.values(catScores).reduce((a, b) => a + b, 0) / cats.length, responses: { ...selfResponses }, isChair, cats, questions });
    navigate("selfReport");
  }

  // ── HOME ──────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primary} 60%, ${BRAND.teal} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FONT }}>
      <div style={{ textAlign: "center", maxWidth: 640, marginBottom: 48 }}>
        <div style={{ width: 64, height: 64, background: "white", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}><Building2 size={32} color={BRAND.primary} strokeWidth={1.5} /></div>
        <h1 style={{ color: "white", fontSize: 34, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>Board Governance<br /><span style={{ color: BRAND.accent }}>Assessment Platform</span></h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, fontWeight: 700, lineHeight: 1.6, margin: 0 }}>Grounded in Dr. Corbett's Leadership & Governance philosophy — built exclusively for The Nonprofit Edge community.</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
        {[
          { icon: <Building2 size={32} strokeWidth={1.5} color={BRAND.primary} />, title: "Admin Setup", desc: "Configure your assessment — short or long form, CEO inclusion, and role segmentation.", btn: "Set Up Assessment", color: BRAND.primary, action: () => navigate("admin") },
          { icon: <ClipboardList size={32} strokeWidth={1.5} color={BRAND.teal} />, title: "Individual Self-Assessment", desc: "Reflect on your own board contributions — giving, preparation, ambassador activity, and growth.", btn: "Start Self-Assessment", color: BRAND.teal, action: () => navigate("selfEntry") },
          { icon: <BarChart3 size={32} strokeWidth={1.5} color={BRAND.accent} />, title: "View Sample Report", desc: "See what a full governance report looks like — 6 respondents, all role groups, no setup required.", btn: "View Demo Report →", color: BRAND.accent, action: addDemoData },
        ].map(card => (
          <div key={card.title} style={{ background: "white", borderRadius: 16, padding: 28, width: 260, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 14 }}>{card.icon}</div>
            <h3 style={{ color: BRAND.primary, margin: "0 0 8px", fontSize: 17, fontWeight: 700 }}>{card.title}</h3>
            <p style={{ color: "#555", fontSize: 13, lineHeight: 1.5, margin: "0 0 auto", paddingBottom: 16 }}>{card.desc}</p>
            <button onClick={card.action} style={{ width: "100%", padding: "12px", background: card.color, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>{card.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ADMIN ─────────────────────────────────────────────────
  if (screen === "admin") return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, fontFamily: FONT }}>
      <div style={{ background: BRAND.primary, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={18} color={BRAND.primary} strokeWidth={2} /></div>
        <div style={{ flex: 1, color: "white", fontWeight: 700, fontSize: 15 }}>Admin Configuration</div>
        {allResponses.length > 0 && (
          <button onClick={() => navigate("dashboard")} style={{ background: BRAND.accent, color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT }}><BarChart3 size={13} strokeWidth={2} style={{marginRight:4,verticalAlign:"middle"}} />View Dashboard ({allResponses.length})</button>
        )}
        <button onClick={() => navigate("home")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>← Back</button>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>

        {/* Organization */}
        <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color: BRAND.primary, margin: "0 0 16px", fontSize: 16, display:"flex", alignItems:"center", gap:6 }}><Building2 size={15} color={BRAND.primary} strokeWidth={2} />Organization</h3>
          <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Organization Name</label>
          <input value={adminData.orgName} onChange={e => setAdminData(p => ({ ...p, orgName: e.target.value }))} placeholder="e.g. Hope Community Foundation" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: FONT }} />
        </div>

        {/* How it works */}
        <div style={{ background: `${BRAND.primary}06`, border: `1px solid ${BRAND.primary}15`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: BRAND.primary, marginBottom: 12, display:"flex", alignItems:"center", gap:6 }}><ClipboardList size={14} color={BRAND.primary} strokeWidth={2} />How This Works</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { step: "1", text: "Enter your name and role below, then click \"Launch & Take Assessment\" — board members take it one at a time on this device, or you can share the link for them to complete on their own." },
              { step: "2", text: "After each submission, use the \"+ Add Response\" button on the dashboard to pass the device to the next board member." },
              { step: "3", text: "The full report becomes available once at least 3 assessments have been completed. This protects anonymity and ensures the data is meaningful." },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: BRAND.primary, color: "white", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{item.step}</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin info */}
        <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BRAND.teal}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Users size={20} color={BRAND.primary} strokeWidth={1.8} />
            <h3 style={{ color: BRAND.primary, margin: 0, fontSize: 16, fontWeight: 700 }}>Your Information</h3>
          </div>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
            As the admin, your responses count just like everyone else's. Enter your name and role to get started.
          </p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Name</label>
            <input value={respondentInfo.name} onChange={e => setRespondentInfo(p => ({ ...p, name: e.target.value }))} placeholder="First & Last Name" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: FONT }} />
          </div>
          <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Role on the Board</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ROLES.map(r => (
              <div key={r.id} onClick={() => setRespondentInfo(p => ({ ...p, role: r.id }))} style={{ padding: "8px 14px", border: `2px solid ${respondentInfo.role === r.id ? BRAND.teal : "#E2E8F0"}`, borderRadius: 20, cursor: "pointer", background: respondentInfo.role === r.id ? `${BRAND.teal}12` : "white", color: respondentInfo.role === r.id ? BRAND.teal : "#555", fontWeight: respondentInfo.role === r.id ? 700 : 500, fontSize: 13, transition: "all 0.15s" }}>{r.label}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => respondentInfo.name && respondentInfo.role && navigate("assessment")}
            disabled={!respondentInfo.name || !respondentInfo.role}
            style={{ flex: 1, padding: "14px", background: (respondentInfo.name && respondentInfo.role) ? BRAND.primary : "#CBD5E1", color: (respondentInfo.name && respondentInfo.role) ? "white" : "#94A3B8", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: (respondentInfo.name && respondentInfo.role) ? "pointer" : "not-allowed", fontFamily: FONT }}
          >
            {respondentInfo.name && respondentInfo.role ? "Launch & Take Assessment →" : "Enter your name and role above to continue"}
          </button>
          <button onClick={addDemoData} style={{ padding: "14px 20px", background: "white", color: BRAND.primary, border: `2px solid ${BRAND.primary}`, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Preview Demo</button>
        </div>
      </div>
    </div>
  );

  // ── SELF ENTRY ────────────────────────────────────────────
  if (screen === "selfEntry") return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 24 }}>
      <div style={{ maxWidth: 460, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ marginBottom: 12, display:"flex", justifyContent:"center" }}><ClipboardList size={40} color={BRAND.teal} strokeWidth={1.4} /></div>
          <h2 style={{ color: BRAND.primary, margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>Individual Self-Assessment</h2>
          <p style={{ color: "#666", margin: 0, fontSize: 14 }}>~5 minutes · Personal, honest, and private</p>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Name</label>
          <input value={respondentInfo.name} onChange={e => setRespondentInfo(p => ({ ...p, name: e.target.value }))} placeholder="First & Last Name" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: FONT, marginBottom: 16 }} />
          <div style={{ background: `${BRAND.teal}10`, border: `1px solid ${BRAND.teal}30`, borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: "#444", lineHeight: 1.6 }}>
            This assessment is about <strong>you</strong> — not your board collectively. Your results are private and will generate a personal action plan.
          </div>
          <button onClick={() => { setSelfResponses({}); setSelfReflections({}); setSelfCommitment(""); navigate("selfAssessment"); }} disabled={!respondentInfo.name.trim()} style={{ width: "100%", padding: "13px", background: respondentInfo.name.trim() ? BRAND.teal : "#E2E8F0", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: respondentInfo.name.trim() ? "pointer" : "not-allowed", fontFamily: FONT }}>Begin →</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: BRAND.primary, fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: FONT }}>← Back to Home</button>
        </div>
      </div>
    </div>
  );

  // ── SELF ASSESSMENT ───────────────────────────────────────
  if (screen === "selfAssessment") return (
    <SelfAssessmentScreen
      selfResponses={selfResponses}
      setSelfResponses={setSelfResponses}
      selfReflections={selfReflections}
      setSelfReflections={setSelfReflections}
      respondentInfo={respondentInfo}
      onSubmit={submitSelfAssessment}
      onBack={() => navigate("selfEntry")}
    />
  );

  // ── SELF REPORT ───────────────────────────────────────────
  if (screen === "selfReport" && selfReportData) {
    const { catScores, responses: selfR, isChair, cats: reportCats, questions: reportQs } = selfReportData;
    const activeCats = reportCats || SELF_CATEGORIES;
    const activeQs = reportQs || SELF_QUESTIONS;
    const firstName = respondentInfo.name.split(" ")[0];
    const selfScoreColor = s => s >= 3.5 ? BRAND.green : s >= 2.5 ? BRAND.teal : s >= 1.5 ? BRAND.gold : BRAND.orange;
    const selfScoreLabel = s => s >= 3.5 ? "Strong" : s >= 2.5 ? "On Track" : s >= 1.5 ? "Developing" : "Needs Attention";
    const tier = s => s < 2 ? "low" : s < 3 ? "mid" : "high";
    const priorities = Object.entries(catScores).sort((a, b) => a[1] - b[1]).filter(([, s]) => s < 3.5);
    return (
      <div style={{ minHeight: "100vh", background: BRAND.bg, fontFamily: FONT }}>
        <div style={{ background: BRAND.primary, padding: "14px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 32, height: 32, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={18} color={BRAND.primary} strokeWidth={2} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}>Personal Board Member Report</div>
              <div style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{respondentInfo.name}</div>
            </div>
            <button onClick={() => navigate("home")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT }}>← Home</button>
          </div>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 60px" }}>
          <div style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.teal})`, borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: "white" }}>
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Personal Governance Self-Assessment</div>
            <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 800 }}>Hi, {firstName}.</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, opacity: 0.9 }}>This is a reflection of your own contributions — not a grade, and not a comparison to your fellow board members. Here's what you shared.</p>
          </div>
          {/* Snapshot */}
          <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Your Snapshot{isChair ? " · Board Chair Edition" : ""}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {activeCats.map(cat => {
                const score = catScores[cat] || 0;
                const color = selfScoreColor(score);
                const q0 = activeQs.find(q => q.category === cat);
                return (
                  <div key={cat} style={{ textAlign: "center", padding: "12px 8px", borderRadius: 10, background: `${color}08`, border: `1px solid ${color}20` }}>
                    <div style={{ marginBottom: 6, display:"flex", justifyContent:"center" }}><QIcon icon={q0?.icon} size={22} color={color} /></div>
                    <div style={{ fontSize: 9, color: BRAND.textMuted, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{cat}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{score.toFixed(1)}</div>
                    <div style={{ fontSize: 9, color, fontWeight: 700, marginTop: 2 }}>{selfScoreLabel(score)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Category cards */}
          {activeCats.map(cat => {
            const score = catScores[cat] || 0;
            const action = SELF_ACTION_PLAN[cat]?.[tier(score)];
            const catQs = activeQs.filter(q => q.category === cat);
            const color = selfScoreColor(score);
            const reflection = selfReflections[cat];
            return (
              <div key={cat} style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: `4px solid ${color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: BRAND.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display:"flex", alignItems:"center", gap:5 }}><QIcon icon={catQs[0]?.icon} size={13} color={BRAND.textMuted} />{cat}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color }}>{selfScoreLabel(score)}</div>
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${color}12`, border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color }}>{score.toFixed(1)}</div>
                </div>
                <div style={{ marginBottom: 14, background: BRAND.bg, borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>What You Shared</div>
                  {catQs.map(q => {
                    const val = selfR[q.id];
                    const chosen = q.options?.find(o => o.value === val);
                    const isTop = val === Math.max(...(q.options||[]).map(o => o.value));
                    return (
                      <div key={q.id} style={{ padding: "7px 0", borderBottom: `1px solid ${BRAND.border}` }}>
                        <div style={{ fontSize: 12, color: BRAND.textBody, lineHeight: 1.4, marginBottom: 2 }}>{q.question}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isTop ? BRAND.green : color }}>{chosen?.label || "—"}</div>
                      </div>
                    );
                  })}
                </div>
                {reflection && (
                  <div style={{ background: `${BRAND.teal}08`, border: `1px solid ${BRAND.teal}25`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>💭 Your Reflection</div>
                    <p style={{ color: BRAND.textBody, fontSize: 13, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>"{reflection}"</p>
                  </div>
                )}
                {action && (
                  <div style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>💡 Your Next Step</div>
                    <p style={{ color: BRAND.textBody, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{action}</p>
                  </div>
                )}
              </div>
            );
          })}
          {/* Where to Focus */}
          {priorities.length > 0 && (
            <div style={{ background: "white", borderRadius: 14, padding: 28, marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Your Personal Action Plan</div>
              <h3 style={{ color: BRAND.primary, margin: "0 0 6px", fontSize: 17, fontWeight: 800 }}>Where to Focus First</h3>
              <p style={{ color: BRAND.textBody, fontSize: 13, margin: "0 0 18px", lineHeight: 1.5 }}>Sequenced from your lowest score upward.</p>
              {priorities.map(([cat, score], i) => {
                const color = selfScoreColor(score);
                const action = SELF_ACTION_PLAN[cat]?.[tier(score)];
                const q0 = activeQs.find(q => q.category === cat);
                return (
                  <div key={cat} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < priorities.length - 1 ? `1px solid ${BRAND.border}` : "none" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.primary, marginBottom: 3, display:"flex", alignItems:"center", gap:5 }}><QIcon icon={q0?.icon} size={14} color={BRAND.primary} />{cat} <span style={{ fontWeight: 500, color: BRAND.textMuted }}>· {selfScoreLabel(score)}</span></div>
                      <div style={{ fontSize: 13, color: BRAND.textBody, lineHeight: 1.5 }}>{action}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Commitment prompt */}
          <div style={{ background: "white", borderRadius: 14, padding: 28, marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", border: `2px solid ${BRAND.primary}20` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.primary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>✋ Your Commitment</div>
            <h3 style={{ color: BRAND.primary, margin: "0 0 6px", fontSize: 17, fontWeight: 800 }}>Before my next board meeting, I commit to…</h3>
            <p style={{ color: BRAND.textBody, fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>Choose one or write your own. The best commitments are specific and doable in the next 2–4 weeks.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                "Making at least one donor or partner introduction",
                "Reading the next board packet before the meeting",
                "Having a one-on-one conversation with the CEO or Board Chair",
                "Making or completing my financial gift",
                "Sharing something about our mission on social media or in conversation",
              ].map(opt => (
                <div key={opt} onClick={() => setSelfCommitment(selfCommitment === opt ? "" : opt)} style={{ padding: "10px 14px", border: `2px solid ${selfCommitment === opt ? BRAND.primary : "#E2E8F0"}`, borderRadius: 8, cursor: "pointer", background: selfCommitment === opt ? `${BRAND.primary}08` : "white", color: selfCommitment === opt ? BRAND.primary : "#555", fontWeight: selfCommitment === opt ? 700 : 500, fontSize: 13, transition: "all 0.15s" }}>
                  {selfCommitment === opt ? "✓ " : ""}{opt}
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${BRAND.border}`, paddingTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 7 }}>Or write your own:</label>
              <textarea
                value={selfCommitment.length && ![
                  "Making at least one donor or partner introduction",
                  "Reading the next board packet before the meeting",
                  "Having a one-on-one conversation with the CEO or Board Chair",
                  "Making or completing my financial gift",
                  "Sharing something about our mission on social media or in conversation",
                ].includes(selfCommitment) ? selfCommitment : ""}
                onChange={e => setSelfCommitment(e.target.value)}
                placeholder="Before my next board meeting, I will..."
                rows={2}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: FONT, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
            {selfCommitment && (
              <div style={{ marginTop: 14, background: `${BRAND.green}10`, border: `1px solid ${BRAND.green}30`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.green, marginBottom: 3 }}>Committed</div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5, fontStyle: "italic" }}>"{selfCommitment}"</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: `linear-gradient(135deg, ${BRAND.primary}06, ${BRAND.teal}06)`, border: `1px solid ${BRAND.primary}15`, borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
            <div style={{ marginBottom: 10, display:"flex", justifyContent:"center" }}><MessageSquare size={24} color={BRAND.primary} strokeWidth={1.5} /></div>
            <p style={{ color: BRAND.textBody, fontSize: 14, lineHeight: 1.8, margin: "0 0 10px", fontStyle: "italic" }}>{isChair ? '"The Chair sets the ceiling for what this board can become. Your preparation, your directness, your partnership with the CEO — all of it flows down."' : '"The most effective board members don\'t wait to be asked — they show up prepared, give generously, make connections, and never stop learning."'}</p>
            <div style={{ fontSize: 12, color: BRAND.textMuted, fontWeight: 600 }}>Dr. Lyn Corbett · The Nonprofit Edge</div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={() => navigate("home")} style={{ flex: 1, padding: "13px", background: BRAND.primary, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>← Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESPONDENT ENTRY ──────────────────────────────────────
  if (screen === "invite" && finalized) return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", background: "white", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <Shield size={48} color={BRAND.textMuted} strokeWidth={1.2} style={{ marginBottom: 16 }} />
        <h2 style={{ color: BRAND.primary, margin: "0 0 10px", fontWeight: 800 }}>Assessment Closed</h2>
        <p style={{ color: "#666", fontSize: 15, margin: "0 0 24px", lineHeight: 1.7 }}>This assessment has been finalized. No new responses are being accepted.</p>
        <button onClick={() => navigate("dashboard")} style={{ padding: "12px 28px", background: BRAND.primary, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>← Back to Report</button>
      </div>
    </div>
  );

  if (screen === "invite") return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 24 }}>
      <div style={{ maxWidth: 500, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ marginBottom: 12, display:"flex", justifyContent:"center" }}><Building2 size={36} color={BRAND.primary} strokeWidth={1.4} /></div>
          <h2 style={{ color: BRAND.primary, margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>{adminData.orgName ? `${adminData.orgName} Board Assessment` : "Board Assessment"}</h2>
          <p style={{ color: "#666", margin: 0, fontSize: 14 }}>Short Form · ~10 minutes · {SHORT_QUESTIONS.length} questions</p>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Name</label>
            <input value={respondentInfo.name} onChange={e => setRespondentInfo(p => ({ ...p, name: e.target.value }))} placeholder="First & Last Name" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: FONT }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Role</label>
            {ROLES.map(r => (
              <div key={r.id} onClick={() => setRespondentInfo(p => ({ ...p, role: r.id }))} style={{ padding: "10px 14px", border: `2px solid ${respondentInfo.role === r.id ? BRAND.teal : "#E2E8F0"}`, borderRadius: 8, cursor: "pointer", background: respondentInfo.role === r.id ? `${BRAND.teal}12` : "white", color: respondentInfo.role === r.id ? BRAND.teal : "#444", fontWeight: respondentInfo.role === r.id ? 700 : 500, fontSize: 14, marginBottom: 8 }}>{r.label}</div>
            ))}
          </div>
          <div style={{ background: `${BRAND.primary}08`, borderRadius: 8, padding: 12, marginBottom: 18, display: "flex", gap: 8, fontSize: 12, color: "#555", lineHeight: 1.5 }}>
            <Shield size={13} color={BRAND.textMuted} strokeWidth={2} style={{verticalAlign:"middle",marginRight:4}} />Your individual responses are confidential. The admin sees only aggregated results.
          </div>
          <button onClick={() => respondentInfo.name && respondentInfo.role && navigate("assessment")} disabled={!respondentInfo.name || !respondentInfo.role} style={{ width: "100%", padding: "14px", background: (respondentInfo.name && respondentInfo.role) ? BRAND.primary : "#B0C4D0", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: (respondentInfo.name && respondentInfo.role) ? "pointer" : "not-allowed", fontFamily: FONT }}>Start Assessment →</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: BRAND.primary, fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: FONT }}>← Back to Home</button>
        </div>
      </div>
    </div>
  );

  // ── ASSESSMENT ────────────────────────────────────────────
  if (screen === "assessment") return (
    <AssessmentScreen
      responses={responses}
      setResponses={setResponses}
      respondentInfo={respondentInfo}
      openEndedResponses={openEndedResponses}
      setOpenEndedResponses={setOpenEndedResponses}
      onSubmit={submitAssessment}
    />
  );

  // ── REPORT / DASHBOARD ────────────────────────────────────
  if ((screen === "report" || screen === "dashboard") && reportData) {
    const { overall, catScores, byRole, questionScores, respondentCount, qs } = reportData;
    const hasMinimum = respondentCount >= 3;
    const cats = ["People", "Culture", "Work", "Impact"];
    const TABS = [
      { id: "overview", label: "📊 Overview" },
      { id: "categories", label: "📂 By Category" },
      { id: "questions", label: "📋 Questions" },
      { id: "roles", label: "👥 By Role" },
      { id: "insights", label: "💡 Insights & Actions" },
      { id: "openended", label: "💬 Qualitative" },
    ];

    const ownMap = {
      "People": { low: ["Run a board skills matrix — map who you have against what you need", "Add 'Who is missing from this table?' to every recruitment conversation", "Establish a Governance Committee with a 90-day charge", "Set a 12-month recruitment goal with specific profile criteria"], mid: ["Shift recruitment toward lived experience alongside professional credentials", "Review and enforce term limits — renewal without reflection breeds complacency", "Develop or strengthen your board onboarding process"], high: ["Formalize a continuous recruitment pipeline — never stop building", "Document your board culture so new members enter strong"] },
      "Culture": { low: ["Redesign your next three meeting agendas — cut reports, add dialogue time", "Start meetings with a culture moment: what's working, what isn't", "Ask members 'What would make this meeting worth your time?' and act on it", "Use consent agendas so routine items don't crowd out strategy"], mid: ["Survey board members on meeting experience and share results with the board", "Pilot a new meeting format for one quarter — evaluate and adjust", "Establish written norms for healthy disagreement and decision-making"], high: ["Document your meeting norms and share them with new members", "Use your culture as a recruitment differentiator"] },
      "Work": { low: ["Clarify the board's role in strategy vs. operations — document it", "Implement a consent agenda so reporting doesn't crowd out strategy", "Establish a quarterly financial literacy session for the full board", "Create a 90-day CEO-Chair check-in structure"], mid: ["Identify the one governance function creating the most friction and fix it first", "Put CEO-board relationship expectations in writing", "Strengthen board fundraising engagement — define expectations and provide tools"], high: ["Conduct an annual board-CEO relationship review alongside this assessment", "Develop a board fundraising toolkit with talking points and cultivation steps"] },
      "Impact": { low: ["Put board self-assessment on the agenda as a standing item", "Tie at least two board goals directly to the strategic plan", "Ask: 'How is our governance changing outcomes for the people we serve?'", "Establish one measurable board metric beyond financial compliance"], mid: ["Formalize your self-assessment cycle — annual minimum", "Report board performance metrics at annual meetings alongside program outcomes"], high: ["Lead a sector conversation on board impact — write, speak, share your model"] },
    };

    const expertMap = {
      "People": { low: ["Board composition audit with gap analysis and recruitment strategy", "Facilitated skills matrix workshop with prioritized recruiting profile", "Executive search support for high-priority board seats"], mid: ["Governance coaching with Chair on recruitment pipeline and term limit enforcement", "Facilitated board orientation session for new and returning members"], high: ["Strategic governance consultation to formalize your model for longevity"] },
      "Culture": { low: ["Facilitated board retreat on culture, trust, and meeting redesign", "Governance coaching with Chair on facilitation and conflict navigation", "Anonymous board culture survey with facilitated results debrief"], mid: ["Half-day facilitated session on meeting redesign and governance norms", "Board Chair coaching on facilitation and culture-setting"], high: ["Governance peer learning cohort — share your model and learn from others"] },
      "Work": { low: ["Full-board governance training on roles and responsibilities", "Facilitated financial literacy workshop", "CEO-board relationship assessment and coaching"], mid: ["Targeted governance coaching on your specific weak function", "Board fundraising bootcamp — role, ask, donor cultivation"], high: ["Annual governance health check to sustain what's working"] },
      "Impact": { low: ["Governance impact framework — define what board success looks like", "Strategic planning facilitation linking board priorities to organizational outcomes", "Board performance dashboard design and implementation"], mid: ["Facilitated session connecting board work to strategic plan milestones", "Governance metrics coaching — what to measure and how to report it"], high: ["Governance model documentation and thought leadership support"] },
    };

    return (
      <div style={{ minHeight: "100vh", background: BRAND.bg, fontFamily: FONT }}>
        {/* Finalize Confirmation Modal */}
        {showFinalizeConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 32, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Shield size={24} color={BRAND.orange} strokeWidth={2} />
                <h3 style={{ color: BRAND.primary, margin: 0, fontSize: 18, fontWeight: 800 }}>Finalize & Close Assessment?</h3>
              </div>
              <p style={{ color: "#444", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
                You currently have <strong>{respondentCount} response{respondentCount !== 1 ? "s" : ""}</strong> collected. There may still be outstanding submissions from board members who haven't completed the assessment yet.
              </p>
              <p style={{ color: BRAND.orange, fontSize: 13, fontWeight: 600, margin: "0 0 24px", padding: "10px 14px", background: `${BRAND.orange}10`, borderRadius: 8 }}>
                Are you sure you want to finalize and close this assessment? No new responses will be accepted after this point.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowFinalizeConfirm(false)} style={{ flex: 1, padding: "12px", background: "#F1F5F9", color: BRAND.primary, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
                <button onClick={() => { setFinalized(true); setShowFinalizeConfirm(false); setShowEmailScreen(true); }} style={{ flex: 1, padding: "12px", background: BRAND.primary, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Yes, Finalize & Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Email Screen Modal */}
        {showEmailScreen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 32, maxWidth: 500, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              {!emailSent ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <Award size={22} color={BRAND.teal} strokeWidth={2} />
                    <h3 style={{ color: BRAND.primary, margin: 0, fontSize: 18, fontWeight: 800 }}>Assessment Finalized</h3>
                  </div>
                  <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>Send the final report. Enter recipient emails below.</p>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Email (Admin)</label>
                    <input value={adminEmail || adminData.adminEmail || ""} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@organization.org" style={{ width: "100%", padding: "10px 12px", border: `1px solid ${adminEmail ? BRAND.teal : "#DDD"}`, borderRadius: 8, fontSize: 14, fontFamily: FONT, boxSizing: "border-box", outline: "none" }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Additional Recipients <span style={{ fontWeight: 400, color: BRAND.textMuted }}>(optional)</span></label>
                    <textarea value={additionalEmails} onChange={e => setAdditionalEmails(e.target.value)} placeholder={"ceo@organization.org\nchair@organization.org"} rows={3} style={{ width: "100%", padding: "10px 12px", border: "1px solid #DDD", borderRadius: 8, fontSize: 13, fontFamily: FONT, boxSizing: "border-box", outline: "none", resize: "vertical" }} />
                    <div style={{ fontSize: 11, color: BRAND.textMuted, marginTop: 4 }}>One email per line — CEO, Board Chair, consultants</div>
                  </div>
                  {emailError && <div style={{ background: `${BRAND.red}10`, border: `1px solid ${BRAND.red}30`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: BRAND.red, marginBottom: 16 }}>{emailError}</div>}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setShowEmailScreen(false)} style={{ flex: 1, padding: "12px", background: "#F1F5F9", color: BRAND.primary, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Skip for Now</button>
                    <button disabled={!adminEmail || emailSending} onClick={async () => {
                      setEmailSending(true);
                      setEmailError("");
                      try {
                        const additionalList = additionalEmails.split("\n").map(e => e.trim()).filter(Boolean);
                        // Build actual report snapshot HTML
                        const { overall, catScores, byRole } = reportData;
                        const scoreLabel = (s) => s >= 4.5 ? "Exceptional" : s >= 3.5 ? "Responsible" : s >= 2.5 ? "Functional" : "Developing";
                        const scoreColor = (s) => s >= 4.5 ? "#1A7A4A" : s >= 3.5 ? "#0097A9" : s >= 2.5 ? "#B7791F" : "#C0392B";
                        const catRows = Object.entries(catScores).map(([cat, score]) => `
                          <tr>
                            <td style="padding:10px 14px;border-bottom:1px solid #F0F0F0;font-size:14px;color:#333">${cat}</td>
                            <td style="padding:10px 14px;border-bottom:1px solid #F0F0F0;text-align:right">
                              <span style="background:${scoreColor(score)}18;color:${scoreColor(score)};padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700">${scoreLabel(score)}</span>
                            </td>
                          </tr>`).join("");
                        const roleRows = Object.values(byRole).map(r => `
                          <tr>
                            <td style="padding:8px 14px;border-bottom:1px solid #F0F0F0;font-size:13px;color:#444">${r.label}</td>
                            <td style="padding:8px 14px;border-bottom:1px solid #F0F0F0;font-size:13px;color:#666;text-align:center">${r.count}</td>
                            <td style="padding:8px 14px;border-bottom:1px solid #F0F0F0;text-align:right">
                              <span style="font-weight:700;color:${scoreColor(r.overall)}">${scoreLabel(r.overall)}</span>
                            </td>
                          </tr>`).join("");
                        const strengths = Object.entries(catScores).sort((a,b) => b[1]-a[1]).slice(0,2).map(([c]) => `<li style="margin-bottom:6px">${c}</li>`).join("");
                        const priorities = Object.entries(catScores).sort((a,b) => a[1]-b[1]).slice(0,2).map(([c]) => `<li style="margin-bottom:6px">${c}</li>`).join("");
                        const reportHtml = `
                          <div style="font-family:Inter,-apple-system,sans-serif">
                            <div style="background:linear-gradient(135deg,#0D2C54,#0097A9);border-radius:12px;padding:28px;margin-bottom:24px;color:white">
                              <div style="font-size:12px;opacity:0.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Overall Governance Score</div>
                              <div style="font-size:48px;font-weight:800;line-height:1">${overall.toFixed(2)}<span style="font-size:20px;opacity:0.7">/5</span></div>
                              <div style="font-size:20px;font-weight:700;margin-top:8px;color:#4DD9E8">${scoreLabel(overall)}</div>
                              <div style="font-size:13px;opacity:0.7;margin-top:6px">${respondentCount} respondents · ${adminData.orgName || "Your Organization"}</div>
                            </div>
                            <h3 style="color:#0D2C54;margin:0 0 12px;font-size:16px">Category Scores</h3>
                            <table style="width:100%;border-collapse:collapse;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:24px">
                              ${catRows}
                            </table>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
                              <div style="background:white;border-radius:10px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
                                <div style="font-size:13px;font-weight:700;color:#0D2C54;margin-bottom:10px">✅ Strengths</div>
                                <ul style="margin:0;padding-left:18px;color:#444;font-size:13px">${strengths}</ul>
                              </div>
                              <div style="background:white;border-radius:10px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
                                <div style="font-size:13px;font-weight:700;color:#0D2C54;margin-bottom:10px">⚠️ Focus Areas</div>
                                <ul style="margin:0;padding-left:18px;color:#444;font-size:13px">${priorities}</ul>
                              </div>
                            </div>
                            <h3 style="color:#0D2C54;margin:0 0 12px;font-size:16px">Results by Role</h3>
                            <table style="width:100%;border-collapse:collapse;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:24px">
                              <tr style="background:#F8FAFC"><th style="padding:10px 14px;text-align:left;font-size:12px;color:#888;font-weight:700">Role</th><th style="padding:10px 14px;text-align:center;font-size:12px;color:#888;font-weight:700">Respondents</th><th style="padding:10px 14px;text-align:right;font-size:12px;color:#888;font-weight:700">Score</th></tr>
                              ${roleRows}
                            </table>
                            <div style="background:#0D2C5408;border:1px solid #0D2C5420;border-radius:10px;padding:18px;text-align:center">
                              <div style="font-size:13px;color:#555;margin-bottom:8px">For the full interactive report with insights and action plans:</div>
                              <a href="https://thenonprofitedge.org" style="color:#0097A9;font-weight:700;font-size:14px">View Full Report at thenonprofitedge.org</a>
                            </div>
                          </div>`;
                        const res = await fetch("/api/send-report", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            adminEmail: adminEmail || adminData.adminEmail,
                            additionalEmails: additionalList,
                            orgName: adminData.orgName,
                            respondentCount,
                            reportHtml,
                          }),
                        });
                        const data = await res.json();
                        if (data.success) { setEmailSent(true); }
                        else { setEmailError(data.error || "Failed to send. Please try again."); }
                      } catch { setEmailError("Network error. Please try again."); }
                      setEmailSending(false);
                    }} style={{ flex: 2, padding: "12px", background: !adminEmail ? "#CBD5E1" : BRAND.teal, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: !adminEmail ? "default" : "pointer", fontFamily: FONT }}>
                      {emailSending ? "Sending…" : "Send Final Report"}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ color: BRAND.primary, margin: "0 0 8px", fontWeight: 800 }}>Report Sent</h3>
                  <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>The final report has been delivered to {adminEmail}{additionalEmails ? " and additional recipients" : ""}.</p>
                  <button onClick={() => setShowEmailScreen(false)} style={{ padding: "12px 32px", background: BRAND.primary, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>View Report</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ background: finalized ? BRAND.dark : BRAND.primary, padding: "14px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 32, height: 32, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={18} color={BRAND.primary} strokeWidth={2} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}>{finalized ? "✅ Final Report — Assessment Closed" : "Governance Assessment Report"}</div>
              <div style={{ color: "white", fontSize: 15, fontWeight: 700 }}>{adminData.orgName || "Your Organization"} · {respondentCount} Respondent{respondentCount !== 1 ? "s" : ""}</div>
            </div>
            {!finalized && <button onClick={() => navigate("admin")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>⚙️ Admin</button>}
            <button onClick={() => navigate("home")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>← Home</button>
            {!finalized && <button onClick={() => { setRespondentInfo({ name: "", email: "", role: "" }); setResponses({}); setOpenEndedResponses({ moreOf: "", lessOf: "", stopDoing: "", biggestImpact: "", neededMost: "", longTerm: "" }); navigate("invite"); }} style={{ background: BRAND.accent, color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT }}>+ Add Response</button>}
            {hasMinimum && !finalized && <button onClick={() => setShowFinalizeConfirm(true)} style={{ background: BRAND.green, color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT }}>✓ Finalize Report</button>}
            {finalized && <button onClick={() => setShowEmailScreen(true)} style={{ background: BRAND.teal, color: "white", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT }}>📧 Send Report</button>}
          </div>
        </div>

        {/* Minimum responses gate */}
        {!hasMinimum && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
            <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ marginBottom: 16, display:"flex", justifyContent:"center" }}><Shield size={52} color={BRAND.textMuted} strokeWidth={1.2} /></div>
              <h2 style={{ color: BRAND.primary, margin: "0 0 10px", fontSize: 22, fontWeight: 800 }}>Report Locked</h2>
              <p style={{ color: "#555", fontSize: 15, margin: "0 0 6px", lineHeight: 1.7 }}>
                The full report requires a minimum of <strong>3 completed assessments</strong> to protect individual anonymity and ensure the data is statistically meaningful.
              </p>
              <p style={{ color: BRAND.textMuted, fontSize: 14, margin: "0 0 28px" }}>
                {respondentCount} of 3 required {respondentCount === 1 ? "assessment" : "assessments"} completed.
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: i <= respondentCount ? BRAND.teal : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                    {i <= respondentCount ? "✓" : ""}
                  </div>
                ))}
              </div>
              <button onClick={() => { setRespondentInfo({ name: "", email: "", role: "" }); setResponses({}); setOpenEndedResponses({ moreOf: "", lessOf: "", stopDoing: "", biggestImpact: "", neededMost: "", longTerm: "" }); navigate("invite"); }} style={{ padding: "13px 32px", background: BRAND.primary, color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                + Add Next Response
              </button>
            </div>
          </div>
        )}

        {/* Tabs — only show when minimum met */}
        {hasMinimum && <div style={{ background: "white", borderBottom: `1px solid ${BRAND.border}` }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "13px 16px", border: "none", background: "none", borderBottom: `3px solid ${activeTab === t.id ? BRAND.accent : "transparent"}`, color: activeTab === t.id ? BRAND.primary : "#888", fontSize: 12, fontWeight: activeTab === t.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: FONT }}>{t.label}</button>
            ))}
          </div>
        </div>}
        {/* Content */}
        {hasMinimum && <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <div style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.teal})`, borderRadius: 16, padding: 28, marginBottom: 24, color: "white", display: "flex", alignItems: "center", gap: 32 }}>
                <ScoreGauge score={overall} size={120} />
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Overall Governance Score</div>
                  <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{overall.toFixed(2)}<span style={{ fontSize: 20, opacity: 0.7 }}>/5</span></div>
                  <div style={{ fontSize: 18, color: BRAND.accent, fontWeight: 700, marginTop: 6 }}>{scoreLabel(overall)}</div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>{respondentCount} respondents · Short Form · {qs.length} questions</div>
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ color: BRAND.primary, margin: "0 0 14px", fontSize: 15 }}>Board Performance Continuum</h3>
                <div style={{ display: "flex", gap: 4 }}>
                  {[{ label: "Developing", range: "1.0-2.4", color: BRAND.orange }, { label: "Functional", range: "2.5-3.4", color: BRAND.gold }, { label: "Responsible", range: "3.5-4.4", color: BRAND.teal }, { label: "Exceptional", range: "4.5-5.0", color: BRAND.green }].map((stage, i) => {
                    const [lo, hi] = stage.range.split("-").map(Number);
                    const active = overall >= lo && overall <= hi;
                    return <div key={stage.label} style={{ flex: i === 3 ? 0.5 : 1, background: stage.color, opacity: active ? 1 : 0.25, borderRadius: i === 0 ? "8px 0 0 8px" : i === 3 ? "0 8px 8px 0" : 0, padding: "10px 6px", textAlign: "center", color: "white", transform: active ? "scaleY(1.1)" : "none", boxShadow: active ? "0 4px 12px rgba(0,0,0,0.3)" : "none", position: "relative", zIndex: active ? 2 : 1 }}><div style={{ fontWeight: 700, fontSize: 11 }}>{stage.label}</div><div style={{ fontSize: 10, opacity: 0.85 }}>{stage.range}</div></div>;
                  })}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ color: BRAND.primary, margin: "0 0 18px", fontSize: 15 }}>Category Performance</h3>
                {Object.entries(catScores).map(([cat, score]) => <CategoryBar key={cat} category={cat} score={score} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  { title: "✅ Strengths", items: Object.entries(catScores).sort((a, b) => b[1] - a[1]).slice(0, 2) },
                  { title: "⚠️ Needs Attention", items: Object.entries(catScores).sort((a, b) => a[1] - b[1]).slice(0, 2) },
                ].map(s => (
                  <div key={s.title} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <h4 style={{ color: BRAND.primary, margin: "0 0 12px", fontSize: 14 }}>{s.title}</h4>
                    {s.items.map(([cat, score]) => <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F0F0", fontSize: 13 }}><span style={{ color: "#444" }}>{cat}</span><span style={{ fontWeight: 700, color: scoreColor(score) }}>{score.toFixed(1)}</span></div>)}
                  </div>
                ))}
              </div>
              <div style={{ background: `${BRAND.primary}08`, border: `1px solid ${BRAND.primary}30`, borderRadius: 12, padding: 20 }}>
                <h4 style={{ color: BRAND.primary, margin: "0 0 10px", fontSize: 14, display:"flex", alignItems:"center", gap:6 }}><Award size={15} color={BRAND.primary} strokeWidth={2} />The 12 Principles of Exceptional Governance</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Constructive Partnership", "Mission-Driven", "Strategic Thinking", "Culture of Inquiry", "Independent-Mindedness", "Ethos of Transparency", "Compliance with Integrity", "Sustaining Resources", "Results Oriented", "Intentional Practices", "Continuous Learning", "Revitalization"].map(p => <span key={p} style={{ background: "white", border: `1px solid ${BRAND.primary}30`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: BRAND.primary, fontWeight: 600 }}>{p}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* ── BY CATEGORY ── */}
          {activeTab === "categories" && (
            <div>
              <h2 style={{ color: BRAND.primary, margin: "0 0 20px", fontSize: 20, fontWeight: 800 }}>Category Deep Dive</h2>
              {Object.entries(catScores).map(([cat, score]) => {
                const catQs = qs.filter(q => q.category === cat);
                return (
                  <div key={cat} style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <QIcon icon={catQs[0]?.icon} size={22} color={color} />
                      <div style={{ flex: 1 }}><h3 style={{ color: BRAND.primary, margin: 0, fontSize: 17 }}>{cat}</h3><div style={{ fontSize: 12, color: "#888" }}>{catQs.length} questions</div></div>
                      <div style={{ textAlign: "right" }}><div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(score) }}>{score.toFixed(1)}</div><div style={{ fontSize: 11, color: scoreColor(score), fontWeight: 700 }}>{scoreLabel(score)}</div></div>
                    </div>
                    <div style={{ height: 6, background: "#E0E8EF", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}><div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: scoreColor(score), borderRadius: 4 }} /></div>
                    {catQs.map(q => (
                      <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                        <p style={{ color: "#444", fontSize: 13, margin: 0, lineHeight: 1.5, flex: 1 }}>{q.question}</p>
                        <div style={{ display: "flex", gap: 4, alignItems: "center", minWidth: 100, justifyContent: "flex-end" }}>
                          {SCALE.map(s => <div key={s.value} style={{ width: 14, height: 14, borderRadius: "50%", background: Math.round(questionScores[q.id]) === s.value ? s.color : "#E0E8EF" }} />)}
                          <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 700, color: scoreColor(questionScores[q.id]) }}>{questionScores[q.id] ? questionScores[q.id].toFixed(1) : "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── QUESTIONS ── */}
          {activeTab === "questions" && (
            <div>
              <h2 style={{ color: BRAND.primary, margin: "0 0 20px", fontSize: 20, fontWeight: 800 }}>Question-Level Analysis</h2>
              <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                {qs.map((q, i) => {
                  const score = questionScores[q.id] || 0;
                  return (
                    <div key={q.id} style={{ padding: "13px 0", borderBottom: "1px solid #F0F0F0" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${scoreColor(score)}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: scoreColor(score), flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: BRAND.teal, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{q.category}</div>
                          <p style={{ color: "#333", fontSize: 13, margin: "0 0 7px", lineHeight: 1.5 }}>{q.question}</p>
                          <div style={{ height: 4, background: "#E0E8EF", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: scoreColor(score), borderRadius: 3 }} /></div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 50 }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: scoreColor(score) }}>{score ? score.toFixed(1) : "—"}</div>
                          <div style={{ fontSize: 10, color: scoreColor(score), fontWeight: 600 }}>{score ? scoreLabel(score) : ""}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#FFF8F0", border: `1px solid ${BRAND.orange}30`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ color: BRAND.orange, margin: "0 0 12px", fontSize: 15 }}>⚠️ Lowest-Scoring Questions — Priority Focus</h3>
                {[...qs].sort((a, b) => (questionScores[a.id] || 0) - (questionScores[b.id] || 0)).slice(0, 5).map(q => (
                  <div key={q.id} style={{ padding: "8px 0", borderBottom: `1px solid ${BRAND.orange}15`, display: "flex", gap: 10 }}>
                    <span>⬇️</span>
                    <p style={{ color: "#555", fontSize: 13, margin: 0, flex: 1, lineHeight: 1.4 }}>{q.question}</p>
                    <span style={{ color: scoreColor(questionScores[q.id] || 0), fontWeight: 700, fontSize: 13 }}>{(questionScores[q.id] || 0).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BY ROLE ── */}
          {activeTab === "roles" && (
            <div>
              <h2 style={{ color: BRAND.primary, margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Results by Role Group</h2>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>A gap of 0.5+ between any two groups warrants focused discussion.</p>
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                {Object.entries(byRole).map(([roleId, data]) => (
                  <div key={roleId} style={{ background: "white", borderRadius: 12, padding: 16, flex: "1 1 140px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center", position: "relative" }}>
                    {data.count === 1 && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}50`, borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700, color: BRAND.gold }}>1 respondent</div>
                    )}
                    <ScoreGauge score={data.overall} size={80} />
                    <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: BRAND.primary }}>{data.label}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{data.count} respondent{data.count !== 1 ? "s" : ""}</div>
                    {data.count === 1 && <div style={{ fontSize: 10, color: BRAND.gold, marginTop: 3, lineHeight: 1.4 }}>Single respondent — interpret with caution</div>}
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                <h3 style={{ color: BRAND.primary, margin: "0 0 16px", fontSize: 15 }}>Category Scores by Role Group</h3>
                {cats.map(cat => (
                  <div key={cat} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.dark, marginBottom: 8 }}>{cat}</div>
                    {Object.entries(byRole).filter(([, d]) => d.categories[cat] > 0).map(([id, data]) => (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: "#666", width: 130, flexShrink: 0 }}>{data.label}</div>
                        <div style={{ flex: 1, height: 8, background: "#E0E8EF", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${(data.categories[cat] / 5) * 100}%`, background: scoreColor(data.categories[cat]), borderRadius: 4 }} /></div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: scoreColor(data.categories[cat]), width: 32, textAlign: "right" }}>{data.categories[cat].toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {byRole.exec_committee && byRole.board_member && (
                <div style={{ background: `${BRAND.primary}08`, border: `1px solid ${BRAND.primary}30`, borderRadius: 12, padding: 20 }}>
                  <h4 style={{ color: BRAND.primary, margin: "0 0 8px" }}>Executive Committee vs. Full Board</h4>
                  <p style={{ color: "#555", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    Overall gap: <strong style={{ color: Math.abs(byRole.exec_committee.overall - byRole.board_member.overall) > 0.5 ? BRAND.red : BRAND.green }}>{Math.abs(byRole.exec_committee.overall - byRole.board_member.overall).toFixed(2)} points</strong>
                    {Math.abs(byRole.exec_committee.overall - byRole.board_member.overall) > 0.5 ? " — Significant alignment gap. Prioritize full-board dialogue." : " — Strong alignment between leadership tiers."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── INSIGHTS ── */}
          {activeTab === "insights" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ color: BRAND.primary, margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>Insights & Action Plan</h2>
                <p style={{ color: BRAND.textBody, fontSize: 14, margin: 0, lineHeight: 1.6 }}>Evidence-based recommendations drawn directly from your board's assessment data.</p>
              </div>
              {/* What We Heard */}
              <div style={{ background: `linear-gradient(135deg, ${BRAND.primary}08, ${BRAND.teal}08)`, border: `1px solid ${BRAND.primary}18`, borderRadius: 14, padding: 24, marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>What We Heard</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  {Object.entries(catScores).map(([cat, score]) => {
                    const icon = qs.find(q => q.category === cat)?.icon || "•";
                    const tier = score >= 4 ? "strength" : score >= 3 ? "developing" : "priority";
                    const tierColor = tier === "strength" ? BRAND.green : tier === "developing" ? BRAND.gold : BRAND.red;
                    const perfLabel = scoreLabel(score);
                    return (
                      <div key={cat} style={{ background: "white", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                        <QIcon icon={icon} size={20} color={BRAND.primary} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.primary }}>{cat}</div>
                          <div style={{ fontSize: 12, color: tierColor, fontWeight: 600 }}>{perfLabel}</div>
                        </div>
                        <span style={{ background: `${tierColor}15`, color: tierColor, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap" }}>{tier === "strength" ? "Strength" : tier === "developing" ? "Developing" : "Priority"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Category insight cards */}
              {Object.entries(catScores).map(([cat, score]) => {
                const icon = qs.find(q => q.category === cat)?.icon || "•";
                const color = scoreColor(score);
                const tier = score < 2.5 ? "low" : score < 3.75 ? "mid" : "high";
                const myOwn = ownMap[cat]?.[tier] || [];
                const withExpert = expertMap[cat]?.[tier] || [];
                return (
                  <div key={cat} style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", borderTop: `4px solid ${color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <QIcon icon={icon} size={22} color={color} />
                      <div style={{ flex: 1 }}><h3 style={{ color: BRAND.primary, margin: 0, fontSize: 17, fontWeight: 700 }}>{cat}</h3><div style={{ fontSize: 12, color: BRAND.textMuted, marginTop: 2 }}>{scoreLabel(score)} · {score.toFixed(1)} / 5.0</div></div>
                      <div style={{ width: 50, height: 50, borderRadius: "50%", background: `${color}12`, border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color }}>{score.toFixed(1)}</div>
                    </div>
                    <p style={{ color: BRAND.textBody, fontSize: 14, lineHeight: 1.7, margin: "0 0 18px", padding: "12px 16px", background: BRAND.bg, borderRadius: 8 }}>{generateInsight(cat, score)}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ background: `${BRAND.primary}05`, border: `1px solid ${BRAND.primary}15`, borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.primary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>🧭 On Your Own</div>
                        {myOwn.map((action, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: BRAND.textBody, marginBottom: i < myOwn.length - 1 ? 7 : 0, lineHeight: 1.5 }}><span style={{ color: BRAND.primary, flexShrink: 0, fontWeight: 700 }}>→</span><span>{action}</span></div>)}
                      </div>
                      <div style={{ background: `${BRAND.accent}05`, border: `1px solid ${BRAND.accent}20`, borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>🤝 With Expert Support</div>
                        {withExpert.map((action, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: BRAND.textBody, marginBottom: i < withExpert.length - 1 ? 7 : 0, lineHeight: 1.5 }}><span style={{ color: BRAND.accent, flexShrink: 0, fontWeight: 700 }}>→</span><span>{action}</span></div>)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* 90-Day Roadmap */}
              <div style={{ background: "white", borderRadius: 14, padding: 28, marginTop: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Your Board Action Plan</div>
                <h3 style={{ color: BRAND.primary, margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>90-Day Governance Roadmap</h3>
                <p style={{ color: BRAND.textBody, fontSize: 13, margin: "0 0 22px", lineHeight: 1.5 }}>Sequenced to your lowest-scoring areas first. Each phase builds on the one before it.</p>
                {[
                  { phase: "Days 1–30", title: "Share the Data. Start the Conversation.", color: BRAND.red, actions: ["Present full assessment results at your next board meeting", "Name your single highest-priority area based on your lowest PCWI score", "Form or re-activate a Governance Committee with a specific 90-day charge", "Schedule one extended dialogue session focused entirely on your priority area", "Assign a named owner to each improvement initiative before you leave the room"] },
                  { phase: "Days 31–60", title: "Build the Structure. Assign the Work.", color: BRAND.gold, actions: ["Draft a written board improvement plan — owners, timelines, and success metrics", "Pilot one meeting format change: consent agenda, strategy-first, or new dialogue norms", "Launch board composition audit if People scored below 3.5", "Schedule a board-CEO alignment conversation if Work scored below 3.5", "If Culture scored below 3.0: run an anonymous experience survey and debrief"] },
                  { phase: "Days 61–90", title: "Execute. Measure. Adjust.", color: BRAND.green, actions: ["Implement your top two governance improvements from the 30–60 day plan", "Conduct a mid-cycle check-in: what's working, what needs to shift?", "Begin targeted recruitment outreach for any composition gaps identified", "Set the date for your next full governance assessment (12–18 months out)", "Report progress to the full board at day 90 — celebrate every step forward"] },
                ].map(phase => (
                  <div key={phase.phase} style={{ marginBottom: 12, border: `1px solid ${BRAND.border}`, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ background: BRAND.primary, padding: "11px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ background: phase.color, color: "white", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{phase.phase}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{phase.title}</span>
                    </div>
                    <div style={{ padding: "14px 18px" }}>
                      {phase.actions.map((a, i) => <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: BRAND.textBody, marginBottom: i < phase.actions.length - 1 ? 7 : 0, lineHeight: 1.5 }}><span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${BRAND.border}`, flexShrink: 0, display: "inline-block", marginTop: 1 }} />{a}</div>)}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 18, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.teal})`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Need help implementing this plan?</div>
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>The Nonprofit Edge connects you with Dr. Corbett's governance expertise.</div>
                  </div>
                  <a href="https://thenonprofitedge.org" target="_blank" rel="noreferrer" style={{ background: "white", color: BRAND.primary, padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>Get Support →</a>
                </div>
              </div>
            </div>
          )}

          {/* ── QUALITATIVE ── */}
          {activeTab === "openended" && (
            <div>
              <h2 style={{ color: BRAND.primary, margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Qualitative Responses</h2>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 28px" }}>Anonymous, open-ended responses — often the richest data for board conversation. Use these directly in your next facilitated session.</p>

              {allResponses.some(r => r.openEnded && Object.values(r.openEnded).some(v => v)) ? (
                <>
                  {/* More / Less / Stop — 3-column layout */}
                  {allResponses.some(r => r.openEnded?.moreOf || r.openEnded?.lessOf || r.openEnded?.stopDoing) && (
                    <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                      <h3 style={{ color: BRAND.primary, margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>What would you like to see our board do more of, less of, or stop doing?</h3>
                      <p style={{ color: BRAND.textMuted, fontSize: 12, margin: "0 0 20px" }}>Each row represents one respondent's perspective.</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        {[
                          { key: "moreOf", label: "↑ More of…", color: BRAND.green },
                          { key: "lessOf", label: "↓ Less of…", color: BRAND.gold },
                          { key: "stopDoing", label: "✕ Stop doing…", color: BRAND.red },
                        ].map(col => {
                          const entries = allResponses.filter(r => r.openEnded?.[col.key]).map(r => r.openEnded[col.key]);
                          return (
                            <div key={col.key}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: col.color, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, padding: "6px 10px", background: `${col.color}10`, borderRadius: 6, border: `1px solid ${col.color}25` }}>{col.label}</div>
                              {entries.length > 0 ? entries.map((e, i) => (
                                <div key={i} style={{ padding: "10px 12px", background: BRAND.bg, borderRadius: 8, marginBottom: 8, fontSize: 13, color: "#444", lineHeight: 1.6, fontStyle: "italic", borderLeft: `3px solid ${col.color}40` }}>"{e}"</div>
                              )) : (
                                <div style={{ padding: "10px 12px", color: BRAND.textMuted, fontSize: 12, fontStyle: "italic" }}>No responses for this column.</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Single-response questions */}
                  {[
                    { key: "biggestImpact", label: "🎯 Biggest Impact in the Next 12 Months", question: "What is the single most important thing our board could do in the next 12 months to make the biggest difference?", color: BRAND.teal },
                    { key: "neededMost", label: "🔍 What's Needed Most Right Now", question: "What does this organization need most from its board — and are we delivering it?", color: BRAND.primary },
                    { key: "longTerm", label: "🔭 Long-Term Strategic Questions", question: "Looking 3–5 years out, what strategic questions should our board be wrestling with that we aren't yet?", color: "#6B46C1" },
                  ].map(section => {
                    const resps = allResponses.filter(r => r.openEnded?.[section.key]).map(r => r.openEnded[section.key]);
                    return resps.length > 0 ? (
                      <div key={section.key} style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${section.color}` }}>
                        <h3 style={{ color: section.color, margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>{section.label}</h3>
                        <p style={{ color: BRAND.textMuted, fontSize: 12, margin: "0 0 16px", fontStyle: "italic" }}>{section.question}</p>
                        {resps.map((r, i) => <div key={i} style={{ padding: "10px 14px", background: BRAND.bg, borderRadius: 8, marginBottom: 8, fontSize: 13, color: "#444", lineHeight: 1.6, fontStyle: "italic", borderLeft: `3px solid ${section.color}30` }}>"{r}"</div>)}
                      </div>
                    ) : null;
                  })}
                </>
              ) : (
                <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 24 }}>
                  <div style={{ marginBottom: 16, display:"flex", justifyContent:"center" }}><MessageSquare size={48} color={BRAND.primary} strokeWidth={1.2} /></div>
                  <h3 style={{ color: BRAND.primary, margin: "0 0 8px" }}>No qualitative responses yet</h3>
                  <p style={{ color: "#888", margin: 0 }}>Open-ended responses will appear here after board members complete the reflection questions at the end of the assessment.</p>
                </div>
              )}

              {/* Facilitation Questions */}
              <div style={{ background: `${BRAND.primary}08`, border: `1px solid ${BRAND.primary}30`, borderRadius: 12, padding: 24, marginTop: 8 }}>
                <h4 style={{ color: BRAND.primary, margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>💬 Board Meeting Facilitation Guide</h4>
                <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Use these questions to open discussion on the themes above. They're sequenced to move from reflection to action.</p>
                {[
                  { q: "Looking at the 'Stop doing' responses — is there anything that surprises you? Anything you'd push back on?", tag: "Opening" },
                  { q: "Where do you see the most alignment across these responses? Where is the tension or disagreement?", tag: "Alignment" },
                  { q: "If we could only do one thing from the 'More of' list this year, what would have the biggest impact — and who should own it?", tag: "Priority" },
                  { q: "On the question of what's needed most from this board right now — are we honest with ourselves about whether we're delivering it?", tag: "Accountability" },
                  { q: "What strategic question from the long-term responses should we schedule a dedicated conversation about in the next 90 days?", tag: "Strategy" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: "#444", padding: "12px 0", borderBottom: i < 4 ? `1px solid ${BRAND.primary}10` : "none", lineHeight: 1.6, alignItems: "flex-start" }}>
                    <span style={{ background: BRAND.accent, color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, whiteSpace: "nowrap", marginTop: 2, flexShrink: 0 }}>{item.tag}</span>
                    <span>{item.q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 40, padding: "20px 0", borderTop: `1px solid ${BRAND.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <Building2 size={20} color={BRAND.textMuted} strokeWidth={1.6} />
            <div style={{ flex: 1, fontSize: 11, color: "#aaa" }}>
              Powered by The Nonprofit Edge · Grounded in Dr. Corbett's Leadership & Governance Philosophy<br />
              © 2026 The Pivotal Group Consultants Inc. · thenonprofitedge.org
            </div>
            <button onClick={() => window.print()} style={{ padding: "8px 16px", background: "white", color: BRAND.primary, border: `1px solid ${BRAND.primary}`, borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: FONT }}><span style={{display:"flex",alignItems:"center",gap:5}}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print Report</span></button>
          </div>
        </div>}
      </div>
    );
  }

  return null;
}
