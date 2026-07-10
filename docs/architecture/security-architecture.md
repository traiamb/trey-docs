
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Architecture</span>
  </div>
  <h1 class="trey-page-title">Security Architecture</h1>
  <p class="trey-page-description">Isolation, token boundaries, command audit, protected paths, secret scanning, and approval gates.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview
Trey uses a robust multi-layered security architecture spanning secure BFF endpoints, HTTP headers hardening, and sandboxed runner containers.

> [!NOTE]
> **Zero Trust Control Plane**
> The Spring Boot control plane assumes zero trust from runtimes and browser clients. No shell commands are executed on the backend orchestrator.

## Security Controls
1. **BFF Cookie Isolation**: All frontend tokens are converted to HttpOnly, SameSite, Secure cookies.
2. **Hardened Headers**: Enforces CSP (Content Security Policy), HSTS (HTTP Strict Transport Security), frame-ancestors, and X-Content-Type-Options.
3. **Outbound Runner Daemon**: Go runners connect outbound, requiring no inbound network routes.
4. **Scoped Role Gatekeepers**: All API requests undergo cross-company and cross-workspace access validation.

</div>