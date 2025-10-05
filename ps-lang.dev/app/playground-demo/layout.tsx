import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Playground Demo | PS-LANG',
  description: 'Interactive simulation playground for PS-LANG. Compare token usage, latency, and costs across models and scenarios with and without PS-LANG optimization.',
  keywords: [
    'PS-LANG playground',
    'Token comparison',
    'Simulation demo',
    'AI benchmarks',
    'Performance metrics',
    'Cost optimization',
    'Model comparison',
    'Interactive demo'
  ],
  openGraph: {
    title: 'Playground Demo | PS-LANG',
    description: 'Interactive simulation playground to compare PS-LANG performance across models and scenarios.',
    type: 'website',
    url: 'https://ps-lang.dev/playground-demo',
    siteName: 'PS-LANG',
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Playground Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground Demo | PS-LANG',
    description: 'Interactive simulation playground for PS-LANG performance testing.',
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function PlaygroundDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
