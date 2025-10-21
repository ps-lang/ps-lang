"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { filterForAgent, EXAMPLE_PROMPTS } from "@/lib/ps-lang-filter"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import FAQSection from "@/components/faq-section"
import { siteConfig } from "@/config/site"
import { useInteractionTracking } from "@/lib/useInteractionTracking"

type ViewMode = "original" | "enriched" | "agent-1" | "agent-2"
type Persona = "developer" | "analyst" | "designer" | "marketer" | "researcher" | "manager"

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS.original)
  const [viewMode, setViewMode] = useState<ViewMode>("original")
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [demoHeight, setDemoHeight] = useState(675)
  const [isResizing, setIsResizing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)
  const [selection, setSelection] = useState({ text: '', start: 0, end: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [enrichedPrompt, setEnrichedPrompt] = useState(EXAMPLE_PROMPTS.enriched)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Analytics tracking
  const { track } = useInteractionTracking('prompt_editor')

  // Track page load
  useEffect(() => {
    const startTime = Date.now()

    track({
      interactionType: 'page_load',
      category: 'navigation',
      target: 'prompt_editor',
      value: {
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
      },
    })

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      track({
        interactionType: 'page_exit',
        category: 'navigation',
        target: 'prompt_editor',
        value: {
          time_spent_seconds: timeSpent,
        },
      })
    }
  }, [track])

  const personaPrompts: Record<Persona, string[]> = {
    developer: [
      "Debug the authentication system in the user service. Check JWT token validation, session management, and password hashing. Provide a detailed fix with security best practices.",
      "Optimize database queries for the analytics dashboard. Review indexes, query performance, and caching strategies. Suggest improvements for handling 100k+ records.",
      "Implement a real-time WebSocket notification system with fallback to polling. Include connection recovery, message queuing, and client-side state management.",
      "Refactor the legacy payment processing module to use modern async/await patterns. Add comprehensive error handling and transaction rollback support.",
      "Build a CI/CD pipeline with automated testing, code quality checks, and deployment to staging and production environments using GitHub Actions.",
    ],
    analyst: [
      "Analyze Q4 2024 sales data and create a comprehensive report with revenue, customer acquisition, and product performance metrics. Highlight key trends and provide strategic recommendations.",
      "Identify patterns in user churn data across different subscription tiers. Analyze cohort behavior, engagement metrics, and suggest retention strategies.",
      "Create a predictive model for quarterly revenue forecasting based on historical sales, market trends, and seasonal patterns. Include confidence intervals.",
      "Examine customer support ticket data to identify common pain points, resolution times, and opportunities for automation or process improvement.",
      "Build a competitive analysis dashboard comparing our product metrics against top 3 competitors. Include pricing, features, market share, and customer satisfaction.",
    ],
    designer: [
      "Create a responsive landing page for a SaaS product with hero section, feature showcase, pricing tiers, and testimonials. Include mobile-first design and accessibility considerations.",
      "Design a comprehensive design system with color palette, typography scale, component library, and usage guidelines for our web and mobile applications.",
      "Redesign the onboarding flow to improve user activation rates. Include user research findings, wireframes, and interactive prototypes for 3 key screens.",
      "Create a dark mode theme that maintains brand consistency while reducing eye strain. Define color tokens, contrast ratios, and component variations.",
      "Design an admin dashboard with data visualization, user management, and system monitoring. Focus on information hierarchy and efficient task completion.",
    ],
    marketer: [
      "Develop a content marketing strategy for Q1 2025 targeting enterprise customers. Include blog topics, SEO keywords, distribution channels, and success metrics.",
      "Create a multi-channel campaign for product launch including email sequences, social media posts, landing pages, and paid ad copy with A/B testing variants.",
      "Analyze campaign performance across Google Ads, Facebook, and LinkedIn. Identify top-performing segments, recommend budget reallocation, and forecast ROI.",
      "Build a customer journey map from awareness to conversion. Identify touchpoints, pain points, and opportunities for personalization and automation.",
      "Design a referral program with incentive structure, messaging templates, tracking mechanisms, and viral loop optimization strategies.",
    ],
    researcher: [
      "Conduct a comprehensive literature review on transformer architectures in natural language processing. Summarize key innovations, benchmark results, and future directions.",
      "Design and execute a user research study to understand pain points in our checkout process. Include research plan, interview questions, and synthesis framework.",
      "Analyze the feasibility of implementing blockchain technology for supply chain transparency. Evaluate technical requirements, costs, benefits, and risks.",
      "Investigate emerging trends in edge computing and IoT for real-time data processing. Compare vendor solutions, use cases, and implementation considerations.",
      "Research privacy-preserving machine learning techniques including federated learning and differential privacy. Assess applicability to our healthcare product.",
    ],
    manager: [
      "Create a Q1 2025 roadmap for the engineering team. Prioritize features based on business impact, technical debt, and resource availability. Include timeline and milestones.",
      "Develop a hiring plan for scaling the product team from 12 to 20 people. Define roles, responsibilities, interview process, and onboarding program.",
      "Analyze team velocity and sprint metrics to identify bottlenecks in the development process. Recommend process improvements and tooling investments.",
      "Build a risk assessment framework for the upcoming platform migration. Identify dependencies, create mitigation strategies, and establish rollback procedures.",
      "Design a quarterly OKR framework aligned with company goals. Include team objectives, key results, tracking mechanisms, and review cadence.",
    ],
  }

  const parsePromptToPSL = (rawPrompt: string, persona?: Persona): string => {
    const timestamp = new Date().toISOString()
    const wordCount = rawPrompt.split(/\s+/).length
    const charCount = rawPrompt.length

    // Format similar to the example with cleaner structure
    let enrichedPrompt = `# ${persona?.charAt(0).toUpperCase()}${persona?.slice(1)} Prompt\n\n`

    // Main task zone
    enrichedPrompt += `<#. task: ${rawPrompt.split('.')[0]}... .#>\n\n`

    // Objective section
    enrichedPrompt += `## Objective\n${rawPrompt}\n\n`

    // Add persona-specific metadata
    if (persona === 'analyst') {
      enrichedPrompt += `## Required Metrics\n<$. metrics_required:\n  - revenue\n  - customer_acquisition\n  - product_performance\n.$>\n\n`
    } else if (persona === 'developer') {
      enrichedPrompt += `## Technical Requirements\n<@. requirements:\n  - code_quality\n  - test_coverage\n  - performance_metrics\n.@>\n\n`
    } else if (persona === 'designer') {
      enrichedPrompt += `## Design Specs\n<@. design_specs:\n  - responsive_layout\n  - accessibility\n  - brand_consistency\n.@>\n\n`
    } else if (persona === 'marketer') {
      enrichedPrompt += `## Campaign Goals\n<$. campaign_goals:\n  - conversion_rate\n  - engagement_metrics\n  - roi_targets\n.$>\n\n`
    } else if (persona === 'researcher') {
      enrichedPrompt += `## Research Scope\n<#. research_scope:\n  - literature_review\n  - methodology\n  - findings_synthesis\n.#>\n\n`
    } else if (persona === 'manager') {
      enrichedPrompt += `## Project Requirements\n<@. project_requirements:\n  - timeline_milestones\n  - resource_allocation\n  - success_criteria\n.@>\n\n`
    }

    // Analysis steps
    enrichedPrompt += `## Analysis Steps\n\n`
    enrichedPrompt += `<. debug_notes:\n  - Data validation: PASSED\n  - Date range: Q4 2024 (Oct-Dec)\n  - Cross-reference: Q3 baseline established\n.>\n\n`

    enrichedPrompt += `Make sure to highlight key trends and provide actionable recommendations.\n\n`

    // Output format
    enrichedPrompt += `<@. output_format:\n  type: structured_report\n  sections: [executive_summary, revenue_analysis, customer_metrics, product_performance, trends, recommendations]\n  charts: true\n.@>\n\n`

    enrichedPrompt += `---\n\n`

    // Zone metadata
    enrichedPrompt += `<.bm zone_metadata: type="passthrough", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`

    // Prompt metadata
    enrichedPrompt += `<.bm prompt_metadata: persona="${persona}", model="claude-sonnet-4.5", timestamp="${timestamp}", total_zones=4 .bm>`

    return enrichedPrompt
  }

  const loadPersonaPrompt = (persona: Persona) => {
    setSelectedPersona(persona)
    const prompts = personaPrompts[persona]
    const randomIndex = Math.floor(Math.random() * prompts.length)
    const rawPrompt = prompts[randomIndex]

    // Load raw prompt in the textarea
    setPrompt(rawPrompt)

    // Generate enriched version for .psl view
    const enriched = parsePromptToPSL(rawPrompt, persona)
    setEnrichedPrompt(enriched)

    // Track persona selection
    track({
      interactionType: 'persona_selected',
      category: 'prompt_type',
      target: persona,
      value: {
        prompt_length: rawPrompt.length,
        word_count: rawPrompt.split(/\s+/).length,
      },
    })
  }

  const insertZone = (zoneType: string) => {
    if (!textareaRef.current) return

    // Get cursor position
    const cursorPos = textareaRef.current.selectionStart
    const beforeCursor = prompt.substring(0, cursorPos)
    const afterCursor = prompt.substring(cursorPos)

    // Single-line zone insertion examples
    const zoneExamples = {
      'pass-through': '<#. task: analyze_sales_data .#>',
      'private': '<. debug_notes: data_validation_passed .>',
      'public': '<$. required_metrics: revenue, customer_acquisition, product_performance .$>',
      'action': '<@. output_format: structured_report with charts .@>',
      'question': '<?. clarification_needed: date_range and scope .?>',
      'benchmark': '<.bm ai_metadata: analysis_type=quarterly_sales, model=claude-sonnet-4.5 .bm>',
      'metadata': '<!. context: domain=business_analytics, complexity=moderate .!>',
      'config': '<~. settings: temperature=0.7, max_tokens=2000 .~>',
      'example': '<*. sample_output: Q4 revenue: $2.4M (+18% YoY) .*>'
    }

    const example = zoneExamples[zoneType as keyof typeof zoneExamples] || ''

    // Insert inline at cursor position with single space
    const needsSpaceBefore = beforeCursor.length > 0 && !beforeCursor.endsWith(' ') && !beforeCursor.endsWith('\n')
    const needsSpaceAfter = afterCursor.length > 0 && !afterCursor.startsWith(' ') && !afterCursor.startsWith('\n')

    const newPrompt = beforeCursor +
                      (needsSpaceBefore ? ' ' : '') +
                      example +
                      (needsSpaceAfter ? ' ' : '') +
                      afterCursor
    setPrompt(newPrompt)

    // Update enriched view - parse the prompt to add AI metadata to all zones
    const enriched = parsePromptToPSL(newPrompt, selectedPersona || undefined)
    setEnrichedPrompt(enriched)

    // Track zone insertion
    track({
      interactionType: 'zone_inserted',
      category: 'zone_type',
      target: zoneType,
      value: {
        cursor_position: cursorPos,
        prompt_length: newPrompt.length,
      },
    })

    // Move cursor after inserted zone
    setTimeout(() => {
      if (textareaRef.current) {
        const offset = (needsSpaceBefore ? 1 : 0) + example.length + (needsSpaceAfter ? 1 : 0)
        const newCursorPos = cursorPos + offset
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const wrapSelection = (zoneType: string) => {
    if (!selection.text) return

    const zoneWrappers = {
      'pass-through': { start: '<#. ', end: ' .#>' },
      'private': { start: '<. ', end: ' .>' },
      'public': { start: '<$. ', end: ' .$>' },
      'action': { start: '<@. ', end: ' .@>' },
      'question': { start: '<?. ', end: ' .?>' },
      'benchmark': { start: '<.bm ', end: ' .bm>' },
      'metadata': { start: '<!. ', end: ' .!>' },
      'config': { start: '<~. ', end: ' .~>' },
      'example': { start: '<*. ', end: ' .*>' }
    }

    const wrapper = zoneWrappers[zoneType as keyof typeof zoneWrappers]
    if (!wrapper) return

    const before = prompt.substring(0, selection.start)
    const selected = selection.text
    const after = prompt.substring(selection.end)

    const newPrompt = before + wrapper.start + selected + wrapper.end + after
    setPrompt(newPrompt)

    // Update enriched view - parse to add AI metadata to all zones
    const enriched = parsePromptToPSL(newPrompt, selectedPersona || undefined)
    setEnrichedPrompt(enriched)
    setShowTooltip(false)

    // Track text wrapping
    track({
      interactionType: 'text_wrapped',
      category: 'zone_type',
      target: zoneType,
      value: {
        selected_text_length: selected.length,
        selected_word_count: selected.split(/\s+/).length,
      },
    })
  }

  const handleTextSelect = useCallback(() => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const text = textareaRef.current.value.substring(start, end)

    if (text.length > 0) {
      setSelection({ text, start, end })

      // Calculate position based on cursor position in textarea
      const textarea = textareaRef.current
      const textBeforeSelection = textarea.value.substring(0, start)
      const lines = textBeforeSelection.split('\n')
      const currentLine = lines.length
      const charInLine = lines[lines.length - 1].length

      // Get textarea metrics
      const rect = textarea.getBoundingClientRect()
      const lineHeight = 21 // Based on leading-[1.6] with text-[13px]
      const charWidth = 7.8 // Approximate mono font character width

      // Calculate approximate position
      const x = rect.left + 16 + (charWidth * charInLine) // 16px for padding
      const y = rect.top + 12 + (lineHeight * (currentLine - 1)) // 12px for top padding

      setTooltipPosition({ x, y: y - 70 })
      setShowTooltip(true)
    } else {
      setShowTooltip(false)
    }
  }, [])

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showTooltip && textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        setShowTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTooltip])

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsResizing(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setStartY(clientY)
    setStartHeight(demoHeight)
    e.preventDefault()
  }

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return

      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      const deltaY = clientY - startY
      const newHeight = Math.max(450, Math.min(1200, startHeight + deltaY))
      setDemoHeight(newHeight)
    }

    const handleResizeEnd = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('touchmove', handleResizeMove)
      document.addEventListener('touchend', handleResizeEnd)
      document.body.style.cursor = 'ns-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
      document.removeEventListener('touchmove', handleResizeMove)
      document.removeEventListener('touchend', handleResizeEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, startY, startHeight])

  const filterResult = filterForAgent(enrichedPrompt, "agent-b")

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-wide">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Home</Link>
          <span className="text-stone-300">→</span>
          <Link href="/playground" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Playground</Link>
          <span className="text-stone-300">→</span>
          <span className="text-stone-900 font-semibold uppercase">1-Shot Prompt Editor</span>
        </nav>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-4 pb-8 sm:pt-6 sm:pb-10">
          <div className="text-center">
            <div className="inline-block mb-4 sm:mb-6">
              <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Interactive Demo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4 sm:mb-6 tracking-tight">
              PromptScript Playground
            </h1>
            <p className="text-base sm:text-lg text-stone-600 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-light">
              Small syntax investment → Compounding efficiency gains
            </p>
            <p className="text-sm text-stone-500 max-w-xl mx-auto font-light">
              Watch how .psl syntax engineering improves metrics over time
            </p>
          </div>
        </div>

        {/* 1-Shot Prompt Editor */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-typewriter font-bold text-ink text-lg">1-Shot Prompt Editor</h3>
              <p className="font-mono text-xs text-stone-500 mt-1">See how PS-LANG zones transform your prompts</p>
            </div>
          </div>

          {/* Single window with sidebar */}
          <div className="bg-white border border-stone-300/80 rounded-2xl overflow-hidden shadow-lg">
            {/* Header bar with traffic lights */}
            <div className="bg-gradient-to-b from-stone-200 to-stone-150 border-b border-stone-300/60">
              <div className="px-4 py-3 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA42] border border-[#24A53B] shadow-sm"></div>
                </div>
                <div className="text-xs font-mono text-stone-600 font-medium">
                  Prompt Builder v0.2.4-alpha
                </div>
              </div>
            </div>

            {/* Content area with sidebar */}
            <div className="relative flex flex-col md:flex-row" style={{ minHeight: `${demoHeight}px` }}>
              {/* Sidebar */}
              <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50/50 p-5 overflow-y-auto">
                <h4 className="font-typewriter font-semibold text-sm text-[#2D1300] mb-4">Prompt Editor</h4>

                {/* Persona Selector */}
                <div className="mb-6">
                  <h5 className="text-xs font-typewriter text-stone-500 uppercase tracking-wider mb-3">Prompt Type</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => loadPersonaPrompt('developer')}
                      className={`aspect-square p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPersona === 'developer'
                          ? 'border-[#2D1300]/60 bg-[#2D1300]/5'
                          : 'border-stone-200 hover:border-[#2D1300]/40 bg-white'
                      }`}
                      title="Developer"
                    >
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span className="text-[9px] font-typewriter font-medium text-stone-600">Dev</span>
                    </button>
                    <button
                      onClick={() => loadPersonaPrompt('analyst')}
                      className={`aspect-square p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPersona === 'analyst'
                          ? 'border-[#2D1300]/60 bg-[#2D1300]/5'
                          : 'border-stone-200 hover:border-[#2D1300]/40 bg-white'
                      }`}
                      title="Analyst"
                    >
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-[9px] font-typewriter font-medium text-stone-600">Analyst</span>
                    </button>
                    <button
                      onClick={() => loadPersonaPrompt('designer')}
                      className={`aspect-square p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPersona === 'designer'
                          ? 'border-[#2D1300]/60 bg-[#2D1300]/5'
                          : 'border-stone-200 hover:border-[#2D1300]/40 bg-white'
                      }`}
                      title="Designer"
                    >
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span className="text-[9px] font-typewriter font-medium text-stone-600">Design</span>
                    </button>
                    <button
                      onClick={() => loadPersonaPrompt('marketer')}
                      className={`aspect-square p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPersona === 'marketer'
                          ? 'border-[#2D1300]/60 bg-[#2D1300]/5'
                          : 'border-stone-200 hover:border-[#2D1300]/40 bg-white'
                      }`}
                      title="Marketer"
                    >
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      <span className="text-[9px] font-typewriter font-medium text-stone-600">Market</span>
                    </button>
                    <button
                      onClick={() => loadPersonaPrompt('researcher')}
                      className={`aspect-square p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPersona === 'researcher'
                          ? 'border-[#2D1300]/60 bg-[#2D1300]/5'
                          : 'border-stone-200 hover:border-[#2D1300]/40 bg-white'
                      }`}
                      title="Researcher"
                    >
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-[9px] font-typewriter font-medium text-stone-600">Research</span>
                    </button>
                    <button
                      onClick={() => loadPersonaPrompt('manager')}
                      className={`aspect-square p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPersona === 'manager'
                          ? 'border-[#2D1300]/60 bg-[#2D1300]/5'
                          : 'border-stone-200 hover:border-[#2D1300]/40 bg-white'
                      }`}
                      title="Manager"
                    >
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-[9px] font-typewriter font-medium text-stone-600">Manage</span>
                    </button>
                  </div>
                </div>

                {/* Zone Helpers */}
                <div className="hidden md:block">
                  <h5 className="text-xs font-typewriter text-stone-500 uppercase tracking-wider mb-3">Insert Zone</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => insertZone('pass-through')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Pass-through zone - Visible to all agents"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;#.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Pass</span>
                    </button>
                    <button
                      onClick={() => insertZone('private')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Private zone - Hidden from agents"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Private</span>
                    </button>
                    <button
                      onClick={() => insertZone('public')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Public zone - Shared context"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;$.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Public</span>
                    </button>
                    <button
                      onClick={() => insertZone('action')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Action zone - Instructions & format"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;@.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Action</span>
                    </button>
                    <button
                      onClick={() => insertZone('question')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Question zone - Clarifications needed"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;?.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Question</span>
                    </button>
                    <button
                      onClick={() => insertZone('benchmark')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Benchmark zone - AI metadata"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;.bm</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Bench</span>
                    </button>
                    <button
                      onClick={() => insertZone('metadata')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Metadata zone - Additional context"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;!.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Meta</span>
                    </button>
                    <button
                      onClick={() => insertZone('config')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Config zone - Settings & parameters"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;~.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Config</span>
                    </button>
                    <button
                      onClick={() => insertZone('example')}
                      className="aspect-square p-2 rounded-lg border-2 border-stone-200 hover:border-[#2D1300]/40 bg-white transition-all flex flex-col items-center justify-center gap-0.5"
                      title="Example zone - Sample data"
                    >
                      <div className="font-mono text-[11px] font-bold text-stone-700">&lt;*.</div>
                      <span className="text-[8px] font-typewriter font-medium text-stone-500">Example</span>
                    </button>
                  </div>
                  <p className="text-[10px] font-typewriter text-stone-400 mt-3">
                    🚧 Demo WIP - Advanced parsing and automation features in development
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col relative" style={{ minHeight: `${demoHeight}px` }}>
                {/* Editable Prompt Section */}
                <div className="flex-none bg-white border-b-2 border-stone-300">
                  <div className="px-4 py-2 bg-stone-100/50">
                    <span className="text-[10px] font-typewriter text-stone-500 uppercase tracking-wider">Your Prompt</span>
                  </div>
                  <div className="p-4 relative">
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onMouseUp={handleTextSelect}
                      onKeyUp={handleTextSelect}
                      placeholder="Type or select a persona to load a prompt..."
                      readOnly
                      className="w-full h-32 font-mono text-[13px] leading-[1.6] text-stone-900 bg-transparent border-none focus:outline-none resize-none cursor-default select-text"
                    />

                    {/* Selection Tooltip */}
                    <AnimatePresence>
                      {showTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          className="fixed z-40 bg-white/98 backdrop-blur-md rounded-xl shadow-2xl border-2 border-[#2D1300]/20 p-2"
                          style={{
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <div className="text-[9px] font-typewriter text-stone-500 uppercase tracking-wider mb-2 px-2">Wrap with Zone</div>
                          <div className="grid grid-cols-6 gap-1">
                            <button
                              onClick={() => wrapSelection('pass-through')}
                              className="p-2 rounded-md hover:bg-[#2D1300]/10 transition-colors border border-stone-200"
                              title="Pass-through"
                            >
                              <div className="font-mono text-[10px] font-bold text-stone-700">&lt;#.</div>
                            </button>
                            <button
                              onClick={() => wrapSelection('private')}
                              className="p-2 rounded-md hover:bg-[#2D1300]/10 transition-colors border border-stone-200"
                              title="Private"
                            >
                              <div className="font-mono text-[10px] font-bold text-stone-700">&lt;.</div>
                            </button>
                            <button
                              onClick={() => wrapSelection('public')}
                              className="p-2 rounded-md hover:bg-[#2D1300]/10 transition-colors border border-stone-200"
                              title="Public"
                            >
                              <div className="font-mono text-[10px] font-bold text-stone-700">&lt;$.</div>
                            </button>
                            <button
                              onClick={() => wrapSelection('action')}
                              className="p-2 rounded-md hover:bg-[#2D1300]/10 transition-colors border border-stone-200"
                              title="Action"
                            >
                              <div className="font-mono text-[10px] font-bold text-stone-700">&lt;@.</div>
                            </button>
                            <button
                              onClick={() => wrapSelection('question')}
                              className="p-2 rounded-md hover:bg-[#2D1300]/10 transition-colors border border-stone-200"
                              title="Question"
                            >
                              <div className="font-mono text-[10px] font-bold text-stone-700">&lt;?.</div>
                            </button>
                            <button
                              onClick={() => wrapSelection('benchmark')}
                              className="p-2 rounded-md hover:bg-[#2D1300]/10 transition-colors border border-stone-200"
                              title="Benchmark"
                            >
                              <div className="font-mono text-[10px] font-bold text-stone-700">&lt;.bm</div>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Enriched.psl Section */}
                <div className="flex-1 bg-white overflow-auto">
                  <div className="px-4 py-2 bg-stone-100/50 sticky top-0 z-10">
                    <span className="text-[10px] font-typewriter text-stone-500 uppercase tracking-wider">Enriched.psl (Auto-generated WIP)</span>
                  </div>
                  <div className="p-4 font-mono text-[12px] leading-[1.6] text-stone-700 whitespace-pre-wrap">
                    {enrichedPrompt}
                  </div>
                </div>
              </div>
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
              className="h-2 bg-gradient-to-t from-stone-100 to-stone-50 border-t border-stone-200/80 cursor-ns-resize hover:bg-stone-200/80 transition-colors active:bg-stone-300 flex items-center justify-center group"
            >
              <div className="w-12 h-1 bg-stone-300 rounded-full group-hover:bg-stone-400 transition-colors"></div>
            </div>

            {/* Footer bar */}
            <div className="bg-gradient-to-t from-stone-100 to-stone-50 border-t border-stone-200/80 px-5 py-3.5 flex items-center justify-between">
              <div className="font-mono text-xs text-stone-600 font-medium">
                <span className="inline-flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${filterResult.zones.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`}></span>
                  <span className="font-semibold text-stone-700">{filterResult.zones.length}</span> zones detected in enriched version
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-stone-500">
                  Add zones to see AI metadata
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Disclaimer Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="border border-stone-300 bg-stone-50 p-8 sm:p-10">
          <h3 className="text-lg font-light text-stone-900 mb-5 tracking-tight">
            About This Demo
          </h3>
          <div className="space-y-5 text-sm text-stone-600 leading-relaxed max-w-2xl">
            <p>
              This live editor demonstrates how PS-LANG zone syntax transforms your prompts in real-time for better context control in multi-agent workflows.
            </p>
            <p>
              The transformations shown are examples for learning purposes. Real-world usage depends on your specific workflow, agent configuration, and context requirements.
            </p>
            <p className="font-medium text-stone-900">
              Try it with your own prompts to see how zones work!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        title="Understanding the Editor"
        faqs={[
          {
            question: "What is the 1-Shot Prompt Editor?",
            answer: "The 1-Shot Prompt Editor lets you write prompts and see in real-time how PS-LANG zones transform them. Select a persona, insert zone syntax, and watch how your prompt gets enriched with structured context control."
          },
          {
            question: "How do zone buttons work?",
            answer: "Click any zone button (Pass-through, Private, Public, etc.) to insert that zone syntax at your cursor position. Zones control what context gets passed between agents in multi-agent workflows."
          },
          {
            question: "What do the different personas do?",
            answer: "Personas (Developer, Analyst, Designer, etc.) provide role-specific example prompts to help you understand how different professionals might use PS-LANG zones in their workflows."
          },
          {
            question: "Can I use my own prompts?",
            answer: "This is currently a work-in-progress demo for learning and demonstration purposes. The editor shows example transformations to help you understand zone-based context control."
          }
        ]}
      />

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <div className="border border-stone-300 bg-gradient-to-br from-stone-50 to-white p-12 sm:p-16 text-center">
          <div className="inline-block mb-4">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Get Started</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-light text-stone-900 mb-6 tracking-tight">
            Ready to Use PS-LANG?
          </h3>
          <p className="text-base text-stone-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Start using PS-LANG zones in your prompts today, or install the CLI for advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={siteConfig.urls.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
            >
              View on GitHub →
            </a>
            <a
              href={siteConfig.urls.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 border border-stone-300 text-stone-900 font-light text-sm hover:border-stone-400 transition-colors"
            >
              Install CLI
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
