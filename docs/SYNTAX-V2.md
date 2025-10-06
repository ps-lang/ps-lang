# PS-LANG Syntax v0.2 - Privacy-First Context Control

**Status:** Draft Proposal
**Date:** 2025-10-06
**Breaking Changes:** Yes (backward compatible with lazy parser)

---

## Core Philosophy Change

**v0.1:** 7 zones, explicit closing required
**v0.2:** Privacy-first default `<.` zone with lazy close, directional context, chainable selectors

---

## 1. Privacy-First Default: `<.` Zone

### The New Default Behavior

Every prompt starts with implicit privacy. The `<.` syntax is now the **default privacy zone**:

```markdown
<. This is private by default

No closing tag needed for simple single-line zones.
The parser auto-detects context boundaries.
```

**Rules:**
- ✅ **Lazy close**: `<. text` (no closing required)
- ✅ **Auto-boundary detection**: Parser infers where zone ends
- ✅ **Privacy-first**: Content is agent-blind unless explicitly marked otherwise
- ✅ **Complex prompts**: Use explicit closing `<. text .>` for clarity

### Examples

```markdown
<!-- Simple (lazy close) -->
<. Private note about implementation approach

<!-- Explicit close (recommended for multi-line) -->
<.
Private strategy notes
Multiple lines
Still private
.>

<!-- Mixed: lazy + explicit -->
<. Quick private thought
<#. Public context for next agent #.>
<. Another private note
```

---

## 2. Directional Context Windows

### Backward Context Lookup

**Syntax:** `<-.` (look backward) and `<--.` (look further backward)

```markdown
<. Initial context here

<-.
Reference previous context
This zone has awareness of everything BEFORE it
.>

<--.
Reference even older context
Looks further back in the conversation/file
.>
```

**Use cases:**
- Agent handoffs: "Based on what the previous agent did..."
- Incremental refinement: "Building on the earlier analysis..."
- Context inheritance: "Using the same approach as before..."

### Forward Context Lookup

**Syntax:** `.->` (look forward)

```markdown
<-.bm
This benchmark will be referenced later
Declare metrics here
.->

<!-- Later in file -->
<. Use metrics from the benchmark above
```

**Use cases:**
- Declare-before-use patterns
- Setup context for future agents
- Forward planning annotations

---

## 3. Selector-Based Chaining & Named Zones

### Named Zones

**Syntax:** `<.identifier:description .>`

```markdown
<.auth:authentication strategy notes
Using JWT with 15min expiry
Refresh token rotation enabled
.>

<!-- Reference it later -->
<-.bm.auth
Benchmark based on auth strategy above
Login time: 45ms
Token gen: 12ms
.>
```

### Chaining Pattern

```markdown
<!-- Define multiple named zones -->
<.db:database schema
Users table: id, email, created_at
.>

<.api:api endpoints
GET /users
POST /users
.>

<!-- Chain reference -->
<-.bm.db.api
Benchmark for database + API interaction
Query time: 23ms
API response: 67ms
.>
```

**Rules:**
- Identifiers use `:` separator: `<.identifier:description`
- References use `.` chain: `<-.bm.identifier1.identifier2`
- Case-sensitive by default
- Alphanumeric + hyphen + underscore allowed

---

## 4. Zone Permissions Model (Updated)

### Privacy Levels

**Symmetrical Closing Rule:** Opening symbols **reverse** in closing (mirrored pattern)

| Zone | Opening | Closing (Symmetrical) | Privacy | Export | Public Agentic Tags | Private Agentic Tags |
|------|---------|----------------------|---------|--------|---------------------|----------------------|
| **Default Private** | `<.` | `.>` | Agent-blind | ❌ | ❌ | ✅ |
| **Pass-Through** | `<#.` | `.#>` | Next agent only | ✅ | ✅ | ❌ |
| **Active Workspace** | `<@.` | `.@>` | Current agent | ✅ | ✅ | ✅ |
| **AI-Managed** | `<~.` | `.~>` | All agents | ✅ | ✅ | ✅ (meta only) |
| **Business** | `<$.` | `.$>` | Strategic only | ❌ | ❌ | ✅ |
| **Question** | `<?.` | `.?>` | Flag for resolution | ✅ | ✅ | ✅ |
| **Benchmark** | `<.bm` | `.bm>` | Public metrics | ✅ | ✅ | ❌ (PII blocked) |

**Note:** All zones support lazy close (no closing tag) with auto-boundary detection

### Agentic Meta Tags

