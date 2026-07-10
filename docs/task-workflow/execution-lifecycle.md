
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Task Workflow</span>
  </div>
  <h1 class="trey-page-title">Execution Lifecycle</h1>
  <p class="trey-page-description">How a task moves from queued to running, verifying, approval, completed, or failed.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

The Trey execution lifecycle represents the complete path a task takes from creation to PR submission. It is coordinates via a state machine between the Next.js console, Spring Boot control plane, and Go daemon.

- Intake & Refinement: Task is created and refined by the Lead Agent.
- Queue Allocation: Assigned to the queue of an online, matching runner.
- Worktree Checkout: Daemon checks out worktree on a task-scoped branch.
- Runtime Synthesizing: Agent runtime receives guidelines and performs the coding task.
- Mechanical verification: Daemon executes build, test, and lint commands, verifying the output.
- Risk Review & Approval: Diffs and logs are presented for human review.
- Git Publication: Upon approval, daemon commits, pushes branch, and creates the PR.

---
### Related Pages

- [Task Refinement](../task-workflow/task-refinement.md)
- [Changed Files and Diff](../task-workflow/changed-files-and-diff.md)

</div>