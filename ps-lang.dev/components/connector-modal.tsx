"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"

interface ConnectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConnectorModal({ isOpen, onClose }: ConnectorModalProps) {
  const { user } = useUser()
  const [activeProvider, setActiveProvider] = useState<"chatgpt" | "claude" | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const connectors = useQuery(
    api.aiConnectors.getUserConnectors,
    user ? { userId: user.id } : "skip"
  )
  const connectProvider = useMutation(api.aiConnectors.connectProvider)
  const disconnectProvider = useMutation(api.aiConnectors.disconnectProvider)

  const chatgptConnector = connectors?.find((c) => c.provider === "chatgpt")
  const claudeConnector = connectors?.find((c) => c.provider === "claude")

  const handleConnect = async (provider: "chatgpt" | "claude") => {
    if (!user) return
    setIsConnecting(true)

    try {
      if (provider === "chatgpt") {
        // ChatGPT uses OAuth - redirect to OAuth flow
        window.location.href = `/api/auth/chatgpt/authorize?userId=${user.id}`
      } else if (provider === "claude") {
        // Claude uses API key
        if (!apiKey.trim()) {
          alert("Please enter your Claude API key")
          setIsConnecting(false)
          return
        }

        await connectProvider({
          userId: user.id,
          provider: "claude",
          apiKey: apiKey.trim(),
          settings: { autoSync: true, syncFrequency: "daily" },
        })

        setApiKey("")
        setActiveProvider(null)

        // Track in PostHog
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('connector_connected', {
            provider: 'claude',
          })
        }
      }
    } catch (error) {
      console.error("Error connecting provider:", error)
      alert("Failed to connect. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (provider: "chatgpt" | "claude") => {
    if (!user) return

    const confirmed = confirm(`Disconnect ${provider === "chatgpt" ? "ChatGPT" : "Claude"}?`)
    if (!confirmed) return

    try {
      await disconnectProvider({
        userId: user.id,
        provider,
      })

      // Track in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('connector_disconnected', {
          provider,
        })
      }
    } catch (error) {
      console.error("Error disconnecting provider:", error)
    }
  }

  const handleSync = async (provider: "chatgpt" | "claude") => {
    if (!user) return
    setIsSyncing(true)

    try {
      const response = await fetch(`/api/sync/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Synced ${data.syncedCount} conversations successfully!`)

        // Track in PostHog
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('conversation_sync', {
            provider,
            count: data.syncedCount,
          })
        }
      } else {
        throw new Error(data.error || "Sync failed")
      }
    } catch (error) {
      console.error("Sync error:", error)
      alert("Failed to sync conversations. Please try again.")
    } finally {
      setIsSyncing(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-stone-300 max-w-2xl w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-stone-200 px-8 py-6 flex items-center justify-between">
            <h2
              className="text-2xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              Connect AI Assistants
            </h2>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <p className="text-sm text-stone-600" style={{ fontFamily: 'var(--font-crimson)' }}>
              API Status: These connectors verify your API keys for creating new conversations that auto-save to Journal Plus.
            </p>

            {/* Claude Connector - Featured */}
            <div className="border border-stone-200 bg-stone-50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900">Claude</h3>
                    <p className="text-xs text-stone-500">Anthropic Claude conversations</p>
                  </div>
                </div>
                {claudeConnector?.status === "connected" ? (
                  <span className="text-xs text-green-600">● Connected</span>
                ) : (
                  <span className="text-xs text-stone-400">Not connected</span>
                )}
              </div>

              {claudeConnector?.status === "connected" ? (
                <div>
                  <div className="text-xs text-stone-600 mb-3">
                    Last synced: {claudeConnector.lastSyncAt ? new Date(claudeConnector.lastSyncAt).toLocaleString() : "Never"}
                  </div>
                  <div className="bg-green-50 border border-green-200 p-3 mb-3">
                    <p className="text-xs text-green-800">
                      ✓ Connected! Use the Live Chat to create new conversations that auto-save to Journal Plus.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDisconnect("claude")}
                    className="px-4 py-2 border border-stone-300 text-sm text-stone-700 hover:border-red-500 hover:text-red-600 transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div>
                  {activeProvider === "claude" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-600 mb-2">
                          Claude API Key
                        </label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk-ant-..."
                          className="w-full px-4 py-2 border border-stone-300 text-sm focus:outline-none focus:border-stone-900"
                        />
                        <p className="text-xs text-stone-500 mt-1">
                          Get your API key from{" "}
                          <a
                            href="https://console.anthropic.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            Anthropic Console
                          </a>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConnect("claude")}
                          disabled={isConnecting || !apiKey.trim()}
                          className="px-6 py-2 bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {isConnecting ? "Connecting..." : "Connect"}
                        </button>
                        <button
                          onClick={() => {
                            setActiveProvider(null)
                            setApiKey("")
                          }}
                          className="px-4 py-2 border border-stone-300 text-sm text-stone-700 hover:border-stone-900 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveProvider("claude")}
                      className="px-6 py-2 bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
                    >
                      Connect with API Key
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ChatGPT - Available */}
            <div className="border border-stone-200 bg-stone-50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    G
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900">ChatGPT</h3>
                    <p className="text-xs text-stone-500">OpenAI GPT-4 API</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium">✓ API Ready</span>
              </div>
              <div className="bg-green-50 border border-green-200 p-3">
                <p className="text-xs text-green-800">
                  ChatGPT available in Live Chat. Your OpenAI API key is configured.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
