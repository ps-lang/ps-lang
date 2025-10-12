"use client"

import { useLayoutEffect } from 'react'
import { useTheme } from 'next-themes'
import { setTheme as setThemeStorage } from '@/lib/theme-storage'

interface ForceThemeProps {
  theme: 'default' | 'fermi'
}

/**
 * Force a specific theme for a page
 * Sets theme in both next-themes AND our storage system (cookie/localStorage)
 */
export default function ForceTheme({ theme }: ForceThemeProps) {
  const { setTheme, resolvedTheme } = useTheme()

  useLayoutEffect(() => {
    // Only set if different from current theme
    if (resolvedTheme !== theme) {
      setTheme(theme)
      // Also set in our storage system
      setThemeStorage(theme)
    }
  }, [theme, setTheme, resolvedTheme])

  return null
}
