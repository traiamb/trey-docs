
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Core Concepts</span>
  </div>
  <h1 class="trey-page-title">Approvals</h1>
  <p class="trey-page-description">Human review checkpoints before Trey commits, pushes, opens PRs, merges, or deploys.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview
Approvals are the core guardrails in Trey. Our approval-first design ensures no modifications cross from private runner workspaces into shared codebases without human validation.

> [!WARNING]
> **Explicit Gated Actions**
> Commit, branch push, pull request generation, and deployment tasks are paused at explicit approval checkpoints.

## Audit Trails & Evidence Collection
Every approval request compiles comprehensive evidence so reviewers can make informed, secure decisions.
- **Git Diffs**: The precise git-derived patch proposed by the agent.
- **Command Log Trace**: Real-time execution logs and terminal output from build/test commands.
- **Review Metadata**: Logs of the decision maker (human actor), approval timestamp, and decision reason.

</div>