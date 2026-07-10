
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Core Concepts</span>
  </div>
  <h1 class="trey-page-title">Task</h1>
  <p class="trey-page-description">Understand task lifecycle, plan, creation, agent execution, and summarization.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview
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
```json
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
```

</div>