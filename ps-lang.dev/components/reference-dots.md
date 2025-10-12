# Sphere3D - Universal 3D Figure Component

A reusable Three.js sphere component with configurable themes for PS-LANG journal themes.

## Overview

The `Sphere3D` component is a universal 3D illustration component that can be used across different page sections (hero, features, etc.) with different journal theme configurations.

## Architecture

```
sphere-3d.tsx (Universal Component)
    ↓
sphere-3d-fermi.tsx (Fermi Theme Wrapper)
    ↓
Used in: app/ps-journaling/page.tsx, any section
```

## Usage

### Basic Usage (Fermi Theme)

```tsx
import Sphere3D from '@/components/sphere-3d'

<Sphere3D theme="fermi" />
```

### Default Theme

```tsx
<Sphere3D theme="default" />
```

### Custom Theme

```tsx
<Sphere3D
  theme="custom"
  colors={{
    background: '#FAF8F6',
    sphere: '#E8DED4',
    lines: '#2C1F1F'
  }}
/>
```

### Advanced Configuration

```tsx
<Sphere3D
  theme="fermi"
  rotationSpeed={0.003}
  numLines={12}
  lineOpacity={0.2}
  radius={2.0}
  className="custom-class"
  dataAttributes={{
    'data-section': 'features',
    'data-variant': 'dark'
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'fermi' \| 'default' \| 'custom'` | `'fermi'` | Theme preset |
| `colors` | `{ background?, sphere?, lines? }` | - | Custom colors (when theme="custom") |
| `rotationSpeed` | `number` | `0.002` | Rotation speed per frame |
| `numLines` | `number` | `9` | Number of longitude lines |
| `lineOpacity` | `number` | `0.15` | Base opacity for lines |
| `radius` | `number` | `1.8` | Sphere radius |
| `className` | `string` | `''` | Custom CSS classes |
| `dataAttributes` | `Record<string, string>` | `{}` | Data attributes for tracking |

## Theme Presets

### Fermi Theme
- **Background**: `#FAF8F6` (warm cream)
- **Sphere**: `#E8DED4` (beige)
- **Lines**: `#2C1F1F` (dark brown)

### Default Theme
- **Background**: `#fafaf9` (light stone)
- **Sphere**: `#D9CFC5` (tan)
- **Lines**: `#5A4939` (medium brown)

## Future Journal Themes

As new journal themes are added to PS-LANG, you can:

1. **Add theme preset** to `THEME_PRESETS` in `sphere-3d.tsx`
2. **Create wrapper component** (like `hero-card-illustration-3d.tsx`)
3. **Use in pages** with theme-specific configurations

### Example: Adding "Dark" Theme

```tsx
// 1. Add to sphere-3d.tsx
const THEME_PRESETS = {
  fermi: { ... },
  default: { ... },
  dark: {
    background: '#1A1410',
    sphere: '#3D342C',
    lines: '#E8DED4',
  },
}

// 2. Create wrapper: components/sphere-3d-dark.tsx
import Sphere3D from './sphere-3d'

export default function Sphere3DDark() {
  return (
    <Sphere3D
      theme="dark"
      dataAttributes={{
        'data-illustration-theme': 'dark',
      }}
    />
  )
}

// 3. Use in any page/section
<Sphere3DDark />
```

## Performance Considerations

- **Single instance per page**: Three.js scenes use GPU resources
- **Cleanup**: Component properly disposes resources on unmount
- **Responsive**: Handles window resize without recreation
- **Optimized**: Uses `Math.min(window.devicePixelRatio, 2)` to prevent over-rendering

## Technical Details

- **Library**: Three.js 0.160.1
- **Geometry**: `SphereGeometry(radius, 64, 64)` for smooth rendering
- **Lines**: Generated programmatically as curved paths along sphere surface
- **Lighting**: Ambient + 2 directional lights for depth
- **Animation**: RequestAnimationFrame loop with slow Y-axis rotation

## Data Attributes

All instances include:
- `data-component="sphere-3d"`
- `data-illustration-type="three-js"`
- `data-theme={theme}`
- Custom attributes via `dataAttributes` prop

## Examples in Codebase

### Current: PS Journaling Page (Fermi Theme)
```tsx
// app/ps-journaling/page.tsx
illustration={theme === 'fermi' ? <Sphere3DFermi /> : undefined}
```

### Future: Any Section
```tsx
// Use the wrapper
<Sphere3DFermi />

// Or use universal component with custom config
<Sphere3D
  theme="default"
  rotationSpeed={0.001}
  dataAttributes={{ 'data-section': 'features' }}
/>
```

## Creative Direction Notes

> "stick to the style the Creative Director made"

The component preserves the original Fermi Journal theme aesthetic:
- Warm, minimal color palette
- Subtle longitude lines for texture
- Slow rotation creating "sun-like" movement
- Clean, uncluttered presentation

## Future Enhancements

- [ ] Add texture support (grain, noise)
- [ ] Add second sphere overlay (small sphere)
- [ ] Add horizontal latitude lines
- [ ] Theme transitions/interpolation
- [ ] Pause on hover option
- [ ] Click interactions
- [ ] Performance mode (lower poly count)
