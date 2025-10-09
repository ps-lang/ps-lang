import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get or create user's data retention preferences
 */
export const getUserPreferences = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dataRetentionPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    // Return existing preferences or default to "privacy_first"
    if (existing) {
      return existing;
    }

    // Default preferences (privacy_first)
    return {
      userId: args.userId,
      tier: "privacy_first",
      retentionDays: 30,
      anonymizationDays: 0, // No anonymization - direct deletion
      allowAITraining: false,
      allowBenchmarkCreation: false,
      allowAcademicResearch: false,
      allowSessionRecording: false,
      isResearchContributor: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },
});

/**
 * Update user's data retention tier
 */
export const updateRetentionTier = mutation({
  args: {
    userId: v.string(),
    tier: v.string(), // "privacy_first", "standard", "research_contributor"
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dataRetentionPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    // Define tier settings
    const tierSettings = {
      privacy_first: {
        retentionDays: 30,
        anonymizationDays: 0,
        allowAITraining: false,
        allowBenchmarkCreation: false,
        allowAcademicResearch: false,
        allowSessionRecording: false,
        isResearchContributor: false,
      },
      standard: {
        retentionDays: 730, // 2 years
        anonymizationDays: 90,
        allowAITraining: false,
        allowBenchmarkCreation: false,
        allowAcademicResearch: false,
        allowSessionRecording: true,
        isResearchContributor: false,
      },
      research_contributor: {
        retentionDays: 1825, // 5 years
        anonymizationDays: 90,
        allowAITraining: true,
        allowBenchmarkCreation: true,
        allowAcademicResearch: true,
        allowSessionRecording: true,
        isResearchContributor: true,
      },
    };

    const settings = tierSettings[args.tier as keyof typeof tierSettings];
    if (!settings) {
      throw new Error(`Invalid tier: ${args.tier}`);
    }

    const now = Date.now();

    if (existing) {
      // Update existing preferences
      await ctx.db.patch(existing._id, {
        previousTier: existing.tier,
        tier: args.tier,
        tierChangedAt: now,
        ...settings,
        updatedAt: now,
        // Set researchContributorSince if upgrading to research_contributor
        ...(args.tier === "research_contributor" && !existing.isResearchContributor
          ? { researchContributorSince: now }
          : {}),
      });

      return { success: true, message: `Updated to ${args.tier} tier` };
    } else {
      // Create new preferences
      await ctx.db.insert("dataRetentionPreferences", {
        userId: args.userId,
        tier: args.tier,
        ...settings,
        createdAt: now,
        updatedAt: now,
        ...(args.tier === "research_contributor"
          ? { researchContributorSince: now }
          : {}),
      });

      return { success: true, message: `Created ${args.tier} tier preferences` };
    }
  },
});

/**
 * Update granular retention settings
 */
export const updateGranularSettings = mutation({
  args: {
    userId: v.string(),
    allowAITraining: v.optional(v.boolean()),
    allowBenchmarkCreation: v.optional(v.boolean()),
    allowAcademicResearch: v.optional(v.boolean()),
    allowPublicationCredit: v.optional(v.boolean()),
    allowRevenueShare: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dataRetentionPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!existing) {
      throw new Error("No retention preferences found. Please select a tier first.");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.allowAITraining !== undefined) updates.allowAITraining = args.allowAITraining;
    if (args.allowBenchmarkCreation !== undefined) updates.allowBenchmarkCreation = args.allowBenchmarkCreation;
    if (args.allowAcademicResearch !== undefined) updates.allowAcademicResearch = args.allowAcademicResearch;
    if (args.allowPublicationCredit !== undefined) updates.allowPublicationCredit = args.allowPublicationCredit;
    if (args.allowRevenueShare !== undefined) updates.allowRevenueShare = args.allowRevenueShare;

    await ctx.db.patch(existing._id, updates);

    return { success: true, message: "Updated granular settings" };
  },
});

/**
 * Get all research contributors (for admin dashboard)
 */
export const getResearchContributors = query({
  handler: async (ctx) => {
    const contributors = await ctx.db
      .query("dataRetentionPreferences")
      .withIndex("by_isResearchContributor", (q) => q.eq("isResearchContributor", true))
      .collect();

    return contributors;
  },
});

/**
 * Get tier statistics (for transparency reports)
 */
export const getTierStatistics = query({
  handler: async (ctx) => {
    const allPreferences = await ctx.db.query("dataRetentionPreferences").collect();

    const stats = {
      total: allPreferences.length,
      privacy_first: allPreferences.filter((p) => p.tier === "privacy_first").length,
      standard: allPreferences.filter((p) => p.tier === "standard").length,
      research_contributor: allPreferences.filter((p) => p.tier === "research_contributor").length,
    };

    return stats;
  },
});
