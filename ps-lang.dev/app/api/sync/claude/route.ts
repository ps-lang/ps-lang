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
      provider: "claude",
    })

    if (!connector || connector.status !== "connected" || !connector.apiKey) {
      return NextResponse.json({ error: "Claude not connected" }, { status: 400 })
    }

    // Note: Claude doesn't have a public API for fetching conversation history yet
    // This is a placeholder for when Anthropic releases that API
    // For now, we'll accept conversations via webhook/manual upload

    const body = await request.json()
    const { conversations } = body

    if (!conversations || !Array.isArray(conversations)) {
      return NextResponse.json(
        { error: "Invalid request. Send conversations array." },
        { status: 400 }
      )
    }

    let syncedCount = 0

    // Process each conversation
    for (const conversation of conversations) {
      const { id, messages, created_at } = conversation

      if (!id || !messages || !Array.isArray(messages)) continue

      // Transform to PS-LANG with private signals
      const { pslPrompt, metaTags, zones, privateSignals } = transformToPSLang(messages)
      const title = extractTitle(messages)

      // Generate AI summary
      let aiSummary = ""
      try {
        const summaryResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/conversations/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        })
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json()
          aiSummary = summaryData.summary
        }
      } catch (error) {
        console.error("Summary generation failed:", error)
        // Fallback to title
        aiSummary = title
      }

      // Save to Convex
      await convex.mutation(api.aiConnectors.syncConversation, {
        userId,
        provider: "claude",
        conversationId: id,
        title,
        messages,
        pslPrompt,
        metaTags,
        zones,
        privateSignals,
        aiSummary,
        conversationDate: created_at || Date.now(),
      })

      syncedCount++
    }

    // Update last sync time
    await convex.mutation(api.aiConnectors.updateLastSync, {
      userId,
      provider: "claude",
    })

    return NextResponse.json({
      success: true,
      syncedCount,
      message: `Synced ${syncedCount} conversations`,
    })
  } catch (error) {
    console.error("Claude sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync conversations" },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check Claude sync status
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const connector = await convex.query(api.aiConnectors.getConnectorStatus, {
      userId,
      provider: "claude",
    })

    if (!connector) {
      return NextResponse.json({ connected: false })
    }

    const conversations = await convex.query(api.aiConnectors.getUserConversations, {
      userId,
      provider: "claude",
    })

    return NextResponse.json({
      connected: connector.status === "connected",
      lastSyncAt: connector.lastSyncAt,
      conversationCount: conversations?.length || 0,
    })
  } catch (error) {
    console.error("Claude status check error:", error)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}
