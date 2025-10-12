"use client"

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

/**
 * Sphere 3D Component
 *
 * Universal reusable Three.js sphere with configurable themes
 * Can be used in any page section - hero, features, etc.
 *
 * @example
 * ```tsx
 * // Fermi theme
 * <Sphere3D theme="fermi" />
 *
 * // Default theme
 * <Sphere3D theme="default" />
 *
 * // Custom theme
 * <Sphere3D
 *   theme="custom"
 *   colors={{
 *     background: '#FAF8F6',
 *     sphere: '#E8DED4',
 *     lines: '#2C1F1F'
 *   }}
 * />
 * ```
 */

interface Sphere3DProps {
  /**
   * Theme preset
   * @default "fermi"
   */
  theme?: 'fermi' | 'default' | 'custom'

  /**
   * Custom color configuration (used when theme="custom")
   */
  colors?: {
    background?: string
    sphere?: string
    lines?: string
  }

  /**
   * Rotation speed
   * @default 0.002
   */
  rotationSpeed?: number

  /**
   * Number of longitude lines
   * @default 20
   */
  numLines?: number

  /**
   * Line opacity
   * @default 0.08
   */
  lineOpacity?: number

  /**
   * Sphere radius
   * @default 1.8
   */
  radius?: number

  /**
   * Custom class name
   */
  className?: string

  /**
   * Data attributes for tracking/identification
   */
  dataAttributes?: Record<string, string>
}

// Theme presets
const THEME_PRESETS = {
  fermi: {
    background: '#F9F6F3',
    sphere: '#E8D4CC', // Warmer peachy-salmon base
    lines: '#5A4538',
  },
  default: {
    background: '#fafaf9',
    sphere: '#D9CFC5',
    lines: '#5A4939',
  },
}

