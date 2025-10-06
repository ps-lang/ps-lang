import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function updatePaper() {
  // List all papers first to find the correct slug
  console.log("Fetching all papers...");
  const papers = await client.query(api.researchPapers.getAll);

  console.log(`Found ${papers.length} papers:`);
  papers.forEach((p: any) => {
    console.log(`  - ${p.slug}: ${p.title}`);
  });

  // Get the first paper (or update the slug if needed)
  const targetSlug = papers[0]?.slug;

  if (!targetSlug) {
    console.error("No papers found in database!");
    return;
  }

  console.log(`\nUpdating paper with slug: ${targetSlug}`);

  // Read the markdown file
  const markdownPath = path.join(__dirname, "../papers/public/paper-1.md");
  const content = fs.readFileSync(markdownPath, "utf-8");

  // Get the paper by slug
  const paper = await client.query(api.researchPapers.getBySlug, {
    slug: targetSlug,
  });

  if (!paper) {
    console.error("Paper not found!");
    return;
  }

  console.log("Found paper:", paper.title);
  console.log("Updating originalContent field...");

  // Update the originalContent field
  await client.mutation(api.researchPapers.update, {
    paperId: paper._id,
    originalContent: content,
  });

  console.log("✅ Paper updated successfully!");
  console.log("The Academic view will now show the icons from the markdown.");
}

updatePaper().catch(console.error);
