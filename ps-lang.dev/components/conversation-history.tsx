"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import { Id } from "@/convex/_generated/dataModel"

interface ConversationHistoryProps {
  provider?: "claude" | "chatgpt"
}

// Color hierarchy for nested levels
const levelColors = {
  0: "#9333ea", // purple-600 - Root conversation
  1: "#2563eb", // blue-600 - Message groups
  2: "#16a34a", // green-600 - Individual messages
  3: "#6b7280", // gray-500 - Nested context
}

export default function ConversationHistory({ provider = "claude" }: ConversationHistoryProps) {
  const { user } = useUser()
  const conversations = useQuery(
    api.aiConnectors.getUserConversations,
    user ? { userId: user.id, provider } : "skip"
  )

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <p className="text-sm">No conversations synced yet.</p>
        <p className="text-xs mt-2">Click "Sync Now" to import your Claude conversations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationAccordion key={conversation._id} conversation={conversation} />
      ))}
    </div>
  )
}

interface ConversationAccordionProps {
  conversation: any
}

function ConversationAccordion({ conversation }: ConversationAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showFullMessages, setShowFullMessages] = useState(false)
  const { user } = useUser()

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)

    // Emit agent negotiation payload when expanding
    if (newState && typeof window !== "undefined" && (window as any).posthog) {
      ;(window as any).posthog.capture("agent_conversation_access", {
        conversationId: conversation._id,
        publicMetaTags: conversation.metaTags || [],
        privateSignals: conversation.privateSignals || {},
        zones: conversation.zones || [],
        intent: "conversation_review",
        rlhfScore: conversation.rlhfScore || 0,
      })
    }
  }

  // Use AI-generated summary or fallback
  const summary = conversation.aiSummary ||
    (conversation.messages?.[0]?.content
      ? conversation.messages[0].content.split(".").slice(0, 2).join(".") + "."
      : "No summary available")

  // RLHF score visualization
  const rlhfScore = conversation.rlhfScore || 0
  const scoreColor = rlhfScore > 0 ? "text-green-600" : rlhfScore < 0 ? "text-red-600" : "text-gray-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      className="border bg-white shadow-sm overflow-hidden"
      style={{ borderColor: isOpen ? levelColors[0] : "#e5e7eb" }}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: levelColors[0] }}
          />
          <div className="text-left flex-1">
            <h3 className="font-medium text-stone-900 text-sm">{conversation.title}</h3>
            <p className="text-xs text-stone-500 mt-1 line-clamp-1">{summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* RLHF Score */}
          <div className={`text-xs font-medium ${scoreColor}`}>
            {rlhfScore > 0 ? `+${rlhfScore.toFixed(2)}` : rlhfScore.toFixed(2)}
          </div>
          {/* Meta-tag badges */}
          <div className="flex gap-2">
            {conversation.metaTags?.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            ▼
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-purple-50/30 border-t" style={{ borderColor: levelColors[0] }}>
              {/* Summary / Full Toggle */}
              <div className="mb-4">
                {showFullMessages ? (
                  <div className="space-y-3">
                    {conversation.messages?.map((message: any, idx: number) => (
                      <MessageItem
                        key={idx}
                        message={message}
                        level={1}
                        conversationId={conversation._id}
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-stone-700">{summary}</p>
                    <button
                      onClick={() => setShowFullMessages(true)}
                      className="text-xs text-purple-600 hover:underline mt-2"
                    >
                      Show full conversation →
                    </button>
                  </div>
                )}
              </div>

              {/* PS-LANG Transformed Prompt */}
              {conversation.pslPrompt && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-stone-600 mb-2">PS-LANG Transformation</h4>
                  <pre className="text-xs bg-stone-100 p-3 rounded overflow-x-auto">
                    {conversation.pslPrompt}
                  </pre>
                </div>
              )}

              {/* RLHF Feedback Component */}
              <RLHFFeedback conversationId={conversation._id} userId={user?.id || ""} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface MessageItemProps {
  message: any
  level: number
  conversationId: Id<"syncedConversations">
}

function MessageItem({ message, level, conversationId }: MessageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const color = levelColors[level as keyof typeof levelColors] || levelColors[3]

  return (
    <div
      className="border-l-4 pl-4 py-2"
      style={{ borderColor: color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium uppercase"
              style={{ color }}
            >
              {message.role}
            </span>
          </div>
          {isExpanded ? (
            <p className="text-sm text-stone-700 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <p className="text-sm text-stone-700 line-clamp-2">{message.content}</p>
          )}
          {message.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs hover:underline mt-1"
              style={{ color }}
            >
              {isExpanded ? "Show less" : "Show more →"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface RLHFFeedbackProps {
  conversationId: Id<"syncedConversations">
  userId: string
}

function RLHFFeedback({ conversationId, userId }: RLHFFeedbackProps) {
  const submitFeedback = useMutation(api.conversationFeedback.submitFeedback)
  const userFeedback = useQuery(
    api.conversationFeedback.getUserFeedback,
    userId ? { conversationId, userId } : "skip"
  )

  const handleFeedback = async (feedback: "positive" | "negative") => {
    await submitFeedback({
      conversationId,
      userId,
      feedback,
      context: {
        agentType: "claude",
      },
    })

    // Track in PostHog
    if (typeof window !== "undefined" && (window as any).posthog) {
      ;(window as any).posthog.capture("conversation_feedback", {
        conversationId,
        feedback,
      })
    }
  }

  return (
    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-200">
      <span className="text-xs text-stone-600">Was this conversation helpful?</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback("positive")}
          className={`p-2 rounded transition-all ${
            userFeedback?.feedback === "positive"
              ? "bg-green-100 text-green-700"
              : "hover:bg-stone-100 text-stone-500"
          }`}
        >
          👍
        </button>
        <button
          onClick={() => handleFeedback("negative")}
          className={`p-2 rounded transition-all ${
            userFeedback?.feedback === "negative"
              ? "bg-red-100 text-red-700"
              : "hover:bg-stone-100 text-stone-500"
          }`}
        >
          👎
        </button>
      </div>
    </div>
  )
}
