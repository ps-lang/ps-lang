import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "PS-LANG Playground - Interactive Demos | Multi-Agent Context Control",
  description: "Explore PS-LANG zone-based syntax with interactive demos. See token efficiency gains up to 60% and context control improvements in real-time.",
  keywords: "PS-LANG playground, multi-agent demos, token efficiency, context control demos, AI workflow optimization",
  alternates: {
    canonical: 'https://ps-lang.dev/playground',
  },
  openGraph: {
    title: "PS-LANG Playground - Interactive Demos",
    description: "Interactive demos showing token efficiency and context control with PS-LANG zones",
    url: "https://ps-lang.dev/playground",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Playground Demos',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS-LANG Playground - Interactive Demos",
    description: "See token efficiency gains up to 60% with zone-based syntax",
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
