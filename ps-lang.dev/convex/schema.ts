import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Feedback submissions
  feedback: defineTable({
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.string(),
    feedbackType: v.string(),
    feedback: v.string(),
    rating: v.number(),
    emailUpdates: v.boolean(),
    version: v.string(),
    submittedAt: v.number(),
  }).index("by_submittedAt", ["submittedAt"]),

  // Newsletter subscribers
  newsletter: defineTable({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    interests: v.array(v.string()),
    source: v.string(),
    emailDomain: v.string(),
    subscribedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_subscribedAt", ["subscribedAt"]),

  // Alpha signups (legacy - kept for historical data)
  alphaSignups: defineTable({
    email: v.string(),
    persona: v.string(),
    githubUrl: v.optional(v.string()),
    interestedIn: v.array(v.string()),
    signupDate: v.number(),
    clerkUserId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_signupDate", ["signupDate"]),

  // Alpha access requests (new system - users request after signup)
  alphaRequests: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    persona: v.string(),
    githubUrl: v.optional(v.string()),
    interestedIn: v.array(v.string()),
    status: v.string(), // "pending", "approved", "rejected"
    requestedAt: v.number(),
    approvedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_status", ["status"])
    .index("by_requestedAt", ["requestedAt"]),

  // User journal entries (for future use)
  journalEntries: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    zones: v.optional(v.array(v.string())), // PS-LANG zones used
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_createdAt", ["createdAt"]),

  // .psl file storage (for future use)
  pslFiles: defineTable({
    userId: v.string(),
    fileName: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_isPublic", ["isPublic"]),

  // Papers newsletter subscribers
  papersNewsletter: defineTable({
    email: v.string(),
    frequency: v.string(), // "weekly" or "biweekly"
    subscribedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_subscribedAt", ["subscribedAt"])
    .index("by_isActive", ["isActive"]),

  // Feature requests (alpha tester feedback)
  featureRequests: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "ai-logging", "benchmarking", "privacy", "audit", "workflow", "other"
    submittedBy: v.string(), // clerkUserId
    submitterEmail: v.string(),
    status: v.string(), // "proposed", "under-review", "planned", "in-progress", "completed", "declined"
    upvotes: v.number(),
    downvotes: v.number(),
    netScore: v.number(), // upvotes - downvotes
    submittedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_netScore", ["netScore"])
    .index("by_submittedAt", ["submittedAt"])
    .index("by_category", ["category"]),

  // Feature request votes
  featureVotes: defineTable({
    featureRequestId: v.id("featureRequests"),
    userId: v.string(), // clerkUserId
    voteType: v.string(), // "upvote" or "downvote"
    votedAt: v.number(),
  })
    .index("by_feature", ["featureRequestId"])
    .index("by_user", ["userId"])
    .index("by_feature_and_user", ["featureRequestId", "userId"]),

  // Agentic UX: Consent Records
  consentRecords: defineTable({
    userId: v.string(), // clerkUserId
    scopes: v.array(v.string()), // ["meta.public", "meta.private", "analytics.rl", "export.artifacts"]
    version: v.string(), // consent version (e.g., "v1")
    proof: v.string(), // hash/signature of consent action
    grantedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_grantedAt", ["grantedAt"]),

  // Agentic UX: Stream Events
  streamEvents: defineTable({
    sessionId: v.string(), // unique session identifier
    componentId: v.string(), // e.g., "jp.CapabilityPicker"
    action: v.string(), // e.g., "ux.stream.start", "action.logging.simulate"
    payload: v.optional(v.any()), // event-specific data
    metaTags: v.array(v.string()), // associated meta tag names
    zone: v.string(), // "public", "private", "managed", "read-only"
    userId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_userId", ["userId"])
    .index("by_zone", ["zone"])
    .index("by_timestamp", ["timestamp"]),

  // Agentic UX: Meta Tags
  metaTags: defineTable({
    sessionId: v.string(),
    name: v.string(), // e.g., "ux.stream.init", "consent.granted"
    value: v.any(), // tag value (boolean, string, number, object)
    source: v.string(), // component or system that created tag
    zone: v.string(), // PS-LANG zone
    visibility: v.string(), // "public", "consented", "private"
    confidence: v.optional(v.number()), // 0.0 to 1.0
    ttl: v.optional(v.number()), // time-to-live in ms
    userId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_name", ["name"])
    .index("by_zone", ["zone"])
    .index("by_timestamp", ["timestamp"]),

  // Agentic UX: RLHF Signals
  rlhfSignals: defineTable({
    eventId: v.optional(v.id("streamEvents")),
    sessionId: v.string(),
    signal: v.number(), // -1, 0, +1, or fractional values
    reason: v.string(), // "user_feedback", "engagement", "completed_action"
    modelHint: v.optional(v.string()), // hint for future model training
    userId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_userId", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // Agentic UX: Artifacts
  artifacts: defineTable({
    sessionId: v.string(),
    type: v.string(), // "llms.txt", "webpage.jsonld", "export.json"
    content: v.string(), // artifact content
    checksum: v.string(), // content hash
    visibility: v.string(), // "public", "private", "consented"
    userId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_type", ["type"])
    .index("by_userId", ["userId"])
    .index("by_createdAt", ["createdAt"]),

  // AI Connectors (ChatGPT, Claude, etc.)
  aiConnectors: defineTable({
    userId: v.string(), // clerkUserId
    provider: v.string(), // "chatgpt", "claude"
    status: v.string(), // "connected", "disconnected", "error"
    accessToken: v.optional(v.string()), // encrypted OAuth token
    refreshToken: v.optional(v.string()), // encrypted refresh token
    apiKey: v.optional(v.string()), // encrypted API key (for Claude)
    lastSyncAt: v.optional(v.number()),
    connectedAt: v.number(),
    settings: v.optional(v.any()), // auto-sync, sync-frequency, etc.
  })
    .index("by_userId", ["userId"])
    .index("by_provider", ["provider"])
    .index("by_userId_and_provider", ["userId", "provider"]),

  // Synced Conversations
  syncedConversations: defineTable({
    userId: v.string(),
    provider: v.string(), // "chatgpt", "claude"
    conversationId: v.string(), // external conversation ID
    title: v.string(),
    messages: v.array(v.any()), // array of message objects
    pslPrompt: v.optional(v.string()), // transformed PS-LANG version
    metaTags: v.optional(v.array(v.string())), // extracted meta-tags
    zones: v.optional(v.array(v.string())), // PS-LANG zones used
    privateSignals: v.optional(v.any()), // private signals for agent negotiation
    aiSummary: v.optional(v.string()), // AI-generated summary
    syncedAt: v.number(),
    conversationDate: v.number(), // when conversation happened
    rlhfScore: v.optional(v.number()), // aggregate RLHF score (-1 to +1)
  })
    .index("by_userId", ["userId"])
    .index("by_provider", ["provider"])
    .index("by_conversationId", ["conversationId"])
    .index("by_userId_and_provider", ["userId", "provider"])
    .index("by_syncedAt", ["syncedAt"])
    .index("by_rlhfScore", ["rlhfScore"]),

  // Conversation RLHF Feedback (thumbs up/down on conversations)
  conversationFeedback: defineTable({
    conversationId: v.id("syncedConversations"),
    userId: v.string(),
    messageId: v.optional(v.string()), // null = feedback on entire conversation
    feedback: v.string(), // "positive", "negative"
    context: v.optional(v.object({
      zone: v.optional(v.string()),
      metaTags: v.optional(v.array(v.string())),
      agentType: v.optional(v.string()),
    })),
    submittedAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_userId", ["userId"])
    .index("by_conversation_and_user", ["conversationId", "userId"])
    .index("by_submittedAt", ["submittedAt"]),

  // Research Papers
  researchPapers: defineTable({
    slug: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    abstract: v.string(),
    keywords: v.array(v.string()),
    authors: v.array(v.string()),
    category: v.string(),

    // Content in different formats
    content: v.string(), // Legacy field - original markdown (paper-1.md)
    originalContent: v.optional(v.string()), // paper-1.md - preserved academic format
    pslContent: v.optional(v.string()), // paper-1.psl - PS-LANG formatted version
    enrichedContent: v.optional(v.string()), // paper-1-plus.psl - AI enriched with RLHF metadata

    // File paths for reference
    originalFile: v.optional(v.string()), // "paper-1.md"
    pslFile: v.optional(v.string()), // "paper-1.psl"
    enrichedFile: v.optional(v.string()), // "paper-1-plus.psl"

    pdfUrl: v.optional(v.string()),
    artifactUrl: v.optional(v.string()), // Claude artifact link
    publicationDate: v.number(),
    status: v.string(), // "preprint", "published", "draft"
    views: v.number(),
    downloads: v.number(),
    citations: v.optional(v.array(v.string())),
    relatedPapers: v.optional(v.array(v.id("researchPapers"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_publicationDate", ["publicationDate"])
    .index("by_views", ["views"]),

  // User Interactions - Universal tracking for all site interactions
  userInteractions: defineTable({
    // Who
    userId: v.optional(v.string()), // clerkUserId if authenticated
    sessionId: v.string(), // anonymous session ID

    // Where
    page: v.string(), // "research-paper", "homepage", "playground", "journal", etc.
    pageId: v.optional(v.string()), // specific page identifier (e.g., paper slug)

    // What
    interactionType: v.string(), // "like", "toggle", "click", "view", "download", etc.
    category: v.string(), // "paper-keyword", "paper-abstract", "feature-request", "cta-button", etc.
    target: v.string(), // what was interacted with (keyword name, button label, etc.)

    // Value
    value: v.optional(v.any()), // flexible field for interaction-specific data
    // Examples:
    // - keyword: { liked: true, toggleCount: 3 }
    // - button: { label: "Sign Up", position: "hero" }
    // - scroll: { depth: 75, duration: 30 }

    // Context
    metadata: v.optional(v.object({
      paperTitle: v.optional(v.string()),
      paperCategory: v.optional(v.string()),
      referrer: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      viewport: v.optional(v.string()),
    })),

    // When
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_sessionId", ["sessionId"])
    .index("by_page", ["page"])
    .index("by_category", ["category"])
    .index("by_interactionType", ["interactionType"])
    .index("by_timestamp", ["timestamp"])
    .index("by_page_and_category", ["page", "category"])
    .index("by_page_and_type", ["page", "interactionType"]),
});
