import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Map slugs to paper metadata (in production, fetch from Convex)
  const paperMetadata: Record<string, any> = {
    'zone-based-context-control-multi-agent-systems': {
      title: 'PS-LANG: Zone-Based Context Control in Multi-Agent AI Systems',
      description: 'Multi-agent AI systems face significant challenges in managing context flow between agents, leading to token inefficiency, privacy concerns, and computational waste. We introduce PS-LANG (Privacy-First Script Language), a domain-specific language that employs zone-based syntax for precise context control in agent pipelines.',
      keywords: ['Multi-agent systems', 'Context control', 'Privacy-preserving AI', 'Domain-specific languages', 'Token optimization', 'AI workflow management'],
      authors: ['Vummo Labs Research Team'],
      publishedTime: '2025-10-05',
    }
  }

  const paper = paperMetadata[params.slug] || {
    title: 'Research Paper',
    description: 'Academic research and technical deep-dives on PS-LANG',
  }

  return {
    title: `${paper.title} | PS-LANG Research`,
    description: paper.description,
    keywords: paper.keywords,
    authors: paper.authors?.map((name: string) => ({ name })),
    openGraph: {
      title: paper.title,
      description: paper.description,
      type: 'article',
      publishedTime: paper.publishedTime,
      authors: paper.authors,
      url: `https://ps-lang.dev/research-papers/${params.slug}`,
      siteName: 'PS-LANG',
      images: [
        {
          url: 'https://ps-lang.dev/og-image.png',
          width: 1200,
          height: 630,
          alt: paper.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: paper.title,
      description: paper.description,
      images: ['https://ps-lang.dev/og-image.png'],
    },
  }
}

export default function ResearchPaperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
