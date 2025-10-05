import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    // Read the paper-1 markdown file
    const paperPath = path.join(
      process.cwd(),
      "papers",
      "public",
      "paper-1.md"
    );
    const paperContent = fs.readFileSync(paperPath, "utf-8");

    // Extract metadata from the markdown
    const title = "PS-LANG: Zone-Based Context Control in Multi-Agent AI Systems";
    const subtitle = "A Privacy-First Scripting Language for Selective Information Flow";
    const abstract = "Multi-agent AI systems face significant challenges in managing context flow between agents, leading to token inefficiency, privacy concerns, and computational waste. We introduce PS-LANG (Privacy-First Script Language), a domain-specific language that employs zone-based syntax for precise context control in agent pipelines. Our approach enables developers to mark content as private, pass-through, or active workspace, ensuring that each agent receives only relevant information. Empirical evaluation across diverse benchmarks demonstrates a 60% reduction in token usage and 95% context accuracy, while maintaining backwards compatibility with existing AI platforms including Claude, GPT, Cursor, and Copilot. PS-LANG addresses critical gaps in multi-agent frameworks by providing fine-grained control over information visibility, reducing API costs, preventing privacy leakage, and enabling accurate benchmarking without context contamination.";
    const keywords = [
      "Multi-agent systems",
      "Context control",
      "Privacy-preserving AI",
      "Domain-specific languages",
      "Token optimization",
      "AI workflow management"
    ];
    const authors = ["Vummo Labs Research Team"];
    const category = "Multi-Agent Systems";
    const slug = "zone-based-context-control-multi-agent-systems";
    const artifactUrl = "https://claude.ai/public/artifacts/f107ece1-1aa9-4be3-80fd-93904b008901";
    const publicationDate = Date.now();

    // Check if paper already exists
    const existingPaper = await convex.query(api.researchPapers.getBySlug, {
      slug,
    });

    if (existingPaper) {
      return NextResponse.json(
        { message: "Paper already exists", paperId: existingPaper._id },
        { status: 200 }
      );
    }

    // Create the paper in Convex
    const paperId = await convex.mutation(api.researchPapers.create, {
      slug,
      title,
      subtitle,
      abstract,
      keywords,
      authors,
      category,
      content: paperContent,
      artifactUrl,
      publicationDate,
      status: "preprint",
    });

    return NextResponse.json(
      { message: "Paper seeded successfully", paperId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding paper:", error);
    return NextResponse.json(
      { error: "Failed to seed paper", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Read the paper-1 markdown file
    const paperPath = path.join(
      process.cwd(),
      "papers",
      "public",
      "paper-1.md"
    );
    const paperContent = fs.readFileSync(paperPath, "utf-8");

    // Extract metadata from the markdown
    const title = "PS-LANG: Zone-Based Context Control in Multi-Agent AI Systems";
    const subtitle = "A Privacy-First Scripting Language for Selective Information Flow";
    const abstract = "Multi-agent AI systems face significant challenges in managing context flow between agents, leading to token inefficiency, privacy concerns, and computational waste. We introduce PS-LANG (Privacy-First Script Language), a domain-specific language that employs zone-based syntax for precise context control in agent pipelines. Our approach enables developers to mark content as private, pass-through, or active workspace, ensuring that each agent receives only relevant information. Empirical evaluation across diverse benchmarks demonstrates a 60% reduction in token usage and 95% context accuracy, while maintaining backwards compatibility with existing AI platforms including Claude, GPT, Cursor, and Copilot. PS-LANG addresses critical gaps in multi-agent frameworks by providing fine-grained control over information visibility, reducing API costs, preventing privacy leakage, and enabling accurate benchmarking without context contamination.";
    const keywords = [
      "Multi-agent systems",
      "Context control",
      "Privacy-preserving AI",
      "Domain-specific languages",
      "Token optimization",
      "AI workflow management"
    ];
    const authors = ["Vummo Labs Research Team"];
    const category = "Multi-Agent Systems";
    const slug = "zone-based-context-control-multi-agent-systems";
    const artifactUrl = "https://claude.ai/public/artifacts/f107ece1-1aa9-4be3-80fd-93904b008901";
    const publicationDate = Date.now();

    // Check if paper already exists
    const existingPaper = await convex.query(api.researchPapers.getBySlug, {
      slug,
    });

    if (existingPaper) {
      return NextResponse.json(
        { message: "Paper already exists", paperId: existingPaper._id },
        { status: 200 }
      );
    }

    // Create the paper in Convex
    const paperId = await convex.mutation(api.researchPapers.create, {
      slug,
      title,
      subtitle,
      abstract,
      keywords,
      authors,
      category,
      content: paperContent,
      artifactUrl,
      publicationDate,
      status: "preprint",
    });

    return NextResponse.json(
      { message: "Paper seeded successfully", paperId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding paper:", error);
    return NextResponse.json(
      { error: "Failed to seed paper", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
