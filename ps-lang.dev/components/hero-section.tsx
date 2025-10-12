"use client"

import { ReactNode } from "react"
import { useTheme } from "next-themes"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// CVA variants for hero container
const heroContainerVariants = cva(
  "relative overflow-hidden transition-colors duration-150",
  {
    variants: {
      siteTheme: {
        default: "bg-[#fafaf9]",
        fermi: "bg-[#F5F3EF]",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

// CVA variants for text elements
const headlineVariants = cva(
  "font-serif",
  {
    variants: {
      siteTheme: {
        default: "text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px] font-light tracking-tight mb-6 text-stone-900",
        fermi: "text-[36px] sm:text-[52px] md:text-[64px] lg:text-[72px] xl:text-[80px] leading-[1.1] sm:leading-[1.0] md:leading-[0.95] lg:leading-[0.92] tracking-[-0.01em] sm:tracking-[-0.015em] md:tracking-[-0.02em] lg:tracking-[-0.025em] mb-6 sm:mb-8 text-[#2C1F1F]",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

const eyebrowVariants = cva(
  "uppercase font-medium",
  {
    variants: {
      siteTheme: {
        default: "text-[10px] tracking-[0.3em] mb-12 text-[#9B8B7E]",
        fermi: "text-[10.5px] tracking-[0.35em] text-[#2C1F1F]",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

const descriptionVariants = cva(
  "font-sans",
  {
    variants: {
      siteTheme: {
        default: "text-[18px] leading-relaxed mb-0 text-stone-700 max-w-2xl mx-auto font-light",
        fermi: "text-[15px] sm:text-[16.5px] leading-[1.65] sm:leading-[1.7] mb-8 sm:mb-12 text-[#2C1F1F]",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

// CVA variants for buttons
const primaryButtonVariants = cva(
  "px-7 py-3 font-normal text-[14px] tracking-normal transition-all duration-200",
  {
    variants: {
      siteTheme: {
        default: "bg-stone-900 text-white hover:bg-stone-800 border border-stone-900",
        fermi: "bg-[#39231B] text-white hover:bg-[#2C1A14] border-none rounded-full shadow-sm hover:shadow-md",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

const secondaryButtonVariants = cva(
  "px-7 py-3 font-normal text-[14px] tracking-normal transition-all duration-200",
  {
    variants: {
      siteTheme: {
        default: "bg-transparent text-stone-900 border border-stone-300 hover:bg-stone-100",
        fermi: "bg-transparent text-[#39231B] border border-[#39231B] hover:border-[#39231B] hover:bg-[#39231B]/5 rounded-full",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

interface HeroSectionProps {
  /**
   * Small eyebrow text above the main heading
   * @example "AI WORKFLOW COLLABORATION"
   */
  eyebrow?: string

  /**
   * Main headline text
   * @example "Master Your AI Workflows"
   */
  headline: ReactNode

  /**
   * Supporting description text
   * @example "Collaborate, benchmark, and improve your AI workflows for better results"
   */
  description: string

  /**
   * Primary CTA button configuration
   */
  primaryCTA?: {
    text: string
    onClick: () => void
    variant?: "solid" | "outline"
  }

  /**
   * Secondary CTA button configuration
   */
  secondaryCTA?: {
    text: string
    onClick: () => void
    variant?: "solid" | "outline"
  }

  /**
   * Optional illustration on the right side
   * Can be an image path, SVG component, or custom React element
   */
  illustration?: ReactNode

  /**
   * Background color theme
   * @default "warm" - warm beige/cream theme
   */
  theme?: "warm" | "light" | "dark"

  /**
   * Layout variant
   * @default "split" - text on left, illustration on right
   */
  layout?: "split" | "centered" | "stacked"

  /**
   * Custom class names for the container
   */
  className?: string

  /**
   * Data attributes for analytics/tracking
   */
  dataAttributes?: Record<string, string>

  /**
   * Force a specific site theme (overrides useTheme hook)
   * Used to prevent hydration mismatches on SSR
   */
  forcedTheme?: "default" | "fermi"
}

/**
 * Reusable Hero Section Component
 *
 * A flexible hero component with support for:
 * - Multiple themes (warm beige, light, dark)
 * - Layout variants (split, centered, stacked)
 * - Customizable CTAs
 * - Illustration slots
 *
 * @example
 * ```tsx
 * <HeroSection
 *   eyebrow="AI WORKFLOW COLLABORATION"
 *   headline="Master Your AI Workflows"
 *   description="Collaborate, benchmark, and improve your AI workflows for better results"
 *   primaryCTA={{ text: "Request Early Access", onClick: () => {...} }}
 *   secondaryCTA={{ text: "Create Account", onClick: () => {...}, variant: "outline" }}
 *   illustration={<SpheresIllustration />}
 *   theme="warm"
 *   layout="split"
 * />
 * ```
 */
export default function HeroSection({
  eyebrow,
  headline,
  description,
  primaryCTA,
  secondaryCTA,
  illustration,
  theme = "warm",
  layout = "split",
  className = "",
  dataAttributes = {},
  forcedTheme,
}: HeroSectionProps) {
  // Get global site theme from next-themes (unless forced)
  const { theme: siteTheme } = useTheme()

  // Use forcedTheme if provided, otherwise use siteTheme from hook
  const themeVariant = forcedTheme
    ? forcedTheme
    : (siteTheme === "fermi" || siteTheme === "default")
      ? siteTheme
      : "default"

  // Layout-based structure
  const layoutClasses = {
    split: "grid md:grid-cols-[1fr_1fr] gap-8 sm:gap-16 md:gap-24 items-center",
    centered: "text-center max-w-4xl mx-auto",
    stacked: "flex flex-col items-start",
  }

  return (
    <div
      className={cn(heroContainerVariants({ siteTheme: themeVariant }), className)}
      data-component="hero"
      data-theme={themeVariant}
      data-layout={layout}
      data-has-illustration={!!illustration}
      {...dataAttributes}
    >
      <div
        className={cn(
          "max-w-6xl mx-auto px-8",
          themeVariant === "fermi" ? "pt-16 sm:pt-28 md:pt-32 lg:pt-40 pb-0" : "pt-10 sm:pt-14 lg:pt-16 pb-0"
        )}
        data-element="hero-container"
      >
        <div
          className={layoutClasses[layout]}
          data-element="hero-content-wrapper"
        >
          {/* Content */}
          <div
            className={layout === "centered" ? "mx-auto" : ""}
            data-element="hero-text-content"
          >
            {eyebrow && (
              <div
                className={themeVariant === "fermi" ? "mb-10" : "mb-4"}
                data-element="hero-eyebrow-wrapper"
              >
                {layout === "centered" ? (
                  <span
                    className={eyebrowVariants({ siteTheme: themeVariant })}
                    data-element="hero-eyebrow"
                  >
                    {eyebrow}
                  </span>
                ) : (
                  <div className="flex items-center gap-4">
                    <span
                      className={eyebrowVariants({ siteTheme: themeVariant })}
                      data-element="hero-eyebrow"
                    >
                      {eyebrow}
                    </span>
                    <div
                      className={cn(
                        "flex-1 h-[0.5px] max-w-[200px]",
                        themeVariant === "fermi" ? "bg-[#2C1F1F]/20" : "bg-stone-300"
                      )}
                      data-element="hero-eyebrow-line"
                    ></div>
                  </div>
                )}
              </div>
            )}

            <h1
              className={cn(
                headlineVariants({ siteTheme: themeVariant }),
                themeVariant === "fermi" ? "max-w-[500px] sm:max-w-[600px] md:max-w-[650px] lg:max-w-[700px]" : ""
              )}
              data-element="hero-headline"
            >
              {headline}
            </h1>

            <p
              className={cn(
                descriptionVariants({ siteTheme: themeVariant }),
                layout === "centered"
                  ? themeVariant === "fermi"
                    ? "max-w-2xl mx-auto"
                    : "max-w-xl mx-auto"
                  : "max-w-[380px]"
              )}
              data-element="hero-description"
            >
              {description}
            </p>

            {/* CTAs */}
            {(primaryCTA || secondaryCTA) && (
              <div
                className={`flex gap-3 ${layout === "centered" ? "justify-center" : ""}`}
                data-element="hero-cta-group"
              >
                {primaryCTA && (
                  <button
                    onClick={primaryCTA.onClick}
                    className={
                      primaryCTA.variant === "outline"
                        ? secondaryButtonVariants({ siteTheme: themeVariant })
                        : primaryButtonVariants({ siteTheme: themeVariant })
                    }
                    data-element="hero-cta-primary"
                    data-variant={primaryCTA.variant || "solid"}
                  >
                    {primaryCTA.text}
                  </button>
                )}

                {secondaryCTA && (
                  <button
                    onClick={secondaryCTA.onClick}
                    className={
                      secondaryCTA.variant === "solid"
                        ? primaryButtonVariants({ siteTheme: themeVariant })
                        : secondaryButtonVariants({ siteTheme: themeVariant })
                    }
                    data-element="hero-cta-secondary"
                    data-variant={secondaryCTA.variant || "outline"}
                  >
                    {secondaryCTA.text}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Illustration */}
          {illustration && layout === "split" && (
            <div
              className="relative flex items-center justify-start sm:justify-center mt-8 sm:mt-0 sm:-mt-[70px] -ml-[104px] sm:-ml-[50px] md:-ml-[75px]"
              data-element="hero-illustration"
              data-illustration-present="true"
            >
              {illustration}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
