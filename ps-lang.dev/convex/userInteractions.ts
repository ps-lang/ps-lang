import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Track a user interaction
export const track = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.string(),
    page: v.string(),
    pageId: v.optional(v.string()),
    interactionType: v.string(),
    category: v.string(),
    target: v.string(),
    value: v.optional(v.any()),
    metadata: v.optional(v.object({
      paperTitle: v.optional(v.string()),
      paperCategory: v.optional(v.string()),
      referrer: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      viewport: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const interactionId = await ctx.db.insert("userInteractions", {
      ...args,
      timestamp: Date.now(),
    });

    return interactionId;
  },
});

// Get interactions for a specific page
export const getByPage = query({
  args: {
    page: v.string(),
    pageId: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let interactions = await ctx.db
      .query("userInteractions")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .collect();

    if (args.pageId) {
      interactions = interactions.filter((i) => i.pageId === args.pageId);
    }

    if (args.category) {
      interactions = interactions.filter((i) => i.category === args.category);
    }

    return interactions;
  },
});

// Get aggregated metrics for a category
export const getMetrics = query({
  args: {
    page: v.string(),
    category: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let interactions = await ctx.db
      .query("userInteractions")
      .withIndex("by_page_and_category", (q) =>
        q.eq("page", args.page).eq("category", args.category)
      )
      .collect();

    // Filter by date range if provided
    if (args.startDate) {
      interactions = interactions.filter((i) => i.timestamp >= args.startDate!);
    }
    if (args.endDate) {
      interactions = interactions.filter((i) => i.timestamp <= args.endDate!);
    }

    // Aggregate by target
    const aggregated: Record<string, {
      target: string;
      count: number;
      uniqueSessions: number;
      likeCount: number;
      unlikeCount: number;
    }> = {};

    interactions.forEach((interaction) => {
      const target = interaction.target;

      if (!aggregated[target]) {
        aggregated[target] = {
          target,
          count: 0,
          uniqueSessions: 0,
          likeCount: 0,
          unlikeCount: 0,
        };
      }

      aggregated[target].count++;

      // Count likes/unlikes if value contains liked status
      if (interaction.value && typeof interaction.value === 'object') {
        if ('liked' in interaction.value) {
          if (interaction.value.liked) {
            aggregated[target].likeCount++;
          } else {
            aggregated[target].unlikeCount++;
          }
        }
      }
    });

    // Count unique sessions per target
    const sessionsByTarget: Record<string, Set<string>> = {};
    interactions.forEach((interaction) => {
      if (!sessionsByTarget[interaction.target]) {
        sessionsByTarget[interaction.target] = new Set();
      }
      sessionsByTarget[interaction.target].add(interaction.sessionId);
    });

    Object.keys(aggregated).forEach((target) => {
      aggregated[target].uniqueSessions = sessionsByTarget[target].size;
    });

    return Object.values(aggregated).sort((a, b) => b.count - a.count);
  },
});

// Get top interacted items across entire site
export const getTopInteractions = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    let interactions = await ctx.db
      .query("userInteractions")
      .order("desc")
      .collect();

    if (args.category) {
      interactions = interactions.filter((i) => i.category === args.category);
    }

    // Group by target
    const targetCounts: Record<string, number> = {};
    interactions.forEach((interaction) => {
      targetCounts[interaction.target] = (targetCounts[interaction.target] || 0) + 1;
    });

    return Object.entries(targetCounts)
      .map(([target, count]) => ({ target, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },
});

// Get user's interaction history
export const getUserHistory = query({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      return [];
    }

    const index = args.userId ? "by_userId" : "by_sessionId";
    const value = args.userId || args.sessionId!;

    const interactions = await ctx.db
      .query("userInteractions")
      .withIndex(index as any, (q: any) => q.eq(args.userId ? "userId" : "sessionId", value))
      .order("desc")
      .collect();

    return interactions;
  },
});

// Get all interactions for a specific user (for DSAR export)
export const getUserInteractions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const interactions = await ctx.db
      .query("userInteractions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return interactions.map(interaction => ({
      id: interaction._id,
      timestamp: new Date(interaction.timestamp).toISOString(),
      page: interaction.page,
      pageId: interaction.pageId,
      interactionType: interaction.interactionType,
      category: interaction.category,
      target: interaction.target,
      value: interaction.value,
      metadata: interaction.metadata,
    }));
  },
});
