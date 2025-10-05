import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Journal Plus - Alpha Access | PS-LANG",
  description: "Premium AI workflow tracking for alpha testers. Advanced features for logging, benchmarking, and auditing AI interactions.",
  robots: {
    index: false, // Don't index alpha pages
    follow: false,
  },
}

export default function JournalPlusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
