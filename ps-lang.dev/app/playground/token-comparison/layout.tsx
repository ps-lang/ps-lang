import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Token Comparison Tool | PS-LANG Reduces AI Token Usage by 60%",
  description: "Compare token usage with and without PS-LANG zone syntax. See how privacy zones reduce token costs by up to 60% in multi-agent workflows. Interactive demo with real examples.",
  keywords: "AI token optimization, reduce token costs, token comparison, AI cost savings, prompt efficiency",
  alternates: {
    canonical: 'https://ps-lang.dev/playground/token-comparison',
  },
  openGraph: {
    title: "Token Comparison Tool | PS-LANG Reduces AI Token Usage by 60%",
    description: "Compare token usage with and without PS-LANG zone syntax. See how privacy zones reduce token costs by up to 60% in multi-agent workflows.",
    url: "https://ps-lang.dev/playground/token-comparison",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Token Comparison Tool',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Token Comparison Tool | PS-LANG Reduces Token Usage by 60%",
    description: "Interactive demo showing how PS-LANG zone syntax reduces AI token costs by up to 60%. Compare with and without privacy zones.",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function TokenComparisonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
