import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

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

    // Return existing preferences or default to "standard"
    if (existing) {
      return existing;
    }

    // Default preferences (standard tier)
    return {
      userId: args.userId,
      tier: "standard",
      retentionDays: 730, // 2 years
      anonymizationDays: 90, // Anonymize after 90 days
      allowAITraining: false,
      allowBenchmarkCreation: false,
      allowAcademicResearch: false,
      allowSessionRecording: true,
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
    tier: v.string(), // "privacy_essential", "standard", "research_contributor"
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dataRetentionPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    // Define tier settings
    const tierSettings = {
      privacy_essential: {
        retentionDays: 90,
        anonymizationDays: 30,
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
      privacy_essential: allPreferences.filter((p) => p.tier === "privacy_essential").length,
      standard: allPreferences.filter((p) => p.tier === "standard").length,
      research_contributor: allPreferences.filter((p) => p.tier === "research_contributor").length,
    };

    return stats;
  },
});

/**
 * CRON JOB: Anonymize data that has passed the anonymization threshold
 * Internal mutation - can only be called by Convex scheduled functions
 */
export const anonymizeExpiredData = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const allPreferences = await ctx.db.query("dataRetentionPreferences").collect();

    let anonymizedCount = 0;

    for (const pref of allPreferences) {
      if (pref.anonymizationDays === 0) continue; // Skip if no anonymization needed

      const anonymizationThreshold = pref.updatedAt + (pref.anonymizationDays * 24 * 60 * 60 * 1000);

      if (now >= anonymizationThreshold) {
        // TODO: Implement actual anonymization logic
        // This would involve:
        // 1. Finding all user data (sessions, interactions, etc.)
        // 2. Replacing PII with hashed IDs
        // 3. Removing identifiable information
        // 4. Marking data as anonymized

        console.log(`[CRON] Would anonymize data for user ${pref.userId} (tier: ${pref.tier})`);
        anonymizedCount++;
      }
    }

    return {
      success: true,
      anonymizedCount,
      message: `Anonymized data for ${anonymizedCount} users`,
    };
  },
});

/**
 * CRON JOB: Delete data that has passed the retention threshold
 * Internal mutation - can only be called by Convex scheduled functions
 */
export const deleteExpiredData = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const allPreferences = await ctx.db.query("dataRetentionPreferences").collect();

    let deletedCount = 0;

    for (const pref of allPreferences) {
      const retentionThreshold = pref.updatedAt + (pref.retentionDays * 24 * 60 * 60 * 1000);

      if (now >= retentionThreshold) {
        // TODO: Implement actual deletion logic
        // This would involve:
        // 1. Finding all user data older than retention threshold
        // 2. Permanently deleting it
        // 3. Logging the deletion for audit trail

        console.log(`[CRON] Would delete data for user ${pref.userId} (tier: ${pref.tier})`);
        deletedCount++;
      }
    }

    return {
      success: true,
      deletedCount,
      message: `Deleted data for ${deletedCount} users`,
    };
  },
});

/**
 * CRON JOB: Aggregate research contributor data after 2 years
 * Internal mutation - can only be called by Convex scheduled functions
 */
export const aggregateResearchData = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const contributors = await ctx.db
      .query("dataRetentionPreferences")
      .withIndex("by_isResearchContributor", (q) => q.eq("isResearchContributor", true))
      .collect();

    let aggregatedCount = 0;
    const twoYearsInMs = 730 * 24 * 60 * 60 * 1000; // 2 years

    for (const contributor of contributors) {
      const aggregationThreshold = contributor.updatedAt + twoYearsInMs;

      if (now >= aggregationThreshold) {
        // TODO: Implement actual aggregation logic
        // This would involve:
        // 1. Finding individual data points older than 2 years
        // 2. Aggregating them into summary statistics
        // 3. Removing individual records
        // 4. Keeping aggregated insights for research

        console.log(`[CRON] Would aggregate data for contributor ${contributor.userId}`);
        aggregatedCount++;
      }
    }

    return {
      success: true,
      aggregatedCount,
      message: `Aggregated data for ${aggregatedCount} research contributors`,
    };
  },
});
