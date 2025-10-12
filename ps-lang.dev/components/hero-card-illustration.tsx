/**
 * Hero Card Illustration Component
 *
 * Minimal two-sphere SVG illustration matching the Fermi Journal theme
 *
 * @example
 * ```tsx
 * <HeroCardIllustration />
 * ```
 */
export default function HeroCardIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[600px]"
      aria-label="Minimal two-sphere illustration"
      data-component="hero-card-illustration"
      data-illustration-type="svg"
    >
      <defs>
        {/* Gradient for larger sphere - warm beige */}
        <radialGradient id="sphere-one" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#F5F0EB" />
          <stop offset="70%" stopColor="#E8DED4" />
          <stop offset="100%" stopColor="#D9CFC5" />
        </radialGradient>

        {/* Gradient for smaller sphere - darker brown */}
        <radialGradient id="sphere-two" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#5A4D42" />
          <stop offset="60%" stopColor="#3D342C" />
          <stop offset="100%" stopColor="#2C1F1F" />
        </radialGradient>

        {/* Subtle shadow */}
        <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.12" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background rectangle - warm cream */}
      <rect width="600" height="450" fill="#FAF8F6" />

      {/* Large background sphere - centered, dominant */}
      <circle
        cx="300"
        cy="225"
        r="180"
        fill="url(#sphere-one)"
      />

      {/* Vertical grid lines for 3D sphere effect */}
      <g opacity="0.15" stroke="#2C1F1F" strokeWidth="0.8" fill="none">
        {/* Center vertical line */}
        <path d="M 300 45 L 300 405" opacity="0.9" />

        {/* Lines left of center */}
        <path d="M 260 50 Q 258 225 260 400" opacity="0.8" />
        <path d="M 220 65 Q 215 225 220 385" opacity="0.7" />
        <path d="M 180 90 Q 172 225 180 360" opacity="0.6" />
        <path d="M 145 125 Q 138 225 145 325" opacity="0.5" />

        {/* Lines right of center */}
        <path d="M 340 50 Q 342 225 340 400" opacity="0.8" />
        <path d="M 380 65 Q 385 225 380 385" opacity="0.7" />
        <path d="M 420 90 Q 428 225 420 360" opacity="0.6" />
        <path d="M 455 125 Q 462 225 455 325" opacity="0.5" />
      </g>
    </svg>
  )
}
