---
summary: "CLI reference for `AGENT logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
---

# `AGENT logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:
- Logging overview: [Logging](/logging)

## Examples

```bash
AGENT logs
AGENT logs --follow
AGENT logs --json
AGENT logs --limit 500
```

