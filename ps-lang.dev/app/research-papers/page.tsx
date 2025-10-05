"use client"

import Link from "next/link"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import PapersNewsletterModal from "@/components/papers-newsletter-modal"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function PapersPage() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)
  const papers = useQuery(api.researchPapers.getAll)

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[{ label: "Research Papers", href: "/research-papers" }]} />
        </div>

        <header className="mb-16 pb-10 border-b border-stone-200/60">
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">Research Publications</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 mb-8 tracking-tight leading-[1.1]">
            PS-LANG Research Papers
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-[1.7] font-light tracking-wide max-w-3xl">
            Academic research, technical deep-dives, and formal analysis of multi-agent context control systems.
          </p>
        </header>

        {/* Papers Grid */}
        {!papers ? (
          <div className="text-center py-12">
            <div className="text-stone-400 text-sm">Loading papers...</div>
          </div>
        ) : (
          <div className="space-y-8">
          {papers.map((paper) => (
            <article key={paper.slug} className="border border-stone-200/60 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-300">
              <Link href={`/research-papers/${paper.slug}`} className="block p-8 sm:p-10">
                <div className="mb-4 flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">{paper.category}</span>
                  <span className="text-stone-300/60">•</span>
                  <time className="text-[10px] tracking-[0.15em] text-stone-400/80 uppercase">
                    {new Date(paper.publicationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>

                <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 tracking-tight leading-tight hover:text-stone-600 transition-colors">
                  {paper.title}
                </h2>

                <p className="text-[15px] text-stone-600 leading-[1.8] tracking-[0.01em] mb-4 line-clamp-3">
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
        )}
      </div>

      <PapersNewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </div>
  )
}
