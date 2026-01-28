---
summary: "CLI reference for `AGENT config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
---

# `AGENT config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `AGENT configure`).

## Examples

```bash
AGENT config get browser.executablePath
AGENT config set browser.executablePath "/usr/bin/google-chrome"
AGENT config set agents.defaults.heartbeat.every "2h"
AGENT config set agents.list[0].tools.exec.node "node-id-or-name"
AGENT config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
AGENT config get agents.defaults.workspace
AGENT config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
AGENT config get agents.list
AGENT config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
AGENT config set agents.defaults.heartbeat.every "0m"
AGENT config set gateway.port 19001 --json
AGENT config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
