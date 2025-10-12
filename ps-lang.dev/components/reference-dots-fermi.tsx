import ReferenceDots from './reference-dots'

/**
 * Reference Dots - Fermi Theme
 *
 * Three-dot system for Fermi journal theme
 * Eventually will include: main orb (sun) + 2 companion dots
 *
 * @example
 * ```tsx
 * <ReferenceDotsFermi />
 * ```
 */
export default function ReferenceDotsFermi() {
  return (
    <ReferenceDots
      theme="fermi"
      dataAttributes={{
        'data-reference-dots': 'fermi',
        'data-dot-count': '1', // Will be 3 eventually
      }}
    />
  )
}
