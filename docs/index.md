<div class="home-page-container">
  <div class="trey-hero">
    <div class="trey-hero-grid"></div>
    <div class="trey-hero-container">
      <div class="trey-hero-content">
        <div class="trey-hero-badge">
          <svg class="trey-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
          Trey Documentation
        </div>
        <h1 class="trey-hero-title">Local-first AI engineering operations, documented end to end.</h1>
        <p class="trey-hero-description">Learn how Trey coordinates agents, runners, runtimes, git worktrees, live telemetry, daemon-verified safety gates, and human approval before code reaches shared systems.</p>
        <div class="trey-hero-actions">
          <a class="trey-btn trey-btn-primary" href="core-concepts/workspaces/">
            Start reading
            <svg class="trey-icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a class="trey-btn trey-btn-secondary" href="task/task/">
            <svg class="trey-icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            Task Overview
          </a>
        </div>
      </div>
      
      <div class="trey-hero-card">
        <div class="trey-hero-card-header">
          <span>VERIFIED RUN</span>
          <svg class="trey-icon-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4 4 0 0 0-8 0v4"/><path d="M15 2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 10v4M12 16h.01"/></svg>
        </div>
        <pre class="trey-hero-card-body">runner.claimed      home-macbook
worktree.created    task/TREY-124
runtime.started     codex-cli
checks.passed       lint, build
diff.generated      8 files
approval.required   pull_request</pre>
      </div>
    </div>
  </div>

  <div class="trey-section-title">
    <div>
      <p class="trey-section-badge">Documentation map</p>
      <h2 class="trey-section-heading">Explore Trey by module</h2>
    </div>
    <p class="trey-section-count">14 core modules</p>
  </div>

  <div class="trey-grid">
    <div class="trey-card">
      <h3>Core Concepts</h3>
      <p>The primitives Trey uses to model workspaces, repositories, agents, runners, runtimes, and approvals.</p>
      <a href="core-concepts/workspaces/">Workspaces →</a>
    </div>
    <div class="trey-card">
      <h3>Task Lifecycle</h3>
      <p>Understand task lifecycle, plan, creation, agent execution, and verification pipelines.</p>
      <a href="task/task/">Task Primitives →</a>
    </div>
    <div class="trey-card">
      <h3>Architecture</h3>
      <p>How the Spring Boot control plane, Next.js console, Go daemon, PostgreSQL, and integrations fit together.</p>
      <a href="architecture/security-architecture/">Security Architecture →</a>
    </div>
    <div class="trey-card">
      <h3>Console UI</h3>
      <p>The screens customers use to create work, observe runs, review diffs, and approve changes.</p>
      <a href="console-ui/platform-console/">Platform Console →</a>
    </div>
    <div class="trey-card">
      <h3>Safety and Governance</h3>
      <p>Approval gates, protected paths, secret scanning, command controls, and active session boundaries.</p>
      <a href="safety-and-governance/token-isolation/">Token Isolation →</a>
    </div>
    <div class="trey-card">
      <h3>API Reference</h3>
      <p>Reference pages for the backend APIs that power workspaces, tasks, runners, runtimes, and approvals.</p>
      <a href="api-reference/auth-apis/">Auth APIs →</a>
    </div>
  </div>
</div>