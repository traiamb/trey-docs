# Workspaces

> **Status**: `MVP` | **Category**: Core Concepts

The team or organization boundary for repositories, agents, runners, and audit history.

---

## Overview

A Workspace is the administrative and security boundary within Trey. It partitions users, repositories, agent roles, runner fleets, task queues, and audit history. It is the logical boundary where engineering teams collaborate safely.

> [!NOTE]
> **Workspace Scope**
> All resources are scoped to a workspace. An API request or runner heartbeat from Workspace A can never read, modify, or schedule work inside Workspace B.

## Personal vs Company Workspaces

Workspaces scale from solo developers to enterprise engineering organizations.

- Personal Workspaces: Scoped to a single INDIVIDUAL_OWNER. Designed for local-only, mesh networks, or personal workflows.
- Company Workspaces: Nested under a Company customer boundary. Managed by COMPANY_OWNER and WORKSPACE_ADMIN roles, allowing team collaboration, shared runners, and unified review rules.
- RBAC Enforcement: Scoped roles (Developer, Reviewer, Admin) are verified for every request inside the workspace context.

---

### Related Pages

- [Glossary](../getting-started/glossary.md)
- [Repositories](../core-concepts/repositories.md)
