import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PS-LANG Research | Zone-Based Context Control in Multi-Agent Systems',
  description: 'Academic research and papers on PS-LANG\'s zone-based context control for multi-agent AI systems. Privacy-first architecture, token optimization, and workflow benchmarking studies.',
  keywords: 'AI research, multi-agent systems research, context control papers, AI privacy research, zone-based syntax',
  alternates: {
    canonical: 'https://ps-lang.dev/research-papers',
  },
  openGraph: {
    title: 'PS-LANG Research | Zone-Based Context Control in Multi-Agent Systems',
    description: 'Academic research and papers on PS-LANG\'s zone-based context control for multi-agent AI systems. Privacy-first architecture and token optimization studies.',
    type: 'website',
    url: 'https://ps-lang.dev/research-papers',
    siteName: 'PS-LANG',
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Research Papers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PS-LANG Research | Zone-Based Context Control',
    description: 'Academic research on PS-LANG\'s zone-based context control for multi-agent AI systems. Privacy-first architecture and workflow benchmarking.',
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function ResearchPapersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
