import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const subscribe = mutation({
  args: {
    email: v.string(),
    frequency: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("papersNewsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existing) {
      // Update frequency if already subscribed
      await ctx.db.patch(existing._id, {
        frequency: args.frequency,
        isActive: true,
      })
      return existing._id
    }

    // Create new subscription
    const subscriptionId = await ctx.db.insert("papersNewsletter", {
      email: args.email,
      frequency: args.frequency,
      subscribedAt: Date.now(),
      isActive: true,
    })

    return subscriptionId
  },
})

export const unsubscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("papersNewsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (!subscription) {
      throw new Error("Subscription not found")
    }

    await ctx.db.patch(subscription._id, {
      isActive: false,
    })

    return { success: true }
  },
})

export const getAllSubscribers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("papersNewsletter")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect()
  },
})

export const getSubscribersByFrequency = query({
  args: {
    frequency: v.string(),
  },
  handler: async (ctx, args) => {
    const allActive = await ctx.db
      .query("papersNewsletter")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect()

    return allActive.filter((sub) => sub.frequency === args.frequency)
  },
})
