# Auth APIs

> **Status**: `Reference` | **Category**: API Reference

Authenticate users, manage sessions, and authorize CLI connections.

---

## Overview

Auth APIs manage identity validation, cookie rotation, active sessions, and CLI authorize flows.

- Session Tokens: Gated by HttpOnly, Secure cookies in BFF context to defend against token theft.
- CLI Token handshakes: Authenticates local command-line client sessions safely using PKCE-like authorization redirections.

### Auth Endpoints

```bash
POST /api/v1/auth/login        # Credentials login
POST /api/v1/auth/logout       # Revoke session
POST /api/v1/auth/refresh      # Cookie token rotation
GET  /api/v1/auth/sessions     # List active sessions
POST /api/v1/auth/cli/authorize # CLI OAuth handshake
```

---

### Related Pages

- [API Overview](../api-reference/api-overview.md)
- [Workspace APIs](../api-reference/workspace-apis.md)
- [Active Sessions](../safety-and-governance/active-sessions.md)
