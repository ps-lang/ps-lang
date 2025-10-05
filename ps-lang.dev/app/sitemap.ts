import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Blog posts
  const blogPosts = [
    'token-efficiency-multi-agent-workflows',
    'ps-lang-vs-traditional-context-control',
    'building-better-ai-benchmarks',
    'mcp-integration-guide',
    'privacy-zones-explained'
  ]

  const blogUrls = blogPosts.map(slug => ({
    url: `https://ps-lang.dev/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Research papers
  const researchPapers = [
    'zone-based-context-control-multi-agent-systems'
  ]

  const paperUrls = researchPapers.map(slug => ({
    url: `https://ps-lang.dev/research-papers/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://ps-lang.dev',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://ps-lang.dev/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://ps-lang.dev/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://ps-lang.dev/research-papers',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...blogUrls,
    ...paperUrls,
    {
      url: 'https://ps-lang.dev/docs',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://ps-lang.dev/postscript-journaling',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://ps-lang.dev/playground',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://ps-lang.dev/playground/token-comparison',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://ps-lang.dev/playground/prompt-editor',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://ps-lang.dev/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://ps-lang.dev/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
