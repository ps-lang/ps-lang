import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    // Read the original markdown file
    const originalPath = path.join(
      process.cwd(),
      "papers",
      "public",
      "paper-1.md"
    );
    const originalContent = fs.readFileSync(originalPath, "utf-8");

    // Read the PSL format file
    const pslPath = path.join(
      process.cwd(),
      "papers",
      "public",
      "paper-1.psl.md"
    );
    const pslContent = fs.readFileSync(pslPath, "utf-8");

    // Read the enriched PSL format file
    const enrichedPath = path.join(
      process.cwd(),
      "papers",
      "public",
      "paper-1-plus.psl.md"
    );
    const enrichedContent = fs.readFileSync(enrichedPath, "utf-8");

    const slug = "zone-based-context-control-multi-agent-systems";

    // Get existing paper
    const existingPaper = await convex.query(api.researchPapers.getBySlug, {
      slug,
    });

    if (!existingPaper) {
      return NextResponse.json(
        { error: "Paper not found. Please seed it first at /api/seed-papers" },
        { status: 404 }
      );
    }

    // Update the paper with all formats
    await convex.mutation(api.researchPapers.update, {
      paperId: existingPaper._id,
      content: originalContent, // Legacy field for backwards compatibility
      originalContent: originalContent, // Academic format (paper-1.md)
      pslContent: pslContent, // PSL format with zones (paper-1.psl.md)
      enrichedContent: enrichedContent, // RLHF enriched (paper-1-plus.psl.md)
      originalFile: "paper-1.md",
      pslFile: "paper-1.psl.md",
      enrichedFile: "paper-1-plus.psl.md",
      status: "preprint",
      publicationDate: Date.now(),
    });

    return NextResponse.json(
      {
        message: "Paper refreshed successfully with all formats",
        paperId: existingPaper._id,
        formats: {
          original: "paper-1.md",
          psl: "paper-1.psl.md",
          enriched: "paper-1-plus.psl.md"
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing paper:", error);
    return NextResponse.json(
      { error: "Failed to refresh paper", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
