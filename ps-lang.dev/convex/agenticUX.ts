import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// CONSENT RECORDS
// ============================================================================

export const grantConsent = mutation({
  args: {
    userId: v.string(),
    scopes: v.array(v.string()),
    version: v.string(),
    proof: v.string(),
  },
  handler: async (ctx, args) => {
    const consentId = await ctx.db.insert("consentRecords", {
      userId: args.userId,
      scopes: args.scopes,
      version: args.version,
      proof: args.proof,
      grantedAt: Date.now(),
    });
    return consentId;
  },
});

export const getUserConsent = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("consentRecords")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

// ============================================================================
// STREAM EVENTS
// ============================================================================

export const emitStreamEvent = mutation({
  args: {
    sessionId: v.string(),
    componentId: v.string(),
    action: v.string(),
    payload: v.optional(v.any()),
    metaTags: v.array(v.string()),
    zone: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("streamEvents", {
      sessionId: args.sessionId,
      componentId: args.componentId,
      action: args.action,
      payload: args.payload,
      metaTags: args.metaTags,
      zone: args.zone,
      userId: args.userId,
      timestamp: Date.now(),
    });
    return eventId;
  },
});

export const getSessionEvents = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streamEvents")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

// ============================================================================
// META TAGS
// ============================================================================

export const createMetaTag = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    value: v.any(),
    source: v.string(),
    zone: v.string(),
    visibility: v.string(),
    confidence: v.optional(v.number()),
    ttl: v.optional(v.number()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tagId = await ctx.db.insert("metaTags", {
      sessionId: args.sessionId,
      name: args.name,
      value: args.value,
      source: args.source,
      zone: args.zone,
      visibility: args.visibility,
      confidence: args.confidence,
      ttl: args.ttl,
      userId: args.userId,
      timestamp: Date.now(),
    });
    return tagId;
  },
});

export const getSessionMetaTags = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("metaTags")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

// ============================================================================
// RLHF SIGNALS
// ============================================================================

export const submitRLHFSignal = mutation({
  args: {
    eventId: v.optional(v.id("streamEvents")),
    sessionId: v.string(),
    signal: v.number(),
    reason: v.string(),
    modelHint: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const signalId = await ctx.db.insert("rlhfSignals", {
      eventId: args.eventId,
      sessionId: args.sessionId,
      signal: args.signal,
      reason: args.reason,
      modelHint: args.modelHint,
      userId: args.userId,
      timestamp: Date.now(),
    });
    return signalId;
  },
});

export const getSessionRLHFStats = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const signals = await ctx.db
      .query("rlhfSignals")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const total = signals.length;
    const sum = signals.reduce((acc, s) => acc + s.signal, 0);
    const avg = total > 0 ? sum / total : 0;

    return {
      total,
      sum,
      avg,
      signals,
    };
  },
});

// ============================================================================
// ARTIFACTS
// ============================================================================

export const createArtifact = mutation({
  args: {
    sessionId: v.string(),
    type: v.string(),
    content: v.string(),
    checksum: v.string(),
    visibility: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const artifactId = await ctx.db.insert("artifacts", {
      sessionId: args.sessionId,
      type: args.type,
      content: args.content,
      checksum: args.checksum,
      visibility: args.visibility,
      userId: args.userId,
      createdAt: Date.now(),
    });
    return artifactId;
  },
});

export const getSessionArtifacts = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artifacts")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

// ============================================================================
// ANALYTICS & KPIs
// ============================================================================

export const getSessionKPIs = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("streamEvents")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const consent = await ctx.db
      .query("consentRecords")
      .withIndex("by_userId", (q) => q.eq("userId", args.sessionId))
      .first();

    const rlhfStats = await ctx.db
      .query("rlhfSignals")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Calculate KPIs
    const streamStartEvent = events.find((e) => e.action === "ux.stream.start");
    const firstStreamTime = streamStartEvent
      ? streamStartEvent.timestamp - events[events.length - 1]?.timestamp
      : null;

    const actionEvents = events.filter((e) => e.action.startsWith("action."));
    const actionCompleteRate = events.length > 0 ? actionEvents.length / events.length : 0;

    const personaSwitchEvents = events.filter((e) => e.action === "persona.active");
    const personaSwitchRate = events.length > 0 ? personaSwitchEvents.length / events.length : 0;

    const rlhfScoreAvg =
      rlhfStats.length > 0
        ? rlhfStats.reduce((acc, s) => acc + s.signal, 0) / rlhfStats.length
        : 0;

    return {
      firstStreamTime,
      consentGranted: !!consent,
      actionCompleteRate,
      personaSwitchRate,
      rlhfScoreAvg,
      totalEvents: events.length,
      totalRLHFSignals: rlhfStats.length,
    };
  },
});
