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
});
