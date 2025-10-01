<div align="center">
  <a href="https://ps-lang.dev">
    <img src="./ps-lang-logomark.png" alt="PS-LANG Logo" width="200"/>
  </a>

  <br/>
  <br/>

  # PS-LANG

  **Privacy-First Scripting Language for Multi-Agent Context Control**

  Control what AI agents see in your workflows.

  [![npm version](https://img.shields.io/npm/v/ps-lang.svg)](https://www.npmjs.com/package/ps-lang)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

  ---

  **→ [ps-lang.dev](https://ps-lang.dev) ←**

  ---
</div>

> **Version:** 0.1.0-alpha.1
> **Status:** Alpha Testing Phase

---

## What is PS-LANG?

**PS-LANG** (Privacy-First Scripting Language) is a syntax for controlling what AI agents see in multi-agent workflows. Use **zones** to mark content as private, pass-through, or active workspace.

**Perfect for:**
- Multi-agent pipelines (Research → Writing → Review)
- Context engineering (control what each agent sees)
- Benchmarking (clean test environments)
- Privacy-first AI collaboration

---

## Quick Start (2 minutes)

### 1. Install

```bash
npx ps-lang init
```

This creates a `.ps-lang/` folder in your project with:
- Configuration files
- Claude Code custom commands
- Templates and examples
- Schema for validation

### 2. Use PS-LANG Zones

Start using zones in your files:

```markdown
# My Document

<@. Current task: Implement auth @.>

<#.
API Documentation (passes to next agent):
- POST /login
- GET /user
#.>

<.
Private note: Remember to review security
.>
```

### 3. Claude Code Integration

**Manual setup required** - Copy commands from `.ps-lang/config/claude-commands.json` into your `~/.claude/commands.json`.

Available commands (after setup):
- `/psl-journal` - Create journal entry
- `/psl-log` - Create technical log
- `/psl-zones` - Show zone reference
- `/psl-validate` - Check syntax

See `.ps-lang/README.md` for detailed integration instructions.

---

## The 7 Zones

| Zone | Syntax | Purpose |
|------|--------|---------|
| **Agent-Blind** | `<.>` | Private notes, hidden from agents |
| **Pass-Through** | `<#.>` | Documentation for next agent |
| **Active Workspace** | `<@.>` | Current agent's work area |
| **AI-Managed** | `<~.>` | AI-generated metadata |
| **Sensitive** | `<$.>` | Financial/sensitive data |
| **Questions** | `<?.>` | Open questions |
| **Benchmark/Bookmark** | `<.bm>` | Metrics or references |

**Full reference:** `.ps-lang/examples/basic-zones.md`

---

## Real-World Example

```markdown
<@. Active: Building user authentication @.>

## Authentication Flow

<#.
Next agent needs this context:
- Using JWT tokens
- 15-minute expiry
- Refresh token pattern
#.>

<.
Internal note: Consider adding 2FA later
Don't show this to the code review agent
.>

<.bm auth-performance
Login time: 45ms
Token generation: 12ms
.bm>
```

---

## Project Structure

After `npx ps-lang init`:

```
your-project/
├── .ps-lang/
│   ├── config/
│   │   ├── ps-lang.config.json      # Settings
│   │   └── claude-commands.json     # Custom commands
│   ├── templates/
│   │   ├── journal-template.psl
│   │   └── log-template.psl
│   ├── schemas/
│   │   └── psl-schema.json
│   ├── examples/
│   │   └── basic-zones.md           # Quick reference
│   └── README.md
└── .gitignore                        # Updated automatically
```

---

## Commands

```bash
# Initialize in your project
npx ps-lang init

# Show zone syntax quick reference
npx ps-lang zones

# Generate example files
npx ps-lang example handoff     # Agent handoff document
npx ps-lang example benchmark   # Performance benchmarks
npx ps-lang example journal     # Daily journal entry
npx ps-lang example component   # React component with zones

# Extract zones from files (see what agents would see)
npx ps-lang extract README.md

# Show project zone statistics
npx ps-lang stats

# Manage VS Code themes
npx ps-lang theme list                # List available themes
npx ps-lang theme set journal         # Apply Journal theme (default)
npx ps-lang theme set dark-agent      # Apply Dark Agent theme
npx ps-lang theme set minimal-light   # Apply Minimal Light theme
npx ps-lang theme set zone-focused    # Apply Zone Focused theme
npx ps-lang theme set disable         # Remove theme customizations

# Validate syntax (basic)
npx ps-lang check

# Show help
npx ps-lang help

# Show version
npx ps-lang version
```

---

## VS Code Themes

PS-LANG includes 4 custom VS Code themes optimized for journaling and multi-agent development:

### Available Themes

1. **PS-LANG Journal** (default) - Warm, paper-like theme perfect for journaling and documentation
2. **PS-LANG Dark Agent** - Dark theme optimized for multi-agent development workflows
3. **PS-LANG Minimal Light** - Clean, minimal light theme for focused work
4. **PS-LANG Zone Focused** - High contrast theme with zone-aware color coding

### Using Themes

During `npx ps-lang init`, you'll be prompted to choose a theme. Or manage themes anytime:

```bash
# List all themes
npx ps-lang theme list

# Apply a theme
npx ps-lang theme set journal

# Disable PS-LANG themes
npx ps-lang theme set disable
```

**Note:** Themes are applied to your `.vscode/settings.json` and can be overridden or removed anytime. They don't affect other projects.

---

## Installation Options

**One-time use (recommended for testing):**
```bash
npx ps-lang init
```

**Global installation:**
```bash
npm install -g ps-lang@alpha
ps-lang init
```

**Add to project:**
```bash
npm install ps-lang@alpha
```

---

## Alpha Testing Goals

We need your help testing:

1. **Claude Code Integration**
   - Do custom commands work?
   - Is zone syntax recognized?
   - Any parsing issues?

2. **`.ps-lang` Folder Structure**
   - Is it intuitive?
   - Are files in the right places?
   - What's missing?

3. **Zone Syntax**
   - Are 7 zones enough?
   - Is `<.bm>` dual-purpose confusing?
   - Syntax improvements?

4. **Real-World Usage**
   - Does it solve your problems?
   - Performance impact?
   - Integration friction?

---

## Feedback

**We want to hear from you!**

- **Issues:** https://github.com/vummo/ps-lang/issues
- **Email:** hello@vummo.com
- **Discord:** Coming soon
- **Docs:** https://ps-lang.dev

**What to report:**
- ✅ What works well
- ❌ What's confusing
- 💡 Feature ideas
- 🐛 Bugs
- 📊 Performance data

---

## FAQ

### Q: Does this slow down my workflow?

No! Add zones only where context control matters. Most files don't need any zones.

### Q: What if I use a different AI tool?

Alpha focuses on Claude Code. Future versions will support GPT, Cursor, Copilot, etc.

### Q: Can I use this in production?

It's alpha software. Use in side projects first, production when stable.

### Q: How do I uninstall?

```bash
rm -rf .ps-lang
# Remove from .gitignore if desired
```

### Q: Do I commit `.ps-lang` to git?

**Yes,** commit these:
- config/ps-lang.config.json
- config/claude-commands.json
- templates/
- schemas/
- examples/

**No,** gitignore these (auto-added):
- config/user-*.json
- .cache/

---

## Use Cases

- **Agent Pipelines**: Research → Analysis → Writing workflows with clean context
- **Benchmark Testing**: Test agent performance without upstream contamination
- **Context Pruning**: Keep handoffs lean, reduce token waste
- **Role Separation**: Dev agents shouldn't see business strategy notes
- **MCP Integration**: Model Context Protocol agent chains
- **CI/CD Workflows**: Automated pipelines with agent-specific visibility

---

## Examples

See `.ps-lang/examples/basic-zones.md` for comprehensive examples.

**Quick taste:**

```javascript
// Regular code
function authenticate(user, password) {
  <@. Active: Implementing password check @.>

  <.
  TODO: Add rate limiting
  Don't show this to the documentation agent
  .>

  const hash = await bcrypt.hash(password, 10);

  <#.
  For next agent: This uses bcrypt with 10 rounds
  Security review needed before production
  #.>

  return hash === user.passwordHash;
}
```

---

## Roadmap

**Alpha (Current)**
- ✅ `.ps-lang` folder structure
- ✅ Claude Code custom commands
- ✅ Basic zone syntax
- ✅ Templates and examples

**Beta (Next)**
- 🔄 Full syntax validation
- 🔄 VS Code extension
- 🔄 `.psl` file format support
- 🔄 Schema validation

**v1.0 (Future)**
- Parser library
- Multi-agent framework integration
- Performance optimization
- Training data collection

---

## Contributing

1. Fork repository
2. Create feature branch
3. Add tests
4. Submit PR

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## Support

- **Docs:** https://ps-lang.dev/docs
- **GitHub:** https://github.com/vummo/ps-lang
- **Website:** https://ps-lang.dev
- **Email:** hello@vummo.com

---

## License

MIT - See [LICENSE](./LICENSE)

---

## Thank You!

Thank you for alpha testing PS-LANG! Your feedback shapes the future of multi-agent context control.

**Let's build the future of privacy-first AI collaboration together.** 🚀

---

**PS-LANG v0.1.0-alpha.1** - Claude Code Support
