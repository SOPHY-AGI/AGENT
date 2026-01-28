---
summary: "CLI reference for `AGENT reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
---

# `AGENT reset`

Reset local config/state (keeps the CLI installed).

```bash
AGENT reset
AGENT reset --dry-run
AGENT reset --scope config+creds+sessions --yes --non-interactive
```

