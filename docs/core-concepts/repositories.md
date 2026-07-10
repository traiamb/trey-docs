
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-mvp">MVP</span>
    <span class="trey-category-badge">Core Concepts</span>
  </div>
  <h1 class="trey-page-title">Repositories</h1>
  <p class="trey-page-description">Registered codebases Trey can clone, inspect, isolate, test, and propose changes against.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview
Repositories represent the codebases registered under a Trey workspace. Trey integrates with git hosting providers (GitHub, GitLab) to orchestrate work branches, fetch requirements, propose diffs, and generate pull requests.

> [!CAUTION]
> **Secure Access Keys**
> Repository credentials (git tokens, SSH keys) are kept in secure control plane boundaries or local runner daemons. Agent runtimes are never given direct access to global credentials.

## Repository-Level Governance Policy
Each repository can define granular rules to guide agents and restrict automated changes.
- **AGENTS.md**: Local guidelines containing architectural instructions, coding standards, and source-of-truth rules that agents must read before writing code.
- **.traiamb/repo.json**: Technical configuration defining allowed commands, build/test scripts, and custom path classifications.

### repo.json configuration
```json
{
  "build": "npm run build",
  "test": "npm run test",
  "allowlist": ["npm", "git", "vitest"],
  "protectedPaths": ["next.config.ts", "src/auth/**"]
}
```

</div>