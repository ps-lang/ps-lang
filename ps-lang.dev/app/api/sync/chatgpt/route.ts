import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { transformToPSLang, extractTitle } from "@/lib/psl-transformer"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get connector credentials
    const connector = await convex.query(api.aiConnectors.getConnectorStatus, {
      userId,
      provider: "chatgpt",
    })

    if (!connector || connector.status !== "connected" || !connector.accessToken) {
      return NextResponse.json({ error: "ChatGPT not connected" }, { status: 400 })
    }

    // Fetch conversations from ChatGPT API
    const conversationsResponse = await fetch("https://api.openai.com/v1/conversations", {
      headers: {
        Authorization: `Bearer ${connector.accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!conversationsResponse.ok) {
      // If unauthorized, token may be expired
      if (conversationsResponse.status === 401) {
        // TODO: Implement refresh token flow
        return NextResponse.json({ error: "Token expired" }, { status: 401 })
      }
      throw new Error("Failed to fetch conversations")
    }

    const conversationsData = await conversationsResponse.json()
    const conversations = conversationsData.items || []

    let syncedCount = 0

    // Process each conversation
    for (const conversation of conversations) {
      // Fetch full conversation details
      const conversationResponse = await fetch(
        `https://api.openai.com/v1/conversations/${conversation.id}`,
        {
          headers: {
            Authorization: `Bearer ${connector.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!conversationResponse.ok) continue

      const conversationData = await conversationResponse.json()
      const messages = conversationData.messages || []

      // Transform to PS-LANG
      const { pslPrompt, metaTags, zones } = transformToPSLang(messages)
      const title = extractTitle(messages)

      // Save to Convex
      await convex.mutation(api.aiConnectors.syncConversation, {
        userId,
        provider: "chatgpt",
        conversationId: conversation.id,
        title,
        messages,
        pslPrompt,
        metaTags,
        zones,
        conversationDate: conversation.created_at * 1000 || Date.now(),
      })

      syncedCount++
    }

    // Update last sync time
    await convex.mutation(api.aiConnectors.updateLastSync, {
      userId,
      provider: "chatgpt",
    })

    return NextResponse.json({
      success: true,
      syncedCount,
      message: `Synced ${syncedCount} conversations`,
    })
  } catch (error) {
    console.error("ChatGPT sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync conversations" },
      { status: 500 }
    )
  }
}
