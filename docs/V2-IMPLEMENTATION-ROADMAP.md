# PS-LANG v0.2 Implementation Roadmap

**Status:** Specification complete, parser implementation pending
**Date:** 2025-10-06
**Lead:** Claude Code + RLHF community feedback

---

## ✅ Phase 1: Specification & Documentation (COMPLETE)

### Documents Created

1. **`docs/SYNTAX-V2.md`** - Full specification
   - Privacy-first default behavior
   - Lazy close rules
   - Directional context (`<-.`, `<--.`, `.->`)
   - Selector-based chaining (`<.id:desc .>`)
   - Auto-boundary detection rules
   - Migration guide from v0.1

2. **`docs/SYNTAX-V2-QUICK-REF.md`** - Quick reference card
   - One-page syntax lookup
   - Best practices
   - Common patterns
   - Migration tips

3. **`examples/v2-multi-agent-workflow.psl`** - Working example
   - 4-agent workflow (Research → Write → Edit → SEO)
   - Real-world blog post creation
   - Demonstrates all v0.2 features
   - Meta: Uses PS-LANG to document PS-LANG

### Key Decisions Made

✅ **Privacy-first by default** - `<.` is now the default zone
✅ **Lazy close optional** - Parser auto-detects boundaries
✅ **Backward compatible** - v0.1 syntax still works
✅ **Named zones** - `<.identifier:description .>` for chaining
✅ **Directional context** - `<-.` (backward), `.->` (forward)

---

## 🚧 Phase 2: Parser Implementation (NEXT)

### Core Parser Requirements

**File:** `bin/ps-lang.js` (starting line 586: `extractZones()`)

**Changes needed:**

1. **Lazy Close Detection**
   ```javascript
   // Current regex (explicit close):
   /<\.[\s\S]*?\.>/g

   // New regex (lazy + explicit):
   /<\.\s+(?:(?!<[.@#~$?]|\.>).)*(?:\.>)?/gs

   // Auto-boundary detection:
   // - Stop at next zone tag
   // - Stop at unindented newline
   // - Stop at EOF
   ```

2. **Named Zone Parsing**
   ```javascript
   // Pattern: <.identifier:description text .>
   /<\.([a-zA-Z0-9_-]+):([^\n>]+)\s+([\s\S]*?)\.>/g

   // Extract:
   // - Zone type: <.
   // - Identifier: "auth"
   // - Description: "authentication notes"
   // - Content: actual text
   ```

3. **Directional Context Resolution**
   ```javascript
   // Backward reference: <-.
   /<-+\.([a-zA-Z0-9_.-]*)\s+([\s\S]*?)\.>/g

   // Forward reference: .->
   /[\s\S]*?\.->(?:\s+|$)/g

   // Chain resolution: <-.bm.auth.db
   // Parse as: zone=bm, chain=[auth, db]
   ```

4. **Auto-Boundary Engine**
   ```javascript
   function detectBoundary(content, position) {
     // Rules:
     // 1. Next zone tag → close
     // 2. Unindented newline after indented block → close
     // 3. EOF → close all
     // 4. Explicit close tag → always respect
   }
   ```

### Updated Zone Patterns

```javascript
const zonePatterns = [
  {
    name: 'Default Private (lazy)',
    regex: /<\.\s+(?:(?!<[.@#~$?]|\.>).)*(?:\.>)?/gs,
    color: 'yellow'
  },
  {
    name: 'Default Private (explicit)',
    regex: /<\.[\s\S]*?\.>/g,
    color: 'yellow'
  },
  {
    name: 'Named Zone',
    regex: /<\.([a-zA-Z0-9_-]+):([^\n>]+)\s+([\s\S]*?)\.>/g,
    color: 'cyan',
    extract: ['identifier', 'description', 'content']
  },
  {
    name: 'Backward Reference',
    regex: /<-+\.([a-zA-Z0-9_.-]*)\s+([\s\S]*?)\.>/g,
    color: 'blue',
    extract: ['chain', 'content']
  },
  {
    name: 'Forward Declare',
    regex: /[\s\S]*?\.->(?:\s+|$)/g,
    color: 'green'
  },
  // ... existing patterns for <#., <@., etc.
];
```

### CLI Commands to Update

**`npx ps-lang extract <file>`** - Add v0.2 support
```bash
# Show lazy close zones
# Highlight named zones with identifiers
# Display chain references
# Mark directional lookups
```

**`npx ps-lang validate <file>`** - New validation rules
```bash
# Check named zone uniqueness
# Validate chain references exist
# Detect dangling forward references
# Warn on unclosed complex zones
```

**`npx ps-lang stats`** - Track v0.2 usage
```bash
# Lazy vs explicit close ratio
# Named zone adoption
# Directional reference frequency
# Chain depth analysis
```

---

## 📊 Phase 3: RLHF UX Integration (PLANNED)

### Agentic Feedback Loop System

**Website feature:** `ps-lang.dev/feedback`

**Components:**

1. **Syntax Rating Widget**
   ```jsx
   <SyntaxFeedback
     snippet="<. private note"
     question="Is lazy close intuitive?"
     votes={{ yes: 847, no: 23 }}
   />
   ```

2. **Agent Suggestions Panel**
   ```
   🤖 AI Suggestion: This zone could be named for better chaining

   Current:  <. authentication notes
   Suggested: <.auth:JWT implementation notes

   [Apply] [Dismiss] [Explain]
   ```

