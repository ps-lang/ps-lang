# Typography Guidelines - Preventing Widows & Orphans

This guide explains how to prevent awkward text wrapping (widows, orphans, and single-word line breaks) across the PS-LANG application.

## The Problem

**Widow**: A single word or very short line at the end of a paragraph
**Orphan**: A single word or short line at the beginning of a new column/page

Example of bad wrapping:
```
PS-LANG is in alpha R&D with RLHF Agentic UX built in. Your interactions help train privacy-first multi-agent systems. Settings may evolve as we refine the
platform.
```

## Solutions

### 1. CSS-Only Solution (Recommended)

Use the `text-pretty` utility class for most text content:

```tsx
<p className="text-xs text-stone-600 leading-relaxed text-pretty max-w-2xl">
  Your long paragraph text here...
</p>
```

**When to use:**
- Body text, descriptions, notices
- Any paragraph longer than 2 lines
- Content that needs to look professional

**Browser Support:**
- Chrome 117+
- Safari 17.5+
- Firefox (experimental)
- Falls back gracefully on unsupported browsers

### 2. Text Balance (For Headlines)

Use `text-balance` for short text that should wrap evenly:

```tsx
<h1 className="text-3xl font-light text-stone-900 text-balance">
  Master Your AI Workflows
</h1>
```

**When to use:**
- Headlines (h1, h2, h3)
- Short callouts or pull quotes
- Button text that might wrap

### 3. JavaScript Solution (For Dynamic Content)

Use the `preventWidow()` or `preventOrphan()` utilities:

```tsx
import { preventWidow, preventOrphan } from '@/lib/typography-utils'

// Prevent last word from being alone
const text = preventWidow("Settings may evolve as we refine the platform.")
// Output: "Settings may evolve as we refine the\u00A0platform."

// Keep last 3 words together
const text = preventOrphan("Settings may evolve as we refine the platform.", 3)
// Output: "Settings may evolve as we refine\u00A0the\u00A0platform."
```

**When to use:**
- Dynamically generated content
- User-submitted text
- Content from APIs or databases

### 4. Manual Non-Breaking Spaces

For specific phrases that should always stay together:

```tsx
<p>
  PS-LANG is in alpha R&D with RLHF Agentic UX built{'\u00A0'}in.
</p>
```

**Common phrases to keep together:**
- "built in" → "built\u00A0in"
- "the platform" → "the\u00A0platform"
- "for example" → "for\u00A0example"
- "such as" → "such\u00A0as"
- "may not" → "may\u00A0not"

## Best Practices

### 1. Combine with Max-Width

Always pair text wrapping utilities with max-width constraints:

```tsx
<p className="text-xs text-pretty max-w-2xl">
  {/* Prevents lines from being too long */}
</p>
```

**Recommended max-widths:**
- Body text: `max-w-2xl` (42rem / ~672px)
- Descriptions: `max-w-xl` (36rem / ~576px)
- Notices/alerts: `max-w-3xl` (48rem / ~768px)
- Headlines: `max-w-4xl` (56rem / ~896px)

### 2. Use Semantic Line Length

Optimal reading comfort: **45-75 characters per line**

```tsx
// Too wide - hard to read
<p className="text-xs">Long text...</p>

// Better - comfortable reading
<p className="text-xs max-w-2xl text-pretty">Long text...</p>
```

### 3. Apply Consistently

Add `text-pretty` to all multi-line text elements:

```tsx
// ✅ Good
<div className="space-y-4">
  <p className="text-sm text-pretty max-w-2xl">First paragraph...</p>
  <p className="text-sm text-pretty max-w-2xl">Second paragraph...</p>
</div>

// ❌ Bad - inconsistent wrapping
<div className="space-y-4">
  <p className="text-sm">First paragraph...</p>
  <p className="text-sm text-pretty">Second paragraph...</p>
</div>
```

## Quick Reference

| Use Case | Solution | Example |
|----------|----------|---------|
| Body paragraphs | `text-pretty max-w-2xl` | Descriptions, notices |
| Headlines | `text-balance` | h1, h2, h3 |
| Short text | `max-w-xl` + manual spaces | Button text, labels |
| Dynamic content | `preventWidow()` / `preventOrphan()` | API responses |
| Specific phrases | Manual `\u00A0` | "built in", "the platform" |

## Implementation Checklist

When adding new text content, ask:

- [ ] Is this text longer than 2 lines? → Add `text-pretty`
- [ ] Is this a headline? → Add `text-balance`
- [ ] Does it have a max-width? → Add appropriate `max-w-*`
- [ ] Are there common phrases that break awkwardly? → Add `\u00A0`
- [ ] Is this dynamic/user content? → Use `preventWidow()` utility

## Examples in Codebase

### Settings Page Alpha Notice
```tsx
<p className="text-xs text-stone-600 leading-relaxed text-pretty max-w-2xl">
  PS-LANG is in alpha R&D with RLHF Agentic UX built in...
</p>
```

### Hero Section Headline
```tsx
<h1 className="text-4xl font-light tracking-tight text-balance">
  Master Your AI Workflows
</h1>
```

### Profile Description
```tsx
<p className="text-sm text-stone-600 text-pretty max-w-xl">
  {bio || "Add a bio to tell others about yourself"}
</p>
```

## Browser Fallback

For browsers that don't support `text-wrap: pretty`:

```css
/* Automatically falls back to normal wrapping */
.text-pretty {
  text-wrap: pretty; /* Modern browsers */
  /* No fallback needed - degrades gracefully */
}
```

## Additional Resources

- [CSS text-wrap on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
- [Typography best practices](https://practicaltypography.com/)
- [Butterick's Practical Typography - Line Breaking](https://practicaltypography.com/line-breaking.html)
