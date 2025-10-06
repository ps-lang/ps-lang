'use client'

import { useState } from 'react'
import Script from 'next/script'

/**
 * FAQSection - Global FAQ component with structured data
 *
 * @llms.txt
 * Reusable FAQ accordion component for PS-LANG site
 * Features:
 * - Accordion UI with expand/collapse
 * - JSON-LD structured data for SEO
 * - AI-friendly metadata
 * - Accessible keyboard navigation
 *
 * Usage:
 * <FAQSection
 *   title="Understanding Token Metrics"
 *   faqs={[
 *     { question: "...", answer: "..." }
 *   ]}
 * />
 */

export interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

interface FAQSectionProps {
  title: string
  subtitle?: string
  faqs: FAQItem[]
  className?: string
  // Agentic metadata
  page?: string
  component?: string
  dataStream?: string
}

export default function FAQSection({
  title,
  subtitle = 'FAQ',
  faqs,
  className = '',
  page = 'unknown',
  component = 'faq-section',
  dataStream = 'agentic_ux_v1'
}: FAQSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Generate JSON-LD structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof faq.answer === 'string' ? faq.answer : extractTextFromReactNode(faq.answer)
      }
    }))
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div
        className={`mb-20 mt-20 ${className}`}
        data-ps-lang-component={component}
        data-page={page}
        data-data-stream={dataStream}
        data-ps-lang-version="v0.1.0-alpha.1"
        data-agentic-signature={`${dataStream}:${component}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="mb-8 text-center">
            <div className="inline-block mb-4">
              <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">
                {subtitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
              {title}
            </h2>
          </div>

          <div className="border border-stone-300 bg-white">
            <div className="divide-y divide-stone-200">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  data-faq-item={index}
                  data-faq-question={faq.question}
                  data-interaction="faq-toggle"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full text-left p-6 sm:p-8 hover:bg-stone-50 transition-colors flex items-start justify-between gap-4"
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    data-tracking="faq-question-click"
                    data-faq-index={index}
                  >
                    <h3 className="text-base font-light text-stone-900 pr-4">
                      {faq.question}
                    </h3>
                    <span
                      className="text-stone-400 font-mono text-sm flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      {openFaqIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 sm:px-8 pb-6 sm:pb-8"
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <div className="text-sm text-stone-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Helper function to extract plain text from React nodes for JSON-LD
 * This ensures structured data contains clean text even when answer includes JSX
 */
function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join(' ')

  // For React elements, try to extract text from children
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as React.ReactElement
    if (element.props.children) {
      return extractTextFromReactNode(element.props.children)
    }
  }

  return ''
}
