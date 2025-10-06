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
    const timestamp = Date.now();

    // Build agentic metadata for data stream
    const agenticMetadata = {
      // User segmentation
      userSegment: emailDomain.includes('gmail.com') || emailDomain.includes('yahoo.com') ? 'consumer' : 'business',
      intentLevel: args.interests.length > 0 ? 'high_intent' : 'general_interest',

      // Workflow tracking
      workflowStage: 'lead_capture',
      conversionFunnel: 'newsletter_signup',
      dataStream: 'agentic_ux_v1',

      // Context metadata
      interestCount: args.interests.length,
      hasName: !!(args.firstName || args.lastName),
      sourceContext: args.source,

      // Platform metadata
      platformVersion: 'v0.1.0-alpha.1',
      capturedAt: timestamp
    };

    // Check if email already exists
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing subscriber with new metadata
      await ctx.db.patch(existing._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        interests: args.interests,
        source: args.source,
        agenticMetadata,
        updatedAt: timestamp,
      });
      return existing._id;
    }

    // Create new subscriber with agentic metadata
    const subscriberId = await ctx.db.insert("newsletter", {
      ...args,
      emailDomain,
      subscribedAt: timestamp,
      agenticMetadata,
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
