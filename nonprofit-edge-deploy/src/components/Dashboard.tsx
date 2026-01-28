<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - The Nonprofit Edge</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, sans-serif; 
      background: #f8fafc; 
      color: #1e293b; 
      min-height: 100vh;
      display: flex;
    }

    :root {
      --navy: #0D2C54;
      --navy-light: #164677;
      --teal: #0097A9;
      --teal-light: #00b4cc;
      --gold: #D4A84B;
      --purple: #7C3AED;
      --green: #059669;
      --red: #DC2626;
    }

    /* ============================================ */
    /* LEFT SIDEBAR */
    /* ============================================ */
    .sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e2e8f0;
      padding: 24px;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .logo { margin-bottom: 32px; }
    .logo img { height: 40px; }
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: var(--navy);
    }
    .logo-text span { color: var(--teal); }

    /* Nav Sections */
    .nav-section { margin-bottom: 24px; }
    .nav-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 12px;
      font-weight: 600;
      padding-left: 14px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      color: #475569;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      transition: all 0.15s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }
    .nav-link:hover { background: #f1f5f9; color: var(--navy); }
    .nav-link.active { background: #f0fdfa; color: var(--teal); border-left: 3px solid var(--teal); }
    .nav-link svg { flex-shrink: 0; }

    /* Activity Items */
    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 14px;
    }
    .activity-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }
    .activity-dot.teal { background: var(--teal); }
    .activity-dot.gold { background: var(--gold); }
    .activity-name { font-size: 14px; font-weight: 500; color: #334155; }
    .activity-time { font-size: 12px; color: #94a3b8; }

    /* Event Items */
    .event-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .event-date {
      background: var(--navy);
      border-radius: 8px;
      padding: 8px 12px;
      text-align: center;
      min-width: 48px;
    }
    .event-day { font-size: 16px; font-weight: 700; color: white; }
    .event-month { font-size: 10px; color: rgba(255,255,255,0.8); text-transform: uppercase; }
    .event-name { font-size: 14px; font-weight: 500; color: #334155; }
    .event-time { font-size: 12px; color: #94a3b8; }

    /* Downloads Card */
    .downloads-card {
      background: linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%);
      border-radius: 12px;
      padding: 16px;
      color: white;
      margin-bottom: 20px;
    }
    .downloads-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .downloads-label { font-size: 13px; font-weight: 600; }
    .downloads-count { font-size: 12px; font-weight: 600; }
    .downloads-bar {
      height: 6px;
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
      margin-bottom: 12px;
    }
    .downloads-progress {
      width: 72%;
      height: 100%;
      background: white;
      border-radius: 3px;
    }
    .tier-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      background: white;
      color: var(--navy);
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    /* User Profile */
    .user-section {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
    }
    .user-name { font-size: 14px; font-weight: 600; color: #334155; }
    .user-org { font-size: 12px; color: #94a3b8; }
    .signout-btn {
      font-size: 13px;
      color: #94a3b8;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px 14px;
      text-align: left;
      width: 100%;
    }
    .signout-btn:hover { color: var(--red); }

    /* ============================================ */
    /* MAIN CONTENT */
    /* ============================================ */
    .main {
      flex: 1;
      margin-left: 280px;
      padding: 32px 40px;
    }
    .main-inner { max-width: 1000px; }

    /* Welcome */
    .welcome { margin-bottom: 28px; }
    .welcome h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 6px;
    }
    .welcome p { color: #64748b; font-size: 15px; }
    .welcome strong { color: var(--teal); font-weight: 600; }
    .change-focus {
      margin-left: 12px;
      font-size: 13px;
      color: #94a3b8;
      text-decoration: underline;
      text-underline-offset: 2px;
      cursor: pointer;
      background: none;
      border: none;
    }

    /* Top Cards Grid */
    .top-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    /* Insight Card */
    .insight-card {
      background: linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%);
      border-radius: 16px;
      padding: 28px;
      color: white;
      display: flex;
      flex-direction: column;
    }
    .card-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.85;
      margin-bottom: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .insight-text {
      font-size: 16px;
      line-height: 1.65;
      flex: 1;
      margin-bottom: 24px;
    }
    .commitment-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      padding: 12px 18px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
    }
    .commitment-btn span { display: flex; align-items: center; gap: 8px; }

    /* Professor Card */
    .professor-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
      border-radius: 16px;
      padding: 28px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .professor-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(13,44,84,0.3);
    }
    .professor-text {
      font-size: 16px;
      line-height: 1.65;
      flex: 1;
      margin-bottom: 24px;
    }
    .professor-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      padding: 12px 18px;
      color: white;
      font-size: 14px;
      font-weight: 500;
    }
    .professor-btn span { display: flex; align-items: center; gap: 8px; }

    /* Tools Section */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--navy);
    }
    .view-all {
      font-size: 14px;
      color: var(--teal);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    /* Tool Cards Grid */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    .tool-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .tool-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
    .tool-image {
      height: 120px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      padding: 16px;
      position: relative;
    }
    .tool-image::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(13,44,84,0) 0%, rgba(13,44,84,0.85) 100%);
    }
    .tool-name {
      position: relative;
      color: white;
      font-weight: 600;
      font-size: 15px;
    }

    /* Recently Accessed Section */
    .recent-section { margin-top: 32px; }
    .recent-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .recent-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .recent-card:hover {
      border-color: var(--teal);
      box-shadow: 0 4px 12px rgba(0,151,169,0.1);
    }
    .recent-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .recent-info { flex: 1; }
    .recent-name { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
    .recent-meta { font-size: 12px; color: #94a3b8; }
    .recent-arrow { color: #cbd5e1; }
  </style>
</head>
<body>
  <!-- LEFT SIDEBAR -->
  <aside class="sidebar">
    <!-- Logo -->
    <div class="logo">
      <img src="/logo.png" alt="The Nonprofit Edge" style="width: 220px; height: auto;">
    </div>

    <!-- QUICK ACTIONS Section -->
    <nav class="nav-section">
      <div class="nav-label">Quick Actions</div>
      <a href="/member-resources" class="nav-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        Member Resources
      </a>
      <a href="/my-downloads" class="nav-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        My Downloads
      </a>
      <a href="/favorites" class="nav-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Saved Favorites
      </a>
    </nav>

    <!-- Recent Activity -->
    <div class="nav-section">
      <div class="nav-label">Recent Activity</div>
      <div class="activity-item">
        <span class="activity-dot teal"></span>
        <div>
          <div class="activity-name">Board Assessment started</div>
          <div class="activity-time">Today</div>
        </div>
      </div>
      <div class="activity-item">
        <span class="activity-dot gold"></span>
        <div>
          <div class="activity-name">Strategic Plan completed</div>
          <div class="activity-time">3 days ago</div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="nav-section">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 14px; margin-bottom: 12px;">
        <span class="nav-label" style="margin: 0; padding: 0;">Upcoming Events</span>
        <a href="/events" style="font-size: 12px; color: var(--teal); text-decoration: none; font-weight: 500;">View All</a>
      </div>
      <div class="event-item">
        <div class="event-date">
          <div class="event-day">21</div>
          <div class="event-month">Jan</div>
        </div>
        <div>
          <div class="event-name">Live Q&A Session</div>
          <div class="event-time">2:00 PM EST</div>
        </div>
      </div>
      <div class="event-item">
        <div class="event-date">
          <div class="event-day">24</div>
          <div class="event-month">Feb</div>
        </div>
        <div>
          <div class="event-name">🚀 Platform Launch</div>
          <div class="event-time">12:00 PM EST</div>
        </div>
      </div>
    </div>

    <!-- Downloads Counter -->
    <div class="downloads-card">
      <div class="downloads-header">
        <span class="downloads-label">Remaining Downloads</span>
        <span class="downloads-count">18 of 25</span>
      </div>
      <div class="downloads-bar">
        <div class="downloads-progress"></div>
      </div>
      <span class="tier-badge">PROFESSIONAL</span>
    </div>

    <!-- Settings -->
    <a href="/settings" class="nav-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
      Settings
    </a>

    <!-- User Profile -->
    <div class="user-section">
      <div class="user-profile">
        <div class="user-avatar">L</div>
        <div>
          <div class="user-name">Lyn</div>
          <div class="user-org">The Pivotal Group</div>
        </div>
      </div>
      <button class="signout-btn">Sign Out</button>
    </div>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="main">
    <div class="main-inner">
      <!-- Welcome -->
      <div class="welcome">
        <h1>Good morning, Lyn</h1>
        <p>
          You chose <strong>Board Engagement</strong> as your focus area
          <button class="change-focus">Change focus</button>
        </p>
      </div>

      <!-- Top Cards -->
      <div class="top-cards">
        <!-- Today's Insight -->
        <div class="insight-card">
          <div class="card-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469c-1.006 0-1.9.532-2.401 1.324l-.567-.567z"/>
            </svg>
            Today's Insight
          </div>
          <p class="insight-text">
            The most effective boards don't just govern—they champion. When was the last time you asked your board members what excites them about your mission?
          </p>
          <button class="commitment-btn">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
              </svg>
              Make a Commitment
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>

        <!-- Ask the Professor -->
        <div class="professor-card">
          <div class="card-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0097A9" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Ask the Professor
          </div>
          <p class="professor-text">
            Your personal nonprofit leadership advisor, available 24/7. Get strategic guidance tailored to your challenges.
          </p>
          <div class="professor-btn">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Ask me anything
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Your Tools -->
      <div class="section-header">
        <h2 class="section-title">Your Tools</h2>
      </div>

      <div class="tools-grid">
        <a href="/tools/board-assessment" class="tool-card">
          <div class="tool-image" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop');">
            <span class="tool-name">Board Assessment</span>
          </div>
        </a>
        <a href="/tools/strategic-plan" class="tool-card">
          <div class="tool-image" style="background-image: url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop');">
            <span class="tool-name">Strategic Plan Check-Up</span>
          </div>
        </a>
        <a href="/tools/grant-review" class="tool-card">
          <div class="tool-image" style="background-image: url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop');">
            <span class="tool-name">Grant Review</span>
          </div>
        </a>
        <a href="/tools/ceo-evaluation" class="tool-card">
          <div class="tool-image" style="background-image: url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop');">
            <span class="tool-name">CEO Evaluation</span>
          </div>
        </a>
        <a href="/tools/scenario-planner" class="tool-card">
          <div class="tool-image" style="background-image: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop');">
            <span class="tool-name">Scenario Planner</span>
          </div>
        </a>
        <a href="/tools/dashboards" class="tool-card">
          <div class="tool-image" style="background-image: url('https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop');">
            <span class="tool-name">Dashboards</span>
          </div>
        </a>
      </div>

      <!-- Quote of the Day -->
      <div class="quote-section" style="
        background: white;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        padding: 32px 40px;
        margin-top: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="display: flex; align-items: flex-start; gap: 20px; flex: 1;">
          <div style="
            font-size: 48px;
            color: #e2e8f0;
            font-family: Georgia, serif;
            line-height: 1;
          ">"</div>
          <p style="
            font-size: 20px;
            font-style: italic;
            color: #475569;
            line-height: 1.6;
            margin: 0;
          ">You can't read the label from inside the jar.</p>
        </div>
        <div style="text-align: right; min-width: 120px;">
          <div style="font-weight: 600; color: var(--navy); font-size: 15px;">Unknown</div>
          <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Quote of the Day</div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
