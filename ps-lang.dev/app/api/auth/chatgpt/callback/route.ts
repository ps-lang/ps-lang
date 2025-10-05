import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state") // userId
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/journal-plus?error=oauth_failed`)
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 })
  }

  const userId = state

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://auth.openai.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/chatgpt/callback`,
        client_id: process.env.CHATGPT_CLIENT_ID!,
        client_secret: process.env.CHATGPT_CLIENT_SECRET!,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token } = tokenData

    // Store in Convex
    await convex.mutation(api.aiConnectors.connectProvider, {
      userId,
      provider: "chatgpt",
      accessToken: access_token,
      refreshToken: refresh_token,
      settings: { autoSync: true, syncFrequency: "daily" },
    })

    // Redirect back to Journal Plus
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/journal-plus?connected=chatgpt`)
  } catch (error) {
    console.error("ChatGPT OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/journal-plus?error=oauth_failed`)
  }
}
