"use client"

import { ReactNode, useState, useEffect } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

/**
 * Minimal tabbed notebook component with URL hash support
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'profile', label: 'Profile', content: <ProfileContent /> },
 *     { id: 'approach', label: 'Approach', content: <ApproachContent /> },
 *   ]}
 *   defaultTab="profile"
 * />
 * ```
 *
 * URLs: /settings#profile, /settings#approach, etc.
 * Supports browser back/forward navigation
 */
export function Tabs({ tabs, defaultTab, className = '' }: TabsProps) {
  // Get initial tab from URL hash or fallback to default
  const getInitialTab = () => {
    if (typeof window === 'undefined') return defaultTab || tabs[0]?.id

    const hash = window.location.hash.slice(1) // Remove '#'
    const hashTab = tabs.find(tab => tab.id === hash)
    return hashTab ? hash : (defaultTab || tabs[0]?.id)
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)

  // Listen for hash changes (back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const hashTab = tabs.find(tab => tab.id === hash)
      if (hashTab) {
        setActiveTab(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [tabs])

  // Handle tab click - update both state and URL
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    window.history.pushState(null, '', `#${tabId}`)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={`${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-stone-300 bg-white overflow-x-auto">
        <div className="flex gap-0 min-w-min">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                px-4 sm:px-6 py-3 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium
                transition-all relative whitespace-nowrap flex-shrink-0
                ${activeTab === tab.id
                  ? 'text-stone-900 bg-white'
                  : 'text-stone-500 bg-stone-50/50 hover:text-stone-700 hover:bg-stone-50'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="border border-t-0 border-stone-300 bg-white">
        {activeTabContent}
      </div>
    </div>
  )
}
