import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record alpha signup
export const recordSignup = mutation({
  args: {
    email: v.string(),
    persona: v.string(),
    githubUrl: v.optional(v.string()),
    interestedIn: v.array(v.string()),
    clerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("alphaSignups")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing signup
      await ctx.db.patch(existing._id, {
        persona: args.persona,
        githubUrl: args.githubUrl,
        interestedIn: args.interestedIn,
        clerkUserId: args.clerkUserId,
      });
      return existing._id;
    }

    // Create new signup
    const signupId = await ctx.db.insert("alphaSignups", {
      ...args,
      signupDate: Date.now(),
    });

    return signupId;
  },
});

// Get all alpha signups (admin only)
export const getAllSignups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("alphaSignups")
      .order("desc")
      .collect();
  },
});

// Get signup by email
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alphaSignups")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get signup count
export const getSignupCount = query({
  args: {},
  handler: async (ctx) => {
    const signups = await ctx.db.query("alphaSignups").collect();
    return signups.length;
  },
});

// Delete alpha signup (admin only)
export const deleteSignup = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("alphaSignups")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { success: true };
    }

    return { success: false, error: "Signup not found" };
  },
});
