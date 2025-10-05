import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | PS-LANG Journaling',
  description: 'Learn how PS-LANG transforms ordinary AI prompts into structured super prompts with zone-based privacy control. Discover the 7 privacy zones for multi-agent context management.',
  keywords: [
    'PS-LANG tutorial',
    'Zone-based syntax',
    'AI prompt engineering',
    'Privacy zones',
    'Context control',
    'Super prompts',
    'Multi-agent systems',
    'Journal Plus',
    'Prompt optimization'
  ],
  openGraph: {
    title: 'How PS-LANG Journaling Works',
    description: 'Transform ordinary AI prompts into structured super prompts with zone-based privacy control. Learn the 7 PS-LANG zones.',
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
    title: 'How PS-LANG Journaling Works',
    description: 'Transform AI prompts into structured super prompts with 7 privacy zones for precise context control.',
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
