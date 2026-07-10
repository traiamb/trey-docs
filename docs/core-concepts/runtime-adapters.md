
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-planned">Planned</span>
    <span class="trey-category-badge">Core Concepts</span>
  </div>
  <h1 class="trey-page-title">Runtime Adapters</h1>
  <p class="trey-page-description">The adapter contract that lets Trey normalize different coding runtimes into one event model.</p>
</div>

<div class="trey-content-card" markdown="1">

## Overview

Runtime adapters let Trey support multiple coding tools without tying the product to one model provider. The adapter contract is responsible for probing local availability, starting a session, stopping a session, and normalizing output into RuntimeEvent records that the daemon and console can understand.

## Why Trey Must Not Hardcode Ollama Only

Teams will use different tools for different work: local OpenCode/Ollama for private experiments, Claude Code for complex product work, Codex CLI for repository-aware coding, Cursor CLI for editor-aligned workflows, and raw Ollama for future low-level model tasks. A stable adapter layer keeps Trey focused on orchestration, verification, approval, and audit rather than provider-specific behavior.

## Adapter Contract

Each adapter exposes probe, start, stop, and event normalization. Probe reports installation and auth state. Start launches work in a daemon-owned worktree. Stop terminates a task cleanly. RuntimeEvent normalization turns provider-specific stdout, JSON, command messages, and errors into a shared stream.

### Pseudo interface

```bash
type RuntimeAdapter = {
  probe(context: ProbeContext): Promise<RuntimeProbe>;
  start(session: RuntimeSession): AsyncIterable<RuntimeEvent>;
  stop(runId: string, reason: StopReason): Promise<void>;
};

type RuntimeEvent = {
  runId: string;
  type: "stdout" | "stderr" | "tool_call" | "file_hint" | "error" | "completed";
  message: string;
  observedAt: string;
};
```

> [!CAUTION]
> **Events are not proof**
> Runtime events explain what the tool said or attempted. The daemon still verifies changed files, diffs, commands, and checks from the local environment.

## How Claude, Codex, Cursor, and OpenCode Fit

Adapters can wrap command-line tools, local HTTP APIs, or future SDKs. The console should show a consistent run console regardless of provider: live output, runtime status, daemon log tail, changed files, checks, diff proposal, approval panel, and event timeline.

---
### Related Pages

- [Runtime Adapters Overview](../runtime-adapters/runtime-adapters-overview.md)
- [Runtime Adapter Architecture](../architecture/runtime-adapter-architecture.md)
- [Runtime Detection](../runtime-adapters/runtime-detection.md)
- [Runtimes](../core-concepts/runtimes.md)
- [Task Runs](../core-concepts/task-runs.md)

</div>