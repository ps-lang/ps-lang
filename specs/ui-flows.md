# PS-LANG Playground UI Flows & States

<~.
meta-tags: {
  "doc_type": "technical-spec",
  "component": "ui-flows",
  "version": "0.1",
  "date": "2025-10-01",
  "scope": "control-states-animations-skeleton"
}
~.>

---

## Control Bar States

### Model Selector

**States:**
- `idle` - ready for selection
- `changing` - transition animation active
- `disabled` - during simulation run

**Transitions:**
```
idle → changing (user clicks different model)
changing → idle (300ms easeInOut complete)
idle → disabled (simulation starts)
disabled → idle (simulation complete)
```

**Animation:**
- Opacity fade: 1 → 0.6 → 1
- No layout shift
- Duration: 300ms easeInOut

### Scenario Selector

**States:**
- `idle` - ready for selection
- `changing` - loading new scenario config
- `disabled` - during simulation run

**Transitions:**
```
idle → changing (user selects scenario)
changing → idle (config loaded, ~250ms)
```

**Loading Treatment:**
- Skeleton shimmer on chart area
- Control bar remains visible
- Delta pills fade to skeleton

### PS-LANG Toggle

**States:**
- `off` - PS-LANG disabled
- `on` - PS-LANG enabled
- `transitioning` - computing deltas
- `disabled` - during other control changes

**Visual:**
```
OFF: gray background, "OFF" label
ON: brand-green background, "ON" label
Transitioning: pulse animation
```

**Animation:**
- Toggle switch: 350ms easeInOut
- Chart bars: stagger 100ms delay per bar
- Delta pills: fade + slide up 200ms

### Metric View Tabs

**States:**
- `tokens | latency | cost | rounds | osm | savings`
- `active` - currently displayed
- `inactive` - clickable
- `disabled` - during transition

**Transitions:**
```
inactive → active (user clicks)
active → inactive (other tab selected)
```

**Animation:**
- Tab underline: slide to new position (300ms easeInOut)
- Chart data: crossfade (250ms)
- Y-axis labels: fade out → fade in (200ms)

### Disclosure Level

**States:**
- `public` - basic metrics only
- `passthrough` - + coarse weights
- `private_demo` - + full precision (simulated)

**Visual Indicators:**
```
Public: neutral gray chip
Pass-through: blue info chip
Private: amber warning chip
```

**Affected UI:**
- Right-rail detail panel
- Export preview
- OSM formula display

### Seed Control

**States:**
- `locked` - current seed
- `editing` - user typing new seed
- `rolling` - random seed generation

**Actions:**
```
Re-roll button: generates random seed (1–999999)
Input field: accepts manual seed entry
Lock icon: shows seed is immutable per run
```

---

## Main Visualization States

### Bar Chart

**States:**
- `empty` - no data yet
- `loading` - skeleton shimmer
- `baseline` - no PS-LANG (single bar)
- `comparison` - PS-LANG ON (dual bars)
- `transitioning` - animating between states

**Loading Skeleton:**
```
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░  │ ← shimmer effect
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░  │
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────┘
```

**Animation Specs:**
- Bar height change: 300ms easeInOut
- Bar color transition: 200ms
- Dual bar layout shift: transform-only (no reflow)
- Savings overlay: fade in 150ms delay

**Transform-Only Rule:**
```css
/* Allowed */
transform: scaleY(0.8);
transform: translateX(20px);
opacity: 0.5;

/* Forbidden */
height: 250px; /* causes reflow */
width: 100%; /* causes reflow */
margin-left: 10px; /* causes reflow */
```

### Delta Pills

**States:**
- `hidden` - PS-LANG OFF
- `visible` - PS-LANG ON
- `animating` - entrance animation
- `updating` - metric change

**Pill Structure:**
```
┌─────────────────┐
│ Tokens  −21%   │ ← green if positive delta
└─────────────────┘
┌─────────────────┐
│ Latency −15%   │
└─────────────────┘
```

**Animation:**
```
Entrance: slide up + fade in (200ms easeInOut)
Stagger: 50ms delay per pill
Update: scale pulse (150ms)
```

**Color Logic:**
```
Positive delta (savings): green
Negative delta (cost): red
Neutral (no change): gray
OSM: always blue (informational)
```

### Run Log Card

**States:**
- `empty` - no runs yet
- `populated` - 1–5 runs
- `full` - 5 runs (auto-trim oldest)

**Entry Format:**
```
┌────────────────────────────────────────┐
│ Claude Sonnet 4.5 · Multi-Tool Agent   │
│ PS-LANG ON · Tokens −21% · 42 seed     │
│ 2min ago                               │
└────────────────────────────────────────┘
```

**Animation:**
- New entry: slide down from top (300ms)
- Oldest removal: fade out + slide up (200ms)

---

## Modal States

### Methodology Modal

**States:**
- `closed` - not visible
- `opening` - fade + scale entrance
- `open` - interactive
- `closing` - fade + scale exit

**Tabs:**
```
┌─────────────────────────────────┐
│ Assumptions | Formulas | Disclosure │ ← tab bar
├─────────────────────────────────┤
│                                 │
│   [Tab Content]                 │
│                                 │
└─────────────────────────────────┘
```

**Tab Transition:**
- Content: crossfade (200ms)
- Tab underline: slide (300ms easeInOut)

