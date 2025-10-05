/**
 * PS-LANG Transformer
 * Converts AI conversation messages into structured PS-LANG super prompts
 */

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: number
}

interface TransformResult {
  pslPrompt: string
  metaTags: string[]
  zones: string[]
  privateSignals?: {
    userExpertiseLevel?: string
    timeToResolution?: number
    conversationTurns?: number
    codeQualityScore?: number
    agentAssistanceLevel?: string
  }
}

/**
 * Extract technical context from messages
 */
function extractTechnicalContext(messages: Message[]): string[] {
  const techKeywords = [
    "next.js",
    "react",
    "typescript",
    "javascript",
    "python",
    "rust",
    "go",
    "api",
    "database",
    "postgres",
    "mysql",
    "mongodb",
    "auth",
    "oauth",
    "jwt",
    "clerk",
    "convex",
    "tailwind",
    "css",
  ]

  const context: Set<string> = new Set()

  messages.forEach((msg) => {
    if (msg.role === "user") {
      const lower = msg.content.toLowerCase()
      techKeywords.forEach((keyword) => {
        if (lower.includes(keyword)) {
          context.add(keyword)
        }
      })
    }
  })

  return Array.from(context)
}

/**
 * Detect if conversation involves benchmarking/optimization
 */
function detectBenchmarkIntent(messages: Message[]): boolean {
  const benchmarkKeywords = [
    "optimize",
    "performance",
    "benchmark",
    "faster",
    "improve",
    "compare",
    "measure",
    "speed",
    "efficient",
  ]

  return messages.some((msg) => {
    if (msg.role === "user") {
      const lower = msg.content.toLowerCase()
      return benchmarkKeywords.some((keyword) => lower.includes(keyword))
    }
    return false
  })
}

/**
 * Extract meta-tags from conversation
 */
function extractMetaTags(messages: Message[]): string[] {
  const tags: string[] = []

  // Detect intent
  const firstUserMsg = messages.find((m) => m.role === "user")
  if (firstUserMsg) {
    const lower = firstUserMsg.content.toLowerCase()

    if (lower.includes("build") || lower.includes("create") || lower.includes("implement")) {
      tags.push("intent:implementation")
    } else if (lower.includes("fix") || lower.includes("debug") || lower.includes("error")) {
      tags.push("intent:debugging")
    } else if (lower.includes("optimize") || lower.includes("improve")) {
      tags.push("intent:optimization")
    } else if (lower.includes("review") || lower.includes("audit")) {
      tags.push("intent:review")
    } else {
      tags.push("intent:general")
    }
  }

  // Detect tech stack
  const techContext = extractTechnicalContext(messages)
  if (techContext.length > 0) {
    tags.push(`tech_stack:${techContext.join(",")}`)
  }

  // Detect complexity
  const avgMsgLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length
  if (avgMsgLength > 500) {
    tags.push("complexity:high")
  } else if (avgMsgLength > 200) {
    tags.push("complexity:medium")
  } else {
    tags.push("complexity:low")
  }

  return tags
}

/**
 * Extract private signals for agent negotiation
 */
function extractPrivateSignals(messages: Message[]): TransformResult["privateSignals"] {
  const conversationTurns = messages.length

  // Estimate expertise level based on message complexity
  const avgWordCount = messages.reduce((sum, m) => sum + m.content.split(" ").length, 0) / messages.length
  const userExpertiseLevel = avgWordCount > 100 ? "advanced" : avgWordCount > 50 ? "intermediate" : "beginner"

  // Estimate time to resolution (mock for now - would need actual timestamps)
  const timeToResolution = messages.length * 2 // rough estimate in minutes

  // Code quality score based on code block presence and structure
  const hasCodeBlocks = messages.some(m => m.content.includes("```"))
  const hasTests = messages.some(m => m.content.toLowerCase().includes("test"))
  const codeQualityScore = (hasCodeBlocks ? 0.5 : 0) + (hasTests ? 0.5 : 0)

  // Agent assistance level
  const assistantMessages = messages.filter(m => m.role === "assistant").length
  const agentAssistanceLevel = assistantMessages > 5 ? "high" : assistantMessages > 2 ? "medium" : "low"

  return {
    userExpertiseLevel,
    timeToResolution,
    conversationTurns,
    codeQualityScore,
    agentAssistanceLevel,
  }
}

/**
 * Transform conversation to PS-LANG format
 */
export function transformToPSLang(messages: Message[]): TransformResult {
  if (messages.length === 0) {
    return {
      pslPrompt: "",
      metaTags: [],
      zones: [],
      privateSignals: undefined,
    }
  }

  const zones: string[] = []
  const metaTags = extractMetaTags(messages)
  const techContext = extractTechnicalContext(messages)
  const hasBenchmarkIntent = detectBenchmarkIntent(messages)
  const privateSignals = extractPrivateSignals(messages)

  // Get the main user request (first user message)
  const mainRequest = messages.find((m) => m.role === "user")?.content || ""

  // Build PS-LANG prompt
  let pslPrompt = ""

  // Public zone - main request
  zones.push("public")
  pslPrompt += `<@.\n${mainRequest}\n.>\n\n`

  // Private zone - technical context
  if (techContext.length > 0) {
    zones.push("private")
    pslPrompt += `<#.\nTech stack: ${techContext.join(", ")}\n`

    // Add any follow-up context from user messages
    const followUpMessages = messages.filter((m, i) => m.role === "user" && i > 0)
    if (followUpMessages.length > 0) {
      pslPrompt += `\nAdditional context:\n`
      followUpMessages.forEach((msg) => {
        pslPrompt += `- ${msg.content.substring(0, 100)}${msg.content.length > 100 ? "..." : ""}\n`
      })
    }

    pslPrompt += `#>\n\n`
  }

  // Bookmark zone - benchmarking
  if (hasBenchmarkIntent) {
    zones.push("bookmark")
    pslPrompt += `<.bm\nBenchmark this implementation against industry standards.\nMeasure performance improvements and compare with best practices.\n.bm>`
  }

  return {
    pslPrompt: pslPrompt.trim(),
    metaTags,
    zones,
    privateSignals,
  }
}

/**
 * Extract conversation title from messages
 */
export function extractTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === "user")
  if (!firstUserMsg) return "Untitled Conversation"

  // Take first 60 characters of first message
  const title = firstUserMsg.content.substring(0, 60).trim()
  return title + (firstUserMsg.content.length > 60 ? "..." : "")
}
