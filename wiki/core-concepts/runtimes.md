# Runtimes

> **Status**: `MVP` | **Category**: Core Concepts

Coding and model tools such as Claude Code, Codex CLI, Cursor CLI, and OpenCode/Ollama.

---

## Overview

Runtimes are the actual coding engines (e.g. Claude Code, Codex CLI, Cursor, Ollama/OpenCode) started by the Go daemon to inspect, edit, and refactor code.

- Multi-Runtime Support: Trey is designed to be runtime-agnostic, letting users choose optimal models or tools for each task.
- Local Runtimes: Run on the user machine (Ollama, local CLI) keeping code completely private.
- Cloud-backed CLIs: Run via remote providers (Claude Code API) for complex code synthesis.

## Probing and Status Control

The runner daemon periodically probes the host system to check the installation, version, and authentication state of registered runtimes.

- AVAILABLE: The binary is detected and authenticated.
- AUTH_REQUIRED: The binary exists but requires authorization (e.g., Claude login expired).
- UNAVAILABLE: The binary is missing or not in the system PATH.

---

### Related Pages

- [Runners](../core-concepts/runners.md)
- [Runtime Adapters](../core-concepts/runtime-adapters.md)
