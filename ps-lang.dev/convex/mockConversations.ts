import { mutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * Generate mock conversations for testing
 * This creates sample Claude conversations with realistic data
 */
export const generateMockConversations = mutation({
  args: {
    userId: v.string(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 3

    const mockConversations = [
      {
        conversationId: "mock-001",
        title: "Build authentication system with Clerk",
        messages: [
          { role: "user", content: "I need to add authentication to my Next.js app. What's the best approach?" },
          { role: "assistant", content: "For Next.js, I recommend using Clerk. It provides robust authentication with minimal setup. Here's how to integrate it:\n\n```bash\nnpm install @clerk/nextjs\n```\n\nThen wrap your app with ClerkProvider..." },
          { role: "user", content: "How do I protect routes?" },
          { role: "assistant", content: "You can use middleware for route protection. Create a middleware.ts file:\n\n```typescript\nimport { authMiddleware } from '@clerk/nextjs';\n\nexport default authMiddleware({\n  publicRoutes: ['/'],\n});\n```" },
        ],
        metaTags: ["intent:implementation", "tech_stack:next.js,clerk,typescript", "complexity:medium"],
        zones: ["public", "private"],
        privateSignals: {
          userExpertiseLevel: "intermediate",
          timeToResolution: 8,
          conversationTurns: 4,
          codeQualityScore: 1.0,
          agentAssistanceLevel: "medium",
        },
        aiSummary: "User wants to add authentication to a Next.js app. Clerk was recommended for easy integration with built-in route protection via middleware.",
        rlhfScore: 0.8,
      },
      {
        conversationId: "mock-002",
        title: "Optimize React rendering performance",
        messages: [
          { role: "user", content: "My React component is re-rendering too much. How can I optimize it?" },
          { role: "assistant", content: "Let's identify the cause. Are you using useState or useContext? Can you share the component code?" },
          { role: "user", content: "Here's the code:\n\n```jsx\nfunction ProductList({ products }) {\n  const [selected, setSelected] = useState([]);\n  return products.map(p => <Product key={p.id} product={p} />);\n}\n```" },
          { role: "assistant", content: "The issue is that Product components re-render on every parent state change. Wrap Product with React.memo:\n\n```jsx\nconst Product = React.memo(({ product }) => {\n  // component logic\n});\n```\n\nAlso consider useMemo for expensive calculations." },
          { role: "user", content: "That worked! Renders dropped by 80%." },
          { role: "assistant", content: "Great! For further optimization, you could also virtualize the list if you have many items using react-window or react-virtual." },
        ],
        metaTags: ["intent:optimization", "tech_stack:react,javascript", "complexity:high"],
        zones: ["public", "private", "bookmark"],
        privateSignals: {
          userExpertiseLevel: "intermediate",
          timeToResolution: 12,
          conversationTurns: 6,
          codeQualityScore: 0.5,
          agentAssistanceLevel: "high",
        },
        aiSummary: "User's React component had excessive re-renders. Solution involved using React.memo to prevent unnecessary updates and suggesting virtualization for large lists, resulting in 80% render reduction.",
        rlhfScore: 1.0,
      },
      {
        conversationId: "mock-003",
        title: "Debug TypeScript type error in API route",
        messages: [
          { role: "user", content: "Getting TypeScript error: 'Property 'user' does not exist on type 'NextRequest''. How do I fix this?" },
          { role: "assistant", content: "You need to extend the NextRequest type. Create a types file:\n\n```typescript\nimport { NextRequest } from 'next/server';\n\ndeclare module 'next/server' {\n  interface NextRequest {\n    user?: { id: string };\n  }\n}\n```" },
          { role: "user", content: "Thanks! That fixed it." },
        ],
        metaTags: ["intent:debugging", "tech_stack:typescript,next.js", "complexity:low"],
        zones: ["public"],
        privateSignals: {
          userExpertiseLevel: "beginner",
          timeToResolution: 4,
          conversationTurns: 3,
          codeQualityScore: 0.5,
          agentAssistanceLevel: "low",
        },
        aiSummary: "User had TypeScript type error with NextRequest. Quick fix involved extending the NextRequest interface via module declaration augmentation.",
        rlhfScore: 0.5,
      },
    ]

    const conversationIds = []

    for (let i = 0; i < Math.min(count, mockConversations.length); i++) {
      const mock = mockConversations[i]

      // Transform to PS-LANG format
      const pslPrompt = `<@.\n${mock.messages[0].content}\n.>\n\n<#.\nTech stack: ${mock.metaTags.find(t => t.startsWith('tech_stack'))?.split(':')[1] || 'unknown'}\n#>`

      const id = await ctx.db.insert("syncedConversations", {
        userId: args.userId,
        provider: "claude",
        conversationId: mock.conversationId,
        title: mock.title,
        messages: mock.messages,
        pslPrompt,
        metaTags: mock.metaTags,
        zones: mock.zones,
        privateSignals: mock.privateSignals,
        aiSummary: mock.aiSummary,
        rlhfScore: mock.rlhfScore,
        syncedAt: Date.now(),
        conversationDate: Date.now() - (i * 86400000), // Spread over days
      })

      conversationIds.push(id)
    }

    return {
      success: true,
      created: conversationIds.length,
      conversationIds,
    }
  },
})

/**
 * Clear all mock conversations for a user
 */
export const clearMockConversations = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("syncedConversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("conversationId"), "mock-001"))
      .collect()

    for (const conv of conversations) {
      await ctx.db.delete(conv._id)
    }

    return { deleted: conversations.length }
  },
})
