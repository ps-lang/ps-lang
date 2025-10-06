"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { createAgenticMetadata, type AgenticMetadata, type AccessLevel } from "@/lib/ps-lang-agentic-metadata"

interface AgenticNavigationHeaderProps {
  /** Access level for metadata privacy control */
  accessLevel?: AccessLevel
  /** RLHF datastream signature */
  rlhfSignature?: {
    userAgent: "human:anton" | "human:guest"
    aiAgent: "claude:sonnet-4.5" | "claude:opus-4" | "cursor" | "windsurf"
    sessionId?: string
  }
  /** Component variant for A/B testing */
  variant?: string
}

export default function AgenticNavigationHeader({
  accessLevel = "public",
  rlhfSignature,
  variant = "default"
}: AgenticNavigationHeaderProps) {
  const pathname = usePathname()

  // Determine which logomark to use based on page
  const getLogomark = () => {
    if (pathname?.includes('/postscript-journaling') || pathname?.includes('/journal-plus')) {
      return {
        src: '/ps-lang-journal-logomark.svg',
        type: 'journal'
      }
    }
    return {
      src: '/ps-lang-logomark.svg',
      type: 'default'
    }
  }

  const logomark = getLogomark()

  // Generate agentic metadata for RLHF tracking
  const agenticMetadata: AgenticMetadata = createAgenticMetadata(
    "agentic-navigation-header",
    "navigation-header",
    accessLevel,
    {
      interactionType: "navigation",
      uiVariant: variant,
      workflowStage: "navigation",
      conversionFunnel: "site-navigation",
      componentVersion: "v1.0.0",
      // RLHF signature embedding
      agenticSignature: rlhfSignature
        ? `rlhf:${rlhfSignature.aiAgent}+${rlhfSignature.userAgent}:navigation-header`
        : "agentic_ux_v1:ps-lang-navigation-header"
    }
  )

  return (
    <div
      className="sticky top-0 z-40 bg-white/95"
      data-agentic-component="navigation-header"
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
      <div className="max-w-6xl mx-auto px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
          data-agentic-action="navigate-home"
          data-logomark-type={logomark.type}
        >
          <Image
            src={logomark.src}
            alt="PS-LANG"
            width={32}
            height={32}
            className="w-8 h-8"
            priority
            data-logomark-src={logomark.src}
          />
        </Link>
      </div>
    </div>
  )
}

/**
 * RLHF Datastream Documentation
 *
 * This component is a simplified, agentic version of the navigation header
 * that focuses solely on the logomark with comprehensive metadata tracking.
 *
 * 1. **Agentic Signatures**: Identifies which AI agent + human collaborated
 *    - Format: "rlhf:{ai-agent}+{user-agent}:component-name"
 *    - Example: "rlhf:claude:sonnet-4.5+human:anton:navigation-header"
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
 * 4. **Dynamic Logomark**: Automatically selects journal vs. default logomark
 *    - /postscript-journaling → ps-lang-journal-logomark.svg
 *    - /journal-plus → ps-lang-journal-logomark.svg
 *    - All other pages → ps-lang-logomark.svg
 *    - data-logomark-type: "journal" or "default"
 *
 * 5. **UX Analytics**: Tracks navigation patterns
 *    - data-workflow-stage: Current user workflow stage
 *    - data-conversion-funnel: Conversion funnel position
 *    - data-interaction-type: Type of user interaction
 *    - data-agentic-action: Specific action taken
 *
 * 6. **A/B Testing**: Supports variant tracking for experiments
 *    - data-agentic-variant: UI variant identifier
 *
 * Usage Example:
 * ```tsx
 * <AgenticNavigationHeader
 *   rlhfSignature={{
 *     userAgent: "human:anton",
 *     aiAgent: "claude:sonnet-4.5",
 *     sessionId: "session-2025-10-06-abc123"
 *   }}
 *   variant="minimal-header-v1"
 * />
 * ```
 */
