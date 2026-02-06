// ============================================
// GOVERNANCE KNOWLEDGE SECTION
// Add this to your existing SYSTEM_PROMPT in ask-professor.js
// Insert after the existing BoardSource section
// ============================================

const GOVERNANCE_KNOWLEDGE = `

## BOARDSOURCE HANDBOOK DEEP KNOWLEDGE

### The Three Sectors
- **Public sector**: Serves public good, financed by tax revenues
- **Private sector**: Produces profit for owners  
- **Nonprofit sector**: Serves a social purpose; surplus must support mission, not be distributed as private gain

### Why Nonprofits Need Boards
1. **Legal**: State laws require a board to assume fiduciary role; federal law expects board as gatekeeper preventing private inurement
2. **Ethical**: Board assures public the organization is in good hands; acts as agent for constituents; places organization interests above personal
3. **Practical**: Board provides continuity; differentiates trees from forest; brings complementary perspectives to the chief executive

### The Three Fiduciary Duties
1. **Duty of Care**: Act in good faith, actively participate in governance, exercise reasonable care in decision-making
2. **Duty of Loyalty**: Put organization interests first, speak with one voice in decision-making capacity, avoid conflicts
3. **Duty of Obedience**: Faithfulness to mission and purpose, comply with laws, adhere to bylaws, guard the mission

### Board's Three Primary Roles
1. **Set Organizational Direction**: Determine mission/vision/values, engage in strategic thinking, ensure effective planning
2. **Ensure Necessary Resources**: Build competent board, select chief executive, ensure adequate financial resources, enhance public standing
3. **Provide Oversight**: Support and evaluate CEO, protect assets, monitor programs/services, ensure legal/ethical integrity

### Responsible vs. Exceptional Boards
**Responsible boards:**
- Establish and review strategic plans
- Adopt conflict-of-interest policy
- Monitor financial performance
- Design meetings to accomplish work
- Orient new board members

**Exceptional boards go further:**
- Allocate time to what matters most, engage in strategic thinking regularly
- Require annual conflict disclosure, rigorously adhere to policy
- Measure organizational efficiency, effectiveness, and impact using dashboards
- Improve meeting efficiency with consent agendas and executive sessions
- Invest in ongoing development, conduct regular self-assessments

### The 12 Principles of Exceptional Governance (BoardSource)
1. **Constructive Partnership**: Build trust, candor, respect with CEO
2. **Mission Driven**: Shape and uphold mission, treat it as crucial not one-time exercise
3. **Strategic Thinking**: Allocate time to what matters most, use for assessing CEO and shaping recruitment
4. **Culture of Inquiry**: Mutual respect, constructive debate, question assumptions
5. **Independent Mindedness**: Rigorous conflict-of-interest procedures, don't be unduly influenced
6. **Ethos of Transparency**: Donors and public have access to accurate information
7. **Compliance with Integrity**: Strong ethical values, independent audits, sufficient controls
8. **Sustaining Resources**: Link visions to financial support, expertise, networks
9. **Results Oriented**: Measure progress toward mission, gauge efficiency and impact
10. **Intentional Board Practices**: Purposefully structure to fulfill duties and support priorities
11. **Continuous Learning**: Evaluate own performance, embed learning opportunities
12. **Revitalization**: Planned turnover, thoughtful recruitment, fresh perspectives

### Organizational Life Cycle Stages
1. **Start-up**: Founder-driven, all-volunteer, board plays hands-on role, vulnerable period
2. **Adolescent**: Expansion, instability, formal systems needed, board relinquishes operational role
3. **Mature**: Programs established, operations formalized, board reduces operational role, increases policy/oversight/fundraising
4. **Stagnant**: Funding diminishes, demand wanes, volunteers decline, morale suffers — renewal requires board shake-up
5. **Defunct**: Mission lost, programs ineffective, board moribund — may be time to dissolve

### Board Size Considerations
**Large boards** (pros): Broader representation, larger donor base, less individual burnout
**Large boards** (cons): Slower consensus, members feel underutilized, votes diluted

**Small boards** (pros): Better communication, more individual importance, faster decisions
**Small boards** (cons): May lack capacity, reduced outreach, higher burnout risk

### Committee Best Practices
- **Standing committees**: Deal with ongoing issues (finance, governance, executive)
- **Task forces**: Specific objective, specific timeframe, then disband
- **Zero-based approach**: Start each year with clean slate, form committees based on current needs
- Every committee needs: job description/charter, annual work plan, timeline, staff assignment

### Essential Standing Committees
1. **Governance Committee**: Board development, composition, orientation, assessment, leadership succession
2. **Finance Committee**: Financial health oversight, budget review, asset safeguarding, board education on finances
3. **Executive Committee**: Small group acting between meetings; risk of disenfranchising other members if overused

### Individual Board Member Responsibilities
**General**: Know mission/programs/needs, serve in leadership willingly, avoid prejudiced judgments, follow trends
**Meetings**: Prepare and participate conscientiously, ask substantive questions, maintain confidentiality, support board decisions
**Staff relations**: Counsel CEO appropriately, avoid asking for special favors, remember CEO evaluates staff not board
**Avoiding conflicts**: Serve whole organization not special interests, disclose conflicts, maintain independence
**Fiduciary**: Exercise prudence, read and understand financial statements
**Fundraising**: Give personally, help identify potential givers
**Ambassador**: Represent organization responsibly, bring back community feedback

### Board Chair Responsibilities
**Leadership skills**: Approachable, good listener, shows integrity/respect/humility, strategist and visionary
**Duties with CEO**: Cultivate working partnership, oversee hiring/monitoring/evaluation
**Duties with board**: Ensure members carry out responsibilities, oversee assessment process
**Duties with community**: Cultivate donor relationships, serve as ambassador, speak at events

### Legal and Ethical Framework
- **Fiduciary responsibility**: Treat organization assets with same care as your own
- **Test of reasonableness and prudence**: Centuries-old standard from English common law
- **Guilt by omission**: Being passive or inactive in oversight; ignorance is not an excuse
- **Quorum importance**: Too low means few members make major decisions
- **Sarbanes-Oxley influence**: Heightened accountability and transparency carried into nonprofit sector

### Signs a Nonprofit Should Consider Dissolution
- Programs widely considered ineffective, client base declined significantly
- Board moribund, showing no will or ability to initiate change
- Current CEO unable/unwilling to take on renewal, no one else available
- Organization's public reputation poor and beyond resurrection
- Management systems not supporting the work

### Key Governance Definitions
- **Mission**: Reason organization exists, the need it meets
- **Vision**: What the community's future looks like if mission succeeds  
- **Values**: Deeply held beliefs guiding all programs and operations
- **Governance**: Board's legal authority to exercise power on behalf of community served
- **Fiduciary**: Person responsible for managing assets in trust for beneficiaries

`;

// ============================================
// HOW TO ADD THIS TO YOUR EXISTING FILE:
// ============================================
// 
// 1. Open your ask-professor.js file in GitHub
// 2. Find the SYSTEM_PROMPT constant (the big template literal string)
// 3. Locate the existing BoardSource section
// 4. Paste the GOVERNANCE_KNOWLEDGE content right after it
// 5. Commit and push — Vercel auto-deploys
//
// The result: The Professor will have deep, authoritative 
// governance knowledge baked into every response with 
// ZERO speed penalty (it's just text, no database lookup).
// ============================================

module.exports = { GOVERNANCE_KNOWLEDGE };
