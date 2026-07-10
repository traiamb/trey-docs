
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Safety and Governance</span>
  </div>
  <h1 class="trey-page-title">Active Sessions</h1>
  <p class="trey-page-description">Manage and audit active CLI and web console sessions.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

Active Sessions protect the platform from unauthorized token reuse. Trey tracks all active user logins, CLI handshakes, and API tokens under a single audit dashboard.

> [!CAUTION]
> **Session Limits**
> Trey enforces session limits based on user role and client type (e.g., maximum 1 web console session and 2 CLI sessions for Developers) to prevent account sharing and token leakage.

## Audit and Revocation Flow

Users can audit active sessions directly from the Settings screen inside the console.

- Session details: Shows client type (Web, CLI, Desktop, Mobile), Device ID, IP Address, and Last Active timestamp.
- Immediate Revocation: Revoking a session destroys its token mapping on the control plane. Subsequent requests are rejected, and the device is logged out.

### Session management endpoints

```bash
GET /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/{sessionId}/revoke
```

---
### Related Pages

- [Token Isolation](../safety-and-governance/token-isolation.md)
- [Security Architecture](../architecture/security-architecture.md)
- [Audit Logging](../safety-and-governance/audit-logging.md)

</div>