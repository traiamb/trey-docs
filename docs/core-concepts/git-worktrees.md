
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Core Concepts</span>
  </div>
  <h1 class="trey-page-title">Git Worktrees</h1>
  <p class="trey-page-description">How Trey isolates task execution from your main working copy and protected branches.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

Trey isolates task execution from the developer's primary working directory by using Git Worktrees. This prevents uncommitted edits from being overwritten or combined with automated changes.

> [!CAUTION]
> **Sandbox Worktrees**
> For each task claim, the runner daemon checks out a separate directory as a worktree, keeping your main branch clean and allowing parallel executions.

## Worktree Lifecycle

1. On task claim, daemon creates a task-scoped branch (e.g., `trey/task-123`).
2. Git worktree is created in a isolated directory (e.g., `<runner-temp>/worktrees/task-123`).
3. Runtimes modify files only in this worktree directory.
4. Verification runs build/test in this path.
5. Worktree is pruned once the task is completed or aborted.

---
### Related Pages

- [Approvals](../core-concepts/approvals.md)
- [Events and Logs](../core-concepts/events-and-logs.md)

</div>