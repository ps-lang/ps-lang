import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Submit RLHF feedback on a conversation
 */
export const submitFeedback = mutation({
  args: {
    conversationId: v.id("syncedConversations"),
    userId: v.string(),
    messageId: v.optional(v.string()),
    feedback: v.string(), // "positive" or "negative"
    context: v.optional(
      v.object({
        zone: v.optional(v.string()),
        metaTags: v.optional(v.array(v.string())),
        agentType: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if user already gave feedback on this conversation/message
    const existing = await ctx.db
      .query("conversationFeedback")
      .withIndex("by_conversation_and_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", args.userId)
      )
      .filter((q) =>
        args.messageId
          ? q.eq(q.field("messageId"), args.messageId)
          : q.eq(q.field("messageId"), undefined)
      )
      .first()

    // If exists, update it; otherwise create new
    if (existing) {
      await ctx.db.patch(existing._id, {
        feedback: args.feedback,
        submittedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("conversationFeedback", {
        conversationId: args.conversationId,
        userId: args.userId,
        messageId: args.messageId,
        feedback: args.feedback,
        context: args.context,
        submittedAt: Date.now(),
      })
    }

    // Update aggregate RLHF score on conversation
    await updateConversationScore(ctx, args.conversationId)

    return { success: true }
  },
})

/**
 * Get feedback for a specific conversation
 */
export const getConversationFeedback = query({
  args: {
    conversationId: v.id("syncedConversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversationFeedback")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect()
  },
})

/**
 * Get user's feedback for a specific conversation
 */
export const getUserFeedback = query({
  args: {
    conversationId: v.id("syncedConversations"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversationFeedback")
      .withIndex("by_conversation_and_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", args.userId)
      )
      .first()
  },
})

/**
 * Helper: Update conversation aggregate RLHF score
 */
async function updateConversationScore(ctx: any, conversationId: any) {
  const allFeedback = await ctx.db
    .query("conversationFeedback")
    .withIndex("by_conversationId", (q: any) => q.eq("conversationId", conversationId))
    .collect()

  // Calculate aggregate score: (positive - negative) / total
  const positive = allFeedback.filter((f: any) => f.feedback === "positive").length
  const negative = allFeedback.filter((f: any) => f.feedback === "negative").length
  const total = positive + negative

  const rlhfScore = total > 0 ? (positive - negative) / total : 0

  // Update conversation
  await ctx.db.patch(conversationId, { rlhfScore })
}
