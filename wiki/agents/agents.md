# Agents

> **Status**: `MVP` | **Category**: Core Concepts

Logical engineering roles with scope, prompts, permissions, and default review expectations.

---

## Overview

Trey uses specialized logical Agent Roles rather than a single chat instance. Each agent role represents a technical specialization with distinct capabilities, prompts, and default review policies.

- Trey Lead Agent: Coordinates task refinement, decomposes complex requirements, and reviews diffs before final verification.
- Backend Agent: Focuses on backend APIs, Postgres schemas, database migrations, and unit tests.
- Frontend Agent: Specializes in React UI layouts, state management, design tokens, and user experience flows.
- PR Review Agent: An independent reviewer role that inspects code changes, risk assessments, and test coverage.

## Scope and Boundaries

Agents suggest and draft files, but they are not system administrators. They operate inside a strict sandbox and cannot bypass security limits.

- No Direct Write: Agents write changes in local git worktrees. They have no push access to protected git branches.
- Prompt Hardening: Agent system prompts strictly enforce policy compliance, secure coding practices, and tool usage regulations.

---

### Related Pages

- [Repositories](../core-concepts/repositories.md)
- [Task](../core-concepts/task.md)
