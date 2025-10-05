import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Generate AI summary for a conversation
 * POST /api/conversations/summarize
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 })
    }

    // Build context from messages
    const conversationText = messages
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n")

    // Generate AI summary
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `Summarize this conversation in 2-3 clear, concise sentences. Focus on the main goal and outcome:

${conversationText}`,
        },
      ],
    })

    const summary = message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Summary generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    )
  }
}
