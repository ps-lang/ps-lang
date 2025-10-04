import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Subscribe to newsletter
export const subscribe = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    interests: v.array(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const emailDomain = args.email.split('@')[1];

    // Check if email already exists
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing subscriber
      await ctx.db.patch(existing._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        interests: args.interests,
        source: args.source,
      });
      return existing._id;
    }

    // Create new subscriber
    const subscriberId = await ctx.db.insert("newsletter", {
      ...args,
      emailDomain,
      subscribedAt: Date.now(),
    });

    return subscriberId;
  },
});

// Get all subscribers (admin only)
export const getAllSubscribers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newsletter")
      .order("desc")
      .collect();
  },
});

// Get subscriber by email
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get subscriber count
export const getSubscriberCount = query({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db.query("newsletter").collect();
    return subscribers.length;
  },
});
