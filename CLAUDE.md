# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

**The Agency** is an open-source collection of 144+ specialized AI agent personality files organized across 12 functional divisions. Each agent is a Markdown file with YAML frontmatter that defines a distinct expert persona (identity, workflow, deliverables, success metrics). The files are consumed by automated scripts that convert and install them into AI coding tools like Claude Code, Cursor, Copilot, Aider, Windsurf, and others.

This is a **content repository**, not a software project — there is no build system, test suite, or runtime application. The primary artifacts are `.md` agent files and two Bash scripts.

## Key Commands

```bash
# Convert all agent .md files into tool-specific formats (writes to integrations/)
./scripts/convert.sh

# Interactive installer — auto-detects installed tools and prompts
./scripts/install.sh

# Install for a specific tool only
./scripts/install.sh --tool claude-code   # → ~/.claude/agents/
./scripts/install.sh --tool cursor        # → .cursor/rules/ (project-scoped)
./scripts/install.sh --tool aider         # → CONVENTIONS.md (project-scoped)
./scripts/install.sh --tool windsurf      # → .windsurfrules (project-scoped)
./scripts/install.sh --tool opencode      # → .opencode/agents/ (project-scoped)
./scripts/install.sh --tool copilot       # → ~/.github/agents/
./scripts/install.sh --tool gemini-cli    # → ~/.gemini/extensions/
./scripts/install.sh --tool kimi          # → ~/.config/kimi/agents/

# Skip interactive prompt, install all detected tools
./scripts/install.sh --no-interactive

# Parallel install with custom job count
./scripts/install.sh --parallel --jobs 4
```

`install.sh` requires the `integrations/` directory to exist — run `convert.sh` first if it's missing.

## Agent File Format

Every agent lives in its category directory (e.g., `engineering/`, `design/`, `marketing/`) as a single `.md` file. Filenames follow the pattern `{category}-{role-slug}.md`.

### Frontmatter (required fields)

```yaml
---
name: Agent Name
description: One-line specialty description
color: colorname or "#hexcode"
emoji: 🎯
vibe: One-line personality hook
services: (optional)
  - name: Service Name
    url: https://url.com
    tier: free/freemium/paid
---
```

### Body sections (semantic order matters)

**Persona group** — who the agent is:
- Identity & Memory
- Communication Style
- Critical Rules

**Operations group** — what the agent does:
- Core Mission
- Technical Deliverables
- Workflow Process
- Success Metrics
- Advanced Capabilities

Section headers use emojis. Code blocks must include language tags and contain real, runnable code — never pseudo-code.

## Repository Structure

```
{category}/                 # One directory per division
  {category}-{slug}.md      # One agent file per role
scripts/
  convert.sh                # Converts agents → integrations/ directory
  install.sh                # Copies from integrations/ → tool config dirs
integrations/               # Generated output (not committed; built by convert.sh)
  claude-code/
  cursor/
  aider/
  ...
examples/                   # Multi-agent scenario walkthroughs
```

Divisions: `engineering`, `design`, `finance`, `marketing`, `paid-media`, `product`, `project-management`, `sales`, `testing`, `support`, `game-development`, `spatial-computing`, `academic`, `specialized`.

## Conversion Pipeline

`convert.sh` parses each `.md` file's YAML frontmatter with `awk`, then routes agent content to per-tool converter functions:

- **Antigravity, Gemini CLI, OpenCode, Qwen** → individual `.md` files in structured subdirectories
- **Cursor** → `.mdc` rule files with frontmatter description
- **OpenClaw** → splits each agent into three files: `SOUL.md` (identity/personality), `AGENTS.md` (mission/workflow), `IDENTITY.md`; content is segmented by matching section headers against keyword patterns
- **Kimi** → YAML config + separate system prompt file
- **Aider, Windsurf** → single accumulated file per tool (`CONVENTIONS.md`, `.windsurfrules`)
- OpenCode color values: named colors (cyan, blue, rose, etc.) are mapped to hex; unknown names default to `#6B7280`

## Contributing Conventions

- **One agent per PR.** PRs with bulk modifications require prior discussion in GitHub Issues.
- PR title format: `Add [Agent Name] - [Category]`
- Agent files must include 2–3 real code/template examples, defined success metrics, and a step-by-step workflow.
- Never commit the `integrations/` directory — it is generated output.
- Discuss first before adding new CI workflows, changing directory architecture, or modifying multiple files at once (these PRs will be auto-closed otherwise).
- External service dependencies must be declared in frontmatter; agents must function without live API calls.
