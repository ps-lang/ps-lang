import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Submit a new feature request
 */
export const submit = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    submittedBy: v.string(),
    submitterEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const featureId = await ctx.db.insert("featureRequests", {
      title: args.title,
      description: args.description,
      category: args.category,
      submittedBy: args.submittedBy,
      submitterEmail: args.submitterEmail,
      status: "proposed",
      upvotes: 0,
      downvotes: 0,
      netScore: 0,
      submittedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return featureId;
  },
});

/**
 * Vote on a feature request
 */
export const vote = mutation({
  args: {
    featureRequestId: v.id("featureRequests"),
    userId: v.string(),
    voteType: v.string(), // "upvote" or "downvote"
  },
  handler: async (ctx, args) => {
    // Check if user already voted
    const existingVote = await ctx.db
      .query("featureVotes")
      .withIndex("by_feature_and_user", (q) =>
        q.eq("featureRequestId", args.featureRequestId).eq("userId", args.userId)
      )
      .first();

    const feature = await ctx.db.get(args.featureRequestId);
    if (!feature) throw new Error("Feature request not found");

    // If changing vote, remove old vote counts
    if (existingVote) {
      if (existingVote.voteType === "upvote") {
        await ctx.db.patch(args.featureRequestId, {
          upvotes: Math.max(0, feature.upvotes - 1),
          netScore: feature.netScore - 1,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.patch(args.featureRequestId, {
          downvotes: Math.max(0, feature.downvotes - 1),
          netScore: feature.netScore + 1,
          updatedAt: Date.now(),
        });
      }
      await ctx.db.delete(existingVote._id);
    }

    // If same vote type, remove vote (toggle off)
    if (existingVote && existingVote.voteType === args.voteType) {
      return { action: "removed", voteType: args.voteType };
    }

    // Add new vote
    const refetchedFeature = await ctx.db.get(args.featureRequestId);
    if (!refetchedFeature) throw new Error("Feature request not found");

    await ctx.db.insert("featureVotes", {
      featureRequestId: args.featureRequestId,
      userId: args.userId,
      voteType: args.voteType,
      votedAt: Date.now(),
    });

    if (args.voteType === "upvote") {
      await ctx.db.patch(args.featureRequestId, {
        upvotes: refetchedFeature.upvotes + 1,
        netScore: refetchedFeature.netScore + 1,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.featureRequestId, {
        downvotes: refetchedFeature.downvotes + 1,
        netScore: refetchedFeature.netScore - 1,
        updatedAt: Date.now(),
      });
    }

    return { action: "added", voteType: args.voteType };
  },
});

/**
 * Get all feature requests sorted by net score
 */
export const list = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let allFeatures;

    // Use index if filtering by status
    if (args.status) {
      allFeatures = await ctx.db
        .query("featureRequests")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else if (args.category) {
      allFeatures = await ctx.db
        .query("featureRequests")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else {
      allFeatures = await ctx.db.query("featureRequests").collect();
    }

    // Apply additional filtering if needed
    if (args.status && args.category) {
      allFeatures = allFeatures.filter((f) => f.category === args.category);
    }

    // Sort by netScore descending
    return allFeatures.sort((a, b) => b.netScore - a.netScore);
  },
});

/**
 * Get user's vote for a feature
 */
export const getUserVote = query({
  args: {
    featureRequestId: v.id("featureRequests"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("featureVotes")
      .withIndex("by_feature_and_user", (q) =>
        q.eq("featureRequestId", args.featureRequestId).eq("userId", args.userId)
      )
      .first();

    return vote;
  },
});

/**
 * Get feature request by ID
 */
export const getById = query({
  args: { id: v.id("featureRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Update feature request status (admin only)
 */
export const updateStatus = mutation({
  args: {
    id: v.id("featureRequests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});
