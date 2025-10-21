import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PS-LANG Examples | Zone Syntax Use Cases & Code Samples',
  description: 'Real-world examples of PS-LANG zone syntax. See how developers use privacy zones, context handoffs, and multi-agent workflows for AI collaboration. Copy-paste code samples included.',
  keywords: 'PS-LANG examples, zone syntax examples, AI workflow examples, prompt engineering examples, multi-agent code samples',
  alternates: {
    canonical: 'https://ps-lang.dev/examples',
  },
  openGraph: {
    title: 'PS-LANG Examples | Zone Syntax Use Cases & Code Samples',
    description: 'Real-world examples of PS-LANG zone syntax. Privacy zones, context handoffs, and multi-agent workflows with copy-paste code samples.',
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
    title: 'PS-LANG Examples | Zone Syntax Use Cases',
    description: 'Real-world PS-LANG zone syntax examples. Privacy zones, context handoffs, and multi-agent workflow samples.',
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
