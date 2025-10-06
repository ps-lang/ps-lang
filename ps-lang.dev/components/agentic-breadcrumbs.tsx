"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { createAgenticMetadata, type AgenticMetadata, type AccessLevel } from "@/lib/ps-lang-agentic-metadata"

interface BreadcrumbItem {
  label: string
  href: string
}

interface AgenticBreadcrumbsProps {
  items: BreadcrumbItem[]
  /** RLHF datastream signature - identifies the AI agent + user interaction */
  rlhfSignature?: {
    userAgent: "human:anton" | "human:guest"
    aiAgent: "claude:sonnet-4.5" | "claude:opus-4" | "cursor" | "windsurf"
    sessionId?: string
  }
  /** Access level for metadata privacy control */
  accessLevel?: AccessLevel
  /** Show PS (standard) or * (dev mode) for home icon */
  homeIcon?: "PS" | "*"
  /** Component variant for A/B testing */
  variant?: string
}

export function AgenticBreadcrumbs({
  items,
  rlhfSignature,
  accessLevel = "public",
  homeIcon = "PS",
  variant = "default"
}: AgenticBreadcrumbsProps) {
  // Generate agentic metadata for RLHF tracking
  const agenticMetadata: AgenticMetadata = createAgenticMetadata(
    "agentic-breadcrumbs",
    "navigation-component",
    accessLevel,
    {
      interactionType: "navigation",
      uiVariant: variant,
      workflowStage: "content-navigation",
      conversionFunnel: "content-discovery",
      componentVersion: "v1.0.0",
      // RLHF signature embedding
      agenticSignature: rlhfSignature
        ? `rlhf:${rlhfSignature.aiAgent}+${rlhfSignature.userAgent}:agentic-breadcrumbs`
        : "agentic_ux_v1:ps-lang-breadcrumbs"
    }
  )

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-stone-600"
      data-agentic-component="breadcrumbs"
      data-agentic-version={agenticMetadata.componentVersion}
      data-agentic-variant={variant}
      data-agentic-signature={agenticMetadata.agenticSignature}
      data-rlhf-user={rlhfSignature?.userAgent}
      data-rlhf-ai={rlhfSignature?.aiAgent}
      data-rlhf-session={rlhfSignature?.sessionId}
      data-privacy-label={agenticMetadata.privacyLabel}
      data-access-level={accessLevel}
      data-interaction-type="navigation"
      data-workflow-stage={agenticMetadata.workflowStage}
      data-conversion-funnel={agenticMetadata.conversionFunnel}
      data-timestamp={agenticMetadata.timestamp}
    >
      <Link
        href="/"
        className="hover:text-stone-900 transition-colors flex items-center font-mono font-semibold text-base"
        aria-label="Home"
        data-agentic-action="navigate-home"
        data-home-icon-type={homeIcon}
      >
        {homeIcon}
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div
            key={item.href}
            className="flex items-center space-x-2"
            data-breadcrumb-index={index}
            data-breadcrumb-depth={items.length}
          >
            <ChevronRight className="w-4 h-4 text-stone-400" aria-hidden="true" />
            {isLast ? (
              <span
                className="text-stone-900 font-medium"
                aria-current="page"
                data-agentic-context="current-page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-stone-900 transition-colors"
                data-agentic-action="navigate-breadcrumb"
                data-breadcrumb-label={item.label}
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

/**
 * RLHF Datastream Documentation
 *
 * This component emits comprehensive metadata for AI-powered analytics:
 *
 * 1. **Agentic Signatures**: Identifies which AI agent + human collaborated
 *    - Format: "rlhf:{ai-agent}+{user-agent}:component-name"
 *    - Example: "rlhf:claude:sonnet-4.5+human:anton:agentic-breadcrumbs"
 *
 * 2. **RLHF Session Tracking**: Links interactions to specific AI sessions
 *    - data-rlhf-session: Unique session ID for conversation tracking
 *    - data-rlhf-user: Human participant identifier
 *    - data-rlhf-ai: AI agent identifier and version
 *
 * 3. **Privacy-First Design**: All metadata respects PS-LANG privacy model
 *    - data-privacy-label: "private" (default) or "public" (user-controlled)
 *    - data-access-level: Clerk-based authentication level
 *
 * 4. **UX Analytics**: Tracks navigation patterns and conversion funnels
 *    - data-workflow-stage: Current user workflow stage
 *    - data-conversion-funnel: Conversion funnel position
 *    - data-interaction-type: Type of user interaction
 *
 * 5. **A/B Testing**: Supports variant tracking for experiments
 *    - data-agentic-variant: UI variant identifier
 *    - data-home-icon-type: "PS" (standard) or "*" (dev mode)
 *
 * Usage Example:
 * ```tsx
 * <AgenticBreadcrumbs
 *   items={breadcrumbItems}
 *   rlhfSignature={{
 *     userAgent: "human:anton",
 *     aiAgent: "claude:sonnet-4.5",
 *     sessionId: "session-2025-10-06-abc123"
 *   }}
 *   homeIcon="*"  // Dev mode
 *   variant="research-papers-v1"
 * />
 * ```
 */
