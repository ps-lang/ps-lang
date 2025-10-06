"use client"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function LiveChat() {
  const { user } = useUser()
  const [provider, setProvider] = useState<"claude" | "chatgpt">("claude")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(`live-${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const saveConversation = useMutation(api.aiConnectors.syncConversation)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          conversationId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData)
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()
      setMessages([...newMessages, data.message])

      // Save to Convex (Journal Plus)
      if (data.conversation && user) {
        try {
          await saveConversation({
            userId: user.id,
            provider,
            conversationId: data.conversation.id,
            title: data.conversation.title,
            messages: data.conversation.messages,
            pslPrompt: data.conversation.pslPrompt,
            metaTags: data.conversation.metaTags,
            zones: data.conversation.zones,
            privateSignals: data.conversation.privateSignals,
            conversationDate: Date.now(),
          })
          console.log("✅ Saved to Journal Plus:", data.conversation.title)
        } catch (saveError) {
          console.error("Failed to save to Journal Plus:", saveError)
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      alert(`Failed: ${error.message}. Check console (F12) for details.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between bg-stone-50">
        <h3 className="text-lg font-light text-stone-900" style={{ fontFamily: 'var(--font-crimson)' }}>
          Live AI Chat → Journal Plus
        </h3>
        <div className="flex gap-2">
          <button
            disabled
            className="px-4 py-2 text-xs font-mono bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-50"
            title="Claude API temporarily disabled"
          >
            Claude
          </button>
          <button
            onClick={() => setProvider("chatgpt")}
            className={`px-4 py-2 text-xs font-mono transition-all ${
              provider === "chatgpt"
                ? "bg-stone-900 text-white border border-stone-900"
                : "bg-white text-stone-600 border border-stone-300 hover:border-stone-400"
            }`}
          >
            ChatGPT
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-stone-500">
              Start a conversation. It will auto-save to Journal Plus with PS-LANG transformation.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-stone-100 text-stone-900"
              }`}
            >
              <div className="text-xs font-medium mb-1 opacity-70">
                {msg.role === "user" ? "You" : provider === "claude" ? "Claude" : "ChatGPT"}
              </div>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 px-4 py-3 rounded-lg">
              <div className="text-xs text-stone-500">Thinking...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 px-6 py-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${provider === "claude" ? "Claude" : "ChatGPT"} anything... (auto-saves to Journal Plus)`}
            className="flex-1 px-4 py-3 border border-stone-300 rounded-lg resize-none focus:outline-none focus:border-purple-600 text-sm"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-2">
          💾 Auto-saves to Journal Plus with AI summary, meta-tags, and PS-LANG transformation
        </p>
      </div>
    </div>
  )
}