export default function Sphere3D({
  theme = 'fermi',
  colors,
  rotationSpeed = 0.002,
  numLines = 20,
  lineOpacity = 0.08,
  radius = 1.8,
  className = '',
  dataAttributes = {},
}: Sphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sphereRef = useRef<THREE.Group | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  // Get theme colors for placeholder
  const themeColors = theme === 'custom' && colors
    ? colors
    : (theme === 'fermi' || theme === 'default')
      ? THEME_PRESETS[theme]
      : THEME_PRESETS.fermi

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    // No background color - transparent
    sceneRef.current = scene

    // Camera setup - adjusted for wider 16:9 canvas
    const camera = new THREE.PerspectiveCamera(
      35, // Reduced FOV from 45 to 35 for less distortion on wider canvas
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 7 // Moved camera back from 5 to 7 for better view of orbit
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // Transparent background (black with 0 alpha)
    renderer.domElement.style.display = 'block' // Prevent inline spacing
    renderer.domElement.style.opacity = '0' // Start invisible
    renderer.domElement.style.transition = 'opacity 400ms ease-in-out'
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Fade in after a brief delay
    setTimeout(() => {
      if (renderer.domElement) {
        renderer.domElement.style.opacity = '1'
      }
    }, 100)

    // Create sphere group
    const sphereGroup = new THREE.Group()
    sphereRef.current = sphereGroup

    // Main sphere geometry - higher segments for smoother appearance
    const geometry = new THREE.SphereGeometry(radius, 128, 128)

    // Define gradient colors (top to bottom) - soft warm beige tones
    const topColor = new THREE.Color('#EDE5DC') // Soft warm cream (top)
    const bottomColor = new THREE.Color('#D9C9BD') // Warm sandy beige (bottom)

    // Sphere material - clean and simple with gradient, soft matte finish, and gentle glow
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'), // White base, gradient applied via shader
      roughness: 0.75, // Higher roughness for soft matte finish
      metalness: 0.02, // Minimal metallic reflection for subtle shine
      emissive: new THREE.Color('#EDE5DC'), // Very gentle warm glow
      emissiveIntensity: 0.15, // Subtle surface luminosity
      flatShading: false, // Smooth shading for gradient effect
    })

    // Inject gradient shader
    material.onBeforeCompile = (shader) => {
      shader.uniforms.topColor = { value: topColor }
      shader.uniforms.bottomColor = { value: bottomColor }
      shader.uniforms.sphereRadius = { value: radius }

      // Inject vertex shader to pass position
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 vPosition;
        `
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vPosition = position;
        `
      )

      // Inject fragment shader for gradient
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float sphereRadius;
        varying vec3 vPosition;
        `
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        // Calculate gradient based on Y position (top = 1, bottom = 0)
        float gradientFactor = (vPosition.y + sphereRadius) / (sphereRadius * 2.0);
        gradientFactor = clamp(gradientFactor, 0.0, 1.0);
        vec3 gradientColor = mix(bottomColor, topColor, gradientFactor);
        diffuseColor.rgb *= gradientColor;
        `
      )
    }

    const sphere = new THREE.Mesh(geometry, material)
    sphereGroup.add(sphere)

    // Create longitude lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(themeColors.lines),
      transparent: true,
      opacity: lineOpacity,
    })

    // Generate longitude lines
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2
      const points: THREE.Vector3[] = []

      // Create curved line along sphere surface
      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI
        const lineRadius = radius + 0.01 // Slightly above sphere surface
        const x = lineRadius * Math.sin(theta) * Math.cos(angle)
        const y = lineRadius * Math.cos(theta)
        const z = lineRadius * Math.sin(theta) * Math.sin(angle)
        points.push(new THREE.Vector3(x, y, z))
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(lineGeometry, linesMaterial)

      // Vary opacity for lines further from front (more subtle)
      const normalizedAngle = Math.abs(Math.cos(angle))
      line.material = linesMaterial.clone()
      line.material.opacity = (lineOpacity * 0.4) + (normalizedAngle * lineOpacity * 0.6)

      sphereGroup.add(line)
    }

    scene.add(sphereGroup)

    // Create second sphere (Earth) - smaller, darker, textured with noise
    const earthGroup = new THREE.Group()

    // Earth sphere geometry - much smaller
    const earthGeometry = new THREE.SphereGeometry(radius * 0.25, 128, 128)

    // Earth material - dark color with transparency and soft matte finish
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4A3A32'), // Dark brown base
      roughness: 0.7, // Higher roughness for soft matte finish
      metalness: 0.05, // Minimal metallic sheen
      emissive: new THREE.Color('#3D3230'),
      emissiveIntensity: 0.08,
      transparent: true,
      opacity: 0.85, // Slight transparency
      flatShading: false,
    })

    const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial)
    earthGroup.add(earthSphere)

    // Create dashed orbital path line with dynamic opacity (fade front/back)
    const orbitRadius = 2.5 // Distance from sun center
    const segments = 128
    const orbitPositions = []
    const orbitOpacities = [] // Store opacity per vertex for front/back fading

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * orbitRadius
      const y = 0
      const z = Math.sin(angle) * orbitRadius

      orbitPositions.push(x, y, z)

      // Calculate opacity based on Z position (front/back visibility)
      // Z closer to camera (positive Z) = more visible
      // Z farther from camera (negative Z) = less visible
      const normalizedZ = (z / orbitRadius + 1.0) / 2.0 // Range 0 to 1
      const opacity = 0.05 + (normalizedZ * 0.4) // Range 0.05 to 0.45
      orbitOpacities.push(opacity)
    }

    const orbitGeometry = new THREE.BufferGeometry()
    orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPositions, 3))
    orbitGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(orbitOpacities, 1))

    const orbitMaterial = new THREE.LineDashedMaterial({
      color: new THREE.Color('#D4B8AE'),
      dashSize: 0.15,
      gapSize: 0.08,
      opacity: 0.0, // Hidden for now
      transparent: true,
    })

    // Customize shader to use per-vertex opacity
    orbitMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        attribute float opacity;
        varying float vOpacity;
        `
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vOpacity = opacity;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying float vOpacity;
        `
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a * vOpacity );'
      )
    }

    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial)
    orbitLine.computeLineDistances() // Required for dashed lines
    // scene.add(orbitLine) // Hidden - orbit path not visible

    // Position Earth at starting angle (left side, 180 degrees / PI radians)
    // This places Earth at the leftmost point of the orbit, moving right
    const startAngle = Math.PI // 180 degrees = left side
    earthGroup.position.set(
      Math.cos(startAngle) * orbitRadius,
      0,
      Math.sin(startAngle) * orbitRadius
    )
    scene.add(earthGroup)

    // Lighting setup - soft lighting with subtle top-left highlight for sheen
    // Strong ambient for even base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
    scene.add(ambientLight)

    // Directional light from top-left for subtle sheen highlight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(-3, 4, 3)
    scene.add(directionalLight)

    // Soft fill light from right for balance
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.15)
    fillLight.position.set(3, 1, 2)
    scene.add(fillLight)

    // Animation loop with realistic physics-based motion
    let animationFrameId: number
    let orbitAngle = startAngle // Start from initial position

    // Realistic rotation rates (simplified Earth vs Sun)
    // Sun rotates ~25 days, Earth orbits 365 days, Earth rotates 1 day
    // Sun rotates counter-clockwise, Earth orbits clockwise (reversed for visual effect)
    // We'll scale these for visual effect
    const sunRotationSpeed = rotationSpeed // Sun's self-rotation (counter-clockwise)
    const earthOrbitSpeed = rotationSpeed * 0.4 // Earth's orbital speed (slower, clockwise)
    const earthRotationSpeed = rotationSpeed * 0.5 // Earth's self-rotation (much slower, counter-clockwise)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Sun self-rotation (counter-clockwise when viewed from above North Pole)
      if (sphereRef.current) {
        sphereRef.current.rotation.y += sunRotationSpeed
      }

      // Earth orbital motion (clockwise when viewed from above)
      // Starting from left side, moves: left → bottom → right → top → left
      if (earthGroup) {
        orbitAngle -= earthOrbitSpeed // Negative for clockwise motion
        earthGroup.position.x = Math.cos(orbitAngle) * orbitRadius
        earthGroup.position.y = 0 // Keep on equatorial plane
        earthGroup.position.z = Math.sin(orbitAngle) * orbitRadius

        // Earth self-rotation (counter-clockwise, same direction as sun)
        earthGroup.rotation.y += earthRotationSpeed

        // Optional: Make Earth face the sun (tidal locking effect)
        // Uncomment to lock one side of Earth always facing the sun
        // earthGroup.rotation.y = -orbitAngle
      }

      renderer.render(scene, camera)
    }
    animate()

    // Start fade out transition, then mark as loaded
    setTimeout(() => setFadeOut(true), 100)
    setTimeout(() => setIsLoaded(true), 400)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
      geometry.dispose()
      material.dispose()
      linesMaterial.dispose()
      earthGeometry.dispose()
      earthMaterial.dispose()
      orbitGeometry.dispose()
      orbitMaterial.dispose()
    }
  }, [theme, colors, rotationSpeed, numLines, lineOpacity, radius])

  return (
    <div
      ref={containerRef}
      className={`w-full aspect-[16/9] max-w-[800px] relative ${className}`}
      style={{ minHeight: '450px' }}
      data-component="reference-dots"
      data-illustration-type="three-js"
      data-theme={theme}
      {...dataAttributes}
    >
      {/* Plain placeholder while Three.js loads */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{
            opacity: fadeOut ? 0 : 1,
          }}
        >
          <div
            className="rounded-full transition-all duration-300"
            style={{
              width: fadeOut ? '380px' : '360px',
              height: fadeOut ? '380px' : '360px',
              background: 'linear-gradient(180deg, #F2DDD4 0%, #D4B8AE 100%)',
              opacity: fadeOut ? 0.2 : 0.4,
            }}
          />
        </div>
      )}
    </div>
  )
}
