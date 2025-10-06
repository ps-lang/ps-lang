# PS-LANG v0.2 Quick Reference

**Privacy-first by default** · **Lazy close** · **Directional context** · **Chainable context selectors**

---

## 🔒 Privacy-First Default

```markdown
<. This is private by default (lazy close - no closing needed)

<. Multi-line private
Still private
.>
```

**Rule:** All prompts start private unless explicitly marked otherwise.

---

## ⬅️ Directional Context

| Syntax | Direction | Use Case |
|--------|-----------|----------|
| `<-.` | Look backward | Reference previous context |
| `<--.` | Look far back | Reference older context |
| `.->` | Look forward | Declare for future use |

**Examples:**

```markdown
<. Initial context

<-.
Reference context above
Inherits previous agent's work
.>

<.bm Setup metrics .->
<!-- Later: reference this benchmark -->
```

---

## 🔗 Chainable Selectors

**Named zones:**

```markdown
<.auth:authentication notes
JWT with 15min expiry
.>

<.db:database schema
Users table design
.>
```

**Chain references:**

```markdown
<-.bm.auth.db
Benchmark combining auth + database
Login flow: 67ms total
.>
```

---

## 📋 Zone Syntax Table

**Symmetrical Closing Rule:** Opening symbols reverse in closing (mirrored)

| Zone | Lazy | Explicit (Symmetrical) | Named (Symmetrical) | Privacy |
|------|------|------------------------|---------------------|---------|
| Default | `<. text` | `<. text .>` | `<.id:desc .>` | Private |
| Pass-through | `<#. text` | `<#. text .#>` | `<#.id:desc .#>` | Next agent |
| Active | `<@. text` | `<@. text .@>` | `<@.id:desc .@>` | Current agent |
| AI-managed | `<~. text` | `<~. text .~>` | `<~.id:desc .~>` | All agents |
| Business | `<$. text` | `<$. text .$>` | `<$.id:desc .$>` | Strategic |
| Question | `<?. text` | `<?. text .?>` | `<?.id:desc .?>` | Resolution |
| Benchmark | `<.bm text` | `<.bm text .bm>` | `<.bm.id text .bm>` | Public metrics |

**Closing Patterns:**
- **Lazy:** No closing tag (parser auto-detects boundary)
- **Symmetrical:** Opening symbols **reverse** in closing (e.g., `<@.` → `.@>`)
- **Universal:** All zones can also close with `.>` (universal closer)
- **Minimal:** All zones can close with just `>` (space + `>`)

---

## 🎯 Best Practices

### Simple Single-Line
✅ Use lazy close
```markdown
<. Private note
<#. Context for next agent
```

### Complex Multi-Line
✅ Use explicit close
```markdown
<.
Multiple lines
More context
Explicit close for clarity
.>
```

### Large Files with References
✅ Use named zones + chaining
```markdown
<.api:endpoint definitions
GET /users
POST /users
.>

<-.bm.api
Response time: 45ms
.>
```

---

## 🔄 Auto-Boundary Detection

Parser auto-closes zones when:
1. New zone tag appears → `<. zone1` then `<#. zone2` (zone1 auto-closes)
2. Unindented text → Back to normal markdown
3. End of file → All zones close
4. Explicit close → Always respected

---

## 🧪 Full Example

```markdown
<~.
meta-tags: {
  "workflow": "multi-agent",
  "ps_lang_version": "0.2.0"
}
.~>

<@.research:research findings
Found 3 papers on AI context control
Key insight: privacy must be default
.@>

<. Internal notes: need more sources on RLHF

<#.writer:instructions
Write blog based on research above
Target: developers
Length: 1200 words
.#>

<-.research
Using findings from research zone...
.->

<.draft:blog content
# Blog post here
.>

<.bm.draft
Word count: 1,340
SEO score: 82/100
.>

<?.review:questions
Add code examples?
.?>
```

---

## 📦 Migration from v0.1

**Backward compatible:** All v0.1 syntax still works

**New in v0.2:**
- ✅ Lazy close (optional)
- ✅ Directional context (`<-.`, `<--.`, `.->`)
- ✅ Named zones (`<.id:description`)
- ✅ Chaining (`<-.bm.id1.id2`)
- ✅ Privacy-first default

---

**PS-LANG v0.2** — Control what AI agents see in Agentic Pipelines
**Learn more:** https://ps-lang.dev
