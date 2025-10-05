import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all published and preprint research papers
export const getAll = query({
  handler: async (ctx) => {
    const papers = await ctx.db
      .query("researchPapers")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "published"),
          q.eq(q.field("status"), "preprint")
        )
      )
      .order("desc")
      .collect();

    return papers;
  },
});

// Get a single paper by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("researchPapers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return paper;
  },
});

// Get papers by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const papers = await ctx.db
      .query("researchPapers")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();

    return papers;
  },
});

// Create a new research paper
export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    abstract: v.string(),
    keywords: v.array(v.string()),
    authors: v.array(v.string()),
    category: v.string(),
    content: v.string(),
    originalContent: v.optional(v.string()),
    pslContent: v.optional(v.string()),
    enrichedContent: v.optional(v.string()),
    originalFile: v.optional(v.string()),
    pslFile: v.optional(v.string()),
    enrichedFile: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    artifactUrl: v.optional(v.string()),
    publicationDate: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const paperId = await ctx.db.insert("researchPapers", {
      ...args,
      views: 0,
      downloads: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return paperId;
  },
});

// Update paper views
export const incrementViews = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("researchPapers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!paper) return null;

    await ctx.db.patch(paper._id, {
      views: paper.views + 1,
    });

    return paper._id;
  },
});

// Update paper downloads
export const incrementDownloads = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("researchPapers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!paper) return null;

    await ctx.db.patch(paper._id, {
      downloads: paper.downloads + 1,
    });

    return paper._id;
  },
});

// Update a research paper
export const update = mutation({
  args: {
    paperId: v.id("researchPapers"),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    abstract: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    authors: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    content: v.optional(v.string()),
    originalContent: v.optional(v.string()),
    pslContent: v.optional(v.string()),
    enrichedContent: v.optional(v.string()),
    originalFile: v.optional(v.string()),
    pslFile: v.optional(v.string()),
    enrichedFile: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    artifactUrl: v.optional(v.string()),
    publicationDate: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paperId, ...updates } = args;

    await ctx.db.patch(paperId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return paperId;
  },
});
