import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "PS-LANG Blog - Multi-Agent AI Insights & Tutorials",
  description: "Learn about multi-agent workflows, token optimization, context control, and AI development best practices with PS-LANG.",
  keywords: "AI blog, multi-agent tutorials, token optimization, context control, PS-LANG guides, AI development",
  alternates: {
    canonical: 'https://ps-lang.dev/blog',
  },
  openGraph: {
    title: "PS-LANG Blog - Multi-Agent AI Insights",
    description: "Tutorials, insights, and best practices for multi-agent AI workflows",
    url: "https://ps-lang.dev/blog",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Blog',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS-LANG Blog",
    description: "Multi-agent AI tutorials and best practices",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
