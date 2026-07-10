
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Safety and Governance</span>
  </div>
  <h1 class="trey-page-title">Token Isolation</h1>
  <p class="trey-page-description">Separate control-plane credentials, runtime credentials, Git tokens, and runner tokens.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

Token Isolation limits the damage of token compromise by partitioning credentials based on entity and scope.

- User Tokens: Compact JWTs containing identity pointers (`sid`) stored inside BFF cookies.
- Runner Tokens: Cryptographically hashed runner keys scoped strictly to fetch, claim, and log task executions within their designated workspace.
- Git Provider Tokens: Scoped oauth keys used by the daemon to publish branches and open PRs.

> [!CAUTION]
> **Isolation Principle**
> If a runner token is compromised, the attacker can only access that specific workspace's queues and cannot impersonate users or read other company workspaces.

---
### Related Pages

- [No Direct Main Edits](../safety-and-governance/no-direct-main-edits.md)
- [Active Sessions](../safety-and-governance/active-sessions.md)

</div>