3. **Community Voting**
   ```
   💡 Proposed zone: <*.> for wildcard context
   Upvotes: 127 | Downvotes: 8
   Discussion: github.com/vummo/ps-lang/discussions/42
   ```

4. **Usage Heatmap**
   ```
   Zone Adoption (last 30 days):
   ████████████████████ <. (lazy)      89%
   ███████████          <. (explicit)  52%
   ███████              <-.            34%
   ██                   <.id:desc      12%
   ```

### Datastreaming Pipeline

**Tech stack:**
- WebSocket stream from CLI to analytics
- Privacy-preserved metrics (no PII)
- Aggregate usage patterns
- Real-time dashboards

**Metrics tracked:**
```json
{
  "session_id": "anonymous-hash",
  "ps_lang_version": "0.2.0",
  "zones_used": {
    "default_lazy": 15,
    "default_explicit": 3,
    "backward_ref": 2,
    "named_zones": 1
  },
  "file_type": "psl",
  "agent": "claude-code",
  "syntax_errors": 0,
  "performance": {
    "parse_time_ms": 23
  }
}
```

**Privacy guarantees:**
- ✅ No file content sent
- ✅ No identifiable info
- ✅ Opt-in only
- ✅ Local-first processing

---

## 🔄 Phase 4: Parser Optimization (FUTURE)

### Performance Goals

| Operation | Current | Target | Strategy |
|-----------|---------|--------|----------|
| Parse .psl file | ~100ms | <50ms | Lazy evaluation |
| Extract zones | ~50ms | <20ms | Compiled regex |
| Chain resolution | N/A | <10ms | Index-based lookup |
| Validation | ~80ms | <30ms | Incremental checks |

### Advanced Features

1. **Smart auto-complete**
   - Suggest zone types based on context
   - Auto-generate named zone IDs
   - Predict chain references

2. **Zone refactoring**
   ```bash
   npx ps-lang refactor --rename auth:jwt-auth
   # Updates all <-.auth references to <-.jwt-auth
   ```

3. **Conflict resolution**
   ```bash
   npx ps-lang merge file1.psl file2.psl
   # Intelligent zone merging
   # Preserve privacy boundaries
   # Resolve naming conflicts
   ```

---

## 🎯 Implementation Priority

### Sprint 1: Core Parser (2-3 weeks)
- [ ] Implement lazy close regex
- [ ] Add named zone parsing
- [ ] Basic directional context
- [ ] Update `extract` command
- [ ] Unit tests for new patterns

### Sprint 2: Validation & CLI (1-2 weeks)
- [ ] Chain reference validation
- [ ] Auto-boundary detection
- [ ] Enhanced `stats` command
- [ ] Error messages for v0.2 syntax
- [ ] Migration helper tool

### Sprint 3: RLHF UX (3-4 weeks)
- [ ] Build feedback widget
- [ ] Implement usage tracking (opt-in)
- [ ] Create analytics dashboard
- [ ] Community voting system
- [ ] Agent suggestion engine

### Sprint 4: Optimization (2 weeks)
- [ ] Performance profiling
- [ ] Regex optimization
- [ ] Caching layer
- [ ] Incremental parsing
- [ ] Benchmark suite

---

## 📝 Next Actions

### For Development Team

1. **Review specification** (`docs/SYNTAX-V2.md`)
2. **Test example file** (`examples/v2-multi-agent-workflow.psl`)
3. **Implement parser changes** (`bin/ps-lang.js`)
4. **Write unit tests** (create `tests/` directory)
5. **Update README** with v0.2 syntax

### For Alpha Testers

1. **Read quick reference** (`docs/SYNTAX-V2-QUICK-REF.md`)
2. **Try lazy close syntax** in existing .psl files
3. **Experiment with named zones** for large files
4. **Provide feedback** on GitHub Discussions
5. **Report parsing issues** via GitHub Issues

### For Community

1. **Vote on syntax proposals** (coming soon)
2. **Share use cases** for directional context
3. **Suggest new zone types** via RFC process
4. **Contribute parser improvements** (PRs welcome)
5. **Build integrations** (VS Code, Cursor, etc.)

---

## 🚀 Success Metrics

**v0.2-alpha release goals:**

- ✅ Specification complete
- ⏳ Parser implementation (0%)
- ⏳ CLI tools updated (0%)
- ⏳ Alpha testers onboarded (target: 50)
- ⏳ Feedback collected (target: 100 responses)
- ⏳ Syntax refinements based on RLHF (2-3 iterations)

**v0.2-beta release goals:**

- 500+ active users
- 80% lazy close adoption
- <5% parsing error rate
- RLHF feedback loop operational
- Community-driven zone proposals accepted

---

## 📚 Resources

**Documentation:**
- Full spec: `docs/SYNTAX-V2.md`
- Quick ref: `docs/SYNTAX-V2-QUICK-REF.md`
- Example: `examples/v2-multi-agent-workflow.psl`

**Implementation:**
- Parser: `bin/ps-lang.js` (line 586+)
- Config: `.ps-lang/config/ps-lang.config.json`
- Templates: `templates/.ps-lang/`

**Community:**
- GitHub: https://github.com/vummo/ps-lang
- Discussions: https://github.com/vummo/ps-lang/discussions
- Issues: https://github.com/vummo/ps-lang/issues

---

**PS-LANG v0.2** — Privacy-first, context-aware, infinitely extensible

**Status:** Specification phase complete, ready for implementation
**Next milestone:** Parser implementation + alpha testing
