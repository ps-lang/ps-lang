"use client"

import { useEffect, useState } from "react"

export default function ScrollTimeline() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    // Initial calculation
    updateProgress()

    // Add scroll listener
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-stone-200/40 z-40">
      <div
        className="h-full bg-stone-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Subtle progress indicator dot */}
      <div
        className="absolute top-0 w-3 h-3 bg-stone-500 rounded-full transform -translate-y-1 transition-all duration-150 ease-out opacity-60"
        style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
      />
    </div>
  )
}