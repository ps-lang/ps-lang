# PS-LANG Basic Zones - Quick Reference

## Overview

PS-LANG uses **zones** to control what AI agents see in your code and documents. Think of zones as privacy layers for multi-agent workflows.

---

## Core Zones

### 1. Agent-Blind Zone `<.>`

**Purpose:** Hide content from AI agents completely

**Use when:**
- Private notes or thoughts
- Sensitive information
- Internal strategies
- Debug notes not meant for agents

**Example:**
```
<.
This is a private note.
No AI agent can see this content.
Perfect for personal reminders.
.>
```

---

### 2. Pass-Through Zone `<#.>`

**Purpose:** Documentation that passes to the next agent

**Use when:**
- API documentation
- Context for next agent
- Instructions for handoff
- Technical specifications

**Example:**
```
<#.
This documentation will be passed to the next agent.
Useful for agent-to-agent handoffs.
#.>
```

---

### 3. Active Workspace Zone `<@.>`

**Purpose:** Current agent's active work area

**Use when:**
- Current implementation tasks
- Work in progress
- Active debugging
- Immediate focus areas

**Example:**
```
<@.
Active task: Implement user authentication
Status: In progress
Next step: Add password hashing
@.>
```

---

### 4. AI-Managed Zone `<~.>`

**Purpose:** AI-generated content and metadata

**Use when:**
- Auto-generated summaries
- AI metadata
- Computed statistics
- Agent-produced content

**Example:**
```
<~.
AI-generated summary:
Processing time: 5 minutes
Accuracy: 95%
~.>
```

---

### 5. Sensitive Zone `<$.>`

**Purpose:** Financial or sensitive data

**Use when:**
- API keys (though use env vars!)
- Financial calculations
- Sensitive business data
- Private user information

**Example:**
```
<$.
Budget: $50,000
Revenue target: $200,000
.$>
```

---

### 6. Question Zone `<?.>`

**Purpose:** Questions and uncertainties

**Use when:**
- Open questions
- Uncertainties
- Decision points
- Areas needing clarification

**Example:**
```
<?.
Should we use Redis or PostgreSQL for caching?
What's the expected load?
.?>
```

---

### 7. Benchmark/Bookmark Zone `<.bm>` (Dual-Purpose!)

**Purpose:** Performance metrics OR reference markers

**Context determines meaning:**

**As Benchmark:**
```
<.bm query-performance
Query time: 45ms → 12ms
Speedup: 3.75x
.bm>
```

**As Bookmark:**
```
<.bm important-implementation
Critical security logic here
See auth.ts:245-300
.bm>
```

---

## Zone Nesting

Zones can be nested for complex scenarios:

```
<@. Current task @.>
  <#. This documentation passes through #.>
  <. But this stays private .>
</@.>
```

---

## Best Practices

1. **Use zones consistently** - Establish team conventions
2. **Close zones properly** - Always match opening and closing tags
3. **Don't overuse** - Only use zones when context control matters
4. **Document your usage** - Help other developers understand your intent
5. **Test with agents** - Verify zones work as expected

---

## Quick Start

1. **Start simple:** Use `<.>` for private notes
2. **Add structure:** Use `<@.>` for current work
3. **Enable handoffs:** Use `<#.>` for next agent
4. **Optimize:** Add `<.bm>` for benchmarking

---

## Need Help?

- **Docs:** https://ps-lang.dev/docs
- **Examples:** `.ps-lang/examples/`
- **Issues:** https://github.com/vummo/ps-lang/issues
- **Email:** hello@ps-lang.dev

---

**PS-LANG v0.1.0-alpha.1** - Claude Code Support
