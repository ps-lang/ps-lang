"use client"

import { useState } from "react"
import NewsletterSignup from "./newsletter-signup"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
  source?: string
}

export default function NewsletterModal({ isOpen, onClose, source = 'newsletter_modal' }: NewsletterModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 max-w-lg w-full p-8 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Modal content */}
          <div className="mb-8">
            <h3 className="text-2xl font-light text-stone-900 mb-3 tracking-tight">
              Stay Updated
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Get early access, launch news, and multi-agent workflow tips.
            </p>
          </div>

          <NewsletterSignup onSuccess={onClose} source={source} />
        </div>
      </div>
    </>
  )
}