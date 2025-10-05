import { query } from "./_generated/server"
import { v } from "convex/values"

/**
 * Cross-Agent Query System
 * Allows agents to discover and access conversations based on meta-tags and signals
 */

/**
 * Query conversations by meta-tags with optional RLHF filtering
 */
export const queryByMetaTags = query({
  args: {
    userId: v.optional(v.string()),
    metaTags: v.array(v.string()), // e.g., ["intent:optimization", "tech_stack:react"]
    minRlhfScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let conversations = await ctx.db
      .query("syncedConversations")
      .collect()

    // Filter by userId if provided
    if (args.userId) {
      conversations = conversations.filter(c => c.userId === args.userId)
    }

    // Filter by meta-tags (must match ALL tags)
    conversations = conversations.filter(c => {
      const convMetaTags = c.metaTags || []
      return args.metaTags.every(tag => convMetaTags.some(t => t.includes(tag)))
    })

    // Filter by RLHF score
    if (args.minRlhfScore !== undefined) {
      conversations = conversations.filter(c => (c.rlhfScore || 0) >= (args.minRlhfScore || 0))
    }

    // Sort by RLHF score descending
    conversations.sort((a, b) => (b.rlhfScore || 0) - (a.rlhfScore || 0))

    // Limit results
    const limit = args.limit || 10
    return conversations.slice(0, limit)
  },
})

/**
 * Query high-quality conversations by expertise level and code quality
 */
export const queryByQuality = query({
  args: {
    userId: v.optional(v.string()),
    minExpertise: v.optional(v.string()), // "beginner", "intermediate", "advanced"
    minCodeQuality: v.optional(v.number()), // 0.0 to 1.0
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let conversations = await ctx.db
      .query("syncedConversations")
      .collect()

    // Filter by userId
    if (args.userId) {
      conversations = conversations.filter(c => c.userId === args.userId)
    }

    // Filter by expertise level
    if (args.minExpertise) {
      const expertiseOrder = { beginner: 1, intermediate: 2, advanced: 3 }
      const minLevel = expertiseOrder[args.minExpertise as keyof typeof expertiseOrder] || 1

      conversations = conversations.filter(c => {
        const privateSignals = c.privateSignals as any
        const level = privateSignals?.userExpertiseLevel || "beginner"
        const convLevel = expertiseOrder[level as keyof typeof expertiseOrder] || 1
        return convLevel >= minLevel
      })
    }

    // Filter by code quality
    if (args.minCodeQuality !== undefined) {
      conversations = conversations.filter(c => {
        const codeQuality = (c.privateSignals as any)?.codeQualityScore || 0
        return codeQuality >= (args.minCodeQuality || 0)
      })
    }

    // Sort by RLHF score
    conversations.sort((a, b) => (b.rlhfScore || 0) - (a.rlhfScore || 0))

    const limit = args.limit || 10
    return conversations.slice(0, limit)
  },
})

/**
 * Query conversations by zone usage
 */
export const queryByZones = query({
  args: {
    userId: v.optional(v.string()),
    zones: v.array(v.string()), // e.g., ["private", "bookmark"]
    matchAll: v.optional(v.boolean()), // true = must have ALL zones, false = any zone
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let conversations = await ctx.db
      .query("syncedConversations")
      .collect()

    if (args.userId) {
      conversations = conversations.filter(c => c.userId === args.userId)
    }

    const matchAll = args.matchAll !== false

    conversations = conversations.filter(c => {
      const convZones = c.zones || []
      if (matchAll) {
        return args.zones.every(zone => convZones.includes(zone))
      } else {
        return args.zones.some(zone => convZones.includes(zone))
      }
    })

    conversations.sort((a, b) => (b.rlhfScore || 0) - (a.rlhfScore || 0))

    const limit = args.limit || 10
    return conversations.slice(0, limit)
  },
})

/**
 * Get agent learning recommendations
 * Returns conversations most valuable for agent training
 */
export const getAgentRecommendations = query({
  args: {
    userId: v.optional(v.string()),
    focusArea: v.optional(v.string()), // "debugging", "optimization", "implementation"
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let conversations = await ctx.db
      .query("syncedConversations")
      .collect()

    if (args.userId) {
      conversations = conversations.filter(c => c.userId === args.userId)
    }

    // Filter by focus area if specified
    if (args.focusArea) {
      const intentTag = `intent:${args.focusArea}`
      conversations = conversations.filter(c =>
        (c.metaTags || []).some(tag => tag === intentTag)
      )
    }

    // Score conversations for learning value
    const scoredConversations = conversations.map(c => ({
      ...c,
      learningScore: calculateLearningScore(c),
    }))

    // Sort by learning score
    scoredConversations.sort((a, b) => (b.learningScore || 0) - (a.learningScore || 0))

    const limit = args.limit || 5
    return scoredConversations.slice(0, limit)
  },
})

/**
 * Calculate learning value score for agents
 */
function calculateLearningScore(conversation: any): number {
  let score = 0

  // RLHF score contribution (40%)
  score += (conversation.rlhfScore || 0) * 0.4

  // Code quality contribution (30%)
  const privateSignals = conversation.privateSignals as any
  score += (privateSignals?.codeQualityScore || 0) * 0.3

  // Conversation depth contribution (20%)
  const turnBonus = Math.min(privateSignals?.conversationTurns || 0, 10) / 10
  score += turnBonus * 0.2

  // Zone diversity contribution (10%)
  const zoneBonus = Math.min((conversation.zones || []).length, 3) / 3
  score += zoneBonus * 0.1

  return score
}
