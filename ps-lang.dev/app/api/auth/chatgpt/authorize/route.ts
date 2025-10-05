import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  // ChatGPT OAuth configuration
  const clientId = process.env.CHATGPT_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/chatgpt/callback`
  const scope = "openid profile email offline_access" // ChatGPT scopes

  if (!clientId) {
    return NextResponse.json({ error: "ChatGPT OAuth not configured" }, { status: 500 })
  }

  // Build OAuth URL
  const authUrl = new URL("https://auth.openai.com/authorize")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", scope)
  authUrl.searchParams.set("state", userId) // Pass userId in state for callback

  // Redirect to ChatGPT OAuth
  return NextResponse.redirect(authUrl.toString())
}
