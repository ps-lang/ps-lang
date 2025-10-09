import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Simple hash function for privacy (non-cryptographic)
 * Good enough for pseudonymization, doesn't require Node.js crypto
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Save cookie consent audit trail to Convex
 * GDPR Article 7(1) - Demonstrating Consent
 * CCPA Section 1798.135 - Consent Records
 */
export const saveConsentHistory = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.string(),
    action: v.string(), // "granted", "denied", "updated", "revoked"
    status: v.string(), // "granted" or "denied"
    granular: v.object({
      analytics: v.boolean(),
      sessionReplay: v.boolean(),
      performance: v.boolean(),
    }),
    gpcDetected: v.boolean(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Hash IP address for privacy (GDPR Article 4(5) - Pseudonymization)
    const hashedIp = args.ipAddress
      ? simpleHash(args.ipAddress)
      : undefined;

    // Calculate expiry (12 months from now)
    const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + TWELVE_MONTHS_MS;

    // Insert consent record
    const consentId = await ctx.db.insert("cookieConsentHistory", {
      userId: args.userId,
      sessionId: args.sessionId,
      action: args.action,
      status: args.status,
      granular: args.granular,
      gpcDetected: args.gpcDetected,
      ipAddress: hashedIp,
      userAgent: args.userAgent,
      referrer: args.referrer,
      expiresAt,
      timestamp: Date.now(),
    });

    return { success: true, consentId, expiresAt };
  },
});

/**
 * Get consent history for a user (DSAR support)
 */
export const getUserConsentHistory = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("cookieConsentHistory")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return history;
  },
});

/**
 * Get consent history by session ID (for anonymous users)
 */
export const getSessionConsentHistory = query({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionId) {
      return [];
    }

    const sessionId = args.sessionId;
    const history = await ctx.db
      .query("cookieConsentHistory")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .collect();

    return history;
  },
});

/**
 * Get latest consent record for a user
 */
export const getLatestConsent = query({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      const userId = args.userId;
      const records = await ctx.db
        .query("cookieConsentHistory")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .take(1);

      return records[0] || null;
    }

    if (args.sessionId) {
      const sessionId = args.sessionId;
      const records = await ctx.db
        .query("cookieConsentHistory")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
        .order("desc")
        .take(1);

      return records[0] || null;
    }

    return null;
  },
});

/**
 * Check if consent has expired
 */
export const checkConsentExpiry = query({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{
    expired: boolean;
    needsRenewal: boolean;
    expiresAt?: number;
    daysUntilExpiry?: number;
  }> => {
    // Get latest consent directly instead of using runQuery
    let latest = null;

    if (args.userId) {
      const userId = args.userId;
      const records = await ctx.db
        .query("cookieConsentHistory")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .take(1);
      latest = records[0] || null;
    } else if (args.sessionId) {
      const sessionId = args.sessionId;
      const records = await ctx.db
        .query("cookieConsentHistory")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
        .order("desc")
        .take(1);
      latest = records[0] || null;
    }

    if (!latest) {
      return { expired: true, needsRenewal: true };
    }

    const isExpired = latest.expiresAt < Date.now();
    const needsRenewalSoon = latest.expiresAt < Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    return {
      expired: isExpired,
      needsRenewal: needsRenewalSoon,
      expiresAt: latest.expiresAt,
      daysUntilExpiry: Math.floor((latest.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)),
    };
  },
});

/**
 * Get all expired consents (for automated cleanup)
 */
export const getExpiredConsents = query({
  handler: async (ctx) => {
    const now = Date.now();

    const expiredConsents = await ctx.db
      .query("cookieConsentHistory")
      .withIndex("by_expiresAt")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    return expiredConsents;
  },
});

/**
 * Delete user consent data (Right to be Forgotten)
 */
export const deleteUserConsentData = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all consent records for user
    const records = await ctx.db
      .query("cookieConsentHistory")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Delete all records
    for (const record of records) {
      await ctx.db.delete(record._id);
    }

    return {
      success: true,
      deletedRecords: records.length,
      message: `Deleted ${records.length} consent records for user ${args.userId}`,
    };
  },
});
