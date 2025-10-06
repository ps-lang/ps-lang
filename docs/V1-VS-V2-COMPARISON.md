# PS-LANG: v0.1 vs v0.2 Syntax Comparison

**Side-by-side comparison** of what changed and why

---

## Philosophy Shift

| Aspect | v0.1 | v0.2 |
|--------|------|------|
| **Default** | No default zone | Privacy-first `<.` default |
| **Closing** | Always required | Lazy close optional |
| **Context** | Static zones only | Directional context lookups |
| **References** | Manual copy-paste | Chainable named zones |
| **Focus** | Zone definition | Zone relationships |

---

## Basic Syntax

### Private Notes

**v0.1:**
```markdown
<. Private note - must close .>
<. Another private note .>
```

**v0.2:**
```markdown
<. Private note - lazy close works
<. Another private note
<. Or use explicit close .>
```

**Why:** Reduces friction, faster annotation

---

## Multi-Line Zones

### Complex Content

**v0.1:**
```markdown
<.
Private multi-line
Must have explicit close
.>
```

**v0.2:**
```markdown
<.
Private multi-line
Still recommend explicit close for clarity
.>

<!-- OR lazy close: -->
<. Private note that auto-closes when next zone starts
<#. Next zone here triggers auto-close
```

**Why:** Flexibility without breaking existing usage

---

## Closing Syntax Rules

### Symmetrical Closing Pattern

**v0.1:** Explicit closing required, must match opening
**v0.2:** Lazy close optional, symmetrical closing recommended

**Symmetry Rule:** Opening symbols **reverse** in closing (mirrored)

```markdown
<!-- All zones follow symmetrical reversal pattern -->
<. text .>       # Default: stays same
<#. text .#>     # Pass-through: <#. reverses to .#>
<@. text .@>     # Active: <@. reverses to .@>
<~. text .~>     # AI-managed: <~. reverses to .~>
<$. text .$>     # Business: <$. reverses to .$>
<?. text .?>     # Question: <?. reverses to .?>
<.bm text .bm>   # Benchmark: multi-char stays same

<!-- v0.2 lazy close (no closing tag needed) -->
<. text
<#. text
<@. text
```

**Why:** Consistent mirror pattern, predictable, and visually balanced

---

## Agent Handoffs

### Pass Context Between Agents

**v0.1:**
```markdown
<#.
Agent B: Use the findings from above
(Manual reference, no automatic lookup)
.#>
```

**v0.2:**
```markdown
<@.research:findings from agent A
Found 3 key insights
.@>

<!-- Later: -->
<-.research
Based on agent A's research above...
Automatic context awareness
.>
```

**Why:** Eliminates manual context management

---

## Large Files with Many Zones

### Organization & Reference

**v0.1:**
```markdown
<. Database notes here .>
<. API notes here .>
<.bm
Combined benchmark
Must manually describe what's being measured
.bm>
```

**v0.2:**
```markdown
<.db:database schema notes
Users table design
.>

<.api:endpoint documentation
GET /users
.>

<.bm.db.api:combined benchmark
Database + API interaction
Query: 23ms
Response: 44ms
Total: 67ms
.bm>
```

**Why:** Named zones + chaining = scalable organization

---

## Benchmark Tracking

### Performance Metrics

**v0.1:**
```markdown
<.bm authentication-flow
login: 45ms
token_gen: 12ms
.bm>
```

**v0.2:**
```markdown
<!-- Simple -->
<.bm.auth login: 45ms, token: 12ms .bm>

<!-- Or declare for future use -->
<.bm.auth Setup benchmark .->

<!-- Later: reference it -->
<-.bm.auth
Metrics improved by 15%
.>
```

**Why:** Bidirectional references, easier tracking

---

## Multi-Agent Workflow

### Research → Write → Edit Pipeline

**v0.1:**
```markdown
<!-- Agent 1 -->
<@. Research findings:
Found 3 papers
Privacy is important
.@>

<!-- Agent 2 -->
<@. Writing phase:
(Must manually restate research findings)
Based on privacy research...
.@>

<!-- Agent 3 -->
<@. Editing phase:
(Must manually check both above)
Review research and writing
.@>
```

