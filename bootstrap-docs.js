const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

const pages = [
  {
    path: 'task/task.md',
    title: 'Task',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'Understand task lifecycle, plan, creation, agent execution, and summarization.',
    content: `## Overview
A Task is the primary operational primitive in Trey, representing a bounded engineering objective to be resolved on a repository. It encapsulates requirement definitions, coordinates agent routing, manages runner/runtime assignments, holds execution logs, captures mechanical verification evidence, and coordinates human approval gates.

> [!NOTE]
> **Task Design Goal**
> A task provides a secure, visible playground where AI coding runtimes can propose modifications, while the Go daemon acts as a trusted local gatekeeper and verification agent.

## Task Creation and Refinement
Tasks are initialized through the console UI or imported from external planning boards. Every task must undergo refinement before execution.
- **Manual Creation**: Users specify the target workspace, repository, assigned agent role, designated runner machine, runtime adapter, and description.
- **Imported Tasks**: Webhooks or polling sync issues from GitHub or Jira, linking external metadata to the Trey task.
- **Lead Agent Refinement**: The Trey Lead Agent reads the description, inspects repo settings, consults AGENTS.md/repo.json policy, and generates an implementation plan.

## Task Execution Lifecycle
Tasks transition through a strict, auditable state machine monitored by the Spring Boot control plane and executed by the Go daemon.
- **QUEUED**: The task is waiting in the workspace queue for its designated runner.
- **CLAIMED / RUNNING**: An active runner claims the task, checks out an isolated git worktree on a unique branch, and spins up the agent runtime.
- **VERIFYING**: The runtime finishes execution. The daemon takes over to run compile, test, lint, protected path, and secret checks.
- **WAITING FOR APPROVAL**: The verification checks complete successfully. The proposed diff, log traces, and risk score are presented for human review.
- **COMPLETED**: The reviewer approves. The daemon commits, pushes task branch, and triggers PR creation.
- **FAILED**: Execution halts due to compilation errors, test failures, runner disconnect, or security policy violations.

## How the Agent Treats the Task
The agent runtime (e.g. Claude Code or OpenCode) does not execute directly on your production environment. It runs inside a sandboxed git worktree and is governed by strict rules.
- **Workspace Boundaries**: The runner daemon isolates the task in a separate folder, protecting the main copy.
- **Prompt and Context Constraints**: The control plane attaches role prompts and repo rules to guide agent decisions.
- **Tool Execution Logging**: All command invocations and file modifications are captured as events in real-time.

### Task Model Schema
\`\`\`json
{
  "id": "uuid-7-task-id",
  "workspaceId": "uuid-workspace-id",
  "repoId": "uuid-repository-id",
  "assignedAgentId": "uuid-agent-id",
  "assignedRunnerId": "uuid-runner-id",
  "status": "WAITING_FOR_APPROVAL",
  "priority": "HIGH",
  "title": "Fix memory leak in background worker"
}
\`\`\``
  },
  {
    path: 'core-concepts/workspaces.md',
    title: 'Workspaces',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'The team or organization boundary for repositories, agents, runners, and audit history.',
    content: `## Overview
A Workspace is the administrative and security boundary within Trey. It partitions users, repositories, agent roles, runner fleets, task queues, and audit history. It is the logical boundary where engineering teams collaborate safely.

> [!NOTE]
> **Workspace Scope**
> All resources are scoped to a workspace. An API request or runner heartbeat from Workspace A can never read, modify, or schedule work inside Workspace B.

## Personal vs Company Workspaces
Workspaces scale from solo developers to enterprise engineering organizations.
- **Personal Workspaces**: Scoped to a single INDIVIDUAL_OWNER. Designed for local-only, mesh networks, or personal workflows.
- **Company Workspaces**: Nested under a Company customer boundary. Managed by COMPANY_OWNER and WORKSPACE_ADMIN roles, allowing team collaboration, shared runners, and unified review rules.
- **RBAC Enforcement**: Scoped roles (Developer, Reviewer, Admin) are verified for every request inside the workspace context.`
  },
  {
    path: 'core-concepts/repositories.md',
    title: 'Repositories',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'Registered codebases Trey can clone, inspect, isolate, test, and propose changes against.',
    content: `## Overview
Repositories represent the codebases registered under a Trey workspace. Trey integrates with git hosting providers (GitHub, GitLab) to orchestrate work branches, fetch requirements, propose diffs, and generate pull requests.

> [!CAUTION]
> **Secure Access Keys**
> Repository credentials (git tokens, SSH keys) are kept in secure control plane boundaries or local runner daemons. Agent runtimes are never given direct access to global credentials.

## Repository-Level Governance Policy
Each repository can define granular rules to guide agents and restrict automated changes.
- **AGENTS.md**: Local guidelines containing architectural instructions, coding standards, and source-of-truth rules that agents must read before writing code.
- **.traiamb/repo.json**: Technical configuration defining allowed commands, build/test scripts, and custom path classifications.

### repo.json configuration
\`\`\`json
{
  "build": "npm run build",
  "test": "npm run test",
  "allowlist": ["npm", "git", "vitest"],
  "protectedPaths": ["next.config.ts", "src/auth/**"]
}
\`\`\``
  },
  {
    path: 'core-concepts/agents.md',
    title: 'Agents',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'Logical engineering roles with scope, prompts, permissions, and default review expectations.',
    content: `## Overview
Trey uses specialized logical Agent Roles rather than a single chat instance. Each agent role represents a technical specialization with distinct capabilities, prompts, and default review policies.
- **Trey Lead Agent**: Coordinates task refinement, decomposes complex requirements, and reviews diffs before final verification.
- **Backend Agent**: Focuses on backend APIs, Postgres schemas, database migrations, and unit tests.
- **Frontend Agent**: Specializes in React UI layouts, state management, design tokens, and user experience flows.
- **PR Review Agent**: An independent reviewer role that inspects code changes, risk assessments, and test coverage.

## Scope and Boundaries
Agents suggest and draft files, but they are not system administrators. They operate inside a strict sandbox and cannot bypass security limits.
- **No Direct Write**: Agents write changes in local git worktrees. They have no push access to protected git branches.
- **Prompt Hardening**: Agent system prompts strictly enforce policy compliance, secure coding practices, and tool usage regulations.`
  },
  {
    path: 'core-concepts/runners.md',
    title: 'Runners',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'Machines that run the Trey daemon and perform isolated engineering work.',
    content: `## Overview
Runners represent the execution machines that host the Go runner daemon (\`trey-daemon\`). Runners poll the Spring Boot orchestrator for tasks, run them in sandboxed environments, and report health and telemetry.

> [!NOTE]
> **Outbound-Only Connection**
> Runners establish outbound HTTP/WebSocket connections. They require no inbound ports open, making them compatible with home laptops and private office networks.

## Runner Architecture and Security
Runners are hardened execution environments designed to run code modifications safely.
- **Multi-Tenant Scoping**: Runners belong to a specific workspace or company. Heartbeats are signed with cryptographically hashed runner tokens.
- **Liveness & Heartbeats**: Runners report heartbeat updates every 10 seconds. Offline states are immediately flagged.
- **Telemetry Capture**: Reports CPU load, memory utilization, disk space, and command execution queues.`
  },
  {
    path: 'core-concepts/runtimes.md',
    title: 'Runtimes',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'Coding and model tools such as Claude Code, Codex CLI, Cursor CLI, and OpenCode/Ollama.',
    content: `## Overview
Runtimes are the actual coding engines (e.g. Claude Code, Cursor CLI, local OpenCode/Ollama) started by the Go daemon to inspect, edit, and refactor code.
- **Multi-Runtime Support**: Trey is designed to be runtime-agnostic, letting users choose optimal models or tools for each task.
- **Local Runtimes**: Run on the user machine (Ollama, local CLI) keeping code completely private.
- **Cloud-backed CLIs**: Run via remote providers (Claude Code API) for complex code synthesis.

## Probing and Status Control
The runner daemon periodically probes the host system to check the installation, version, and authentication state of registered runtimes.
- **AVAILABLE**: The binary is detected and authenticated.
- **AUTH_REQUIRED**: The binary exists but requires authorization (e.g., Claude login expired).
- **UNAVAILABLE**: The binary is missing or not in the system PATH.`
  },
  {
    path: 'core-concepts/approvals.md',
    title: 'Approvals',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'Human review checkpoints before Trey commits, pushes, opens PRs, merges, or deploys.',
    content: `## Overview
Approvals are the core guardrails in Trey. Our approval-first design ensures no modifications cross from private runner workspaces into shared codebases without human validation.

> [!WARNING]
> **Explicit Gated Actions**
> Commit, branch push, pull request generation, and deployment tasks are paused at explicit approval checkpoints.

## Audit Trails & Evidence Collection
Every approval request compiles comprehensive evidence so reviewers can make informed, secure decisions.
- **Git Diffs**: The precise git-derived patch proposed by the agent.
- **Command Log Trace**: Real-time execution logs and terminal output from build/test commands.
- **Review Metadata**: Logs of the decision maker (human actor), approval timestamp, and decision reason.`
  },
  {
    path: 'core-concepts/git-worktrees.md',
    title: 'Git Worktrees',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'How Trey isolates task execution from your main working copy and protected branches.',
    content: `## Overview
Trey isolates task execution from the developer's primary working directory by using Git Worktrees. This prevents uncommitted edits from being overwritten or combined with automated changes.

> [!CAUTION]
> **Sandbox Worktrees**
> For each task claim, the runner daemon checks out a separate directory as a worktree, keeping your main branch clean and allowing parallel executions.

## Worktree Lifecycle
1. On task claim, daemon creates a task-scoped branch (e.g., \`trey/task-123\`).
2. Git worktree is created in a isolated directory (e.g., \`<runner-temp>/worktrees/task-123\`).
3. Runtimes modify files only in this worktree directory.
4. Verification runs build/test in this path.
5. Worktree is pruned once the task is completed or aborted.`
  },
  {
    path: 'core-concepts/execution-lifecycle.md',
    title: 'Execution Lifecycle',
    category: 'Core Concepts',
    status: 'MVP',
    description: 'How a task moves from queued to running, verifying, approval, completed, or failed.',
    content: `## Overview
The Trey execution lifecycle represents the complete path a task takes from creation to PR submission. It is coordinates via a state machine between the Next.js console, Spring Boot control plane, and Go daemon.

## Lifecycle States
- **Intake & Refinement**: Task is created and refined by the Lead Agent.
- **Queue Allocation**: Assigned to the queue of an online, matching runner.
- **Worktree Checkout**: Daemon checks out worktree on a task-scoped branch.
- **Runtime Synthesizing**: Agent runtime receives guidelines and performs the coding task.
- **Mechanical verification**: Daemon executes build, test, and lint commands, verifying the output.
- **Risk Review & Approval**: Diffs and logs are presented for human review.
- **Git Publication**: Upon approval, daemon commits, pushes branch, and creates the PR.`
  },
  {
    path: 'safety-and-governance/active-sessions.md',
    title: 'Active Sessions',
    category: 'Safety and Governance',
    status: 'MVP',
    description: 'Manage and audit active CLI and web console sessions.',
    content: `## Overview
Active Sessions protect the platform from unauthorized token reuse. Trey tracks all active user logins, CLI handshakes, and API tokens under a single audit dashboard.

> [!IMPORTANT]
> **Session Limits**
> Trey enforces session limits based on user role and client type (e.g., maximum 1 web console session and 2 CLI sessions for Developers) to prevent account sharing and token leakage.

## Audit and Revocation Flow
Users can audit active sessions directly from the Settings screen inside the console.
- **Session details**: Shows client type (Web, CLI, Desktop, Mobile), Device ID, IP Address, and Last Active timestamp.
- **Immediate Revocation**: Revoking a session destroys its token mapping on the control plane. Subsequent requests are rejected, and the device is logged out.

### Session management endpoints
\`\`\`bash
GET /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/{sessionId}/revoke
\`\`\``
  },
  {
    path: 'console-ui/platform-console.md',
    title: 'Platform Console',
    category: 'Console UI',
    status: 'MVP',
    description: 'The platform view for super admins to manage companies, users, subscriptions, runners, and complaints.',
    content: `## Overview
The Platform Console is the administration control cockpit reserved for Super Admins. It manages billing subscriptions, resolves company accounts, audits logs, and handles troubleshooting tickets.

> [!WARNING]
> **Audit Enforcement**
> Platform-level actions are recorded in an immutable ledger, requiring Super Admins to log a valid business reason for sensitive operations.

## Super Admin Operations
Super Admins supervise the global health of the Trey network without bypassing individual workspace approvals.
- **Company Lockout**: Suspend or reactivate company workspace access based on billing or violations.
- **Support & Troubleshooting Sessions**: Securely inspect runner logs and task states to debug client complaints.
- **Fleet Diagnostics**: Quarantine failing runners and inspect global telemetry metrics.`
  },
  {
    path: 'api-reference/auth-apis.md',
    title: 'Auth APIs',
    category: 'API Reference',
    status: 'Reference',
    description: 'Authenticate users, manage sessions, and authorize CLI connections.',
    content: `## Overview
Auth APIs manage identity validation, cookie rotation, active sessions, and CLI authorize flows.
- **Session Tokens**: Gated by HttpOnly, Secure cookies in BFF context to defend against token theft.
- **CLI Token handshakes**: Authenticates local command-line client sessions safely using PKCE-like authorization redirections.

### Auth Endpoints
\`\`\`bash
POST /api/v1/auth/login        # Credentials login
POST /api/v1/auth/logout       # Revoke session
POST /api/v1/auth/refresh      # Cookie token rotation
GET  /api/v1/auth/sessions     # List active sessions
POST /api/v1/auth/cli/authorize # CLI OAuth handshake
\`\`\``
  },
  {
    path: 'architecture/security-architecture.md',
    title: 'Security Architecture',
    category: 'Architecture',
    status: 'MVP',
    description: 'Isolation, token boundaries, command audit, protected paths, secret scanning, and approval gates.',
    content: `## Overview
Trey uses a robust multi-layered security architecture spanning secure BFF endpoints, HTTP headers hardening, and sandboxed runner containers.

> [!NOTE]
> **Zero Trust Control Plane**
> The Spring Boot control plane assumes zero trust from runtimes and browser clients. No shell commands are executed on the backend orchestrator.

## Security Controls
1. **BFF Cookie Isolation**: All frontend tokens are converted to HttpOnly, SameSite, Secure cookies.
2. **Hardened Headers**: Enforces CSP (Content Security Policy), HSTS (HTTP Strict Transport Security), frame-ancestors, and X-Content-Type-Options.
3. **Outbound Runner Daemon**: Go runners connect outbound, requiring no inbound network routes.
4. **Scoped Role Gatekeepers**: All API requests undergo cross-company and cross-workspace access validation.`
  },
  {
    path: 'safety-and-governance/token-isolation.md',
    title: 'Token Isolation',
    category: 'Safety and Governance',
    status: 'MVP',
    description: 'Separate control-plane credentials, runtime credentials, Git tokens, and runner tokens.',
    content: `## Overview
Token Isolation limits the damage of token compromise by partitioning credentials based on entity and scope.
- **User Tokens**: Compact JWTs containing identity pointers (\`sid\`) stored inside BFF cookies.
- **Runner Tokens**: Cryptographically hashed runner keys scoped strictly to fetch, claim, and log task executions within their designated workspace.
- **Git Provider Tokens**: Scoped oauth keys used by the daemon to publish branches and open PRs.

> [!NOTE]
> **Isolation Principle**
> If a runner token is compromised, the attacker can only access that specific workspace's queues and cannot impersonate users or read other company workspaces.`
  }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function mapCalloutType(type) {
  switch (type) {
    case 'safety': return 'CAUTION';
    case 'planned': return 'IMPORTANT';
    case 'example': return 'TIP';
    default: return type.toUpperCase();
  }
}

// Clean & build folders
console.log('Cleaning old folders...');
if (fs.existsSync(DOCS_DIR)) fs.rmSync(DOCS_DIR, { recursive: true, force: true });
fs.mkdirSync(DOCS_DIR);

// Build Pages
console.log('Generating markdown files...');
pages.forEach(p => {
  const fullPath = path.join(DOCS_DIR, p.path);
  ensureDirectoryExistence(fullPath);
  
  let content = `# ${p.title}\n\n> **Status**: \`${p.status}\` | **Category**: ${p.category}\n\n${p.description}\n\n---\n\n${p.content}`;
  fs.writeFileSync(fullPath, content, 'utf-8');
});

// Landing page index.md with custom premium HTML matching localhost:3000/docs
const landingHtml = `<div class="home-page-container">
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
</div>`;

fs.writeFileSync(path.join(DOCS_DIR, 'index.md'), landingHtml, 'utf-8');

// Write extra.css
console.log('Writing extra.css stylesheet...');
const extraCssContent = `/* Color Palette and Custom Tokens matching trey-console */
:root {
  --md-primary-fg-color: #0f172a !important; /* slate-950 */
  --md-primary-fg-color--dark: #090d16 !important;
  --md-accent-fg-color: #06b6d4 !important; /* cyan-500 */
  --md-default-bg-color: #f6f8fd !important; /* page background */
  --md-default-fg-color: #0f172a !important; /* primary text */
  --md-default-fg-color--light: #475569 !important; /* secondary text */
  --md-default-fg-color--lighter: #94a3b8 !important;
  
  --md-code-bg-color: #f8fafc !important;
  --md-code-fg-color: #0f172a !important;
}

/* Custom fonts */
body, input {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
}
code, kbd, pre {
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Courier, monospace !important;
}

/* Header customization: clean, semi-transparent white with blur */
.md-header {
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  color: #0f172a !important;
  border-bottom: 1px solid #e2e8f0 !important;
  box-shadow: none !important;
}
.md-header__title {
  color: #0f172a !important;
  font-weight: 600 !important;
}
.md-header__button {
  color: #0f172a !important;
}
.md-header__button.md-icon[for="__search"] {
  color: #0f172a !important;
}

/* Navigation tabs styling */
.md-tabs {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e8f0 !important;
}
.md-tabs__link {
  color: #475569 !important;
  font-weight: 500 !important;
}
.md-tabs__link--active {
  color: #0f172a !important;
}

/* Content Container Card styling */
.md-content {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important; /* rounded-xl */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03) !important;
  padding: 2rem !important;
  margin-top: 1.5rem !important;
  margin-bottom: 2rem !important;
}

/* Page title & headings */
.md-content h1 {
  font-size: 1.875rem !important; /* text-3xl */
  font-weight: 600 !important;
  color: #0f172a !important;
  letter-spacing: -0.025em !important;
  margin-bottom: 1.5rem !important;
}
.md-content h2 {
  font-size: 1.25rem !important; /* text-xl */
  font-weight: 600 !important;
  color: #0f172a !important;
  margin-top: 2rem !important;
  margin-bottom: 1rem !important;
  border-bottom: none !important;
  padding-bottom: 0 !important;
}

/* Admonitions/Callouts styling matching trey-console */
.admonition {
  border-left-width: 4px !important;
  border-radius: 0.5rem !important;
  box-shadow: none !important;
}
.admonition.note, .admonition.info {
  border-left-color: #06b6d4 !important; /* cyan-500 */
  background-color: #ecfeff !important; /* cyan-50 */
}
.admonition.warning {
  border-left-color: #f59e0b !important; /* amber-500 */
  background-color: #fef3c7 !important; /* amber-50 */
}
.admonition.danger, .admonition.caution {
  border-left-color: #f43f5e !important; /* rose-500 */
  background-color: #fff1f2 !important; /* rose-50 */
}
.admonition.tip {
  border-left-color: #10b981 !important; /* emerald-500 */
  background-color: #ecfdf5 !important; /* emerald-50 */
}
.admonition-title {
  background-color: transparent !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  padding-top: 0.75rem !important;
  padding-bottom: 0 !important;
}

/* Sidebar navigation styling */
.md-sidebar--primary {
  background-color: #ffffff !important;
  border-right: 1px solid #e2e8f0 !important;
}
.md-sidebar--secondary {
  background-color: transparent !important;
}
.md-nav__link {
  color: #475569 !important;
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  transition: all 0.2s !important;
}
.md-nav__link:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}
.md-nav__link--active {
  background-color: #0f172a !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}
.md-nav__link--active:hover {
  background-color: #0f172a !important;
  color: #ffffff !important;
}

/* Code block container */
.highlight {
  border-radius: 0.5rem !important;
  border: 1px solid #e2e8f0 !important;
}

/* --- HERO BANNER & GRID LAYOUT FOR THE LANDING PAGE --- */
.trey-hero {
  position: relative;
  overflow: hidden;
  background-color: #0b0f19;
  color: #ffffff;
  padding: 3rem 2rem;
  border-radius: 0.75rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.trey-hero-grid {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}
.trey-hero-container {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 992px) {
  .trey-hero-container {
    grid-template-cols: 1fr 340px;
    align-items: center;
  }
}
.trey-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(34, 211, 238, 0.25);
  background-color: rgba(34, 211, 238, 0.1);
  padding: 0.25rem 0.75rem;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #22d3ee;
  margin-bottom: 1.25rem;
}
.trey-icon {
  width: 14px;
  height: 14px;
}
.trey-hero-title {
  color: #ffffff !important;
  font-size: 2.25rem !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.03em !important;
  margin-top: 0 !important;
  margin-bottom: 1.25rem !important;
}
@media (min-width: 768px) {
  .trey-hero-title {
    font-size: 3.25rem !important;
  }
}
.trey-hero-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #cbd5e1;
  max-width: 600px;
  margin-bottom: 1.75rem;
}
.trey-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.trey-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none !important;
  transition: all 0.2s;
}
.trey-btn-primary {
  background-color: #22d3ee;
  color: #0f172a !important;
}
.trey-btn-primary:hover {
  background-color: #67e8f9;
}
.trey-btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff !important;
}
.trey-btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.trey-icon-btn {
  width: 16px;
  height: 16px;
}

/* Hero Run Card */
.trey-hero-card {
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
.trey-hero-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}
.trey-hero-card-header span {
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #94a3b8;
}
.trey-icon-card {
  width: 16px;
  height: 16px;
  color: #22d3ee;
}
.trey-hero-card-body {
  margin: 0 !important;
  background-color: transparent !important;
  border: none !important;
  color: #34d399 !important; /* emerald-400 */
  font-size: 0.75rem !important;
  line-height: 1.7 !important;
}

/* Homepage grid map */
.trey-section-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}
@media (min-width: 768px) {
  .trey-section-title {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}
.trey-section-badge {
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #0e7490; /* cyan-700 */
  margin: 0 !important;
}
.trey-section-heading {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  margin: 0.25rem 0 0 0 !important;
}
.trey-section-count {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 !important;
}

/* Category cards grid */
.trey-grid {
  display: grid;
  gap: 1rem;
  grid-template-cols: 1fr;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .trey-grid {
    grid-template-cols: repeat(2, 1fr);
  }
}
@media (min-width: 1200px) {
  .trey-grid {
    grid-template-cols: repeat(3, 1fr);
  }
}
.trey-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.trey-card:hover {
  border-color: #22d3ee;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
.trey-card h3 {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  margin: 0 0 0.5rem 0 !important;
}
.trey-card p {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 1rem 0 !important;
  flex-grow: 1;
}
.trey-card a {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0e7490 !important;
  text-decoration: none !important;
}
.trey-card a:hover {
  color: #0891b2 !important;
}

/* Home page content card strip */
.md-content:has(.home-page-container) {
  border: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}
.home-page-container h1,
.home-page-container .md-content__meta {
  display: none !important;
}
`;
const extraCssPath = path.join(DOCS_DIR, 'stylesheets/extra.css');
ensureDirectoryExistence(extraCssPath);
fs.writeFileSync(extraCssPath, extraCssContent, 'utf-8');

// Write logo asset matching tile-dark.svg
console.log('Writing logo asset...');
const logoPath = path.join(DOCS_DIR, 'assets/logo.svg');
ensureDirectoryExistence(logoPath);
fs.writeFileSync(logoPath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="21" fill="#0B0F14"></rect><g fill="none" stroke="#FFFFFF" stroke-linecap="round" transform="translate(20.16 20.16) scale(2.32)"><path d="M12 2.4 L12 21.6" stroke-width="2.4"></path><path d="M4.6 4.4 C4.6 10.2 12 9.4 12 15.2" stroke-width="2.2"></path><path d="M19.4 4.4 C19.4 10.2 12 9.4 12 15.2" stroke-width="2.2"></path></g></svg>`, 'utf-8');

// Write mkdocs.yml
console.log('Creating mkdocs.yml...');
const mkdocsConfig = `site_name: Trey Documentation
site_description: Local-first AI engineering operations cockpit.
theme:
  name: material
  logo: assets/logo.svg
  favicon: assets/logo.svg
  font:
    text: Inter
    code: JetBrains Mono
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: slate
      accent: cyan
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: slate
      accent: cyan
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.expand
    - navigation.top
    - search.suggest
    - search.highlight
    - content.code.copy

extra_css:
  - stylesheets/extra.css

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.inlinehilite
  - pymdownx.snippets
`;
fs.writeFileSync(path.join(ROOT_DIR, 'mkdocs.yml'), mkdocsConfig, 'utf-8');

// Write workflow action
console.log('Writing GitHub Action workflow...');
const workflowPath = path.join(ROOT_DIR, '.github/workflows/deploy.yml');
ensureDirectoryExistence(workflowPath);
const workflowConfig = `name: Deploy Documentation
on:
  push:
    branches:
      - main
      - master

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
`;
fs.writeFileSync(workflowPath, workflowConfig, 'utf-8');

// Write README
console.log('Writing README...');
const readmeContent = `# Trey Docs Site

This directory contains the ready-to-deploy setup for your premium documentation website, powered by **MkDocs Material** and **GitHub Pages**.

## How to Deploy to GitHub Pages

1. Initialize Git in this directory (if not already done):
   \`\`\`bash
   git init
   git remote add origin https://github.com/YOUR_ORGANIZATION/YOUR_REPO.git
   git checkout -b main
   git add .
   git commit -m "Initialize premium docs site"
   git push -u origin main
   \`\`\`
2. Go to your repository settings on GitHub:
   - Under **Settings** -> **Pages**, change the **Source** to **Deploy from a branch**.
   - Select the branch \`gh-pages\` (which is automatically built and pushed by our GitHub Action) and folder \`/(root)\`.
   - Click **Save**.
`;
fs.writeFileSync(path.join(ROOT_DIR, 'README.md'), readmeContent, 'utf-8');

console.log('Bootstrapping completed successfully!');
