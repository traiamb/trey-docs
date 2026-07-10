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
          <a href="getting-started/introduction/" class="trey-btn trey-btn-primary">
            Get Started
            <svg class="trey-icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="core-concepts/workspaces/" class="trey-btn trey-btn-secondary">Learn Concepts</a>
        </div>
      </div>
      
      <div class="trey-hero-card">
        <div class="trey-hero-card-header">
          <span>RUN MONITOR</span>
          <svg class="trey-icon-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <pre class="trey-hero-card-body"><code>$ trey run verify-security
[+] Claimed task-482 (high priority)
[+] Checked out worktree in 140ms
[+] Running static verification...
[+] Verification successful.
[+] Committing patch and creating PR.
[+] Session completed successfully.</code></pre>
      </div>
    </div>
  </div>

  <div class="trey-section-title">
    <div>
      <span class="trey-section-badge">DOCUMENTATION INDEX</span>
      <h2 class="trey-section-heading">Platform Modules</h2>
    </div>
    <span class="trey-section-count">180 Articles Compiled</span>
  </div>

  <div class="trey-grid">
    
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">API REFERENCE</span>
        <h3>API Reference</h3>
        <p>Create agents, assign scopes, manage prompts, and configure approval defaults.</p>
      </div>
      <a href="api-reference/agent-apis/">Explore 13 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">AGENTS</span>
        <h3>Agents</h3>
        <p>Write role prompts that are specific, reviewable, and compatible with daemon verification.</p>
      </div>
      <a href="agents/agent-prompt-guidelines/">Explore 11 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">ARCHITECTURE</span>
        <h3>Architecture</h3>
        <p>The end-to-end Trey system from browser request to daemon-verified code proposal.</p>
      </div>
      <a href="architecture/architecture-overview/">Explore 11 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">CONSOLE UI</span>
        <h3>Console UI</h3>
        <p>Centralize pending approvals for commit, push, PR, merge, and deployment actions.</p>
      </div>
      <a href="console-ui/approval-center/">Explore 16 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">CORE CONCEPTS</span>
        <h3>Core Concepts</h3>
        <p>Logical engineering roles with scope, prompts, permissions, and default review expectations.</p>
      </div>
      <a href="agents/agents/">Explore 18 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">DAEMON AND RUNNERS</span>
        <h3>Daemon and Runners</h3>
        <p>Use cloud compute for elastic execution while retaining approval policy.</p>
      </div>
      <a href="daemon-and-runners/cloud-vm-runner/">Explore 13 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">DEPLOYMENT AND OPERATIONS</span>
        <h3>Deployment and Operations</h3>
        <p>Protect task history, audit logs, artifacts, and database state.</p>
      </div>
      <a href="deployment-and-operations/backups-and-retention/">Explore 10 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">GETTING STARTED</span>
        <h3>Getting Started</h3>
        <p>Create a task, choose repo, agent, runner, runtime, and review the daemon-verified result.</p>
      </div>
      <a href="getting-started/first-task-run/">Explore 8 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">INTEGRATIONS</span>
        <h3>Integrations</h3>
        <p>Represent GitHub issues, Jira tickets, and future sources as linked work records.</p>
      </div>
      <a href="integrations/external-work-items/">Explore 12 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">PRODUCT ROADMAP</span>
        <h3>Product Roadmap</h3>
        <p>Manual task creation, local runner execution, live logs, diff review, and approval gates.</p>
      </div>
      <a href="product-roadmap/phase-1-manual-task-mvp/">Explore 11 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">RUNTIME ADAPTERS</span>
        <h3>Runtime Adapters</h3>
        <p>Connect Claude Code as a Trey runtime while preserving daemon-owned verification.</p>
      </div>
      <a href="runtime-adapters/claude-code-runtime/">Explore 11 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">SAFETY AND GOVERNANCE</span>
        <h3>Safety and Governance</h3>
        <p>Manage and audit active CLI and web console sessions.</p>
      </div>
      <a href="safety-and-governance/active-sessions/">Explore 12 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">TASK WORKFLOW</span>
        <h3>Task Workflow</h3>
        <p>Run deterministic checks owned by the daemon, not the model response.</p>
      </div>
      <a href="task-workflow/build-test-lint-validation/">Explore 11 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">TROUBLESHOOTING</span>
        <h3>Troubleshooting</h3>
        <p>Resolve blocked approvals caused by failed gates, protected paths, or missing reviewer authority.</p>
      </div>
      <a href="troubleshooting/approval-blocked/">Explore 13 topics →</a>
    </div>
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">USE CASES</span>
        <h3>Use Cases</h3>
        <p>Separate client repositories, review paths, and audit records for agency delivery.</p>
      </div>
      <a href="use-cases/agency-workflow/">Explore 10 topics →</a>
    </div>
  </div>
</div>