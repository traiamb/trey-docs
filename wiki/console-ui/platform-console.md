# Platform Console

> **Status**: `MVP` | **Category**: Console UI

The platform view for super admins to manage companies, users, subscriptions, runners, and complaints.

---

## Overview

The Platform Console is the administration control cockpit reserved for Super Admins. It manages billing subscriptions, resolves company accounts, audits logs, and handles troubleshooting tickets.

> [!WARNING]
> **Audit Enforcement**
> Platform-level actions are recorded in an immutable ledger, requiring Super Admins to log a valid business reason for sensitive operations.

## Super Admin Operations

Super Admins supervise the global health of the Trey network without bypassing individual workspace approvals.

- Company Lockout: Suspend or reactivate company workspace access based on billing or violations.
- Support & Troubleshooting Sessions: Securely inspect runner logs and task states to debug client complaints.
- Fleet Diagnostics: Quarantine failing runners and inspect global telemetry metrics.

---

### Related Pages

- [Console Overview](../console-ui/console-overview.md)
- [Dashboard](../console-ui/dashboard.md)
- [Approval Center](../console-ui/approval-center.md)
