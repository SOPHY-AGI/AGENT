---
summary: "CLI reference for `AGENT tui` (terminal UI connected to the Gateway)"
read_when:
  - You want a terminal UI for the Gateway (remote-friendly)
  - You want to pass url/token/session from scripts
---

# `AGENT tui`

Open the terminal UI connected to the Gateway.

Related:
- TUI guide: [TUI](/tui)

## Examples

```bash
AGENT tui
AGENT tui --url ws://127.0.0.1:18789 --token <token>
AGENT tui --session main --deliver
```

