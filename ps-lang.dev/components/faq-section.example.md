# FAQSection Component

Global, reusable FAQ component with built-in SEO optimization and AI-friendly metadata.

## Features

- **Accordion UI**: Expand/collapse functionality
- **JSON-LD Structured Data**: Automatically generates Schema.org FAQPage markup
- **AI-Friendly**: Includes llms.txt documentation and semantic HTML
- **Accessible**: Proper ARIA attributes and keyboard navigation
- **Consistent Styling**: Matches PS-LANG design system

## Usage

```tsx
import FAQSection from '@/components/faq-section'

export default function MyPage() {
  return (
    <FAQSection
      title="Understanding Token Metrics"
      subtitle="FAQ" // optional, defaults to "FAQ"
      faqs={[
        {
          question: "What are these metrics showing?",
          answer: "This chart shows simulated token usage..."
        },
        {
          question: "How do I get started?",
          answer: (
            <>
              Install with <code>npx ps-lang init</code>...
            </>
          )
        }
      ]}
    />
  )
}
```

## Props

```typescript
interface FAQItem {
  question: string
  answer: string | React.ReactNode  // Supports both plain text and JSX
}

interface FAQSectionProps {
  title: string           // Main heading (e.g., "Understanding Token Metrics")
  subtitle?: string       // Optional subtitle (defaults to "FAQ")
  faqs: FAQItem[]        // Array of FAQ items
  className?: string     // Optional additional CSS classes
}
```

## SEO Benefits

The component automatically generates JSON-LD structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are these metrics showing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This chart shows simulated token usage..."
      }
    }
  ]
}
```

This helps:
- **Google Rich Results**: FAQ snippets in search results
- **AI Agents**: ChatGPT, Claude, Perplexity can extract Q&A
- **Voice Assistants**: Alexa, Google Assistant understanding

## AI Agent Metadata

The component includes `@llms.txt` documentation in comments for AI code assistants:

- Component purpose and features
- Usage patterns
- Integration examples

## Accessibility

- **ARIA Labels**: `aria-expanded`, `aria-controls` for screen readers
- **Semantic HTML**: Proper heading hierarchy
- **Keyboard Navigation**: Tab and Enter/Space to expand/collapse
- **Focus Management**: Visual focus indicators

## Examples

### Simple Text FAQs

```tsx
<FAQSection
  title="Getting Started"
  faqs={[
    {
      question: "How do I install PS-LANG?",
      answer: "Run npm install ps-lang in your terminal."
    },
    {
      question: "Is it free?",
      answer: "Yes, PS-LANG is open source and MIT licensed."
    }
  ]}
/>
```

### FAQs with Rich Content

```tsx
<FAQSection
  title="Advanced Usage"
  faqs={[
    {
      question: "Can I use custom zones?",
      answer: (
        <>
          Yes! Create custom zones with the pattern{' '}
          <code className="bg-stone-100 px-2 py-1">
            &lt;symbol. content symbol.&gt;
          </code>
          . Learn more in the{' '}
          <Link href="/docs">documentation</Link>.
        </>
      )
    }
  ]}
/>
```

### Multiple FAQ Sections

```tsx
export default function DocsPage() {
  return (
    <>
      <FAQSection
        title="Installation"
        subtitle="Setup Questions"
        faqs={installationFaqs}
      />

      <FAQSection
        title="Usage"
        subtitle="Common Questions"
        faqs={usageFaqs}
        className="mt-20"
      />
    </>
  )
}
```

## Migration from Inline FAQ

**Before:**

```tsx
const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

// ... in JSX
<div className="border border-stone-300 bg-white">
  {faqs.map((faq, index) => (
    <div key={index}>
      <button onClick={() => setOpenFaqIndex(...)}>
        {faq.question}
      </button>
      {openFaqIndex === index && <div>{faq.answer}</div>}
    </div>
  ))}
</div>
```

**After:**

```tsx
<FAQSection
  title="Understanding Token Metrics"
  faqs={faqs}
/>
```

## Best Practices

1. **Keep answers concise**: 1-3 sentences ideal for rich snippets
2. **Use plain text when possible**: Better for JSON-LD extraction
3. **Structure questions naturally**: How users would ask
4. **Order by importance**: Most common questions first
5. **Update schema**: JSON-LD auto-generated, always in sync

## Related Files

- Component: `components/faq-section.tsx`
- Schema Reference: `public/schemas/faq-schema.jsonld`
- Example Usage: `app/playground/token-comparison/page.tsx`
