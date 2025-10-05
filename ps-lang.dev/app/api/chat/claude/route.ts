import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Anthropic from "@anthropic-ai/sdk"
import { transformToPSLang, extractTitle } from "@/lib/psl-transformer"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Create new Claude conversation and auto-save to Journal Plus
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { messages, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 })
    }

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not set")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Calling Claude with messages:", messages.length)

    // Get Claude response
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    })

    console.log("Claude response received:", response.content[0])

    const assistantMessage = {
      role: "assistant",
      content: response.content[0].type === "text" ? response.content[0].text : "",
    }

    // Full conversation with new response
    const fullConversation = [...messages, assistantMessage]

    // Transform to PS-LANG for display
    const { pslPrompt, metaTags, zones, privateSignals } = transformToPSLang(fullConversation)
    const title = extractTitle(fullConversation)

    return NextResponse.json({
      message: assistantMessage,
      conversation: {
        id: conversationId || `chat-${Date.now()}`,
        userId,
        title,
        messages: fullConversation,
        pslPrompt,
        metaTags,
        zones,
        privateSignals,
      },
    })
  } catch (error: any) {
    console.error("Claude chat error FULL:", error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      { error: `Claude API error: ${error.message || "Unknown error"}` },
      { status: 500 }
    )
  }
}
