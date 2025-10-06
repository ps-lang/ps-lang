# PS-LANG v0.2.0-alpha.1 Release Notes

**Release Date:** 2025-10-06
**Type:** Specification Release (Parser implementation pending)
**Status:** Alpha Testing

---

## 🎉 What's New in v0.2

### Specification Released

PS-LANG v0.2 specification is now complete and ready for community feedback! This release focuses on **privacy-first defaults**, **developer ergonomics**, and **multi-agent workflow optimization**.

### Core Features (Specification Only)

#### 1. **Privacy-First Default** 🔒
- `<.` is now the default privacy zone
- Content is private unless explicitly shared
- Lazy close syntax: `<. private note` (no closing tag needed)

**Example:**
```markdown
<. Internal strategy notes - agents won't see this
<#. Public context for next agent .#>
```

#### 2. **Lazy Close Syntax** ⚡
- Optional closing tags for faster annotation
- Parser auto-detects zone boundaries
- Explicit close still supported for complex zones

**Example:**
```markdown
<. Quick private note
<#. Pass-through context
<@. Active workspace
```

#### 3. **Directional Context** ⬅️➡️
- `<-.` - Look backward for previous agent's context
- `<--.` - Look further back in history
- `.->` - Declare for future reference

**Example:**
```markdown
<@.research:findings
Found 3 key insights
.@>

<!-- Later -->
<-.research
Based on findings above...
.>
```

#### 4. **Named Zones & Selector-Based Chaining** 🔗
- Name zones: `<.auth:JWT implementation notes .>`
- Chain references: `<-.bm.auth.db`
- Organize large files with selectors

**Example:**
```markdown
<.auth:authentication notes
JWT with 15min expiry
.>

<.db:database schema
Users table design
.>

<!-- Combine both -->
<.bm.auth.db
Full auth + db flow: 67ms
.bm>
```

#### 5. **Symmetrical Closing Pattern** ⚖️
- Opening symbols **reverse** in closing
- `<@.` → `.@>` (mirrored)
- `<#.` → `.#>` (mirrored)
- Consistent, predictable, visually balanced

---

## 📄 Documentation

### New Files

- **`docs/SYNTAX-V2.md`** - Full v0.2 specification (917 lines)
- **`docs/SYNTAX-V2-QUICK-REF.md`** - Quick reference card
- **`docs/V1-VS-V2-COMPARISON.md`** - Migration guide
- **`docs/V2-IMPLEMENTATION-ROADMAP.md`** - Implementation plan
- **`examples/v2-multi-agent-workflow.psl`** - Working 4-agent example
- **`VERSION_STATUS.md`** - Version tracking document

### Updated Files

- **`README.md`** - Added v0.2 notice and examples
- **`package.json`** - Bumped to v0.2.0-alpha.1
- **`llms.txt`** - Added v0.2 metadata
- **`bin/ps-lang.js`** - Updated CLI messaging
- **Website `/about`** - Updated with v0.2 status

---

## ✅ Backward Compatibility

**100% backward compatible with v0.1**

All v0.1 syntax works perfectly in v0.2:

```markdown
<!-- v0.1 syntax (still works) -->
<. text .>
<#. text .#>
<@. text .@>

<!-- v0.2 adds lazy close (optional) -->
<. text
<#. text
<@. text
```

---

## ⏳ Implementation Status

### ✅ Complete (v0.2.0-alpha.1)

- [x] Full syntax specification
- [x] Documentation (4 spec docs + quick ref)
- [x] Working examples
- [x] Version updates across project
- [x] CLI help text updated
- [x] Website messaging

### 🚧 Pending (v0.2.0-alpha.2)

- [ ] Parser implementation
  - [ ] Lazy close regex patterns
  - [ ] Named zone parsing
  - [ ] Directional context resolution
  - [ ] Chain reference validation
- [ ] CLI tool updates
  - [ ] `npx ps-lang extract` - v0.2 zone support
  - [ ] `npx ps-lang validate` - chain validation
  - [ ] `npx ps-lang stats` - lazy vs explicit metrics
