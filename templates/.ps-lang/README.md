# .ps-lang Directory

Welcome to your PS-LANG configuration! This directory was created by `npx ps-lang init` and contains all project-specific PS-LANG settings and templates.

**PS-LANG Version:** 0.1.0-alpha.1 (Claude Code Support)

## Structure

```
.ps-lang/
├── config/
│   ├── ps-lang.config.json       # Main configuration
│   └── claude-commands.json      # Claude Code custom commands
├── templates/
│   ├── journal-template.psl      # Journal entry template
│   └── log-template.psl          # Technical log template
├── schemas/
│   └── psl-schema.json           # .psl file validation schema
├── examples/
│   └── basic-zones.md            # Quick reference guide
└── README.md                     # This file
```

## What's Inside?

### config/
Configuration files that control PS-LANG behavior in your project.

- **ps-lang.config.json** - Main settings (zones, features, alpha testing flags)
- **claude-commands.json** - Custom slash commands for Claude Code

### templates/
Reusable templates for creating PS-LANG documents.

- **journal-template.psl** - Structure for journal entries
- **log-template.psl** - Structure for technical logs

### schemas/
JSON Schema files for validation.

- **psl-schema.json** - Validates .psl file structure

### examples/
Learning materials and quick references.

- **basic-zones.md** - Quick guide to all PS-LANG zones

## Usage with Claude Code

**Integration Required:** PS-LANG commands need to be manually added to your Claude Code configuration.

### Setup (One-time)

1. Open `config/claude-commands.json` in this directory
2. Copy the commands from the `ps_lang_commands` section
3. Paste them into your `~/.claude/commands.json` under the `"commands"` key
4. Save and restart Claude Code if needed

### Available Commands (after setup)

- `/psl-journal` - Create a journal entry
- `/psl-log` - Create a technical log
- `/psl-zones` - Show zone reference
- `/psl-validate` - Validate syntax

**Note:** These commands integrate with your existing Claude Code commands, they don't replace them.

## Configuration

Edit `config/ps-lang.config.json` to:
- Enable/disable specific zones
- Configure Claude Code integration
- Set alpha testing preferences
- Customize project settings

## The 7 PS-LANG Zones

Quick reference:

| Zone | Syntax | Purpose |
|------|--------|---------|
| **Agent-Blind** | `<.>` | Private notes, hidden from agents |
| **Pass-Through** | `<#.>` | Documentation for next agent |
| **Active Workspace** | `<@.>` | Current agent's work area |
| **AI-Managed** | `<~.>` | AI-generated metadata |
| **Sensitive** | `<$.>` | Financial/sensitive data |
| **Questions** | `<?.>` | Open questions |
| **Benchmark/Bookmark** | `<.bm>` | Metrics or references |

**Full reference:** See `examples/basic-zones.md`

## Alpha Testing

You're using **PS-LANG v0.1.0-alpha.1** with Claude Code support.

**Feedback welcome:**
- GitHub Issues: https://github.com/vummo/ps-lang/issues
- Email: hello@vummo.com
- Website: https://ps-lang.dev

**What to report:**
- ✅ What works well
- ❌ What's confusing
- 💡 Feature ideas
- 🐛 Bugs
- 📊 Performance data

## What Gets Committed?

**✅ Commit these:**
- `config/ps-lang.config.json` (shared team settings)
- `config/claude-commands.json` (shared commands)
- `templates/` (shared templates)
- `schemas/` (validation schemas)
- `examples/` (documentation)

**❌ Don't commit these:**
- `config/user-*.json` (personal settings)
- `.cache/` (temporary files)

These are already in your `.gitignore`.

## Learn More

- **Quick Start:** `examples/basic-zones.md`
- **Full Docs:** https://ps-lang.dev/docs
- **GitHub:** https://github.com/vummo/ps-lang

---

**Happy context engineering!** 🚀