```markdown
<~.
public_meta_tags: {
  "project": "ps-lang",
  "version": "0.2.0",
  "context_type": "multi-agent-handoff"
}
~.>

<.
private_meta_tags: {
  "internal_notes": "still testing this approach",
  "confidence_level": "medium",
  "review_required": true
}
.>
```

---

## 5. Parser Rules for Lazy Close

### Auto-Boundary Detection

The parser uses these rules to detect zone boundaries:

1. **Newline + New zone tag** → Close previous zone
2. **Newline + Unindented text** → Close previous zone
3. **Explicit close tag** → Always respected
4. **End of file** → Close all open zones

### Examples

```markdown
<!-- Auto-close on new zone -->
<. Private note
<#. Public context #.>
<!-- First zone auto-closed -->

<!-- Auto-close on unindented text -->
<. Private note
  Still part of zone (indented)
Back to normal text
<!-- Zone auto-closed -->

<!-- Explicit close always works -->
<. Private note .>
<. Another note .>
```

### Recommended Practices

- ✅ **Single-line lazy**: `<. quick note`
- ✅ **Multi-line explicit**: `<. multiple\nlines\n.>`
- ✅ **Complex nested**: Always use explicit closing
- ⚠️ **Mixed approach**: Works but less readable

---

## 6. Directional Syntax Summary

| Syntax | Direction | Scope | Use Case |
|--------|-----------|-------|----------|
| `<.` | Current | This zone only | Default privacy |
| `<-.` | Backward | Previous context | Reference earlier work |
| `<--.` | Far backward | Older context | Deep history lookup |
| `.->` | Forward | Future context | Declare for later use |
| `<.id:desc` | Named | Chainable reference | Selector-based chaining |

---

## 7. Migration from v0.1

### Backward Compatibility

**v0.1 syntax (backward compatible):**

```markdown
<!-- v0.1 explicit close pattern -->
<. text .>
<#. text .#>
<@. text .@>
<~. text .~>
<$. text .$>
<?. text .?>
```

**v0.2 adds lazy close:**

```markdown
<!-- v0.2 lazy style (no closing tag) -->
<. text
<#. text
<@. text
<~. text
```

### Migration Strategy

1. **Keep using explicit close** for complex multi-line zones
2. **Adopt lazy close** for simple single-line annotations
3. **Add directional syntax** where context awareness helps
4. **Use named zones** for large files with many references

---

## 8. Full Example: Multi-Agent Workflow

```markdown
<~.
meta-tags: {
  "workflow": "research-to-blog",
  "agents": ["researcher", "writer", "editor"],
  "ps_lang_version": "0.2.0"
}
~.>

<!-- Agent 1: Researcher -->
<@.research-findings:research agent findings
Found 3 key papers on context control
Privacy concerns in multi-agent systems
Current solutions lack flexibility
.@>

<. Internal research notes not for publication

<#.writer:instructions for writing agent
Write a blog post based on research findings above
Target audience: developers using AI tools
Tone: technical but accessible
Length: 1200-1500 words
.#>

<!-- Agent 2: Writer -->
<-.research-findings
Based on the research above, here's my draft...
.->

<.draft:blog post draft
# Context Control in Multi-Agent AI Systems

[Draft content here...]
.>

<. Writer notes: need better intro, ending feels rushed

<!-- Agent 3: Editor -->
<-.draft
Editing the draft above...
.->

<.bm.draft
Readability score: 78/100
SEO score: 82/100
Word count: 1,340
.>

<?.editor:questions for review
Should we add code examples?
Is the technical depth appropriate?
.?>
```

---

## 9. Next Steps

### For Alpha Testing

- [ ] Implement lazy close parser
- [ ] Add directional context resolution
- [ ] Support named zone chaining
- [ ] Update CLI validation
- [ ] Create interactive examples
- [ ] Build RLHF UX feedback system

### For Beta

- [ ] Agentic pipeline datastreaming
- [ ] Public/private meta tag separation
- [ ] Context window lookup optimization
- [ ] VS Code extension with syntax highlighting
- [ ] Real-time zone boundary visualization

---

## 10. Feedback Loop

**RLHF UX Integration:**
- Users rate syntax clarity: ⭐⭐⭐⭐⭐
- Agents suggest auto-improvements
- Community voting on new zone types
- Real-time syntax validation in editor

**Agentic Datastreaming:**
- Stream zone usage metrics
- Track lazy vs explicit close adoption
- Measure directional reference patterns
- Optimize parser based on real usage

---

**PS-LANG v0.2 Syntax** — Privacy-first, context-aware, infinitely extensible

**Status:** Draft for community feedback
**Contribute:** https://github.com/vummo/ps-lang/discussions
