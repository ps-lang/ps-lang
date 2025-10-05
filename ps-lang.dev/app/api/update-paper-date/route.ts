import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = 'force-dynamic';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const slug = "zone-based-context-control-multi-agent-systems";

    // Get the existing paper
    const paper = await convex.query(api.researchPapers.getBySlug, {
      slug,
    });

    if (!paper) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    // Update the publication date to today
    await convex.mutation(api.researchPapers.update, {
      paperId: paper._id,
      publicationDate: Date.now(),
    });

    return NextResponse.json(
      { message: "Paper date updated successfully", paperId: paper._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating paper date:", error);
    return NextResponse.json(
      { error: "Failed to update paper date", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
