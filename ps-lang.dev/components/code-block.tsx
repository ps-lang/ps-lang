"use client"

import { useState } from "react"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  copyable?: boolean
}

export default function CodeBlock({ code, language = "ps-lang", title, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="paper-card p-4 mb-4">
      {(title || copyable) && (
        <div className="flex items-center justify-between mb-3">
          {title && <span className="font-typewriter text-ink-light text-sm">{title}</span>}
          {copyable && (
            <button
              onClick={copyToClipboard}
              className="font-typewriter text-xs text-ink-light hover:text-ink transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      )}
      <pre className="font-typewriter text-ink text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}
