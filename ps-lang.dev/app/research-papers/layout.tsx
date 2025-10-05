import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research Papers | PS-LANG',
  description: 'Academic research, technical deep-dives, and formal analysis of multi-agent context control systems, privacy-preserving AI, and PS-LANG domain-specific language.',
  keywords: [
    'PS-LANG research',
    'Multi-agent systems',
    'Context control',
    'Privacy-preserving AI',
    'Domain-specific languages',
    'AI research papers',
    'Token optimization',
    'Zone-based syntax'
  ],
  openGraph: {
    title: 'Research Papers | PS-LANG',
    description: 'Academic research and technical deep-dives on PS-LANG, multi-agent context control, and privacy-preserving AI systems.',
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
    title: 'Research Papers | PS-LANG',
    description: 'Academic research and technical deep-dives on multi-agent context control and privacy-preserving AI.',
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
