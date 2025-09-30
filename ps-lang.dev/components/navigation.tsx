"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-light text-stone-900 tracking-wide hover:text-stone-600 transition-colors">
            PS-LANG
          </Link>

          <div className="hidden md:flex items-center">
            <Link href="/docs" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Docs
            </Link>
          </div>

          <button className="md:hidden text-sm text-stone-600" onClick={() => setIsOpen(!isOpen)}>
            Menu
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-6 space-y-6 pb-6">
            <Link href="/docs" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Docs
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
