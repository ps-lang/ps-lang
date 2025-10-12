/**
 * Spheres Illustration Component
 *
 * 3D-style layered spheres illustration matching the PS Journaling design aesthetic.
 * Features textured beige/brown gradient spheres with geometric grid lines.
 *
 * @example
 * ```tsx
 * <SpheresIllustration />
 * ```
 */
export default function SpheresIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-label="Decorative 3D spheres illustration"
      data-component="spheres-illustration"
      data-illustration-type="svg"
    >
      <defs>
        {/* Gradients for sphere shading */}
        <radialGradient id="sphere-large" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#F5F0EB" />
          <stop offset="60%" stopColor="#E8DED4" />
          <stop offset="100%" stopColor="#D9CFC5" />
        </radialGradient>

        <radialGradient id="sphere-medium" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#5A4D42" />
          <stop offset="50%" stopColor="#3D342C" />
          <stop offset="100%" stopColor="#2C1F1F" />
        </radialGradient>

        <radialGradient id="sphere-small" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#DDD3C9" />
          <stop offset="60%" stopColor="#C9BFB5" />
          <stop offset="100%" stopColor="#B5ABA1" />
        </radialGradient>

        {/* Subtle shadow */}
        <filter id="shadow-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
          <feOffset dx="2" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background large sphere (cream/beige) with grid lines */}
      <g filter="url(#shadow-soft)">
        <circle
          cx="380"
          cy="320"
          r="220"
          fill="url(#sphere-large)"
        />

        {/* Geometric grid lines on large sphere - very subtle */}
        <g opacity="0.08" stroke="#2C1F1F" strokeWidth="0.3" fill="none">
          {/* Vertical longitude lines */}
          <path d="M 380 100 L 380 540" opacity="0.9" />
          <path d="M 330 110 Q 328 320 330 530" opacity="0.7" />
          <path d="M 430 110 Q 432 320 430 530" opacity="0.7" />
          <path d="M 280 140 Q 275 320 280 500" opacity="0.5" />
          <path d="M 480 140 Q 485 320 480 500" opacity="0.5" />

          {/* Horizontal latitude lines */}
          <ellipse cx="380" cy="320" rx="220" ry="155" opacity="0.8" />
          <ellipse cx="380" cy="320" rx="220" ry="100" opacity="0.6" />
          <ellipse cx="380" cy="320" rx="220" ry="50" opacity="0.4" />
        </g>
      </g>

      {/* Medium sphere (dark brown) - center focal point */}
      <circle
        cx="300"
        cy="340"
        r="140"
        fill="url(#sphere-medium)"
      />

      {/* Small accent sphere (light beige) - top left */}
      <circle
        cx="220"
        cy="200"
        r="75"
        fill="url(#sphere-small)"
      />

      {/* Subtle highlight overlays for depth */}
      <ellipse
        cx="360"
        cy="285"
        rx="85"
        ry="65"
        fill="white"
        opacity="0.06"
      />

      <ellipse
        cx="275"
        cy="305"
        rx="55"
        ry="45"
        fill="white"
        opacity="0.08"
      />

      <ellipse
        cx="210"
        cy="180"
        rx="32"
        ry="28"
        fill="white"
        opacity="0.1"
      />
    </svg>
  )
}
