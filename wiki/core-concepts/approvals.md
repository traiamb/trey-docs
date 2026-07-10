# Approvals

> **Status**: `MVP` | **Category**: Core Concepts

Human review checkpoints before Trey commits, pushes, opens PRs, merges, or deploys.

---

## Overview

Approvals are the core guardrails in Trey. Our approval-first design ensures no modifications cross from private runner workspaces into shared codebases without human validation.

> [!WARNING]
> **Explicit Gated Actions**
> Commit, branch push, pull request generation, and deployment tasks are paused at explicit approval checkpoints.

## Audit Trails & Evidence Collection

Every approval request compiles comprehensive evidence so reviewers can make informed, secure decisions.

- Git Diffs: The precise git-derived patch proposed by the agent.
- Command Log Trace: Real-time execution logs and terminal output from build/test commands.
- Review Metadata: Logs of the decision maker (human actor), approval timestamp, and decision reason.

---

### Related Pages

- [Task Runs](../core-concepts/task-runs.md)
- [Git Worktrees](../core-concepts/git-worktrees.md)
