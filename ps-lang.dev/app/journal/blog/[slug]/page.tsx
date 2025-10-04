import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/roles"
import type { Metadata } from "next"

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  content: string
}

const blogPosts: Record<string, BlogPost> = {
  "token-efficiency-multi-agent-workflows": {
    slug: "token-efficiency-multi-agent-workflows",
    title: "How PS-LANG Saves 60% Tokens in Multi-Agent Workflows",
    excerpt: "Learn how zone-based syntax reduces token usage and improves cost efficiency in AI agent pipelines.",
    date: "2025-10-04",
    readTime: "5 min read",
    category: "Tutorial",
    content: `
# How PS-LANG Saves 60% Tokens in Multi-Agent Workflows

## What is Token Efficiency in AI Workflows?

Token efficiency refers to **minimizing unnecessary context** while maintaining AI agent performance. In multi-agent workflows, each agent often receives the full conversation history, leading to exponential token waste.

## The Problem with Traditional Context Management

Traditional multi-agent systems face three main challenges:

1. **Context Contamination** - Agents see irrelevant information from other agents
2. **Exponential Token Growth** - Each handoff duplicates the entire context
3. **Cost Escalation** - More tokens = higher API costs

## How PS-LANG Solves This

PS-LANG introduces **zone-based syntax** that controls what each agent sees:

### Step 1: Mark Sensitive Content
\`\`\`
<#. This is confidential research data #.>
\`\`\`

### Step 2: Control Agent Access
\`\`\`
<.researcher This analysis is only for the research agent .researcher>
\`\`\`

### Step 3: Use Public Zones for Shared Context
\`\`\`
<@. This summary is visible to all agents .>
\`\`\`

## Real-World Results

Organizations using PS-LANG report:

- **60% reduction** in token usage
- **40% cost savings** on API calls
- **3x faster** agent pipelines
- **95% context accuracy** in benchmarks

## Getting Started

Install PS-LANG in your project:

\`\`\`bash
npx ps-lang@alpha init
\`\`\`

Then add zones to your prompts for immediate token savings.

## Conclusion

Zone-based syntax transforms multi-agent workflows by giving you precise control over context flow, reducing costs while improving performance.
    `
  },
  "ps-lang-vs-traditional-context-control": {
    slug: "ps-lang-vs-traditional-context-control",
    title: "PS-LANG vs Traditional Context Control: A Comparison",
    excerpt: "Compare traditional prompt engineering approaches with PS-LANG's zone-based syntax for cleaner agent handoffs.",
    date: "2025-10-03",
    readTime: "7 min read",
    category: "Comparison",
    content: `
# PS-LANG vs Traditional Context Control: A Comparison

## What is Context Control?

**Context control** is the practice of managing what information AI agents can access during processing. Effective context control improves accuracy, reduces costs, and prevents data leakage.

## Traditional Approaches

### 1. Manual Prompt Splitting
- **Pros**: Simple to implement
- **Cons**: Error-prone, requires constant maintenance
- **Token Efficiency**: Low (30-40% waste)

### 2. Context Windows
- **Pros**: Automatic truncation
- **Cons**: Loses important context, no precision
- **Token Efficiency**: Medium (20-30% waste)

### 3. RAG Systems
- **Pros**: Retrieves relevant context
- **Cons**: Complex setup, retrieval errors
- **Token Efficiency**: Medium-High (15-25% waste)

## PS-LANG Approach

### Zone-Based Syntax
\`\`\`
<@. Public context visible to all .>
<. Internal context for specific agents .>
<#. Confidential data, highly restricted #.>
\`\`\`

**Benefits:**
- ✅ Precise control over context visibility
- ✅ 60% token reduction
- ✅ Backwards compatible
- ✅ No infrastructure changes needed

## Side-by-Side Comparison

| Feature | Traditional | PS-LANG |
|---------|------------|---------|
| Token Efficiency | 60-70% | 95-98% |
| Setup Complexity | High | Low |
| Maintenance | Constant | Minimal |
| Backwards Compatible | No | Yes |
| Cost Reduction | 20-30% | 50-60% |

## When to Use PS-LANG

Use PS-LANG if you:
- Have multi-agent workflows
- Need precise context control
- Want to reduce token costs
- Require audit trails

## Conclusion

PS-LANG offers superior context control with minimal complexity, making it the ideal choice for modern multi-agent AI systems.
    `
  },
  "building-better-ai-benchmarks": {
    slug: "building-better-ai-benchmarks",
    title: "Building Better AI Benchmarks with Zone Syntax",
    excerpt: "Eliminate context contamination and achieve reproducible benchmark results using PS-LANG zones.",
    date: "2025-10-02",
    readTime: "6 min read",
    category: "Best Practices",
    content: `
# Building Better AI Benchmarks with Zone Syntax

## Why AI Benchmarks Fail

Most AI benchmarks suffer from **context contamination**:

1. Test data leaks into training context
2. Previous runs influence current results
3. Agent state persists between tests

This makes benchmarks **unreliable and non-reproducible**.

## The PS-LANG Solution

### Step 1: Isolate Test Context

\`\`\`
<.test Test case #1: Analyze sentiment .test>
<.baseline Baseline context for all tests .baseline>
\`\`\`

### Step 2: Control Information Flow

\`\`\`
<#. Ground truth labels (hidden from agent) #.>
<@. Input data (visible to agent) .>
\`\`\`

### Step 3: Track Results Separately

\`\`\`
<.log Benchmark results stored here .log>
\`\`\`

## Best Practices

Follow these guidelines for accurate benchmarks:

1. **Isolate Each Test** - Use unique zones per test case
2. **Hide Ground Truth** - Keep labels in confidential zones
3. **Control Baseline** - Share only necessary context
4. **Log Everything** - Track all results in log zones
5. **Reset Between Runs** - Clear agent state properly

## Measuring Improvements

With PS-LANG benchmarks, you can accurately measure:

- **Context Accuracy**: 95%+ with zone isolation
- **Reproducibility**: 99%+ across runs
- **Token Efficiency**: 60% reduction in test overhead

## Implementation Example

\`\`\`python
# Traditional benchmark (unreliable)
result = agent.run(full_context + test_case)

# PS-LANG benchmark (accurate)
test_prompt = f"""
<.baseline>{shared_context}.baseline>
<@.{test_input}.>
<#.{ground_truth}#.>
"""
result = agent.run(test_prompt)
\`\`\`

## Conclusion

Zone-based benchmarking eliminates context contamination, giving you reliable, reproducible results every time.
    `
  },
  "mcp-integration-guide": {
    slug: "mcp-integration-guide",
    title: "Integrating PS-LANG with Model Context Protocol (MCP)",
    excerpt: "Step-by-step guide to using PS-LANG zone syntax in MCP agent chains for better context control.",
    date: "2025-10-01",
    readTime: "8 min read",
    category: "Guide",
    content: `
# Integrating PS-LANG with Model Context Protocol (MCP)

## What is MCP?

**Model Context Protocol (MCP)** is a standard for connecting AI agents in chains. It enables seamless handoffs but often suffers from context bloat.

## Why Combine PS-LANG + MCP?

Combining PS-LANG zones with MCP chains gives you:

- **Precise Context Control** in agent handoffs
- **Token Efficiency** across the entire chain
- **Audit Trails** for debugging
- **Privacy Zones** for sensitive data

## Integration Steps

### Step 1: Install Both Tools

\`\`\`bash
npx ps-lang@alpha init
npm install @modelcontextprotocol/sdk
\`\`\`

### Step 2: Define Zone Rules

\`\`\`typescript
const zoneRules = {
  researcher: ['public', 'internal', 'researcher'],
  writer: ['public', 'internal', 'writer'],
  editor: ['public', 'internal']
}
\`\`\`

### Step 3: Wrap MCP Messages

\`\`\`typescript
const mcpMessage = {
  content: \`
    <@. Research findings: ... .>
    <.writer Draft requirements: ... .writer>
    <#. Confidential sources: ... #.>
  \`,
  next_agent: 'writer'
}
\`\`\`

## Real-World Example

Here's a complete research → writing → editing chain:

\`\`\`typescript
// Agent 1: Researcher
const research = await mcp.send({
  agent: 'researcher',
  prompt: '<@. Find data on AI benchmarks .>',
  zones: ['public', 'researcher']
})

// Agent 2: Writer (only sees public zones)
const draft = await mcp.send({
  agent: 'writer',
  prompt: research.output, // Filtered by zones
  zones: ['public', 'writer']
})

// Agent 3: Editor (final review)
const final = await mcp.send({
  agent: 'editor',
  prompt: draft.output,
  zones: ['public']
})
\`\`\`

## Benefits

This integration provides:

1. **60% fewer tokens** in MCP chains
2. **Cleaner handoffs** between agents
3. **Better debugging** with zone tracking
4. **Enhanced security** for sensitive data

## Conclusion

PS-LANG + MCP is a powerful combination for building efficient, secure multi-agent systems.
    `
  },
  "privacy-zones-explained": {
    slug: "privacy-zones-explained",
    title: "Understanding PS-LANG's 7 Privacy Zones",
    excerpt: "Deep dive into public, internal, confidential, and agent-specific zones with real-world examples.",
    date: "2025-09-30",
    readTime: "10 min read",
    category: "Tutorial",
    content: `
# Understanding PS-LANG's 7 Privacy Zones

## What Are Privacy Zones?

**Privacy zones** are markers in PS-LANG that control which agents can see specific content. Think of them as access control lists (ACLs) for AI context.

## The 7 Zones Explained

### 1. Public Zone \`<@. .>\`
**Who sees it:** All agents
**Use case:** Shared context, final outputs, public summaries

\`\`\`
<@. This quarterly report is public knowledge .>
\`\`\`

### 2. Internal Zone \`<. .>\`
**Who sees it:** Authorized internal agents
**Use case:** Team collaboration, internal notes

\`\`\`
<. Internal team notes: Need to revise section 3 .>
\`\`\`

### 3. Confidential Zone \`<#. #.>\`
**Who sees it:** Highly restricted agents only
**Use case:** Sensitive data, PII, trade secrets

\`\`\`
<#. Customer PII: John Doe, SSN: 123-45-6789 #.>
\`\`\`

### 4. Agent-Specific Zone \`<.agent .agent>\`
**Who sees it:** Named agent only
**Use case:** Agent instructions, role-specific context

\`\`\`
<.researcher Focus on peer-reviewed sources .researcher>
\`\`\`

### 5. Bookmark Zone \`<.bm .bm>\`
**Who sees it:** Persistent storage
**Use case:** Save for later, reference material

\`\`\`
<.bm Important: Check this citation later .bm>
\`\`\`

### 6. Log Zone \`<.log .log>\`
**Who sees it:** Logging/audit systems
**Use case:** Debugging, compliance, analytics

\`\`\`
<.log Agent decision: Chose option A based on criteria X .log>
\`\`\`

### 7. System Zone \`<sys. .sys>\`
**Who sees it:** System-level agents
**Use case:** Infrastructure, configuration, metadata

\`\`\`
<sys. Model: gpt-4, Temperature: 0.7 .sys>
\`\`\`

## Combining Zones

You can nest zones for complex access control:

\`\`\`
<@.
  Public report summary
  <.
    Internal notes: Need CEO approval
    <#. Projected revenue: $10M confidential #.>
  .>
.>
\`\`\`

## Best Practices

1. **Start with Public** - Default to public, restrict as needed
2. **Use Confidential Sparingly** - Only for truly sensitive data
3. **Name Agents Clearly** - Use descriptive agent zone names
4. **Log Important Decisions** - Track agent reasoning in log zones
5. **Bookmark References** - Save sources for later validation

## Real-World Example

\`\`\`
<@. Market Analysis Report .>

<. Internal Team Notes:
- Competitor X launched new product
- Need to update pricing strategy
.>

<#. Confidential Financial Data:
Revenue Q3: $5.2M
Profit Margin: 23%
#.>

<.analyst Focus on pricing trends .analyst>
<.writer Draft customer-facing summary .writer>

<.log Analysis started: 2025-10-04 14:30 .log>
\`\`\`

## Conclusion

Mastering PS-LANG's 7 privacy zones gives you fine-grained control over AI context, enabling secure, efficient multi-agent workflows.
    `
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: "Post Not Found | PS-LANG Blog"
    }
  }

  return {
    title: `${post.title} | PS-LANG Blog`,
    description: post.excerpt,
    keywords: `${post.category}, PS-LANG, multi-agent, AI workflows, ${post.slug}`,
    alternates: {
      canonical: `https://ps-lang.dev/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ps-lang.dev/blog/${post.slug}`,
      siteName: "PS-LANG",
      type: "article",
      publishedTime: post.date,
      authors: ["Vummo Labs"],
      images: [
        {
          url: 'https://ps-lang.dev/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ['https://ps-lang.dev/og-image.png'],
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const user = await currentUser()
  const userRole = getUserRole(user)

  // Restrict to super_admin only
  if (userRole !== 'super_admin') {
    redirect('/')
  }

  const post = blogPosts[params.slug]

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-stone-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-stone-600 hover:text-stone-900 underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] tracking-[0.2em]">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Home</Link>
          <span className="text-stone-300">→</span>
          <Link href="/blog" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Blog</Link>
          <span className="text-stone-300">→</span>
          <span className="text-stone-600 uppercase">{post.category}</span>
        </nav>

        {/* Article Header - Luxury Stationery Style */}
        <header className="mb-16 pb-10 border-b border-stone-200/60">
          <div className="mb-8 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">{post.category}</span>
            <span className="text-stone-300/60">•</span>
            <time className="text-[10px] tracking-[0.15em] text-stone-400/80 uppercase">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
            <span className="text-stone-300/60">•</span>
            <span className="text-[10px] tracking-[0.15em] text-stone-400/80 uppercase">{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 mb-8 tracking-tight leading-[1.1] max-w-4xl">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-[1.7] font-light tracking-wide max-w-3xl">
            {post.excerpt}
          </p>
        </header>

        {/* Article Content - Medium.com Style Typography */}
        <div className="prose prose-stone max-w-none
          prose-headings:font-light prose-headings:tracking-tight prose-headings:text-stone-900
          prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:hidden prose-h1:leading-tight
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:font-light prose-h2:tracking-tight prose-h2:leading-tight
          prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:font-normal prose-h3:leading-snug
          prose-p:text-xl prose-p:text-stone-700 prose-p:leading-relaxed prose-p:mb-8
          prose-a:text-stone-900 prose-a:underline prose-a:decoration-stone-300 hover:prose-a:decoration-stone-600 prose-a:transition-colors prose-a:underline-offset-2
          prose-code:text-stone-900 prose-code:bg-stone-100 prose-code:px-2 prose-code:py-1 prose-code:font-mono prose-code:text-base prose-code:font-normal
          prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-pre:p-6 prose-pre:my-10 prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:text-base
          prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4 prose-ul:my-10
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-4 prose-ol:my-10 prose-ol:marker:text-stone-400
          prose-li:text-xl prose-li:text-stone-700 prose-li:leading-relaxed prose-li:pl-8 prose-li:relative
          prose-li:before:content-['—'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-stone-400 prose-li:before:font-light
          prose-strong:text-stone-900 prose-strong:font-semibold
          prose-table:border-collapse prose-table:w-full prose-table:my-12
          prose-th:border prose-th:border-stone-200 prose-th:bg-stone-100 prose-th:p-4 prose-th:text-left prose-th:text-base prose-th:font-medium prose-th:text-stone-900
          prose-td:border prose-td:border-stone-200 prose-td:p-4 prose-td:text-xl prose-td:text-stone-700
        ">
          <div dangerouslySetInnerHTML={{ __html: post.content.trim().split('\n').map(line => {
            if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
            if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
            if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
            if (line.startsWith('- ') || line.startsWith('* ')) return `<li>${line.slice(2)}</li>`
            if (line.match(/^\d+\. /)) return `<li>${line.replace(/^\d+\. /, '')}</li>`
            if (line.startsWith('```')) {
              const lang = line.slice(3)
              return line.includes('```') && !lang ? '</code></pre>' : `<pre><code class="language-${lang}">`
            }
            if (line.startsWith('|')) {
              const cells = line.split('|').filter(c => c.trim())
              const isHeader = cells.some(c => c.includes('---'))
              if (isHeader) return ''
              const tag = line.includes('Feature') ? 'th' : 'td'
              return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')}</tr>`
            }
            if (line.trim() === '') return '<br/>'
            return `<p>${line}</p>`
          }).join('\n') }} />
        </div>

        {/* Article Footer - Luxury Stationery Style */}
        <footer className="mt-20 pt-10 border-t border-stone-200/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link href="/blog" className="group flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              <span className="text-stone-300 group-hover:text-stone-600 transition-colors">←</span>
              <span className="text-[11px] uppercase tracking-[0.15em]">Back to Blog</span>
            </Link>

            <Link
              href="/"
              className="border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-900 px-8 py-3 transition-all duration-300 text-[11px] font-medium uppercase tracking-[0.2em] shadow-sm hover:shadow"
            >
              Try PS-LANG
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
