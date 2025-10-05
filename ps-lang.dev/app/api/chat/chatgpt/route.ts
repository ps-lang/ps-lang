import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"
import { transformToPSLang, extractTitle } from "@/lib/psl-transformer"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Create new ChatGPT conversation and auto-save to Journal Plus
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

    // Get ChatGPT response
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 2000,
    })

    const assistantMessage = {
      role: "assistant",
      content: response.choices[0].message.content || "",
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
  } catch (error) {
    console.error("ChatGPT error:", error)
    return NextResponse.json(
      { error: "Failed to get ChatGPT response" },
      { status: 500 }
    )
  }
}
