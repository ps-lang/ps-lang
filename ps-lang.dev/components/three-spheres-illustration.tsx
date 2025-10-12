"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import HeroCardIllustration from './hero-card-illustration'

/**
 * Large Sun-like sphere - Fermi Journal theory aesthetic
 * Clean, modern design matching nano-banana reference with grid lines
 */
function LargeSphere() {
  const radius = 2.0
  const verticalLineCount = 8  // 8 vertical meridian lines visible in reference
  const horizontalLineCount = 5 // 5 horizontal latitude lines visible in reference

  // Generate vertical meridian lines (longitude) - extremely subtle
  const verticalLines = []
  for (let i = 0; i < verticalLineCount; i++) {
    const rotation = (i / verticalLineCount) * Math.PI * 2
    verticalLines.push(
      <mesh key={`meridian-${i}`} rotation={[0, rotation, 0]}>
        <torusGeometry args={[radius, 0.002, 8, 100, Math.PI * 2]} />
        <meshBasicMaterial color="#D5C9BE" opacity={0.12} transparent />
      </mesh>
    )
  }

  // Generate horizontal latitude lines (evenly spaced from top to bottom) - extremely subtle
  const horizontalLines = []
  for (let i = 1; i <= horizontalLineCount; i++) {
    // Evenly distribute lines from -60° to +60° (avoiding poles)
    const lat = ((i / (horizontalLineCount + 1)) * 120) - 60
    const theta = (lat * Math.PI) / 180
    const y = radius * Math.sin(theta)
    const ringRadius = radius * Math.cos(theta)

    horizontalLines.push(
      <mesh key={`latitude-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, 0.002, 8, 100]} />
        <meshBasicMaterial color="#D5C9BE" opacity={0.12} transparent />
      </mesh>
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Main large sun sphere - warm beige/taupe matching nano-banana */}
      <mesh>
        <sphereGeometry args={[2.0, 128, 128]} />
        <meshStandardMaterial
          color="#E5DBD4"
          roughness={0.95}
          metalness={0.0}
          emissive="#E5DBD4"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Vertical meridian grid lines - 8 lines (very subtle) */}
      {verticalLines}

      {/* Horizontal latitude grid lines - 5 lines (very subtle) */}
      {horizontalLines}
    </group>
  )
}


/**
 * Scene with soft, clean modern lighting matching nano-banana
 */
function Scene() {
  return (
    <>
      {/* Strong ambient light for proper color display */}
      <ambientLight intensity={1.8} color="#FFFFFF" />

      {/* Gentle directional light from top-left (creates very subtle highlight) */}
      <directionalLight
        position={[-4, 6, 4]}
        intensity={0.8}
        color="#FFFFFF"
      />

      {/* Soft fill light from right */}
      <directionalLight
        position={[6, 2, 3]}
        intensity={0.5}
        color="#FFFFFF"
      />

      {/* Hemisphere for natural ambient fill */}
      <hemisphereLight
        color="#FFFFFF"
        groundColor="#F5EDE5"
        intensity={0.8}
      />

      {/* Large sun sphere with Fermi theory grid pattern */}
      <LargeSphere />

      {/* Optional: Enable orbit controls for development (remove in production) */}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </>
  )
}

/**
 * Three.js Spheres Illustration Component
 *
 * Renders 3D spheres with realistic shading and meridian lines.
 * Uses HeroCardIllustration as a loading fallback.
 *
 * @example
 * ```tsx
 * <ThreeSpheresIllustration />
 * ```
 */
export default function ThreeSpheresIllustration() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Hide preloader after a short delay to allow Three.js to initialize
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full aspect-[4/3] max-w-[600px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        style={{ background: '#F8F5F2' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Preloader: Show static illustration while Three.js loads */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <HeroCardIllustration />
      </div>
    </div>
  )
}
