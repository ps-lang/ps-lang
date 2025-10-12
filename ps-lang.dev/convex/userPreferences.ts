import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Get user preferences by userId
 */
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const preference = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    return preference
  },
})

/**
 * Set or update user theme preference
 */
export const setTheme = mutation({
  args: {
    userId: v.string(),
    theme: v.string(), // "default" or "fermi"
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (existing) {
      // Update existing preference
      await ctx.db.patch(existing._id, {
        theme: args.theme,
        updatedAt: Date.now(),
      })
      return { success: true, updated: true }
    } else {
      // Create new preference
      await ctx.db.insert("userPreferences", {
        userId: args.userId,
        theme: args.theme,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return { success: true, created: true }
    }
  },
})

/**
 * Get theme preference for a user (convenience query)
 */
export const getTheme = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const preference = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    return preference?.theme || null
  },
})
