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

          <div className="hidden md:flex items-center space-x-12">
            <Link href="/docs" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Documentation
            </Link>
            <Link href="/examples" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Examples
            </Link>
            <Link href="/playground" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Playground
            </Link>
            <Link href="/about" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/get-started"
              className="border border-stone-900 px-6 py-2 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm tracking-wide"
            >
              GET STARTED
            </Link>
          </div>

          <button className="md:hidden text-sm text-stone-600" onClick={() => setIsOpen(!isOpen)}>
            Menu
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-6 space-y-6 pb-6">
            <Link href="/docs" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Documentation
            </Link>
            <Link href="/examples" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Examples
            </Link>
            <Link href="/playground" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Playground
            </Link>
            <Link href="/about" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              About
            </Link>
            <Link
              href="/get-started"
              className="inline-block border border-stone-900 px-6 py-2 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm tracking-wide"
            >
              GET STARTED
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
