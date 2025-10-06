import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Examples | PS-LANG',
  description: 'Explore real-world PS-LANG examples from simple algorithms to complex AI collaboration patterns. Learn through practical code samples and use cases.',
  keywords: [
    'PS-LANG examples',
    'Code samples',
    'AI collaboration',
    'Algorithm examples',
    'Data processing',
    'Binary search',
    'Programming examples',
    'Tutorial code'
  ],
  openGraph: {
    title: 'PS-LANG Examples',
    description: 'Real-world examples of PS-LANG programs, from simple algorithms to complex AI collaboration patterns.',
    type: 'website',
    url: 'https://ps-lang.dev/examples',
    siteName: 'PS-LANG',
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Examples',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PS-LANG Examples',
    description: 'Real-world PS-LANG code examples and AI collaboration patterns.',
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
