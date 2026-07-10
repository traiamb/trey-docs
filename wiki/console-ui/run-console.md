# Run Console

> **Status**: `MVP` | **Category**: Console UI

Watch live agent output, daemon logs, telemetry, changed files, diff proposal, and approval state.

---

## Overview

The run console is the live operating room for a task run. It brings together agent terminal output, daemon logs, runtime status, runner telemetry, changed files, diff proposal, approval panel, and event timeline in one page.

## Verified State vs Model Claims

The console must visualize daemon-verified state, not just what the model says it did. If a runtime says tests passed but the daemon did not observe a successful test command, Trey should show the check as missing or failed. If a runtime says it changed one file but git reports five, the git-derived list wins.

> [!CAUTION]
> **Daemon facts first**
> Use runtime output for context, but use daemon observations for approvals: git diff, command exits, changed files, protected path checks, secret scan, and artifact records.

## Panels

A complete run console gives reviewers enough evidence to decide without opening several tools.

- Live agent terminal for normalized runtime output.
- Daemon log tail for commands, worktree actions, and verification.
- Runtime status for adapter, auth, selected model, and process state.
- Runner telemetry for CPU, memory, disk, queue, and active task.
- Changed files and diff proposal from git.
- Approval panel with risk, gates, and next privileged action.
- Event timeline for replayable history.

## Example Event Flow

The run console should make the sequence easy to audit from queue claim to approval.

### Run console event stream

```bash
queued -> runner.claimed -> worktree.created -> runtime.started -> file.changed -> command.started -> command.finished -> diff.generated -> gates.passed -> approval.requested
```

---

### Related Pages

- [Live Agent Terminal](../console-ui/live-agent-terminal.md)
- [Daemon Log Tail](../console-ui/daemon-log-tail.md)
- [Diff Proposal Card](../console-ui/diff-proposal-card.md)
- [Task Detail](../console-ui/task-detail.md)
