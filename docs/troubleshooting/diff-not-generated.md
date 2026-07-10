
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-reference">Reference</span>
    <span class="trey-category-badge">Troubleshooting</span>
  </div>
  <h1 class="trey-page-title">Diff Not Generated</h1>
  <p class="trey-page-description">Understand why a run produced no git diff or why the daemon refused to trust it.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

Diff Not Generated covers diff diagnostics inside Trey, Grovya Labs' local-first AI engineering operations cockpit. It explains how the console, Spring Boot control plane, Go daemon, git worktrees, PostgreSQL records, runtime adapters, and human approval process work together for this area.

> [!NOTE]
> **Reference status**
> This page is reference material. Use it to align implementation, operations, and support conversations.

## When to Use It

Use this page when you are designing, operating, or reviewing diff diagnostics. It is especially useful when a founder, developer, reviewer, or DevOps user needs to understand what Trey should automate, what the daemon must verify, and where a human decision is required.

- Before configuring a task or workspace policy.
- While reviewing a run that produced code, logs, checks, or artifacts.
- When explaining the boundary between AI assistance and human accountability.
- When troubleshooting a mismatch between runtime output and daemon-verified state.

## How It Works

Trey treats diff diagnostics as part of a controlled task lifecycle. The backend stores durable records, the console presents the workflow, the daemon performs local execution in an isolated worktree, and runtime adapters translate provider-specific behavior into normalized events. The result should be reviewable from the task page without trusting model text alone.

- The control plane records intent, selected repository, selected agent, selected runner, selected runtime, and current state.
- The daemon claims eligible work, prepares the worktree, starts the runtime, captures command output, and reports telemetry.
- Verification uses git diff, changed files, command exits, build/test/lint results, protected path checks, and secret scanning.
- Approval gates block commit, push, PR, merge, and deployment actions until a human approves the exact proposed result.

## Important Fields and Configuration

Most diff diagnostics workflows depend on a small set of records that should remain visible in the console and audit trail.

- workspaceId
- repositoryId
- taskId
- runId
- status
- createdBy
- createdAt

### Configuration example

```bash
workspace: grovya-labs
repository: example-service
agent: Diff Not Generated
runner: local-macbook
runtime: codex-cli
approvalRequired: true
```

## Operational Workflow

A healthy diff diagnostics workflow is explicit and replayable. The user creates or imports work, chooses the repo and agent, selects a runner and runtime, watches live logs, reviews daemon-derived changes, and decides whether the next privileged action is allowed.

- Create or import a task with clear acceptance criteria.
- Select a repository and agent that match the technical scope.
- Select a runner that has repository access and the required runtime installed.
- Let the daemon run checks and generate a diff from git.
- Approve, reject, or request changes based on verified evidence.

## Safety Notes

For diff diagnostics, Trey should prefer verified local state over convenience. Runtime output can be useful, but it is not a substitute for daemon-owned checks or explicit approval.

- Never treat a runtime message as proof that files changed or tests passed.
- Do not allow direct edits to protected branches from an agent session.
- Block or escalate protected paths, detected secrets, failed checks, and unknown command execution.
- Keep approval records tied to the exact diff, command results, actor, and timestamp.

> [!CAUTION]
> **Human approval remains the control point**
> The daemon can automate execution and verification, but the accountable action is the human decision to publish or reject the proposed change.

---
### Related Pages

- [Tests Failed](../troubleshooting/tests-failed.md)
- [Approval Blocked](../troubleshooting/approval-blocked.md)

</div>