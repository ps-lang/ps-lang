import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "PS-LANG Documentation - Zone-Based Syntax Guide | Multi-Agent Context Control",
  description: "Complete documentation for PS-LANG syntax, zones, and functions. Learn how to control context in multi-agent AI workflows with zone-based syntax.",
  keywords: "PS-LANG docs, zone syntax, multi-agent documentation, context control guide, AI workflow syntax",
  alternates: {
    canonical: 'https://ps-lang.dev/docs',
  },
  openGraph: {
    title: "PS-LANG Documentation - Zone-Based Syntax Guide",
    description: "Complete guide to PS-LANG zones, syntax, and multi-agent context control",
    url: "https://ps-lang.dev/docs",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Documentation',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS-LANG Documentation",
    description: "Master zone-based syntax for multi-agent workflows",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
