---
summary: "CLI reference for `AGENT plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
---

# `AGENT plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:
- Plugin system: [Plugins](/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
AGENT plugins list
AGENT plugins info <id>
AGENT plugins enable <id>
AGENT plugins disable <id>
AGENT plugins doctor
AGENT plugins update <id>
AGENT plugins update --all
```

Bundled plugins ship with Moltbot but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `AGENT.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
AGENT plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
AGENT plugins install -l ./my-plugin
```

### Update

```bash
AGENT plugins update <id>
AGENT plugins update --all
AGENT plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
