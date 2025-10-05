"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"

interface MetaFeedProps {
  sessionId: string
}

export default function MetaFeed({ sessionId }: MetaFeedProps) {
  const metaTags = useQuery(api.agenticUX.getSessionMetaTags, { sessionId })
  const streamEvents = useQuery(api.agenticUX.getSessionEvents, { sessionId })

  // Combine and sort by timestamp
  const allItems = [
    ...(metaTags || []).map((tag) => ({ ...tag, type: 'tag' as const })),
    ...(streamEvents || []).map((event) => ({ ...event, type: 'event' as const })),
  ].sort((a, b) => b.timestamp - a.timestamp)

  const getZoneBadgeColor = (zone: string) => {
    switch (zone) {
      case 'public':
        return 'bg-green-100 text-green-800'
      case 'private':
        return 'bg-red-100 text-red-800'
      case 'managed':
        return 'bg-purple-100 text-purple-800'
      case 'read-only':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-stone-100 text-stone-600'
    }
  }

  return (
    <div
      className="border border-stone-200 bg-white"
      data-ai-section="meta-feed"
      data-ai-zone="public"
    >
      <div className="border-b border-stone-100 px-6 py-4 bg-stone-50">
        <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium">
          Meta-Tag Timeline
        </h4>
        <p className="text-xs text-stone-500 mt-1">
          Real-time stream events and meta-tags
        </p>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        {allItems.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm">
            No events yet. Interact with capabilities to generate meta-tags.
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {allItems.map((item, index) => (
                <motion.div
                  key={`${item.type}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                  className="border border-stone-200 p-4 bg-stone-50 hover:bg-white transition-colors"
                  data-ai-feed-item={item.type}
                  data-ai-zone={item.zone}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${getZoneBadgeColor(
                            item.zone
                          )}`}
                          data-ai-badge="zone"
                        >
                          {item.zone}
                        </span>
                        <span className="text-xs text-stone-400">
                          {item.type === 'tag' ? '🏷️' : '⚡'}
                        </span>
                      </div>

                      {item.type === 'tag' ? (
                        <>
                          <div className="font-mono text-xs text-stone-900 mb-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-stone-600">
                            Value: {JSON.stringify(item.value)}
                          </div>
                          {'confidence' in item && item.confidence && (
                            <div className="text-xs text-stone-500 mt-1">
                              Confidence: {(item.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="font-mono text-xs text-stone-900 mb-1">
                            {item.action}
                          </div>
                          <div className="text-xs text-stone-600">
                            Component: {item.componentId}
                          </div>
                          {item.payload && (
                            <div className="text-xs text-stone-500 mt-1">
                              Payload: {JSON.stringify(item.payload)}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-stone-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
