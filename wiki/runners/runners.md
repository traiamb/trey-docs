# Runners

> **Status**: `MVP` | **Category**: Core Concepts

Machines that run the Trey daemon and perform isolated engineering work.

---

## Overview

Runners represent the execution machines that host the Go runner daemon (`trey-daemon`). Runners poll the Spring Boot orchestrator for tasks, run them in sandboxed environments, and report health and telemetry.

> [!NOTE]
> **Outbound-Only Connection**
> Runners establish outbound HTTP/WebSocket connections. They require no inbound ports open, making them compatible with home laptops and private office networks.

## Runner Architecture and Security

Runners are hardened execution environments designed to run code modifications safely.

- Multi-Tenant Scoping: Runners belong to a specific workspace or company. Heartbeats are signed with cryptographically hashed runner tokens.
- Liveness & Heartbeats: Runners report heartbeat updates every 10 seconds. Offline states are immediately flagged.
- Telemetry Capture: Reports CPU load, memory utilization, disk space, and command execution queues.

### Daemon CLI telemetry check

```bash
trey-daemon status
trey-daemon telemetry --once
```

---

### Related Pages

- [Daemon vs Agent](../core-concepts/daemon-vs-agent.md)
- [Runtimes](../core-concepts/runtimes.md)
