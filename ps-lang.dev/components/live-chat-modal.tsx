"use client"

import { useState } from "react"
import LiveChat from "./live-chat"

interface LiveChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LiveChatModal({ isOpen, onClose }: LiveChatModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      data-ai-section="live-chat-modal"
      data-ai-interaction="modal-overlay"
    >
      <div
        className={`bg-white border border-stone-200 shadow-xl transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full max-w-none max-h-none"
            : "w-full max-w-4xl h-[85vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
        data-ai-component="chat-modal-container"
        data-fullscreen={isFullscreen}
      >
        {/* Modal Header */}
        <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between bg-stone-50">
          <div>
            <h2
              className="text-xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              Live AI Chat
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-mono">
              Auto-saves to Journal Plus with PS-LANG transformation
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className={`${isFullscreen ? "h-[calc(100vh-73px)]" : "h-[calc(85vh-73px)]"}`}>
          <LiveChat />
        </div>
      </div>
    </div>
  )
}
