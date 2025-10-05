"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function AgentQueryDemo() {
  const { user } = useUser()
  const [queryType, setQueryType] = useState<"metaTags" | "quality" | "zones" | "recommendations">("recommendations")
  const [results, setResults] = useState<any[]>([])

  const generateMocks = useMutation(api.mockConversations.generateMockConversations)

  // Query examples
  const recommendations = useQuery(
    api.agentQueries.getAgentRecommendations,
    user ? { userId: user.id, limit: 5 } : "skip"
  )

  const handleGenerateMocks = async () => {
    if (!user) return
    await generateMocks({ userId: user.id, count: 3 })
    alert("Generated 3 mock conversations!")
  }

  const handleQuery = async (type: string) => {
    setQueryType(type as any)

    switch (type) {
      case "metaTags":
        // Example: Find React optimization conversations
        const metaResults = await fetch("/api/agent-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "metaTags",
            metaTags: ["intent:optimization", "tech_stack:react"],
            minRlhfScore: 0.5,
          }),
        }).then(r => r.json())
        setResults(metaResults.conversations || [])
        break

      case "quality":
        // Example: Find advanced conversations with good code
        const qualityResults = await fetch("/api/agent-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "quality",
            minExpertise: "intermediate",
            minCodeQuality: 0.5,
          }),
        }).then(r => r.json())
        setResults(qualityResults.conversations || [])
        break

      case "zones":
        // Example: Find conversations with private + bookmark zones
        const zoneResults = await fetch("/api/agent-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "zones",
            zones: ["private", "bookmark"],
            matchAll: false,
          }),
        }).then(r => r.json())
        setResults(zoneResults.conversations || [])
        break

      case "recommendations":
        setResults(recommendations || [])
        break
    }
  }

  return (
    <div className="border border-stone-200 bg-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-light text-stone-900" style={{ fontFamily: 'var(--font-crimson)' }}>
          Agent Query System
        </h3>
        <button
          onClick={handleGenerateMocks}
          className="px-4 py-2 bg-purple-600 text-white text-xs hover:bg-purple-700 transition-colors"
        >
          Generate Test Data
        </button>
      </div>

      <p className="text-sm text-stone-600 mb-6">
        Cross-agent knowledge discovery using meta-tags, private signals, and RLHF scores
      </p>

      {/* Query Type Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => handleQuery("recommendations")}
          className={`px-4 py-2 text-xs border transition-all ${
            queryType === "recommendations"
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-stone-300 text-stone-600 hover:border-stone-900"
          }`}
        >
          📊 Agent Recommendations
        </button>
        <button
          onClick={() => handleQuery("metaTags")}
          className={`px-4 py-2 text-xs border transition-all ${
            queryType === "metaTags"
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-stone-300 text-stone-600 hover:border-stone-900"
          }`}
        >
          🏷️ Meta-Tag Query
        </button>
        <button
          onClick={() => handleQuery("quality")}
          className={`px-4 py-2 text-xs border transition-all ${
            queryType === "quality"
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-stone-300 text-stone-600 hover:border-stone-900"
          }`}
        >
          ⭐ Quality Filter
        </button>
        <button
          onClick={() => handleQuery("zones")}
          className={`px-4 py-2 text-xs border transition-all ${
            queryType === "zones"
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-stone-300 text-stone-600 hover:border-stone-900"
          }`}
        >
          🔒 Zone Search
        </button>
      </div>

      {/* Query Explanation */}
      <div className="bg-stone-50 border border-stone-200 p-4 mb-6">
        <h4 className="text-xs font-medium text-stone-700 mb-2">Current Query:</h4>
        <code className="text-xs text-purple-700">
          {queryType === "recommendations" && "getAgentRecommendations({ limit: 5 }) - Top learning value"}
          {queryType === "metaTags" && "queryByMetaTags({ metaTags: ['intent:optimization', 'tech_stack:react'], minRlhfScore: 0.5 })"}
          {queryType === "quality" && "queryByQuality({ minExpertise: 'intermediate', minCodeQuality: 0.5 })"}
          {queryType === "zones" && "queryByZones({ zones: ['private', 'bookmark'], matchAll: false })"}
        </code>
      </div>

      {/* Results */}
      <div>
        <h4 className="text-sm font-medium text-stone-700 mb-3">
          Results: {(results.length || recommendations?.length || 0)} conversations
        </h4>
        <div className="space-y-2">
          {(results.length > 0 ? results : recommendations || []).map((conv: any, idx: number) => (
            <div key={idx} className="border border-stone-200 p-4 bg-stone-50/50">
              <div className="flex items-start justify-between mb-2">
                <h5 className="text-sm font-medium text-stone-900">{conv.title}</h5>
                <span className="text-xs text-green-600 font-medium">
                  {conv.rlhfScore ? `+${conv.rlhfScore.toFixed(2)}` : "0.00"}
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-2">{conv.aiSummary}</p>
              <div className="flex gap-2 flex-wrap">
                {conv.metaTags?.map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              {conv.privateSignals && (
                <div className="mt-2 pt-2 border-t border-stone-200">
                  <p className="text-xs text-stone-500">
                    🔒 Expertise: {conv.privateSignals.userExpertiseLevel} |
                    Code Quality: {conv.privateSignals.codeQualityScore} |
                    Turns: {conv.privateSignals.conversationTurns}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
