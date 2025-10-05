"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-stone-600">
      <Link
        href="/"
        className="hover:text-stone-900 transition-colors flex items-center"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={item.href} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-stone-400" />
            {isLast ? (
              <span className="text-stone-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-stone-900 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// Helper function to auto-generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string, customLabels?: Record<string, string>): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)

  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = customLabels?.[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { label, href }
  })
}
