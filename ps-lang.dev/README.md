# PS-LANG.dev - Marketing Website

Official website for **PS-LANG** - Privacy-First Scripting Language for Multi-Agent Context Control.

## 🚀 Quick Start

### Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Using PS-LANG in Your Project

```bash
# One-time setup (recommended)
npx ps-lang@alpha init

# Or install as dev dependency
npm install --save-dev ps-lang@alpha
```

View on npm: https://www.npmjs.com/package/ps-lang

## 📁 Project Structure

```
ps-lang.dev/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout (SEO, analytics)
│   └── api/newsletter/       # Newsletter signup API
├── components/
│   ├── newsletter-modal.tsx  # Newsletter modal
│   ├── newsletter-signup.tsx # Signup form
│   └── navigation.tsx        # Site navigation
├── public/
│   ├── sitemap.xml          # SEO sitemap
│   ├── robots.txt           # Crawler rules
│   └── *.png                # Favicons & OG images
└── scripts/
    ├── generate-favicons.mjs # Automated favicon generation
    └── generate-og-image.mjs # OG image generation
```

## 🔧 Environment Variables

Create `.env.local`:

```env
# Newsletter (Required)
RESEND_API_KEY=re_xxx
RESEND_AUDIENCE_ID=aud_xxx

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA_ID=G-xxx
```

## 🎨 Design System

**Brand Color**: `#2D1300` (dark brown)
**Typography**: Inter (body), JetBrains Mono (code)
**Palette**: Tailwind stone colors (50-900)
**Aesthetic**: Minimal, clean, developer-focused

## 📊 Analytics & Tracking

- **PostHog**: Event tracking (use case clicks, newsletter signups)
- **Google Analytics**: Page views and traffic
- **Resend**: Email newsletter (Vummo Labs audience)

## 🎯 SEO Configuration

✅ **Canonical URL**: `https://ps-lang.dev`
✅ **Sitemap**: `/sitemap.xml`
✅ **Robots**: `/robots.txt`
✅ **Schema.org**: Organization, SoftwareApplication, WebSite
✅ **OG Images**: 1200x630 social previews

## 🛠️ Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Asset generation
npm run generate:favicons  # 7 favicon sizes
npm run generate:og        # Social preview image
```

**Deployment**: Vercel (auto-deploys from `main` branch)

## 📝 Content Updates

### Update Version Number
**Current**: v0.1.0-alpha.1
**Footer**: `app/page.tsx`
**Schema**: `app/layout.tsx` (softwareVersion field)

### Update Newsletter Interests
**Edit**: `components/newsletter-signup.tsx` (interestOptions array)

### Update SEO
**Metadata**: `app/layout.tsx` (metadata object)
**Sitemap**: `public/sitemap.xml` (add new pages)

## 📧 Newsletter Integration

**Provider**: Resend (shared Vummo Labs audience)
**Form**: `components/newsletter-signup.tsx`
**API**: `app/api/newsletter/route.ts`
**Tracking**: Email domain, interests, source

## 🎨 Asset Generation

All assets generated from `public/ps-lang-logomark.png`:

```bash
npm run generate:favicons  # Creates 7 sizes (16x16 to 512x512)
npm run generate:og        # Creates 1200x630 social preview
```

## 🎯 Target Audiences

1. **AI Engineers** - Multi-agent system architects
2. **ML Researchers** - Benchmarking and testing
3. **Dev Teams** - Agent workflow automation
4. **MCP Developers** - Model Context Protocol chains

## 💡 What is PS-LANG?

Zone-based syntax for controlling what AI agents see in multi-agent workflows.

**Core concept:**
- `<. .>` Current agent only
- `<#. .#>` Pass to next agent
- `<@. .@>` Active workspace
- `<$. .$>` Business/monetization context
- `<~. .~>` AI-managed metadata

**Why it matters:**
- **Context engineering**: Control what each agent sees
- **Better benchmarks**: Test agents without contamination
- **Backwards compatible**: Add zones to existing logs
- **Future:** Clerk encryption for secrets management

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Email**: Resend
- **Analytics**: PostHog, Google Analytics
- **Deployment**: Vercel

## 🚧 Roadmap

**Alpha** - Basic zone syntax, CLI tools, themes (✅ Published to npm)
**Beta** - `.psl` file format, secrets management (Clerk integration)
**v1.0** - Parser library, multi-agent framework integration, ChatGPT support

**Website TODOs:**
- [ ] Update homepage with alpha launch announcement
- [ ] Create demo video embed
- [ ] Add case studies section
- [ ] Blog for launch posts

## 🔗 Key Links

- **Website**: https://ps-lang.dev
- **npm Package**: https://www.npmjs.com/package/ps-lang
- **GitHub**: https://github.com/vummo/ps-lang
- **Vummo Labs**: https://vummo.com

## 📄 License

MIT License - See [../LICENSE](../LICENSE)

---

**Built by [Vummo Labs](https://vummo.com)**