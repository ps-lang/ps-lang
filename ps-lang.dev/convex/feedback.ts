import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit feedback
export const submitFeedback = mutation({
  args: {
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.string(),
    feedbackType: v.string(),
    feedback: v.string(),
    rating: v.number(),
    emailUpdates: v.boolean(),
    version: v.string(),
  },
  handler: async (ctx, args) => {
    const feedbackId = await ctx.db.insert("feedback", {
      ...args,
      submittedAt: Date.now(),
    });

    return feedbackId;
  },
});

// Get all feedback (admin only)
export const getAllFeedback = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("feedback")
      .order("desc")
      .collect();
  },
});

// Get feedback by type
export const getFeedbackByType = query({
  args: {
    feedbackType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .filter((q) => q.eq(q.field("feedbackType"), args.feedbackType))
      .order("desc")
      .collect();
  },
});
