import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "PS-LANG Playground | Test Zone Syntax & Multi-Agent Workflows",
  description: "Interactive playground to test PS-LANG zone syntax. Experiment with privacy zones, context handoffs, and multi-agent workflows. See real-time token comparison and prompt optimization in action.",
  keywords: "PS-LANG playground, zone syntax testing, AI prompt playground, context control demo, interactive AI tools, token comparison, prompt editor",
  alternates: {
    canonical: 'https://ps-lang.dev/playground',
  },
  openGraph: {
    title: "PS-LANG Playground | Interactive Zone Syntax Testing",
    description: "Test PS-LANG zone syntax with interactive demos. See real-time token comparison and prompt optimization. Experiment with privacy zones and context handoffs.",
    url: "https://ps-lang.dev/playground",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Playground - Zone Syntax Testing',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS-LANG Playground | Test Zone Syntax Interactively",
    description: "Interactive playground for testing PS-LANG zone syntax. Token comparison, prompt editor, and multi-agent workflow demos.",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
