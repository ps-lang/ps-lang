import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/roles"

const blogPosts = [
  {
    slug: "token-efficiency-multi-agent-workflows",
    title: "How PS-LANG Saves 60% Tokens in Multi-Agent Workflows",
    excerpt: "Learn how zone-based syntax reduces token usage and improves cost efficiency in AI agent pipelines.",
    date: "2025-10-04",
    readTime: "5 min read",
    category: "Tutorial"
  },
  {
    slug: "ps-lang-vs-traditional-context-control",
    title: "PS-LANG vs Traditional Context Control: A Comparison",
    excerpt: "Compare traditional prompt engineering approaches with PS-LANG's zone-based syntax for cleaner agent handoffs.",
    date: "2025-10-03",
    readTime: "7 min read",
    category: "Comparison"
  },
  {
    slug: "building-better-ai-benchmarks",
    title: "Building Better AI Benchmarks with Zone Syntax",
    excerpt: "Eliminate context contamination and achieve reproducible benchmark results using PS-LANG zones.",
    date: "2025-10-02",
    readTime: "6 min read",
    category: "Best Practices"
  },
  {
    slug: "mcp-integration-guide",
    title: "Integrating PS-LANG with Model Context Protocol (MCP)",
    excerpt: "Step-by-step guide to using PS-LANG zone syntax in MCP agent chains for better context control.",
    date: "2025-10-01",
    readTime: "8 min read",
    category: "Guide"
  },
  {
    slug: "privacy-zones-explained",
    title: "Understanding PS-LANG's 7 Privacy Zones",
    excerpt: "Deep dive into public, internal, confidential, and agent-specific zones with real-world examples.",
    date: "2025-09-30",
    readTime: "10 min read",
    category: "Tutorial"
  }
]

export default async function BlogPage() {
  const user = await currentUser()
  const userRole = getUserRole(user)

  // Restrict to super_admin only
  if (userRole !== 'super_admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-wide">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Home</Link>
          <span className="text-stone-300">→</span>
          <Link href="/ps-journaling" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Journal</Link>
          <span className="text-stone-300">→</span>
          <span className="text-stone-900 font-semibold uppercase">Blog</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Insights & Tutorials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-stone-900 mb-4 tracking-tight">
            PS-LANG Blog
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl leading-relaxed font-light">
            Learn about multi-agent workflows, token optimization, and AI development best practices
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/journal/blog/${post.slug}`}>
              <article className="border border-stone-300 bg-white p-8 hover:border-stone-400 transition-colors group h-full flex flex-col">
                <div className="mb-4 flex items-center gap-3 text-xs">
                  <span className="text-stone-500 font-medium uppercase tracking-wider">{post.category}</span>
                  <span className="text-stone-300">•</span>
                  <time className="text-stone-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-400">{post.readTime}</span>
                </div>

                <h2 className="text-2xl font-light text-stone-900 mb-3 tracking-tight group-hover:text-stone-700 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-stone-600 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center text-stone-500 text-sm group-hover:text-stone-900 transition-colors">
                  <span className="font-medium">Read more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 border border-stone-200 bg-white p-12 text-center">
          <h3 className="text-xl font-light text-stone-900 mb-3">More articles coming soon</h3>
          <p className="text-sm text-stone-600 mb-6">
            Subscribe to our newsletter to get notified when new tutorials and guides are published
          </p>
          <Link
            href="/"
            className="inline-block border border-stone-900 bg-stone-900 text-white px-8 py-3 hover:bg-stone-800 transition-colors text-sm font-medium uppercase tracking-wider"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </div>
  )
}
