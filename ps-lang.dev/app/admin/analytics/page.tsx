"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { Heart, TrendingUp, Users, MousePointerClick, FileText } from "lucide-react"

export default function AnalyticsPage() {
  const [selectedPage, setSelectedPage] = useState<string>("research-paper")
  const [selectedCategory, setSelectedCategory] = useState<string>("paper-keyword")
  const [dateRange, setDateRange] = useState<{ start?: number; end?: number }>({})

  // Get metrics for selected page/category
  const metrics = useQuery(
    api.userInteractions.getMetrics,
    selectedPage && selectedCategory
      ? {
          page: selectedPage,
          category: selectedCategory,
          startDate: dateRange.start,
          endDate: dateRange.end,
        }
      : "skip"
  )

  // Get top interactions across site
  const topInteractions = useQuery(api.userInteractions.getTopInteractions, {
    limit: 20,
  })

  const pages = [
    { id: "research-paper", label: "Research Papers" },
    { id: "homepage", label: "Homepage" },
    { id: "playground", label: "Playground" },
    { id: "journal", label: "Journal" },
  ]

  const categories = [
    { id: "paper-keyword", label: "Paper Keywords" },
    { id: "paper-abstract", label: "Paper Abstracts" },
    { id: "cta-button", label: "CTA Buttons" },
    { id: "feature-request", label: "Feature Requests" },
  ]

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">Analytics Dashboard</h1>
          <p className="text-stone-600">User interaction metrics and engagement data</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8">
          <h2 className="text-sm font-medium text-stone-900 mb-4 uppercase tracking-wider">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Page Filter */}
            <div>
              <label className="block text-xs text-stone-600 mb-2 uppercase tracking-wide">Page</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs text-stone-600 mb-2 uppercase tracking-wide">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Metrics */}
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-stone-600" />
              <h2 className="text-lg font-medium text-stone-900">
                {categories.find((c) => c.id === selectedCategory)?.label} Engagement
              </h2>
            </div>

            {!metrics || metrics.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                No data available for this selection
              </div>
            ) : (
              <div className="space-y-4">
                {metrics.slice(0, 10).map((metric) => (
                  <div
                    key={metric.target}
                    className="border-b border-stone-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-stone-900">
                        {metric.target}
                      </span>
                      <span className="text-xs text-stone-500">
                        {metric.uniqueSessions} users
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-600">
                      <span>Total: {metric.count}</span>
                      <span className="text-green-600">👍 {metric.likeCount}</span>
                      <span className="text-red-600">👎 {metric.unlikeCount}</span>
                    </div>

                    {/* Engagement bar */}
                    <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stone-600 rounded-full"
                        style={{
                          width: `${(metric.likeCount / metric.count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Interactions Sitewide */}
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-stone-600" />
              <h2 className="text-lg font-medium text-stone-900">Top Interactions (All Pages)</h2>
            </div>

            {!topInteractions || topInteractions.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                No interactions tracked yet
              </div>
            ) : (
              <div className="space-y-3">
                {topInteractions.map((item, index) => (
                  <div
                    key={item.target}
                    className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-stone-400 w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-stone-900">{item.target}</span>
                    </div>
                    <span className="text-xs text-stone-600 font-medium">
                      {item.count} interactions
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <MousePointerClick className="w-4 h-4 text-stone-400" />
              <span className="text-xs text-stone-600 uppercase tracking-wide">Total Clicks</span>
            </div>
            <div className="text-2xl font-light text-stone-900">
              {metrics?.reduce((sum, m) => sum + m.count, 0) || 0}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-4 h-4 text-stone-400" />
              <span className="text-xs text-stone-600 uppercase tracking-wide">Unique Users</span>
            </div>
            <div className="text-2xl font-light text-stone-900">
              {metrics?.reduce((sum, m) => sum + m.uniqueSessions, 0) || 0}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-4 h-4 text-stone-400" />
              <span className="text-xs text-stone-600 uppercase tracking-wide">Total Likes</span>
            </div>
            <div className="text-2xl font-light text-stone-900">
              {metrics?.reduce((sum, m) => sum + m.likeCount, 0) || 0}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-4 h-4 text-stone-400" />
              <span className="text-xs text-stone-600 uppercase tracking-wide">Items Tracked</span>
            </div>
            <div className="text-2xl font-light text-stone-900">
              {metrics?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
