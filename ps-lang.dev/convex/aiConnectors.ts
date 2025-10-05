import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// AI CONNECTORS (ChatGPT, Claude)
// ============================================================================

export const connectProvider = mutation({
  args: {
    userId: v.string(),
    provider: v.string(), // "chatgpt" or "claude"
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    settings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check if connector already exists
    const existing = await ctx.db
      .query("aiConnectors")
      .withIndex("by_userId_and_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .first();

    if (existing) {
      // Update existing connector
      await ctx.db.patch(existing._id, {
        status: "connected",
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        apiKey: args.apiKey,
        settings: args.settings,
        connectedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new connector
    const connectorId = await ctx.db.insert("aiConnectors", {
      userId: args.userId,
      provider: args.provider,
      status: "connected",
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      apiKey: args.apiKey,
      connectedAt: Date.now(),
      settings: args.settings || { autoSync: true, syncFrequency: "daily" },
    });

    return connectorId;
  },
});

export const disconnectProvider = mutation({
  args: {
    userId: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const connector = await ctx.db
      .query("aiConnectors")
      .withIndex("by_userId_and_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .first();

    if (!connector) {
      throw new Error("Connector not found");
    }

    await ctx.db.patch(connector._id, {
      status: "disconnected",
      accessToken: undefined,
      refreshToken: undefined,
      apiKey: undefined,
    });

    return connector._id;
  },
});

export const getUserConnectors = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiConnectors")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getConnectorStatus = query({
  args: {
    userId: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const connector = await ctx.db
      .query("aiConnectors")
      .withIndex("by_userId_and_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .first();

    return connector || null;
  },
});

export const updateLastSync = mutation({
  args: {
    userId: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const connector = await ctx.db
      .query("aiConnectors")
      .withIndex("by_userId_and_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .first();

    if (!connector) {
      throw new Error("Connector not found");
    }

    await ctx.db.patch(connector._id, {
      lastSyncAt: Date.now(),
    });

    return connector._id;
  },
});

// ============================================================================
// SYNCED CONVERSATIONS
// ============================================================================

export const syncConversation = mutation({
  args: {
    userId: v.string(),
    provider: v.string(),
    conversationId: v.string(),
    title: v.string(),
    messages: v.array(v.any()),
    pslPrompt: v.optional(v.string()),
    metaTags: v.optional(v.array(v.string())),
    zones: v.optional(v.array(v.string())),
    privateSignals: v.optional(v.any()),
    aiSummary: v.optional(v.string()),
    conversationDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if conversation already synced
    const existing = await ctx.db
      .query("syncedConversations")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .first();

    if (existing) {
      // Update existing conversation
      await ctx.db.patch(existing._id, {
        title: args.title,
        messages: args.messages,
        pslPrompt: args.pslPrompt,
        metaTags: args.metaTags,
        zones: args.zones,
        privateSignals: args.privateSignals,
        aiSummary: args.aiSummary,
        syncedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new synced conversation
    const conversationDbId = await ctx.db.insert("syncedConversations", {
      userId: args.userId,
      provider: args.provider,
      conversationId: args.conversationId,
      title: args.title,
      messages: args.messages,
      pslPrompt: args.pslPrompt,
      metaTags: args.metaTags,
      zones: args.zones,
      privateSignals: args.privateSignals,
      aiSummary: args.aiSummary,
      syncedAt: Date.now(),
      conversationDate: args.conversationDate,
    });

    // Update connector's last sync time
    await ctx.db
      .query("aiConnectors")
      .withIndex("by_userId_and_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .first()
      .then((connector) => {
        if (connector) {
          ctx.db.patch(connector._id, { lastSyncAt: Date.now() });
        }
      });

    return conversationDbId;
  },
});

export const getUserConversations = query({
  args: {
    userId: v.string(),
    provider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.provider) {
      const provider = args.provider;
      return await ctx.db
        .query("syncedConversations")
        .withIndex("by_userId_and_provider", (q) =>
          q.eq("userId", args.userId).eq("provider", provider)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("syncedConversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getConversationById = query({
  args: { conversationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("syncedConversations")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .first();
  },
});