- [ ] Unit tests
- [ ] Alpha testing with community

---

## 🎯 For Alpha Testers

### What You Can Do Now

1. **Read the Spec**
   ```bash
   cat docs/SYNTAX-V2-QUICK-REF.md
   cat docs/SYNTAX-V2.md
   ```

2. **Use v0.2 Syntax Conceptually**
   - Write with lazy close in mind
   - Plan named zones for large files
   - Design directional references
   - Current parser ignores v0.2 syntax (no errors)

3. **Provide Feedback**
   - GitHub Issues: https://github.com/vummo/ps-lang/issues
   - GitHub Discussions: Syntax proposals
   - Email: hello@ps-lang.dev

4. **Continue Using v0.1**
   - All v0.1 features work perfectly
   - CLI tools operational
   - VS Code themes available

### What's Coming (v0.2.0-alpha.2)

- Parser support for all v0.2 syntax
- Enhanced CLI validation
- Usage metrics tracking
- RLHF feedback system

---

## 📊 Breaking Changes

**None.** This release is additive-only and fully backward compatible.

---

## 🐛 Known Limitations

### Current (v0.2.0-alpha.1)

- ⚠️ v0.2 syntax not yet parsed (spec-only release)
- ⚠️ `npx ps-lang extract` shows v0.1 zones only
- ⚠️ No chain reference validation yet

### Workarounds

- Use v0.1 syntax for production workflows
- Use v0.2 syntax for documentation/planning
- Explicitly close complex zones for clarity

---

## 🚀 Installation

### NPM

```bash
# Install CLI globally
npm install -g ps-lang@alpha

# Or use with npx (recommended)
npx ps-lang@alpha init
```

### Check Version

```bash
npx ps-lang@alpha version
```

**Output:**
```
PS-LANG v0.2.0-alpha.1
v0.2 Syntax: Privacy-first default, lazy close, directional context, named zones
Parser Implementation: In Progress (v0.1 syntax fully supported)
```

---

## 📝 Migration Guide

### From v0.1 to v0.2

**No migration required!** v0.1 syntax continues to work.

**To adopt v0.2 features:**

1. Start using lazy close for quick annotations
2. Add named zones to large files
3. Use directional refs in multi-agent workflows
4. Keep explicit close for complex nested zones

**Example Migration:**

```markdown
<!-- Before (v0.1) -->
<@. Research findings: privacy matters .@>
<@. Writing based on research above .@>

<!-- After (v0.2) -->
<@.research:key findings
Privacy is fundamental
.@>

<-.research
Based on findings...
.>
```

---

## 🙏 Credits

- **Specification:** Claude Code (Anthropic) + Community
- **Implementation:** Coming in v0.2.0-alpha.2
- **Testing:** Alpha testers at ps-lang.dev
- **Feedback:** GitHub community

---

## 📞 Support

- **Website:** https://ps-lang.dev
- **GitHub:** https://github.com/vummo/ps-lang
- **Issues:** https://github.com/vummo/ps-lang/issues
- **Discussions:** https://github.com/vummo/ps-lang/discussions
- **Email:** hello@ps-lang.dev

---

## 🔜 What's Next

### v0.2.0-alpha.2 (Est. 2-3 weeks)
- Parser implementation
- CLI updates
- Unit tests
- Alpha testing (50 users)

### v0.2.0-alpha.3 (Est. 4-6 weeks)
- RLHF feedback system
- Usage analytics
- Performance optimization
- Syntax refinements

### v0.2.0-beta (Est. 8-12 weeks)
- Production-ready parser
- Full test coverage
- VS Code extension
- ChatGPT integration

### v1.0.0 (Est. 6 months)
- Stable API
- Multi-framework support
- Encryption features
- Enterprise features

---

**PS-LANG™ v0.2.0-alpha.1** — Privacy-First Agentic Context Control

**Release Status:** Specification Complete ✅ | Parser Pending ⏳
