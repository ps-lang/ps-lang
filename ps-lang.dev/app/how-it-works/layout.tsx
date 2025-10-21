import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How PS-LANG Works | Zone-Based Context Control Explained',
  description: 'Learn how PS-LANG\'s zone-based syntax controls what AI agents see. Understand privacy zones, context handoffs, and multi-agent workflows. Step-by-step guide with visual examples.',
  keywords: 'how PS-LANG works, zone syntax explained, context control guide, AI privacy tutorial, multi-agent workflow guide',
  alternates: {
    canonical: 'https://ps-lang.dev/how-it-works',
  },
  openGraph: {
    title: 'How PS-LANG Works | Zone-Based Context Control Explained',
    description: 'Learn how PS-LANG\'s zone-based syntax controls what AI agents see. Privacy zones, context handoffs, and multi-agent workflows explained.',
    type: 'website',
    url: 'https://ps-lang.dev/how-it-works',
    siteName: 'PS-LANG',
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'How PS-LANG Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How PS-LANG Works | Context Control Guide',
    description: 'Learn PS-LANG\'s zone-based syntax for controlling AI agent context. Step-by-step guide with visual examples.',
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
