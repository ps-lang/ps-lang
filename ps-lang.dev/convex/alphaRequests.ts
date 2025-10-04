import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit alpha access request (authenticated users only)
export const submitRequest = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    persona: v.string(),
    githubUrl: v.optional(v.string()),
    interestedIn: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already has a request
    const existing = await ctx.db
      .query("alphaRequests")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existing) {
      // Update existing request
      await ctx.db.patch(existing._id, {
        persona: args.persona,
        githubUrl: args.githubUrl,
        interestedIn: args.interestedIn,
        status: "pending", // Reset to pending if they resubmit
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new request
    const requestId = await ctx.db.insert("alphaRequests", {
      ...args,
      status: "pending",
      requestedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return requestId;
  },
});

// Get all alpha requests (admin only)
export const getAllRequests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("alphaRequests")
      .order("desc")
      .collect();
  },
});

// Get request by clerk user ID
export const getByClerkUserId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alphaRequests")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

// Get pending requests count
export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db.query("alphaRequests").collect();
    return requests.filter(r => r.status === "pending").length;
  },
});

// Approve alpha request (admin only)
export const approveRequest = mutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db
      .query("alphaRequests")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (request) {
      await ctx.db.patch(request._id, {
        status: "approved",
        approvedAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { success: true };
    }

    return { success: false, error: "Request not found" };
  },
});

// Reject alpha request (admin only)
export const rejectRequest = mutation({
  args: {
    clerkUserId: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db
      .query("alphaRequests")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (request) {
      await ctx.db.patch(request._id, {
        status: "rejected",
        rejectionReason: args.reason,
        updatedAt: Date.now(),
      });
      return { success: true };
    }

    return { success: false, error: "Request not found" };
  },
});
