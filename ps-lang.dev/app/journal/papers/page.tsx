"use client"

import Link from "next/link"
import { useState } from "react"
import { siteConfig } from "@/config/site"
import PapersNewsletterModal from "@/components/papers-newsletter-modal"

type Paper = {
  slug: string
  title: string
  abstract: string
  date: string
  authors: string[]
  category: string
  pdfUrl?: string
}

const papers: Paper[] = [
  {
    slug: "zone-based-context-control-multi-agent-systems",
    title: "Zone-Based Context Control in Multi-Agent AI Systems",
    abstract: "We present PS-LANG, a privacy-first scripting language for controlling information flow in multi-agent AI workflows. Our approach reduces token usage by 60% while maintaining 95% context accuracy in benchmarks.",
    date: "2025-10-04",
    authors: ["Vummo Labs Research Team"],
    category: "Multi-Agent Systems",
  },
]

export default function PapersPage() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] tracking-[0.2em]">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Home</Link>
          <span className="text-stone-300">→</span>
          <span className="text-stone-600 uppercase">Papers</span>
        </nav>

        <header className="mb-16 pb-10 border-b border-stone-200/60">
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">Research Publications</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 mb-8 tracking-tight leading-[1.1]">
            PS-LANG Research Papers
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-[1.7] font-light tracking-wide max-w-3xl mb-10">
            Academic research, technical deep-dives, and formal analysis of multi-agent context control systems.
          </p>

          {/* Newsletter CTA */}
          <div className="bg-stone-50/50 border border-stone-200/60 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-light text-stone-900 mb-2 tracking-tight">Papers Newsletter</h2>
                <p className="text-[14px] text-stone-600 leading-relaxed tracking-[0.01em]">
                  Receive new research papers via email. Weekly or bi-weekly delivery.
                </p>
              </div>
              <button
                onClick={() => setIsNewsletterOpen(true)}
                className="border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-900 px-8 py-3 transition-all duration-300 text-[11px] font-medium uppercase tracking-[0.2em] shadow-sm hover:shadow whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </header>

        {/* Papers Grid */}
        <div className="space-y-8">
          {papers.map((paper) => (
            <article key={paper.slug} className="border border-stone-200/60 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-300">
              <Link href={`/journal/papers/${paper.slug}`} className="block p-8 sm:p-10">
                <div className="mb-4 flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">{paper.category}</span>
                  <span className="text-stone-300/60">•</span>
                  <time className="text-[10px] tracking-[0.15em] text-stone-400/80 uppercase">
                    {new Date(paper.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>

                <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 tracking-tight leading-tight hover:text-stone-600 transition-colors">
                  {paper.title}
                </h2>

                <p className="text-[15px] text-stone-600 leading-[1.8] tracking-[0.01em] mb-4">
                  {paper.abstract}
                </p>

                <div className="flex items-center gap-2 text-[12px] text-stone-500 mb-4">
                  <span className="tracking-[0.05em]">By {paper.authors.join(", ")}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-stone-400 uppercase tracking-[0.15em]">Read Paper →</span>
                  {paper.pdfUrl && (
                    <span className="text-stone-400 uppercase tracking-[0.15em]">Download PDF</span>
                  )}
                </div>
              </Link>
            </article>
          ))}

          {/* Coming Soon */}
          <div className="border border-stone-200/60 bg-stone-50/50 p-8 sm:p-10 text-center">
            <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium block mb-4">Coming Soon</span>
            <p className="text-[15px] text-stone-600 leading-relaxed tracking-[0.01em] max-w-xl mx-auto">
              More research papers on multi-agent systems, privacy-preserving AI, and context control optimization.
            </p>
          </div>
        </div>
      </div>

      <PapersNewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </div>
  )
}
