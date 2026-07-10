# Daemon vs Agent

> **Status**: `MVP` | **Category**: Core Concepts

Separate logical AI roles from the Go daemon process that executes and verifies work.

---

## Overview

Trey separates the people-shaped concepts from the machine-shaped concepts. An agent is a logical role, such as Backend Agent or PR Review Agent. A daemon is the long-running Go process installed on a runner machine. A runtime is the coding tool the daemon starts, such as Claude Code, Codex CLI, Cursor CLI, or OpenCode/Ollama. A runner is the actual machine doing the work. A human is the final approver for actions that affect shared history or production systems.

- Agent: logical role, prompt, scope, and permission policy.
- Daemon: local executor that creates worktrees, starts runtimes, runs checks, and reports verified state.
- Runtime: model or coding CLI used to edit code.
- Runner: laptop, workstation, GPU server, or VM where the daemon runs.
- Human: accountable approver for commit, push, PR, merge, and deployment actions.

## When to Use It

Use this distinction whenever you configure a task, troubleshoot execution, or explain Trey to a teammate. Most workflow mistakes come from treating the model as the executor. In Trey, the runtime can suggest and edit, but the daemon verifies filesystem state and the human approves risk.

## How It Works

A task selects an agent, repository, runner, and runtime. The control plane queues the task. The runner daemon claims it, creates an isolated worktree, launches the runtime with the agent prompt and task context, streams normalized events, calculates the git diff, runs checks, and asks for approval before publishing anything.

### Example assignment

```bash
agent: Backend Agent
runtime: Claude Code
runner: home-macbook
daemon: trey-daemon v0.1.x
repository: nivasaone-api
action: implement endpoint and wait for approval before PR
```

> [!TIP]
> **Concrete mental model**
> Backend Agent + Claude Code runtime + home-macbook runner + Go daemon + nivasaone-api repo means the role decides how to work, Claude Code edits, the home MacBook executes, the daemon verifies, and the human approves.

## Safety Notes

Do not grant a runtime direct authority to commit or push outside the daemon path. Trey should trust git, process exits, checks, protected path rules, and approvals more than natural-language model claims.

---

### Related Pages

- [Runners](../core-concepts/runners.md)
- [Runtime Adapters](../core-concepts/runtime-adapters.md)
- [Human Approval Flow](../task-workflow/human-approval-flow.md)
- [Task](../core-concepts/task.md)