**Modal Animation:**
```
Opening:
- Backdrop: opacity 0 → 0.5 (200ms)
- Modal: scale(0.95) → scale(1) + opacity 0 → 1 (300ms easeInOut)

Closing:
- Reverse of opening
```

### Export Preview

**States:**
- `hidden` - export not triggered
- `generating` - preparing data
- `ready` - preview visible
- `copied` - confirmation state

**Actions:**
```
Download CSV → triggers browser download
Copy JSON → clipboard + "Copied!" toast (2s)
Copy Methodology → formatted text to clipboard
```

---

## Skeleton Loading Patterns

### Chart Skeleton

```html
<div class="skeleton-shimmer">
  <div class="skeleton-bar" style="width: 60%; height: 180px"></div>
  <div class="skeleton-bar" style="width: 75%; height: 220px"></div>
  <div class="skeleton-bar" style="width: 45%; height: 140px"></div>
</div>
```

**Shimmer Effect:**
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}
```

### Delta Pills Skeleton

```
┌─────────────────┐
│ ▓▓▓▓▓ ▓▓▓▓    │ ← gray shimmer
└─────────────────┘
```

---

## Error States

### Simulation Error

**Trigger:** Invalid seed or computation error

**Display:**
```
┌────────────────────────────────┐
│ ⚠️ Simulation Error            │
│ Unable to generate results.    │
│ [Try Different Seed]           │
└────────────────────────────────┘
```

**Recovery:**
- Auto-revert to last valid state
- Suggest seed re-roll
- Log error to console (don't expose to user)

### No Data

**Trigger:** First load before any simulation

**Display:**
```
┌────────────────────────────────┐
│ Select model & scenario        │
│ to see PS-LANG impact          │
└────────────────────────────────┘
```

---

## Responsive Breakpoints

### Desktop (≥1024px)

```
┌──────────────────────────────────────┐
│ Control Bar (full width)             │
├────────────────────┬─────────────────┤
│  Chart (70%)       │  Run Log (30%)  │
│                    │                 │
│  Delta Pills       │  Details Panel  │
└────────────────────┴─────────────────┘
```

### Tablet (768px – 1023px)

```
┌──────────────────────────────────────┐
│ Control Bar (scrollable)             │
├──────────────────────────────────────┤
│  Chart (100%)                        │
│  Delta Pills                         │
├──────────────────────────────────────┤
│  Run Log (100%)                      │
└──────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌────────────────┐
│ Controls       │
│ (stacked)      │
├────────────────┤
│ Chart          │
│ (simplified)   │
├────────────────┤
│ Pills (scroll) │
├────────────────┤
│ Run Log        │
│ (collapsed)    │
└────────────────┘
```

---

## Interaction Flows

### Happy Path: Toggle PS-LANG

```
1. User clicks PS-LANG toggle OFF → ON
2. Toggle animates to ON state (350ms)
3. Chart shows skeleton (100ms delay)
4. Simulation runs (deterministic, ~50ms)
5. Chart bars animate in (300ms stagger)
6. Delta pills slide up + fade in (200ms, 50ms stagger)
7. Run log adds new entry (slide down 300ms)
8. Details panel updates disclosure data
```

**Total time:** ~900ms from click to complete

### Scenario Change

```
1. User selects different scenario
2. Scenario selector enters "changing" state
3. Chart fades to skeleton (200ms)
4. Delta pills fade out (150ms)
5. New scenario config loads (~100ms)
6. Simulation re-runs with new parameters
7. Chart animates in with new data (300ms)
8. Delta pills return (200ms stagger)
```

**Total time:** ~750ms

### Metric View Switch

```
1. User clicks different metric tab (e.g., Tokens → Latency)
2. Tab underline slides to new position (300ms)
3. Chart Y-axis fades out (150ms)
4. Chart data crossfades (250ms)
5. New Y-axis fades in (150ms, 100ms delay)
6. Delta pills update active metric highlight
```

**Total time:** ~500ms

---

## Accessibility States

### Focus States

```
Control element focused:
- 2px blue outline
- No layout shift
- Keyboard navigation support
```

### ARIA States

```html
<button
  role="switch"
  aria-checked="true"
  aria-label="PS-LANG enforcement toggle"
>
  PS-LANG: ON
</button>

<div role="tablist" aria-label="Metric view selector">
  <button role="tab" aria-selected="true">Tokens</button>
  <button role="tab" aria-selected="false">Latency</button>
</div>

<div role="region" aria-live="polite" aria-label="Simulation results">
  <!-- Chart content -->
</div>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Budget

<@. Maximum allowed timings @.>

| Interaction | Target | Maximum |
|-------------|--------|---------|
| Toggle PS-LANG | 300ms | 500ms |
| Switch scenario | 500ms | 750ms |
| Switch metric | 250ms | 400ms |
| Modal open | 200ms | 350ms |
| Chart update | 300ms | 450ms |

---

## Acceptance Criteria

<@. UI flow validation @.>

- [ ] All animations use `transform` and `opacity` only (no layout reflow)
- [ ] Skeleton states appear within 100ms of control change
- [ ] No cumulative layout shift (CLS = 0)
- [ ] Focus states visible for keyboard navigation
- [ ] Reduced motion preference respected
- [ ] All interactive elements have ARIA labels
- [ ] Mobile layout doesn't horizontally scroll
- [ ] Modal traps focus when open
- [ ] Export preview shows accurate data before download

---

<.bm ui-flows-spec
animation_types: 12
states: 25+
performance_budget: defined
accessibility: WCAG-AA
.bm>
