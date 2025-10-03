'use client'

import { usePathname } from 'next/navigation'

/**
 * PageContextHeader - Dynamic PS-LANG zone-based page context indicator
 *
 * Displays contextual zone syntax based on current route, demonstrating
 * PS-LANG's zone-based context control in the UI itself.
 *
 * @llms.txt
 * Component demonstrates PS-LANG zones in navigation context
 * Each route gets a semantically appropriate zone type
 * Zone prefixes indicate content visibility/purpose
 */

interface PageContext {
  zone: string
  label: string
  description: string
}

const PAGE_CONTEXTS: Record<string, PageContext> = {
  '/': {
    zone: '<#.',
    label: 'context control for ai agents',
    description: 'Pass-through zone - Core concept visible to all agents'
  },
  '/playground': {
    zone: '<@.',
    label: 'interactive demos',
    description: 'Action zone - Active workspace for exploration'
  },
  '/playground/prompt-editor': {
    zone: '<#.',
    label: '1-shot prompt optimizer',
    description: 'Pass-through zone - Main tool for prompt engineering'
  },
  '/playground/token-comparison': {
    zone: '<$.',
    label: 'token efficiency tracker',
    description: 'Public zone - Shared metrics and benchmarks'
  },
  '/about': {
    zone: '<!.',
    label: 'project metadata',
    description: 'Metadata zone - Project information and context'
  },
  '/journal': {
    zone: '<*.',
    label: 'Basic zone syntax, CLI tools, VS Code/Cursor themes, and community feedback collection',
    description: 'Example zone - Feature roadmap and development focus'
  },
  '/settings': {
    zone: '<~.',
    label: 'configuration panel',
    description: 'Config zone - System settings and preferences'
  }
}

export default function PageContextHeader({ zoneOnly = false }: { zoneOnly?: boolean }) {
  const pathname = usePathname()

  // Find matching context or use default
  const context = PAGE_CONTEXTS[pathname] || PAGE_CONTEXTS['/']

  // Determine closing bracket based on zone type
  // Extract the character between < and . to create symmetric closing
  const zoneChar = context.zone.slice(1, -1) // Gets the character(s) between < and .
  const closingZone = `.${zoneChar}>`

  if (zoneOnly) {
    return (
      <span title={context.description}>
        {context.zone} {context.label} {closingZone}
      </span>
    )
  }

  return (
    <div title={context.description}>
      <div className="font-mono text-xs text-stone-400 tracking-wide mb-3">
        {context.zone} {context.label} {closingZone}
      </div>
      <h1 className="text-2xl font-light text-stone-900 tracking-tight inline">
        PS-LANG<sup className="text-[10px] ml-0.5 -top-2">™</sup>
      </h1>
    </div>
  )
}
