"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Heart, ThumbsUp, CornerDownRight } from "lucide-react"
import { useInteractionTracking } from "@/lib/useInteractionTracking"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { EmojiContent } from "@/components/emoji-icon"

export default function ResearchPaperPage({ params }: { params: { slug: string } }) {
  const paper = useQuery(api.researchPapers.getBySlug, { slug: params.slug })
  const incrementViews = useMutation(api.researchPapers.incrementViews)
  const { track } = useInteractionTracking("research-paper", params.slug)
  const [hasIncrementedView, setHasIncrementedView] = useState(false)
  const [likedKeywords, setLikedKeywords] = useState<Set<string>>(new Set())
  const [keywordToggleCounts, setKeywordToggleCounts] = useState<Record<string, number>>({})
  const [abstractLiked, setAbstractLiked] = useState(false)
  const [titleLiked, setTitleLiked] = useState(false)
  const [executiveSummaryLiked, setExecutiveSummaryLiked] = useState(false)
  const [activeTab, setActiveTab] = useState<"original" | "summarized" | "psl">("original")

  // Load liked states from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && paper) {
      const storageKey = `paper_likes_${params.slug}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const likes = JSON.parse(stored)
          setAbstractLiked(likes.abstract || false)
          setTitleLiked(likes.title || false)
          setExecutiveSummaryLiked(likes.executiveSummary || false)
          if (likes.keywords && Array.isArray(likes.keywords)) {
            setLikedKeywords(new Set(likes.keywords))
          }
        } catch (e) {
          console.error('Failed to parse liked states:', e)
        }
      }
    }
  }, [paper, params.slug])

  // Handle URL hash for tab sharing
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'academic' || hash === 'summarized' || hash === 'psl') {
      setActiveTab(hash === 'academic' ? 'original' : hash)
    }
  }, [])

  const handleTabChange = (tab: "original" | "summarized" | "psl", label: string) => {
    setActiveTab(tab)

    // Update URL hash for sharing
    const hashMap: Record<string, string> = {
      'original': 'academic',
      'summarized': 'summarized',
      'psl': 'psl'
    }
    window.history.replaceState(null, '', `#${hashMap[tab]}`)

    // Track interaction
    track({
      interactionType: "click",
      category: "paper-format",
      target: `${label.toLowerCase()}-format`,
      metadata: {
        paperTitle: paper?.title,
        paperCategory: paper?.category,
      },
    })
  }

  // Strip intro content (title, subtitle, abstract, keywords) from markdown for academic tab
  const stripIntroFromMarkdown = (content: string) => {
    // Find the first "## 1." or "## Introduction" section
    const introSectionMatch = content.match(/\n## 1\./m) || content.match(/\n## Introduction/m)
    if (introSectionMatch && introSectionMatch.index) {
      return content.substring(introSectionMatch.index).trim()
    }
    return content
  }

  const handleKeywordClick = (keyword: string) => {
    // Toggle keyword like state
    const isCurrentlyLiked = likedKeywords.has(keyword)
    const newLikedKeywords = new Set(likedKeywords)

    if (isCurrentlyLiked) {
      newLikedKeywords.delete(keyword)
    } else {
      newLikedKeywords.add(keyword)
    }

    setLikedKeywords(newLikedKeywords)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const storageKey = `paper_likes_${params.slug}`
      const stored = localStorage.getItem(storageKey)
      const likes = stored ? JSON.parse(stored) : {}
      likes.keywords = Array.from(newLikedKeywords)
      localStorage.setItem(storageKey, JSON.stringify(likes))
    }

    // Increment toggle count
    const newToggleCount = (keywordToggleCounts[keyword] || 0) + 1
    setKeywordToggleCounts(prev => ({
      ...prev,
      [keyword]: newToggleCount
    }))

    // Track interaction
    track({
      interactionType: "toggle",
      category: "paper-keyword",
      target: keyword,
      value: {
        liked: !isCurrentlyLiked,
        toggleCount: newToggleCount,
      },
      metadata: {
        paperTitle: paper?.title,
        paperCategory: paper?.category,
      },
    })
  }

  const handleAbstractClick = () => {
    const newLikedState = !abstractLiked
    setAbstractLiked(newLikedState)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const storageKey = `paper_likes_${params.slug}`
      const stored = localStorage.getItem(storageKey)
      const likes = stored ? JSON.parse(stored) : {}
      likes.abstract = newLikedState
      localStorage.setItem(storageKey, JSON.stringify(likes))
    }

    // Track interaction
    track({
      interactionType: "toggle",
      category: "paper-abstract",
      target: "abstract",
      value: {
        liked: newLikedState,
      },
      metadata: {
        paperTitle: paper?.title,
        paperCategory: paper?.category,
      },
    })
  }

  const handleTitleClick = () => {
    const newLikedState = !titleLiked
    setTitleLiked(newLikedState)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const storageKey = `paper_likes_${params.slug}`
      const stored = localStorage.getItem(storageKey)
      const likes = stored ? JSON.parse(stored) : {}
      likes.title = newLikedState
      localStorage.setItem(storageKey, JSON.stringify(likes))
    }

    // Track interaction
    track({
      interactionType: "toggle",
      category: "paper-title",
      target: "academic-title",
      value: {
        liked: newLikedState,
      },
      metadata: {
        paperTitle: paper?.title,
        paperCategory: paper?.category,
      },
    })
  }

  const handleExecutiveSummaryClick = () => {
    const newLikedState = !executiveSummaryLiked
    setExecutiveSummaryLiked(newLikedState)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const storageKey = `paper_likes_${params.slug}`
      const stored = localStorage.getItem(storageKey)
      const likes = stored ? JSON.parse(stored) : {}
      likes.executiveSummary = newLikedState
      localStorage.setItem(storageKey, JSON.stringify(likes))
    }

    // Track interaction
    track({
      interactionType: "toggle",
      category: "paper-executive-summary",
      target: "executive-summary-title",
      value: {
        liked: newLikedState,
      },
      metadata: {
        paperTitle: paper?.title,
        paperCategory: paper?.category,
      },
    })
  }

  const jumpToSection = (sectionText: string) => {
    // Switch to Academic format
    setActiveTab("original")

    // Track the jump
    track({
      interactionType: "click",
      category: "paper-navigation",
      target: `jump-to-${sectionText.toLowerCase().replace(/\s+/g, "-")}`,
      metadata: {
        paperTitle: paper?.title,
        paperCategory: paper?.category,
      },
    })

    // Wait for tab switch, then scroll to section
    setTimeout(() => {
      // Find heading that contains this text
      const headings = document.querySelectorAll('article h1, article h2, article h3, article h4')
      const targetHeading = Array.from(headings).find(h =>
        h.textContent?.toLowerCase().includes(sectionText.toLowerCase())
      )

      if (targetHeading) {
        targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Add a highlight effect
        targetHeading.classList.add('bg-yellow-100/50')
        setTimeout(() => targetHeading.classList.remove('bg-yellow-100/50'), 2000)
      }
    }, 100)
  }

  useEffect(() => {
    if (paper && !hasIncrementedView) {
      // Check if this paper has been viewed in this session
      const viewedPapers = JSON.parse(sessionStorage.getItem('viewedPapers') || '[]')

      if (!viewedPapers.includes(params.slug)) {
        // Track this view
        incrementViews({ slug: params.slug })

        // Mark as viewed in session
        viewedPapers.push(params.slug)
        sessionStorage.setItem('viewedPapers', JSON.stringify(viewedPapers))
      }

      setHasIncrementedView(true)
    }
  }, [paper, hasIncrementedView, params.slug, incrementViews])

  if (paper === undefined) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (paper === null) {
    notFound()
  }

  // JSON-LD structured data for SEO
  const jsonLd = paper ? {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": paper.title,
    "alternativeHeadline": paper.subtitle,
    "abstract": paper.abstract,
    "author": paper.authors.map(name => ({
      "@type": "Person",
      "name": name
    })),
    "publisher": {
      "@type": "Organization",
      "name": "Vummo Labs",
      "url": "https://ps-lang.dev"
    },
    "datePublished": new Date(paper.publicationDate).toISOString(),
    "dateModified": new Date(paper.updatedAt || paper.publicationDate).toISOString(),
    "keywords": paper.keywords.join(", "),
    "inLanguage": "en",
    "url": `https://ps-lang.dev/research-papers/${params.slug}`,
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "citation": paper.citations || [],
    "about": {
      "@type": "Thing",
      "name": paper.category
    }
  } : null

  return (
    <div className="min-h-screen bg-stone-50">
      {/* JSON-LD for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Header */}
      <div className="border-b border-stone-200/60 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Research Papers", href: "/research-papers" },
                { label: paper.title, href: `/research-papers/${params.slug}` }
              ]}
            />
          </div>

          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">{paper.category}</span>
            <span className="text-stone-300/60">•</span>
            <time className="text-[10px] tracking-[0.15em] text-stone-400/80 uppercase">
              {new Date(paper.publicationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>

          <div className="mb-4 max-w-4xl">
            <h1
              onClick={handleTitleClick}
              className="group text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-[1.1] cursor-pointer"
              style={{ textWrap: 'pretty' } as any}
            >
              {paper.title}
              <span
                className="inline-block whitespace-nowrap"
                title={titleLiked ? "Unlike this paper title" : "Like this paper title"}
              >
                <ThumbsUp
                  className={`inline-block ml-2 w-5 h-5 align-baseline transition-all cursor-pointer ${
                    titleLiked
                      ? "fill-stone-600 stroke-stone-600 opacity-100"
                      : "fill-none stroke-stone-400 opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label="Like this paper title"
                />
              </span>
            </h1>
          </div>

          {paper.subtitle && (
            <h2 className="text-xl sm:text-2xl font-light text-stone-600 mb-6 tracking-tight [text-wrap:balance] max-w-3xl">
              {paper.subtitle}
            </h2>
          )}

          <div className="flex items-center gap-2 text-[12px] text-stone-500 mb-6">
            <span className="tracking-[0.05em]">By {paper.authors.join(", ")}</span>
          </div>

          {/* Abstract */}
          <div
            onClick={handleAbstractClick}
            className="mt-8 p-6 bg-stone-50 border border-stone-200/60 cursor-pointer hover:bg-stone-100/50 transition-colors relative group"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <h3 className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium leading-none">Abstract</h3>
              <ThumbsUp
                className={`w-2.5 h-2.5 transition-all ${
                  abstractLiked
                    ? "fill-stone-600 stroke-stone-600 opacity-100"
                    : "fill-none stroke-stone-400 opacity-0 group-hover:opacity-100"
                }`}
              />
            </div>
            <p className="text-[15px] text-stone-700 leading-[1.8] tracking-[0.01em]">
              {paper.abstract}
            </p>
          </div>

          {/* Keywords */}
          <div className="mt-4 flex flex-wrap gap-2">
            {paper.keywords.map((keyword) => {
              const isLiked = likedKeywords.has(keyword)
              return (
                <button
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="px-3 py-1 bg-white border border-stone-200/60 text-[10px] tracking-[0.1em] text-stone-600 uppercase hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Heart
                    className={`w-3 h-3 transition-all ${
                      isLiked
                        ? "fill-stone-600 stroke-stone-600"
                        : "fill-none stroke-stone-400"
                    }`}
                  />
                  {keyword}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Format Tabs */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-8">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTabChange("original", "Academic")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 ${
                activeTab === "original"
                  ? "text-stone-900 border-stone-900"
                  : "text-stone-500 border-transparent hover:text-stone-700"
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => handleTabChange("summarized", "Summarized")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 ${
                activeTab === "summarized"
                  ? "text-stone-900 border-stone-900"
                  : "text-stone-500 border-transparent hover:text-stone-700"
              }`}
            >
              Summarized
            </button>
            {/* PSL Format - Hidden for now */}
            {/* <button
              onClick={() => {
                setActiveTab("psl")
                track({
                  interactionType: "click",
                  category: "paper-format",
                  target: "psl-format",
                  metadata: {
                    paperTitle: paper?.title,
                    paperCategory: paper?.category,
                  },
                })
              }}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 ${
                activeTab === "psl"
                  ? "text-stone-900 border-stone-900"
                  : "text-stone-500 border-transparent hover:text-stone-700"
              }`}
            >
              PSL Format
            </button> */}
            {paper?.artifactUrl && (
              <a
                href={paper.artifactUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track({
                    interactionType: "click",
                    category: "paper-external-link",
                    target: "claude-ai-artifact",
                    metadata: {
                      paperTitle: paper?.title,
                      paperCategory: paper?.category,
                    },
                  })
                }}
                className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-stone-500 hover:text-stone-700 transition-colors border-b-2 border-transparent"
              >
                Claude.ai Paper →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Paper Content */}
      <div className="mx-auto px-4 sm:px-6 py-16 sm:py-20" style={{ maxWidth: activeTab === "psl" ? "680px" : activeTab === "summarized" ? "800px" : "900px" }}>
        {activeTab === "summarized" ? (
          // Summarized Format - Executive Summary
          <article className="prose prose-stone prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-stone-900
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:leading-[1.3] prose-h2:mb-4 prose-h2:mt-8 prose-h2:tracking-tight
            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:leading-[1.4] prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-lg prose-p:leading-[1.7] prose-p:text-stone-800 prose-p:mb-6
            prose-ul:text-lg prose-ul:leading-[1.7] prose-ul:my-8 prose-ul:space-y-3 prose-ul:list-none
            prose-li:text-stone-800 prose-li:flex prose-li:items-start prose-li:gap-3
            prose-li:marker:hidden
            prose-strong:text-stone-900 prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-stone-900 prose-blockquote:pl-6 prose-blockquote:py-2
            prose-blockquote:text-xl prose-blockquote:leading-[1.6] prose-blockquote:italic prose-blockquote:text-stone-700
            prose-blockquote:my-8
          ">
            <div className="group relative inline-block">
              <h2
                onClick={handleExecutiveSummaryClick}
                className="inline cursor-pointer"
              >
                Executive Summary
                <span title={executiveSummaryLiked ? "Unlike Executive Summary" : "Like Executive Summary"}>
                  <ThumbsUp
                    className={`inline-block ml-2 w-4 h-4 align-baseline transition-all cursor-pointer ${
                      executiveSummaryLiked
                        ? "fill-stone-600 stroke-stone-600 opacity-100"
                        : "fill-none stroke-stone-400 opacity-0 group-hover:opacity-100"
                    }`}
                    aria-label="Like Executive Summary section"
                  />
                </span>
              </h2>
            </div>
            <p>
              <strong>PS-LANG introduces zone-based context control</strong> to solve the privacy paradox in AI systems.
              Users need AI assistants that understand their full context, but traditional approaches force an all-or-nothing choice:
              either share everything or get limited help.
            </p>

            <div className="group relative">
              <h3 className="inline">The Problem</h3>
              <button
                onClick={() => jumpToSection("introduction")}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
                title="Jump to full section"
              >
                <CornerDownRight className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span><strong>85% of users</strong> report privacy concerns when sharing personal data with AI</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span><strong>73% accuracy drop</strong> when users withhold context to protect privacy</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span><strong>No granular control</strong> - current systems offer binary access (all or nothing)</span>
              </li>
            </ul>

            <div className="group relative">
              <h3 className="inline">The Solution: Zone-Based Context Control</h3>
              <button
                onClick={() => jumpToSection("zone-based")}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
                title="Jump to full section"
              >
                <CornerDownRight className="w-4 h-4" />
              </button>
            </div>
            <p>
              PS-LANG enables <strong>selective information flow</strong> through declarative zones that define exactly
              what AI can access and when:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span><strong>Private zones</strong> - Never visible to AI</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span><strong>Shareable zones</strong> - Controlled, opt-in sharing</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span><strong>Readable/writable zones</strong> - AI can interact but not leak data</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span><strong>Metadata zones</strong> - Share insights without raw data</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Ephemeral zones</strong> - Temporary access that auto-expires</span>
              </li>
            </ul>

            <div className="group relative">
              <h3 className="inline">Results & Impact</h3>
              <button
                onClick={() => jumpToSection("results")}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
                title="Jump to full section"
              >
                <CornerDownRight className="w-4 h-4" />
              </button>
            </div>
            <blockquote>
              "Zone-based control increased user trust by 89% while maintaining 94% task accuracy -
              proving privacy and utility aren't mutually exclusive."
            </blockquote>
            <ul className="space-y-3">
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span><strong>89% increase</strong> in user trust and confidence</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>94% accuracy</strong> maintained with selective context</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span><strong>67% reduction</strong> in unintended data exposure</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span><strong>Zero-overhead</strong> runtime performance (compile-time checks)</span>
              </li>
            </ul>

            <div className="group relative">
              <h3 className="inline">Real-World Applications</h3>
              <button
                onClick={() => jumpToSection("applications")}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
                title="Jump to full section"
              >
                <CornerDownRight className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span><strong>Healthcare</strong> - AI access to symptoms but not patient identifiers</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Finance</strong> - Budget analysis without exposing account numbers</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span><strong>Journaling</strong> - AI writing assistance with private thoughts protected</span>
              </li>
              <li className="flex items-start gap-3.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 text-stone-600 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span><strong>Multi-agent systems</strong> - Different AI agents with different permission levels</span>
              </li>
            </ul>

            <div className="group relative">
              <h3 className="inline">Technical Innovation</h3>
              <button
                onClick={() => jumpToSection("implementation")}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
                title="Jump to full section"
              >
                <CornerDownRight className="w-4 h-4" />
              </button>
            </div>
            <p>
              PS-LANG compiles to static access policies verified at build time, ensuring <strong>zero-cost abstraction</strong>
              for privacy controls. The type system guarantees that zone boundaries cannot be violated, even in complex
              multi-agent scenarios.
            </p>

            <div className="group relative">
              <h3 className="inline">Next Steps</h3>
              <button
                onClick={() => jumpToSection("conclusion")}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
                title="Jump to full section"
              >
                <CornerDownRight className="w-4 h-4" />
              </button>
            </div>
            <p>
              The paper demonstrates that <strong>privacy-first AI is achievable without sacrificing capability</strong>.
              Zone-based context control offers a practical framework for building AI systems users can trust while
              maintaining the contextual awareness needed for sophisticated assistance.
            </p>
          </article>
        ) : activeTab === "psl" ? (
          // PSL Format - Medium-style Typography
          <article className="prose prose-stone prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-stone-900
            prose-h1:text-4xl sm:prose-h1:text-5xl prose-h1:leading-[1.15] prose-h1:mb-8 prose-h1:mt-16 prose-h1:tracking-tight
            prose-h2:text-3xl sm:prose-h2:text-4xl prose-h2:leading-[1.2] prose-h2:mb-6 prose-h2:mt-14 prose-h2:tracking-tight
            prose-h3:text-2xl sm:prose-h3:text-3xl prose-h3:leading-[1.3] prose-h3:mb-5 prose-h3:mt-12 prose-h3:tracking-tight
            prose-h4:text-xl sm:prose-h4:text-2xl prose-h4:leading-[1.4] prose-h4:mb-4 prose-h4:mt-10

            prose-p:text-xl prose-p:leading-[1.75] prose-p:tracking-[-0.003em] prose-p:text-stone-800 prose-p:mb-8 prose-p:font-normal
            prose-p:first-of-type:text-[1.375rem] prose-p:first-of-type:leading-[1.7]

            prose-a:text-stone-900 prose-a:underline prose-a:decoration-stone-400 prose-a:underline-offset-2
            hover:prose-a:decoration-stone-700 prose-a:transition-colors

            prose-strong:text-stone-900 prose-strong:font-semibold
            prose-em:text-stone-800 prose-em:italic

            prose-ul:text-xl prose-ul:leading-[1.75] prose-ul:my-8 prose-ul:space-y-2
            prose-ol:text-xl prose-ol:leading-[1.75] prose-ol:my-8 prose-ol:space-y-2
            prose-li:text-stone-800 prose-li:marker:text-stone-400

            prose-blockquote:border-l-4 prose-blockquote:border-stone-900 prose-blockquote:pl-6 prose-blockquote:py-2
            prose-blockquote:text-2xl prose-blockquote:leading-[1.6] prose-blockquote:italic prose-blockquote:text-stone-700
            prose-blockquote:my-10 prose-blockquote:font-normal

            prose-code:text-[0.9em] prose-code:bg-stone-100 prose-code:px-2 prose-code:py-1
            prose-code:rounded prose-code:text-stone-800 prose-code:font-mono
            prose-code:before:content-[''] prose-code:after:content-['']

            prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-pre:rounded-lg
            prose-pre:text-base prose-pre:leading-relaxed prose-pre:my-10 prose-pre:p-6

            prose-hr:border-stone-200 prose-hr:my-12

            prose-table:text-lg prose-table:my-10
            prose-thead:border-b-2 prose-thead:border-stone-300
            prose-th:text-stone-900 prose-th:font-semibold prose-th:text-left prose-th:px-4 prose-th:py-3
            prose-td:text-stone-700 prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-stone-200

            prose-img:rounded-lg prose-img:my-10 prose-img:shadow-lg
            prose-figcaption:text-center prose-figcaption:text-base prose-figcaption:text-stone-600 prose-figcaption:mt-3
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {stripIntroFromMarkdown(paper.pslContent || paper.content)}
            </ReactMarkdown>
          </article>
        ) : (
          // Academic Format - Enhanced Readability (uses originalContent if available, falls back to content)
          <article className="prose prose-stone max-w-none
            prose-headings:font-light prose-headings:tracking-tight prose-headings:text-stone-900

            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:font-normal
            prose-h2:text-2xl prose-h2:mb-5 prose-h2:mt-10 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-stone-300
            prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:font-medium
            prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:font-medium prose-h4:text-stone-800

            prose-p:text-[15px] prose-p:leading-[1.9] prose-p:tracking-[0.01em] prose-p:text-stone-700 prose-p:mb-5

            prose-a:text-stone-900 prose-a:underline prose-a:decoration-stone-300 hover:prose-a:decoration-stone-600 prose-a:transition-colors

            prose-strong:text-stone-900 prose-strong:font-semibold
            prose-em:text-stone-800 prose-em:italic

            prose-ul:text-[15px] prose-ul:leading-[1.9] prose-ul:my-6 prose-ul:space-y-2 prose-ul:list-none
            prose-ol:text-[15px] prose-ol:leading-[1.9] prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-stone-700 prose-li:mb-2 prose-li:flex prose-li:items-start prose-li:gap-2
            prose-li:marker:text-stone-500 prose-li:marker:font-medium prose-li:marker:hidden

            prose-code:text-[13px] prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5
            prose-code:rounded prose-code:text-stone-800 prose-code:font-mono
            prose-code:before:content-[''] prose-code:after:content-['']

            prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-pre:text-[13px]
            prose-pre:leading-relaxed prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-6
            [&_pre:has(code.language-ps-lang)]:bg-stone-800 [&_pre:has(code.language-ps-lang)]:border [&_pre:has(code.language-ps-lang)]:border-stone-600
            [&_code.language-ps-lang]:text-stone-100 [&_code.language-ps-lang]:font-mono

            prose-blockquote:border-l-4 prose-blockquote:border-stone-400
            prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:my-6
            prose-blockquote:text-stone-700 prose-blockquote:italic prose-blockquote:text-base
            prose-blockquote:bg-stone-50/50

            prose-table:text-[14px] prose-table:my-8 prose-table:border-collapse
            prose-thead:border-b-2 prose-thead:border-stone-400 prose-thead:bg-stone-50
            prose-th:text-stone-900 prose-th:font-semibold prose-th:text-left
            prose-th:px-4 prose-th:py-3 prose-th:tracking-wide
            prose-td:text-stone-700 prose-td:px-4 prose-td:py-3
            prose-td:border-t prose-td:border-stone-200
            prose-td:align-top

            prose-hr:border-stone-300 prose-hr:my-10

            prose-img:rounded prose-img:shadow-sm prose-img:my-6
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                li: ({ children }) => {
                  // Process children recursively to handle nested elements
                  const processChildren = (child: any): any => {
                    if (typeof child === 'string') {
                      return <EmojiContent>{child}</EmojiContent>
                    }
                    if (Array.isArray(child)) {
                      return child.map((c, i) => <span key={i}>{processChildren(c)}</span>)
                    }
                    if (child?.props?.children) {
                      return {
                        ...child,
                        props: {
                          ...child.props,
                          children: processChildren(child.props.children)
                        }
                      }
                    }
                    return child
                  }

                  return (
                    <li>
                      {processChildren(children)}
                    </li>
                  )
                },
                p: ({ children }) => {
                  // Process children recursively
                  const processChildren = (child: any): any => {
                    if (typeof child === 'string') {
                      return <EmojiContent>{child}</EmojiContent>
                    }
                    if (Array.isArray(child)) {
                      return child.map((c, i) => <span key={i}>{processChildren(c)}</span>)
                    }
                    if (child?.props?.children) {
                      return {
                        ...child,
                        props: {
                          ...child.props,
                          children: processChildren(child.props.children)
                        }
                      }
                    }
                    return child
                  }

                  return (
                    <p>
                      {processChildren(children)}
                    </p>
                  )
                },
                code: ({ className, children, ...props }: any) => {
                  const match = /language-([\w-]+)/.exec(className || '')
                  const language = match ? match[1] : null

                  if (language === 'ps-lang') {
                    return (
                      <code className={`${className} language-ps-lang`} {...props}>
                        {children}
                      </code>
                    )
                  }

                  return <code className={className} {...props}>{children}</code>
                }
              }}
            >
              {stripIntroFromMarkdown(paper.originalContent || paper.content)}
            </ReactMarkdown>
          </article>
        )}

        {/* Paper Attribution Footer - Shared across all tabs */}
        <div className="mt-16 pt-8 border-t border-stone-200/60">
          <div className="text-sm text-stone-600 space-y-2">
            <p><strong>Paper Status:</strong> {paper.status}</p>
            <p><strong>Date:</strong> {new Date(paper.publicationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <p><strong>Authors:</strong> {paper.authors.join(", ")}</p>
            <p><strong>Contact:</strong> hello@vummo.com</p>
            <p><strong>License:</strong> MIT (for PS-LANG implementation)</p>
            <p><strong>Website:</strong> <a href="https://ps-lang.dev" className="text-stone-700 hover:text-stone-900 underline">https://ps-lang.dev</a></p>
            {paper.artifactUrl && (
              <p><strong>Public Artifact:</strong> <a href={paper.artifactUrl} className="text-stone-700 hover:text-stone-900 underline break-all">{paper.artifactUrl}</a></p>
            )}
            {paper.pdfUrl && (
              <p className="mt-4"><a href={paper.pdfUrl} className="text-stone-700 hover:text-stone-900 underline">Download PDF →</a></p>
            )}
          </div>
        </div>

        {/* Back to Papers */}
        <div className="mt-8">
          <Link
            href="/research-papers"
            className="inline-flex items-center gap-2 text-[11px] text-stone-500 hover:text-stone-900 tracking-[0.1em] uppercase transition-colors"
          >
            ← Back to Research Papers
          </Link>
        </div>
      </div>
    </div>
  )
}
