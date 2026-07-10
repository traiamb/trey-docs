
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Safety and Governance</span>
  </div>
  <h1 class="trey-page-title">Safety Model</h1>
  <p class="trey-page-description">Agent writes code, daemon verifies facts, console visualizes state, and humans approve risk.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

Trey uses a layered safety model: the agent writes code, the daemon observes and verifies, the console visualizes verified state, and the human approves risk. No commit, push, pull request, merge, or deployment should happen without an explicit approval record.

## Source of Truth

Git is the source of truth for changed files and diffs. Build, test, and lint checks are daemon-owned. Protected path rules and secret scans are evaluated before approval. Runtime messages are useful context but never sufficient proof.

- Agent proposes and edits.
- Daemon creates worktree and verifies the filesystem.
- Console displays git-derived state and check results.
- Human approves or requests changes.
- Control plane records every privileged transition.

## Approval Boundaries

Approval gates should exist anywhere Trey crosses from private work into shared systems: commit, push, PR creation, merge, deployment, protected path edit, and sensitive command execution.

### Policy sketch

```bash
approval:
  requiredFor:
    - commit
    - push
    - pull_request
    - protected_path
    - deployment
  blockOn:
    - secret_detected
    - tests_failed
    - direct_main_edit
```

## Safety Notes

Do not let external integrations, model output, or convenience buttons bypass the safety model. GitHub and Jira can request or reflect work, but Trey should remain the execution and approval record.

> [!WARNING]
> **No invisible publishing**
> A user should always be able to answer who approved a change, what diff was approved, which checks ran, and what external action followed.

---
### Related Pages

- [Deployments Screen](../console-ui/deployments-screen.md)
- [Approval Gates](../safety-and-governance/approval-gates.md)

</div>