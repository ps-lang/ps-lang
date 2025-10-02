"use client"

import Navigation from "@/components/navigation"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { filterForAgent, generateBenchmarkData, EXAMPLE_PROMPTS, type BenchmarkMetrics } from "@/lib/ps-lang-filter"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import FeedbackModal from "@/components/feedback-modal"

type ViewMode = "original" | "enriched" | "agent-1" | "agent-2"
type Persona = "developer" | "analyst" | "designer" | "marketer" | "researcher" | "manager"

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS.original)
  const [viewMode, setViewMode] = useState<ViewMode>("original")
  const benchmarkData = useMemo(() => generateBenchmarkData(20), [])
  const [currentIteration, setCurrentIteration] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const metricView = "tokens" as "tokens" | "cost" | "rounds" | "time" // Fixed to tokens only for now
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [hoveredIteration, setHoveredIteration] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
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
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)

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
    // Check if prompt already has zones - if so, add metadata to existing zones
    const zoneRegex = /<([#$@?!~*]?)\.([^>]*)\1\.?>/g
    const hasZones = zoneRegex.test(rawPrompt)

    if (hasZones) {
      // Prompt has zones - add AI metadata after each zone
      let enriched = rawPrompt.replace(
        /<([#$@?!~*]?)\.([^>]*)\1\.?>/g,
        (match, prefix, content) => {
          const timestamp = new Date().toISOString()
          const wordCount = content.trim().split(/\s+/).length
          const charCount = content.trim().length

          return `${match}\n<.bm zone_metadata: type="${prefix || 'passthrough'}", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n`
        }
      )

      // Add overall benchmark at the end
      if (persona) {
        const timestamp = new Date().toISOString()
        enriched += `\n\n<.bm prompt_metadata: persona="${persona}", model="claude-sonnet-4.5", timestamp="${timestamp}", total_zones=${(rawPrompt.match(zoneRegex) || []).length} .bm>`
      }

      return enriched
    }

    // No zones - parse and add zones with metadata
    const lines = rawPrompt.split('\n')
    let enrichedPrompt = ''
    let zoneCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (!line) {
        enrichedPrompt += '\n'
        continue
      }

      const timestamp = new Date().toISOString()
      const wordCount = line.split(/\s+/).length
      const charCount = line.length
      zoneCount++

      // Detect prompt patterns and wrap with appropriate zones + metadata
      if (line.toLowerCase().includes('analyze') || line.toLowerCase().includes('create') || line.toLowerCase().includes('build')) {
        enrichedPrompt += `<#. ${line} #.>\n<.bm zone_metadata: type="passthrough", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      } else if (line.includes('data') || line.includes('Q4') || line.includes('sales') || line.includes('revenue')) {
        enrichedPrompt += `<$. ${line} $.>\n<.bm zone_metadata: type="public", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      } else if (line.toLowerCase().includes('format') || line.toLowerCase().includes('output') || line.toLowerCase().includes('provide') || line.toLowerCase().includes('include')) {
        enrichedPrompt += `<@. ${line} @.>\n<.bm zone_metadata: type="action", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      } else if (line.toLowerCase().includes('debug') || line.toLowerCase().includes('note') || line.toLowerCase().includes('baseline')) {
        enrichedPrompt += `<. ${line} .>\n<.bm zone_metadata: type="private", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      } else if (line.toLowerCase().includes('example') || line.includes('sample')) {
        enrichedPrompt += `<*. ${line} *.>\n<.bm zone_metadata: type="example", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      } else if (line.toLowerCase().includes('context:') || line.toLowerCase().includes('domain:')) {
        enrichedPrompt += `<!. ${line} !.>\n<.bm zone_metadata: type="metadata", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      } else {
        enrichedPrompt += `<#. ${line} #.>\n<.bm zone_metadata: type="passthrough", words=${wordCount}, chars=${charCount}, parsed_at="${timestamp}" .bm>\n\n`
      }
    }

    // Add overall benchmark metadata at the end if persona provided
    if (persona) {
      const timestamp = new Date().toISOString()
      enrichedPrompt += `<.bm prompt_metadata: persona="${persona}", model="claude-sonnet-4.5", timestamp="${timestamp}", total_zones=${zoneCount} .bm>`
    }

    return enrichedPrompt.trim()
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
  }

  const insertZone = (zoneType: string) => {
    if (!textareaRef.current) return

    // Get cursor position
    const cursorPos = textareaRef.current.selectionStart
    const beforeCursor = prompt.substring(0, cursorPos)
    const afterCursor = prompt.substring(cursorPos)

    // Single-line zone insertion examples
    const zoneExamples = {
      'pass-through': '<#. task: analyze_sales_data #.>',
      'private': '<. debug_notes: data_validation_passed .>',
      'public': '<$. required_metrics: revenue, customer_acquisition, product_performance $.>',
      'action': '<@. output_format: structured_report with charts @.>',
      'question': '<?. clarification_needed: date_range and scope ?.>',
      'benchmark': '<.bm ai_metadata: analysis_type=quarterly_sales, model=claude-sonnet-4.5 .bm>',
      'metadata': '<!. context: domain=business_analytics, complexity=moderate !.>',
      'config': '<~. settings: temperature=0.7, max_tokens=2000 ~.>',
      'example': '<*. sample_output: Q4 revenue: $2.4M (+18% YoY) *.>'
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
      'pass-through': { start: '<#. ', end: ' #.>' },
      'private': { start: '<. ', end: ' .>' },
      'public': { start: '<$. ', end: ' $.>' },
      'action': { start: '<@. ', end: ' @.>' },
      'question': { start: '<?. ', end: ' ?.>' },
      'benchmark': { start: '<.bm ', end: ' .bm>' },
      'metadata': { start: '<!. ', end: ' !.>' },
      'config': { start: '<~. ', end: ' ~.>' },
      'example': { start: '<*. ', end: ' *.>' }
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

  // Auto-play animation
  useEffect(() => {
    if (isPlaying && currentIteration < 20) {
      const timer = setTimeout(() => {
        setCurrentIteration(prev => prev + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (currentIteration >= 20) {
      setIsPlaying(false)
      setHasPlayedOnce(true)
    }
  }, [isPlaying, currentIteration])

  const filterResult = filterForAgent(prompt, "agent-b")
  const currentMetrics = benchmarkData[currentIteration - 1]
  const displayIteration = hoveredIteration || currentIteration
  const displayMetrics = benchmarkData[displayIteration - 1]

  // Calculate cumulative totals
  const getCumulativeTotals = (upToIteration: number) => {
    const data = benchmarkData.slice(0, upToIteration)
    const regularTotal = data.reduce((sum, m) => sum + m.regular.tokens, 0)
    const psLangTotal = data.reduce((sum, m) => sum + m.psLang.tokens, 0)
    const tokensSaved = regularTotal - psLangTotal
    const savingsPercentage = ((tokensSaved / regularTotal) * 100).toFixed(1)

    return {
      regularTotal,
      psLangTotal,
      tokensSaved,
      savingsPercentage
    }
  }

  const cumulativeData = getCumulativeTotals(displayIteration)

  const getMetricLabel = () => {
    switch (metricView) {
      case "tokens": return "Tokens Used"
      case "cost": return "Cost (¢)"
      case "rounds": return "Rounds"
      case "time": return "Response Time (s)"
    }
  }

  // Transform data for Recharts
  const chartData = benchmarkData.map((m, i) => {
    let regularValue = 0
    let psLangValue = 0
    let regularProjection = null
    let psLangProjection = null

    // Get the actual value based on metric
    const getValue = (data: any) => {
      switch (metricView) {
        case "tokens":
          return data.tokens
        case "cost":
          return data.cost * 1000
        case "rounds":
          return data.rounds
        case "time":
          return data.timeMs / 1000
        default:
          return 0
      }
    }

    // First play: show all data progressively
    if (!hasPlayedOnce && i < currentIteration) {
      regularValue = getValue(m.regular)
      psLangValue = getValue(m.psLang)
    }
    // After first play: show active + projection
    else if (hasPlayedOnce) {
      if (i < currentIteration) {
        // Active data (solid lines)
        regularValue = getValue(m.regular)
        psLangValue = getValue(m.psLang)
      } else {
        // Projection data (dashed lines) - includes current point for connection
        regularProjection = getValue(m.regular)
        psLangProjection = getValue(m.psLang)
      }
    }

    return {
      iteration: i + 1,
      "Regular Prompting": regularValue || null,
      "PS-LANG": psLangValue || null,
      // Projection starts from currentIteration-1 to connect with active line
      "Regular Prompting Projection": (hasPlayedOnce && i >= currentIteration - 1) ? getValue(m.regular) : null,
      "PS-LANG Projection": (hasPlayedOnce && i >= currentIteration - 1) ? getValue(m.psLang) : null
    }
  })

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="paper-card stacked-papers p-8 mb-8">
          <h1 className="font-editorial text-4xl font-bold text-ink mb-4">
            PS-LANG Playground
          </h1>
          <p className="font-editorial text-xl text-ink-light mb-2">
            Small syntax investment → Compounding efficiency gains
          </p>
          <p className="font-typewriter text-sm text-ink-light">
            Watch how .psl syntax engineering improves metrics over time
          </p>
        </div>

        {/* Full-Screen Timeline Graph */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="font-typewriter font-bold text-ink text-lg">Iteration Performance: Tokens Used</h3>
          </div>

          {/* Single window with tabs */}
          <div className="bg-white border border-stone-300/80 rounded-2xl overflow-hidden shadow-lg">
            {/* Header bar with traffic lights */}
            <div className="bg-gradient-to-b from-stone-200 to-stone-150 border-b border-stone-300/60 relative z-10">
              <div className="px-4 py-3 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA42] border border-[#24A53B] shadow-sm"></div>
                </div>

                <div className="text-xs font-mono text-stone-600 font-medium flex-1">
                  Token Usage Comparison
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => setCurrentIteration(1)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-stone-600 hover:text-stone-900 transition-colors"
                  title="Reset to iteration 1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Graph Content */}
            <div className="relative h-[500px] bg-gradient-to-br from-white to-stone-50 p-8 overflow-hidden">
              {/* Background Prompts - Aesthetic */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                {/* Top row */}
                <motion.div
                  className="absolute top-4 left-[20%] font-typewriter text-[11px] text-stone-300/20 max-w-[200px] blur-[1px] leading-relaxed"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: currentIteration > 1 ? 0.08 : 0.6, y: 0 }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                >
                  Analyze Q4 sales data with revenue metrics...
                </motion.div>
                <motion.div
                  className="absolute top-6 right-[35%] font-typewriter text-[10px] text-stone-300/15 max-w-[180px] blur-[1px] leading-relaxed rotate-[1deg]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: currentIteration > 1 ? 0.06 : 0.5, scale: 1 }}
                  transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.3 }}
                >
                  Build CI/CD pipeline with automated testing...
                </motion.div>
                <motion.div
                  className="absolute top-8 right-12 font-typewriter text-[11px] text-stone-300/18 max-w-[190px] blur-[1px] leading-relaxed"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: currentIteration > 1 ? 0.07 : 0.55, x: 0 }}
                  transition={{ duration: 2.2, delay: 1.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.5 }}
                >
                  Debug authentication system. Check JWT validation...
                </motion.div>

                {/* Upper middle row */}
                <motion.div
                  className="absolute top-28 left-[15%] font-typewriter text-[10px] text-stone-300/14 max-w-[170px] blur-[1px] leading-relaxed rotate-[-1deg]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: currentIteration > 1 ? 0.05 : 0.48, x: 0 }}
                  transition={{ duration: 2.4, delay: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.1 }}
                >
                  Design comprehensive design system with component library...
                </motion.div>
                <motion.div
                  className="absolute top-32 left-[60%] font-typewriter text-[11px] text-stone-300/22 max-w-[185px] blur-[1px] leading-relaxed"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: currentIteration > 1 ? 0.09 : 0.62, y: 0 }}
                  transition={{ duration: 2.1, delay: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.4 }}
                >
                  Create multi-channel campaign for product launch...
                </motion.div>

                {/* Center row */}
                <motion.div
                  className="absolute top-52 left-[18%] font-typewriter text-[12px] text-stone-300/20 max-w-[210px] blur-[1px] leading-relaxed rotate-[2deg]"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: currentIteration > 1 ? 0.08 : 0.58, scale: 1 }}
                  transition={{ duration: 2.6, delay: 1.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.2 }}
                >
                  Optimize database queries for analytics dashboard...
                </motion.div>
                <motion.div
                  className="absolute top-56 right-[20%] font-typewriter text-[10px] text-stone-300/16 max-w-[175px] blur-[1px] leading-relaxed rotate-[-2deg]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: currentIteration > 1 ? 0.06 : 0.52, y: 0 }}
                  transition={{ duration: 2.3, delay: 1.1, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.6 }}
                >
                  Research privacy-preserving ML techniques...
                </motion.div>

                {/* Lower middle row */}
                <motion.div
                  className="absolute bottom-[180px] left-[25%] font-typewriter text-[11px] text-stone-300/18 max-w-[195px] blur-[1px] leading-relaxed"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: currentIteration > 1 ? 0.07 : 0.56, x: 0 }}
                  transition={{ duration: 2.2, delay: 0.9, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.7 }}
                >
                  Develop hiring plan for scaling product team...
                </motion.div>
                <motion.div
                  className="absolute bottom-[160px] right-[8%] font-typewriter text-[10px] text-stone-300/16 max-w-[180px] blur-[1px] leading-relaxed rotate-[1deg]"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: currentIteration > 1 ? 0.06 : 0.54, scale: 1 }}
                  transition={{ duration: 2.5, delay: 1.4, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.3 }}
                >
                  Identify patterns in user churn data across tiers...
                </motion.div>

                {/* Bottom row - Keep away from axis */}
                <motion.div
                  className="absolute bottom-[90px] left-[25%] font-typewriter text-[12px] text-stone-300/24 max-w-[220px] blur-[1px] leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: currentIteration > 1 ? 0.09 : 0.65, y: 0 }}
                  transition={{ duration: 2.1, delay: 2, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.2 }}
                >
                  Create responsive landing page with hero section...
                </motion.div>
                <motion.div
                  className="absolute bottom-[100px] left-[60%] font-typewriter text-[10px] text-stone-300/15 max-w-[170px] blur-[1px] leading-relaxed rotate-[-1deg]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: currentIteration > 1 ? 0.06 : 0.5, y: 0 }}
                  transition={{ duration: 2.4, delay: 0.7, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.5 }}
                >
                  Redesign onboarding flow to improve activation...
                </motion.div>
                <motion.div
                  className="absolute bottom-[95px] right-[15%] font-typewriter text-[11px] text-stone-300/20 max-w-[200px] blur-[1px] leading-relaxed rotate-[1deg]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: currentIteration > 1 ? 0.08 : 0.6, x: 0 }}
                  transition={{ duration: 2.3, delay: 1.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.4 }}
                >
                  Implement user authentication with email verification...
                </motion.div>

                {/* Extra scattered prompts */}
                <motion.div
                  className="absolute top-[120px] right-[45%] font-typewriter text-[10px] text-stone-300/14 max-w-[160px] blur-[1px] leading-relaxed rotate-[2deg]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: currentIteration > 1 ? 0.05 : 0.46, scale: 1 }}
                  transition={{ duration: 2.7, delay: 1.3, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.1 }}
                >
                  Analyze team velocity metrics to identify bottlenecks...
                </motion.div>
                <motion.div
                  className="absolute bottom-[240px] left-[50%] font-typewriter text-[11px] text-stone-300/20 max-w-[185px] blur-[1px] leading-relaxed rotate-[-1deg]"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: currentIteration > 1 ? 0.08 : 0.58, x: 0 }}
                  transition={{ duration: 2.2, delay: 1.7, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.6 }}
                >
                  Build customer journey map from awareness to conversion...
                </motion.div>
              </div>

              {/* Play Button Overlay */}
              <AnimatePresence>
                {!isPlaying && currentIteration === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-stone-400/60 backdrop-blur-sm cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 rounded-full bg-[#2D1300] backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-[#2D1300]"
                    >
                      <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="w-full h-full cursor-crosshair relative z-0"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false)
                  setHoveredIteration(null)
                }}
                onTouchStart={() => {
                  setIsHovering(true)
                  setIsPlaying(false)
                }}
                onTouchEnd={() => {
                  setIsHovering(false)
                  setHoveredIteration(null)
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 50, right: 40, left: 10, bottom: 50 }}
                    onMouseMove={(e: any) => {
                      if (e && e.activeLabel) {
                        const iteration = parseInt(e.activeLabel)
                        setHoveredIteration(iteration)
                        setCurrentIteration(iteration)
                        setIsPlaying(false)
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="0" stroke="#e7e5e4" strokeOpacity={0.4} vertical={false} />
                    <XAxis
                      dataKey="iteration"
                      stroke="none"
                      tick={{ fill: '#a8a29e', fontSize: 13, fontFamily: 'var(--font-typewriter)', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      domain={[1, 20]}
                      ticks={[1, 5, 10, 15, 20]}
                    />
                    <YAxis
                      stroke="none"
                      tick={{ fill: '#a8a29e', fontSize: 13, fontFamily: 'var(--font-typewriter)', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      width={70}
                      domain={[0, 'dataMax + 3000']}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;

                        return (
                          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/50 p-5 min-w-[200px]">
                            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-typewriter font-semibold mb-3">
                              Iteration {label}
                            </div>
                            <div className="space-y-2.5">
                              {payload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-6">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2.5 h-2.5 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs font-typewriter text-stone-600 font-medium">
                                      {entry.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-typewriter font-bold text-[#2D1300] tabular-nums">
                                    {entry.value ? `${(entry.value / 1000).toFixed(1)}k` : '0k'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                    {/* Projection Lines (dashed, gray) - shown after first play */}
                    {hasPlayedOnce && (
                      <>
                        <Line
                          type="monotone"
                          dataKey="Regular Prompting Projection"
                          stroke="#DC2626"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          strokeOpacity={0.3}
                          dot={{ fill: '#DC2626', r: 4, strokeWidth: 0, fillOpacity: 0.3 }}
                          activeDot={false}
                          isAnimationActive={false}
                          connectNulls={true}
                        />
                        <Line
                          type="monotone"
                          dataKey="PS-LANG Projection"
                          stroke="#16A34A"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          strokeOpacity={0.3}
                          dot={{ fill: '#16A34A', r: 4, strokeWidth: 0, fillOpacity: 0.3 }}
                          activeDot={false}
                          isAnimationActive={false}
                          connectNulls={true}
                        />
                      </>
                    )}

                    {/* Active Lines (solid) */}
                    <Line
                      type="monotone"
                      dataKey="Regular Prompting"
                      stroke="#DC2626"
                      strokeWidth={2.5}
                      dot={{
                        fill: '#DC2626',
                        r: 5,
                        strokeWidth: 0
                      }}
                      activeDot={{ r: 7, fill: '#DC2626', stroke: '#fff', strokeWidth: 3 }}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      animationBegin={0}
                      isAnimationActive={true}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="PS-LANG"
                      stroke="#16A34A"
                      strokeWidth={2.5}
                      dot={{
                        fill: '#16A34A',
                        r: 5,
                        strokeWidth: 0
                      }}
                      activeDot={{ r: 7, fill: '#16A34A', stroke: '#fff', strokeWidth: 3 }}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      animationBegin={0}
                      isAnimationActive={true}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Footer bar with metrics and legend */}
            {displayMetrics && currentIteration > 1 && (
              <div className="bg-gradient-to-t from-stone-100/50 to-white border-t border-stone-200/60 px-8 py-6">
                {/* Legend - Always visible with cumulative totals */}
                <div className="flex items-center justify-center gap-8 mb-6 pb-4 border-b border-stone-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#DC2626]"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-typewriter font-medium text-stone-600">
                        Regular Prompting
                      </span>
                      <span className="text-xs font-typewriter text-stone-400">
                        {(cumulativeData.regularTotal / 1000).toFixed(1)}k tokens total
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-typewriter font-medium text-stone-600">
                        PS-LANG
                      </span>
                      <span className="text-xs font-typewriter text-stone-400">
                        {(cumulativeData.psLangTotal / 1000).toFixed(1)}k tokens total
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex flex-col">
                      <span className="text-xs font-typewriter text-green-600 uppercase tracking-wide">Saved</span>
                      <span className="text-lg font-typewriter font-bold text-green-700">
                        {(cumulativeData.tokensSaved / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <motion.div
                  className="grid grid-cols-4 gap-6"
                  key={displayIteration}
                  initial={isHovering ? { opacity: 0.7 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-typewriter">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">Iteration</div>
                    <div className="text-2xl font-semibold text-[#2D1300] tracking-tight">{displayIteration}</div>
                  </div>
                  <div className="font-typewriter">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">Token Savings</div>
                    <div className="text-2xl font-semibold text-stamp-green tracking-tight">{displayMetrics.improvement.tokens}%</div>
                  </div>
                  <div className="font-typewriter">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">Time Saved</div>
                    <div className="text-2xl font-semibold text-stamp-green tracking-tight">{displayMetrics.improvement.time}%</div>
                  </div>
                  <div className="font-typewriter">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">Cost Savings</div>
                    <div className="text-2xl font-semibold text-stamp-green tracking-tight">{displayMetrics.improvement.cost}%</div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Live Prompt Editor */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-typewriter font-bold text-ink text-lg">Live Prompt Editor</h3>
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
                  Prompt Builder
                </div>
              </div>
            </div>

            {/* Content area with sidebar */}
            <div className="relative flex" style={{ height: `${demoHeight}px` }}>
              {/* Sidebar */}
              <div className="w-72 border-r border-stone-200 bg-stone-50/50 p-5 overflow-y-auto" style={{ height: `${demoHeight}px` }}>
                <h4 className="font-typewriter font-semibold text-sm text-[#2D1300] mb-4">Prompt Editor</h4>

                {/* Persona Selector */}
                <div className="mb-6">
                  <h5 className="text-xs font-typewriter text-stone-500 uppercase tracking-wider mb-3">Select Persona</h5>
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
                <div>
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
              <div className="flex-1 flex flex-col relative" style={{ height: `${demoHeight}px` }}>
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
                      className="w-full h-32 font-mono text-[13px] leading-[1.6] text-stone-900 bg-transparent border-none focus:outline-none resize-y min-h-[8rem] max-h-[24rem]"
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
                    {enrichedPrompt || EXAMPLE_PROMPTS.enriched}
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

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="paper-card p-8 bg-gradient-to-br from-[#2D1300]/5 to-stone-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-typewriter font-bold text-ink text-2xl mb-3">Need More Playground Utilities?</h2>
            <p className="font-typewriter text-sm text-ink-light mb-6">
              Help us build the tools you need. Request features, suggest improvements, or share your workflow challenges.
            </p>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-8 py-3 bg-[#2D1300] text-white font-typewriter text-sm rounded-lg hover:bg-[#2D1300]/90 transition-colors"
            >
              Request Features
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-200 text-stone-600 py-12 sm:py-16 border-t border-stone-300">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Zone-styled branding */}
          <div className="mb-8 sm:mb-10">
            <div className="font-mono text-xs sm:text-sm text-stone-400 mb-3">
              {"<#. 1-Shot Better · Open Source Multi-Agent Context Control #.>"}
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">PS-LANG</h3>
              <button
                type="button"
                onClick={() => {
                  setIsFeedbackModalOpen(true);
                  if (typeof window !== 'undefined' && (window as any).posthog) {
                    (window as any).posthog.capture('version_clicked', {
                      version: 'v0.1.0-alpha.1',
                      location: 'footer'
                    });
                  }
                }}
                className="text-sm text-stone-500 font-mono hover:text-stone-900 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center"
                data-track-section="footer-version"
              >
                v0.1.0-alpha.1
              </button>
            </div>
          </div>

          {/* Grid layout for links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 mb-10 sm:mb-12">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Legal</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Terms
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Code</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="https://github.com/vummo/ps-lang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.npmjs.com/package/ps-lang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  npm ↗
                </a>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-2">
              <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Zone Syntax</h4>
              <div className="font-mono text-xs text-stone-500 space-y-1.5 leading-relaxed">
                <div className="hover:text-stone-900 transition-colors cursor-default">{"<.> Current only"}</div>
                <div className="hover:text-stone-900 transition-colors cursor-default">{"<#.> Pass-through"}</div>
                <div className="hover:text-stone-900 transition-colors cursor-default">{"<@.> Active workspace"}</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <p className="text-center sm:text-left text-stone-500">
                © 2025{" "}
                <a
                  href="https://vummo.com"
                  target="_blank"
                  rel="noopener"
                  className="text-stone-600 hover:text-stone-900 transition-colors underline"
                  title="Vummo Labs - AI-powered development tools and multi-agent systems"
                >
                  Vummo Labs
                </a>
                {" "}·{" "}
                <a
                  href="https://github.com/vummo/ps-lang/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-900 transition-colors underline"
                  title="PS-LANG MIT License - Open source multi-agent context control"
                >
                  MIT License
                </a>
              </p>
              <p className="text-center sm:text-right text-stone-400 italic">
                Privacy-first by design
              </p>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} version="v0.1.0-alpha.1" />
    </div>
  )
}
