import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: "PS Journaling - AI Workflow Collaboration | PS-LANG",
  description: "Collaborate with AI, benchmark improvements, and maintain secure audit trails with PS Journaling. Self-hosted OSS tool with end-to-end encryption. MIT licensed.",
  keywords: [
    "AI workflow collaboration",
    "postscript journal",
    "PS-LANG Journal",
    "AI benchmarking",
    "prompt history",
    "workflow audit trail",
    "encrypted journaling",
    "self-hosted AI tools",
    "ChatGPT collaboration",
    "Claude.ai integration",
    "prompt engineering",
    "AI productivity",
    "zone syntax",
    "private AI notes",
    "agentic UX",
    "RLHF datastreams"
  ].join(", "),
  authors: [{ name: "Vummo Labs", url: "https://vummo.com" }],
  creator: "Vummo Labs",
  publisher: "PS-LANG",
  alternates: {
    canonical: 'https://ps-lang.dev/postscript-journaling',
  },
  openGraph: {
    title: "PS Journaling - AI Workflow Collaboration",
    description: "Self-hosted AI workflow collaboration with full control over your data and encryption keys. Collaborate with ChatGPT & Claude.ai through agentic UX, benchmark improvements, maintain audit trails. MIT licensed.",
    url: "https://ps-lang.dev/postscript-journaling",
    siteName: "PS-LANG",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG PS Journaling - AI Workflow Tracking',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS Journaling - AI Workflow Collaboration",
    description: "Self-hosted AI workflow collaboration. Your secrets stay with you. MIT licensed.",
    images: ['https://ps-lang.dev/og-image.png'],
    creator: "@vummo_labs",
    site: "@ps_lang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    // Agentic metadata for AI crawlers and tools
    'ps-lang:version': 'v0.1.0-alpha.1',
    'ps-lang:component': 'postscript-journaling-page',
    'ps-lang:data-stream': 'agentic_ux_v1',
    'ps-lang:access-level': 'public',
    'ps-lang:license': 'MIT',
    'ps-lang:journal-type': 'OSS',

    // Privacy and encryption metadata
    'ps-lang:encryption': 'self-hosted',
    'ps-lang:data-ownership': 'user-controlled',
    'ps-lang:privacy-model': 'local-first',

    // Integration metadata
    'ps-lang:integrations': 'chatgpt,claude-ai',
    'ps-lang:export-formats': 'json,csv',

    // Workflow metadata
    'ps-lang:workflow-stage': 'alpha-signup',
    'ps-lang:conversion-funnel': 'journal-interest',
  }
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PS Journal',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'AI Workflow Tracking',
    operatingSystem: 'Web, Self-hosted',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'Open source, MIT licensed'
    },
    author: {
      '@type': 'Organization',
      name: 'Vummo Labs',
      url: 'https://vummo.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PS-LANG',
      url: 'https://ps-lang.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ps-lang.dev/logo.png'
      }
    },
    softwareVersion: 'v0.1.0-alpha.1',
    description: 'Self-hosted AI workflow collaboration with full control over your data and encryption keys. Collaborate with ChatGPT & Claude.ai through agentic UX, benchmark improvements, and maintain secure audit trails.',
    featureList: [
      'Self-hosted encryption',
      'Zone parsing & benchmark collaboration',
      'ChatGPT & Claude.ai integration',
      'Agentic UX with RLHF datastreams',
      'Local storage & export (JSON/CSV)',
      'MIT licensed - free forever'
    ],
    screenshot: 'https://ps-lang.dev/og-image.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1'
    },
    // Agentic metadata embedded in JSON-LD
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'ps-lang:journal-signature',
        value: 'OSS_v1.0.0_public-access'
      },
      {
        '@type': 'PropertyValue',
        name: 'ps-lang:agentic-version',
        value: 'agentic_ux_v1'
      },
      {
        '@type': 'PropertyValue',
        name: 'ps-lang:data-stream',
        value: 'public-metadata-stream'
      },
      {
        '@type': 'PropertyValue',
        name: 'ps-lang:access-model',
        value: 'public_secrets_key:enabled'
      },
      {
        '@type': 'PropertyValue',
        name: 'ps-lang:privacy-token',
        value: 'private-label:user-controlled'
      }
    ]
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="jsonld-journal"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* PS-LANG Journal Signature Meta Tags */}
      <meta name="ps-lang:journal-signature" content="OSS_v1.0.0_public-access" />
      <meta name="ps-lang:agentic-signature" content="agentic_ux_v1:postscript-journaling" />
      <meta name="ps-lang:mission" content="Empower developers with self-hosted AI workflow tracking" />
      <meta name="ps-lang:vision" content="Privacy-first AI productivity tools for individuals and teams" />
      <meta name="ps-lang:goals" content="100% data ownership, zero vendor lock-in, open source forever" />

      {/* Private/Public Token Management Metadata */}
      <meta name="ps-lang:token-model" content="clerk-based:private-by-default" />
      <meta name="ps-lang:public-access-key" content="user-controlled-settings" />
      <meta name="ps-lang:journal-tier" content="OSS|Plus" />
      <meta name="ps-lang:encryption-model" content="self-hosted:user-managed-keys" />

      {children}
    </>
  )
}