**v0.2:**
```markdown
<!-- Agent 1 -->
<@.research:key findings
Found 3 papers on privacy
.@>

<!-- Agent 2 -->
<-.research
Based on findings above...
.->

<.draft:blog post content
# Article here
.>

<!-- Agent 3 -->
<-.draft
Editing the draft...
.>

<.bm.draft
Word count: 1,340
Readability: 78/100
.>
```

**Why:** Explicit relationships, less redundancy, clearer pipeline

---

## Privacy Levels

### What Agents See

**v0.1:**
```markdown
<. Private (agent-blind) .>
<#. Pass-through (next agent only) .#>
<@. Active workspace (current agent) .@>
<~. AI-managed (all agents) .~>
<$. Business (strategic) .$>
<?. Questions .?>
<.bm Benchmarks .bm>
```

**v0.2:**
```markdown
<!-- Same zones, but now: -->

<. Private - DEFAULT, lazy close works
<#. Pass-through - lazy close .#>
<@. Active - lazy close .@>
<~. AI-managed - lazy close .~>
<$. Business - lazy close .$>
<?. Questions - lazy close .?>
<.bm Benchmarks - lazy close .bm>

<!-- PLUS directional: -->
<-. Look backward for context .>
<--. Look further backward .>
<.bm Setup for later .->

<!-- PLUS named: -->
<.auth:notes about JWT .>
<-.bm.auth reference it later .>
```

**Why:** Same power, more flexibility, better relationships

---

## Migration Strategy

### Backward Compatibility

**Good news:** All v0.1 syntax still works in v0.2!

**v0.1 files:**
```markdown
<. Old style with explicit close .>
<#. Still works perfectly .#>
```

**New v0.2 features (opt-in):**
```markdown
<. Use lazy close when it helps
<-.old-zone reference old zones from new syntax
```

**Gradual adoption:**
1. Keep using explicit close for complex zones
2. Try lazy close for quick annotations
3. Add named zones to large files
4. Use directional refs in multi-agent workflows

---

## Real-World Comparison

### Example: Blog Post Workflow

**v0.1 approach:**
```markdown
<@. Research phase: Found 3 papers .@>
<@. Writing phase: Based on research... .@>
<@. Editing phase: Reviewed above... .@>
<.bm final: 1,340 words .bm>
```

**v0.2 approach:**
```markdown
<@.research:initial findings
Found 3 papers on AI privacy
.@>

<-.research
Using findings above...
.->

<.draft:blog content
# Blog post here
.>

<-.draft
Editing...
.>

<.bm.draft
Word count: 1,340
SEO score: 82/100
.>
```

**Difference:**
- ✅ Named zones: Easier to reference
- ✅ Directional refs: Automatic context
- ✅ Chaining: `<-.bm.draft` is self-documenting
- ✅ Privacy maintained: Same security model

---

## Feature Comparison Table

| Feature | v0.1 | v0.2 | Impact |
|---------|------|------|--------|
| Zone types | 7 | 7 | Same |
| Closing required | Always | Optional (lazy) | 🚀 Faster |
| Named zones | ❌ | ✅ `<.id:desc` | 🎯 Organized |
| Directional refs | ❌ | ✅ `<-.` `<--.` `.->` | 🔗 Context-aware |
| Chaining | ❌ | ✅ `<-.bm.id1.id2` | 📊 Scalable |
| Privacy model | Explicit | Privacy-first default | 🔒 Secure |
| Backward compat | N/A | ✅ 100% | ✨ Safe upgrade |

---

## When to Use v0.2 Features

**Lazy close:**
- ✅ Quick single-line annotations
- ✅ Rapid prototyping
- ⚠️ Complex multi-line (use explicit)

**Named zones:**
- ✅ Large files (>50 lines)
- ✅ Many zones to reference
- ⚠️ Simple files (overkill)

**Directional refs:**
- ✅ Multi-agent workflows
- ✅ Pipeline architectures
- ⚠️ Single-agent tasks (not needed)

**Chaining:**
- ✅ Combined benchmarks
- ✅ Complex relationships
- ⚠️ Simple references (use `<-.id`)

---

## Summary

**v0.1:** Explicit, structured, zone-focused
**v0.2:** Privacy-first, context-aware, relationship-focused

**Both work together.** Choose what fits your workflow.

**Try v0.2 today:**
```bash
npx ps-lang@alpha --init
# Read docs/SYNTAX-V2-QUICK-REF.md
# See examples/v2-multi-agent-workflow.psl
```

**PS-LANG: Control what AI agents see**
