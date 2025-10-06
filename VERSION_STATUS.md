# PS-LANG Version Status

**Current Version:** v0.2.1-alpha.1
**Release Date:** 2025-10-06
**Status:** Specification Released, Parser Implementation Pending

---

## What's in v0.2.1-alpha.1?

### ✅ Complete

#### Documentation & Specification
- [x] Full v0.2 syntax specification (`docs/SYNTAX-V2.md`)
- [x] Quick reference card (`docs/SYNTAX-V2-QUICK-REF.md`)
- [x] v1 vs v2 comparison guide (`docs/V1-VS-V2-COMPARISON.md`)
- [x] Implementation roadmap (`docs/V2-IMPLEMENTATION-ROADMAP.md`)
- [x] Working multi-agent example (`examples/v2-multi-agent-workflow.psl`)

#### New Syntax Features (Spec Only)
- [x] Privacy-first default `<.` zone
- [x] Lazy close syntax (optional closing tags)
- [x] Directional context (`<-.` backward, `<--.` further back, `.->` forward)
- [x] Named zones (`<.identifier:description`)
- [x] PS chaining (`<-.bm.id1.id2`)
- [x] Auto-boundary detection rules

#### Version Updates
- [x] package.json → v0.2.1-alpha.1
- [x] Config files updated
- [x] llms.txt metadata updated
- [x] Website about page updated
- [x] README with v0.2 notice
- [x] CLI help text updated

### ⏳ Pending (v0.2.1-alpha.2)

#### Parser Implementation
- [ ] Lazy close regex patterns
- [ ] Named zone parsing
- [ ] Directional context resolution
- [ ] Chain reference validation
- [ ] Auto-boundary detection engine

#### CLI Updates
- [ ] `npx ps-lang extract` - v0.2 zone support
- [ ] `npx ps-lang validate` - chain reference checks
- [ ] `npx ps-lang stats` - lazy vs explicit usage metrics
- [ ] Enhanced error messages

#### Testing
- [ ] Unit tests for new syntax patterns
- [ ] Integration tests for parser
- [ ] Example file validation
- [ ] Migration testing (v0.1 → v0.2)

---

## Feature Status Matrix

| Feature | Spec | Parser | CLI | Tests | Docs |
|---------|------|--------|-----|-------|------|
| **v0.1 Syntax** | ✅ | ✅ | ✅ | ✅ | ✅ |
| Privacy-first default | ✅ | ❌ | ⚠️ | ❌ | ✅ |
| Lazy close | ✅ | ❌ | ❌ | ❌ | ✅ |
| Named zones | ✅ | ❌ | ❌ | ❌ | ✅ |
| Directional refs | ✅ | ❌ | ❌ | ❌ | ✅ |
| Chaining | ✅ | ❌ | ❌ | ❌ | ✅ |
| Auto-boundary | ✅ | ❌ | ❌ | ❌ | ✅ |

**Legend:**
- ✅ Complete
- ⚠️ Partial (shows v0.2 notice but no parsing support)
- ❌ Not started

---

## Backward Compatibility

**Guaranteed:** All v0.1 syntax works in v0.2

| v0.1 Syntax | v0.2 Support | Notes |
|-------------|--------------|-------|
| `<. text .>` | ✅ Fully supported | Explicit close still works |
| `<#. text #.>` | ✅ Fully supported | All zone types supported |
| `<@. text @.>` | ✅ Fully supported | No breaking changes |
| `<~. text ~.>` | ✅ Fully supported | All existing patterns work |
| `<$. text $.>` | ✅ Fully supported | 100% compatible |
| `<?. text ?.>` | ✅ Fully supported | Parser unchanged |
| `<.bm text .bm>` | ✅ Fully supported | Dual-purpose maintained |

---

## NPM Package Status

**Published:** `ps-lang@0.2.1-alpha.1`

```bash
# Install
npx ps-lang@alpha init

# Check version
npx ps-lang@alpha version
```

---

## What Users Can Do Now

### ✅ Available

1. **Read the v0.2 spec**
   ```bash
   cat docs/SYNTAX-V2-QUICK-REF.md
   ```

2. **Use v0.2 syntax conceptually**
   - Write with lazy close in mind
   - Plan named zones for large files
   - Design directional references
   - v0.1 parser ignores v0.2 syntax (no errors)

3. **Provide feedback**
   - GitHub Issues: https://github.com/vummo/ps-lang/issues
   - GitHub Discussions: Syntax proposals
   - Email: hello@ps-lang.dev

4. **Use v0.1 syntax fully**
   - All v0.1 features work perfectly
   - CLI tools operational
   - VS Code themes available

### ⏳ Coming Soon (v0.2.1-alpha.2)

1. **Parser support for v0.2 syntax**
2. **Enhanced CLI validation**
3. **Usage metrics tracking**
4. **RLHF feedback system**

---

## Roadmap

### v0.2.1-alpha.1 (Current)
- ✅ Specification released
- ✅ Documentation complete
- ✅ Example files published
- ⏳ Community feedback collection

### v0.2.1-alpha.2 (Next - Est. 2-3 weeks)
- [ ] Parser implementation
- [ ] CLI tool updates
- [ ] Unit tests
- [ ] Alpha testing with 50 users

### v0.2.1-alpha.3 (Est. 4-6 weeks)
- [ ] RLHF feedback system
- [ ] Usage analytics dashboard
- [ ] Performance optimization
- [ ] Syntax refinements based on feedback

### v0.2.1-beta (Est. 8-12 weeks)
- [ ] Production-ready parser
- [ ] Full test coverage
- [ ] VS Code extension
- [ ] ChatGPT integration

### v1.0.0 (Est. 6 months)
- [ ] Stable API
- [ ] Multi-framework support
- [ ] Encryption features
- [ ] Enterprise features

---

## Known Limitations

### Current (v0.2.1-alpha.1)

**Parser:**
- ⚠️ v0.2 syntax not yet parsed (spec-only release)
- ⚠️ `npx ps-lang extract` shows v0.1 zones only
- ⚠️ `npx ps-lang validate` doesn't check chain references

**CLI:**
- ⚠️ No lazy close detection
- ⚠️ No named zone validation
- ⚠️ No directional reference resolution

**Workarounds:**
- Use v0.1 syntax for production
- Use v0.2 syntax for documentation/planning
- Explicitly close complex zones for clarity

---

## How to Report Issues

**Spec Issues:**
- Confusing syntax: GitHub Discussions
- Missing features: GitHub Issues
- Syntax proposals: GitHub Discussions (RFC)

**Parser Issues (when released):**
- Parsing errors: GitHub Issues
- Performance: GitHub Issues
- Edge cases: GitHub Issues + example file

**Documentation:**
- Typos/clarity: GitHub Issues
- Missing examples: GitHub Issues
- Tutorial requests: GitHub Discussions

---

## Credits

**v0.2 Specification:** Claude Code (Anthropic) + Community Feedback
**Implementation:** Pending (Sprint 1 starting soon)
**Testing:** Alpha testers (join at ps-lang.dev)

---

**Last Updated:** 2025-10-06
**Next Review:** Upon v0.2.1-alpha.2 parser implementation
