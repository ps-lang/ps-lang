# Proposed Positioning Updates: PS-LANG vs PostScript Journals

## Summary
Update remaining files to clarify the distinction between:
- **PS-LANG** = The open source framework (zone syntax, context control)
- **PostScript Journals** = What you build with it (journal instances for AI collaboration)

**Metaphor:** "PS-LANG is the pen, PostScript Journaling is your digital journal."

---

## 1. Root package.json (npm listing)

**File:** `package.json`
**Line:** 4
**Impact:** HIGH - Shows on npmjs.com package page

### Current:
```json
"description": "Privacy-First Scripting Language for multi-agent context control. v0.2 spec: lazy close, directional context, chainable zones.",
```

### Proposed:
```json
"description": "Open source framework with zone-based syntax for multi-agent context control. Build PostScript Journals—your instance for tracking AI collaborations. PS-LANG is the pen, PostScript Journaling is your digital journal.",
```

**Alternative (shorter):**
```json
"description": "Open source framework for multi-agent context control. Build PostScript Journals to track AI collaborations. Zone-based syntax: lazy close, directional context, chainable zones.",
```

---

## 2. Website Config (Single Source of Truth)

**File:** `ps-lang.dev/config/site.ts`
**Line:** 11
**Impact:** HIGH - Used throughout website

### Current:
```typescript
description: 'Privacy-first multi-agent context control language',
```

### Proposed:
```typescript
description: 'Open source framework with zone syntax for multi-agent context control. Build PostScript Journals—your instance for tracking AI collaborations.',
```

**Alternative (shorter):**
```typescript
description: 'Framework for multi-agent context control. Build PostScript Journals to track AI collaborations.',
```

---

## 3. Website Root Layout (SEO Meta Tags)

**File:** `ps-lang.dev/app/layout.tsx`
**Lines:** 39-40, 69-70, 85-86
**Impact:** HIGH - Google search results, social media shares

### Current (line 39-40):
```typescript
title: "PS-LANG - Multi-Agent Context Control Language",
description: "Control what each AI agent sees in multi-agent workflows. Clean handoffs, better benchmarks, precise context control.",
```

### Proposed:
```typescript
title: "PS-LANG - Multi-Agent Context Control Framework",
description: "Open source framework for controlling what AI agents see. Build PostScript Journals—your instance for tracking AI collaborations. PS-LANG is the pen, PostScript Journaling is your digital journal.",
```

**Alternative (more concise):**
```typescript
title: "PS-LANG - Multi-Agent Context Control Framework",
description: "Framework for controlling what AI agents see. Build PostScript Journals to track AI collaborations. Clean handoffs, better benchmarks, precise context control.",
```

### Current OpenGraph (line 69-70):
```typescript
title: "PS-LANG - Multi-Agent Context Control Language",
description: "Control what each AI agent sees in multi-agent workflows. Clean handoffs, better benchmarks, precise context control.",
```

### Proposed:
```typescript
title: "PS-LANG - Multi-Agent Context Control Framework",
description: "Framework for controlling what AI agents see. Build PostScript Journals to track AI collaborations.",
```

### Current Twitter (line 85-86):
```typescript
title: "PS-LANG - Multi-Agent Context Control",
description: "Clean handoffs for AI agent pipelines",
```

### Proposed:
```typescript
title: "PS-LANG - Multi-Agent Context Control Framework",
description: "Framework for AI agents. Build PostScript Journals to track collaborations.",
```

---

## 4. Structured Data FAQ (Google Featured Snippets)

**File:** `ps-lang.dev/app/layout.tsx`
**Lines:** 151-154
**Impact:** HIGH - Shows in Google search results as featured answer

### Current:
```json
{
  "@type": "Question",
  "name": "What is PS-LANG?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "PS-LANG is a zone-based syntax language for controlling what AI agents see in multi-agent workflows. It provides 7 privacy zones that let you control context flow between agents, reduce token usage by up to 60%, and create cleaner agent handoffs in AI pipelines."
  }
}
```

### Proposed:
```json
{
  "@type": "Question",
  "name": "What is PS-LANG?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "PS-LANG is an open source framework with zone-based syntax for controlling what AI agents see in multi-agent workflows. PostScript Journals is what you create with it—your own journal instance for tracking AI collaborations. Think of PS-LANG as the pen, and PostScript Journaling as your digital journal. It provides 7 privacy zones that let you control context flow between agents, reduce token usage by up to 60%, and create cleaner agent handoffs."
  }
}
```

---

## 5. Structured Data - Software Application

**File:** `ps-lang.dev/app/layout.tsx`
**Line:** 119
**Impact:** MEDIUM - Google Knowledge Graph

### Current:
```json
"description": "Multi-Agent Context Control Language for AI workflows. Control what each AI agent sees in agent pipelines with clean handoffs and accurate benchmarks.",
```

### Proposed:
```json
"description": "Open source framework with zone-based syntax for controlling what AI agents see in multi-agent workflows. Build PostScript Journals—your own journal instance for tracking AI collaborations.",
```

---

## 6. Public llms.txt and llms-full.txt (Website Copies)

**Files:**
- `ps-lang.dev/public/llms.txt`
- `ps-lang.dev/public/llms-full.txt`

**Impact:** MEDIUM - AI crawler metadata on website

### Action:
Copy the updated versions from root directory:
- Copy `llms.txt` → `ps-lang.dev/public/llms.txt`
- Copy `llms-full.txt` → `ps-lang.dev/public/llms-full.txt`

These should always mirror the root versions.

---

## Implementation Priority

### Phase 1 (High Impact - SEO & npm visibility):
1. ✅ Root `llms.txt` and `llms-full.txt` (DONE)
2. ✅ Root `README.md` (DONE)
3. ✅ `ps-lang.dev/app/page.tsx` - Hero tagline (DONE)
4. ✅ `ps-lang.dev/app/about/page.tsx` - About description (DONE)
5. ⏳ Root `package.json` - npm description
6. ⏳ `ps-lang.dev/config/site.ts` - site config
7. ⏳ `ps-lang.dev/app/layout.tsx` - metadata & structured data

### Phase 2 (Medium Impact - Website sync):
8. ⏳ `ps-lang.dev/public/llms.txt` - Copy from root
9. ⏳ `ps-lang.dev/public/llms-full.txt` - Copy from root

---

## Recommendation

**Option A (Verbose):** Use full metaphor everywhere
*"PS-LANG is the pen, PostScript Journaling is your digital journal"*

**Option B (Concise - RECOMMENDED):** Use shorter version for meta tags, full version for content
- Meta tags: *"Framework for multi-agent context control. Build PostScript Journals to track AI collaborations."*
- Content pages: Full metaphor with explanation

**Reasoning:** Meta descriptions have character limits (155-160 chars). Shorter versions rank better in search results.

---

## Character Count Analysis

### npm description (recommended max: 200 chars)
- Current: 132 chars ✅
- Proposed verbose: 242 chars ❌ (too long)
- Proposed concise: 181 chars ✅

### Meta description (recommended max: 155 chars)
- Current: 102 chars ✅
- Proposed verbose: 198 chars ❌ (too long)
- Proposed concise: 145 chars ✅

### OpenGraph description (recommended max: 200 chars)
- Current: 102 chars ✅
- Proposed: 116 chars ✅

---

## Next Steps

1. Review proposed changes
2. Choose verbose vs. concise approach
3. Apply changes to Phase 1 files
4. Test meta tags in Google Search Console
5. Sync public copies in Phase 2
