import { query } from "./_generated/server";

/**
 * Get users who recently downgraded to Essential tier
 * Perfect for re-engagement marketing campaigns
 */
export const getRecentDowngrades = query({
  handler: async (ctx) => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    const allPrefs = await ctx.db
      .query("dataRetentionPreferences")
      .collect();

    // Find users who:
    // 1. Are currently on Essential tier
    // 2. Switched within the last 30 days
    // 3. Previously had Standard or Research Contributor
    const recentDowngrades = allPrefs.filter((pref) => {
      const isEssential = pref.tier === "privacy_essential";
      const recentSwitch = pref.tierChangedAt && pref.tierChangedAt >= thirtyDaysAgo;
      const downgradedFromHigherTier =
        pref.previousTier === "standard" ||
        pref.previousTier === "research_contributor";

      return isEssential && recentSwitch && downgradedFromHigherTier;
    });

    // Calculate days until anonymization for each user
    return recentDowngrades.map((pref) => ({
      userId: pref.userId,
      downgradedFrom: pref.previousTier,
      downgradedAt: pref.tierChangedAt,
      daysUntilAnonymization: Math.ceil(
        (pref.updatedAt + (30 * 24 * 60 * 60 * 1000) - now) / (24 * 60 * 60 * 1000)
      ),
      // Include for personalized outreach
      hadSessionRecording: pref.previousTier === "research_contributor",
    }));
  },
});

/**
 * Get users approaching anonymization deadline
 * Useful for "last chance" campaigns
 */
export const getUsersNearAnonymization = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sevenDaysFromNow = now + (7 * 24 * 60 * 60 * 1000);

    const essentialUsers = await ctx.db
      .query("dataRetentionPreferences")
      .collect();

    // Find Essential tier users whose data will be anonymized in the next 7 days
    const nearDeadline = essentialUsers
      .filter((pref) => {
        if (pref.tier !== "privacy_essential") return false;

        const anonymizationDate = pref.updatedAt + (pref.anonymizationDays * 24 * 60 * 60 * 1000);
        return anonymizationDate <= sevenDaysFromNow && anonymizationDate > now;
      })
      .map((pref) => ({
        userId: pref.userId,
        daysUntilAnonymization: Math.ceil(
          (pref.updatedAt + (pref.anonymizationDays * 24 * 60 * 60 * 1000) - now) / (24 * 60 * 60 * 1000)
        ),
        previousTier: pref.previousTier,
      }));

    return nearDeadline;
  },
});
