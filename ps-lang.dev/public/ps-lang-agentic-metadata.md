# PS-LANG Agentic Metadata System

**Version:** v1.0.0
**Last Updated:** October 6, 2025
**License:** MIT

## Overview

PS-LANG implements a comprehensive agentic metadata system for AI-powered analytics, personalization, and workflow optimization. This system is built on a **private-by-default** model with user-controlled public sharing.

## Core Principles

### 1. Privacy-First Architecture

- **Default to Private:** All agentic metadata starts as private, stored with the user's Clerk account
- **User-Controlled Sharing:** Users explicitly choose what metadata to share publicly
- **Encryption:** Self-hosted encryption with user-managed keys
- **Zero Vendor Lock-in:** Full data export capabilities (JSON, CSV)

### 2. Token Management Model

PS-LANG uses a dual-token system:

#### Private Token (Default)
- Stored in Clerk user metadata
- Accessible only via authenticated session
- Includes all detailed agentic metadata
- Never shared without explicit user consent

#### Public Secrets Key
- User-controlled setting in PS-LANG Journal
- Enables selective sharing of metadata
- Users choose which fields become public
- Public metadata labeled with `ps-lang:access-level="public"`

### 3. Journal Tiers

#### OSS (Open Source)
- Self-hosted, MIT licensed
- Full feature access
- Local data storage
- Community support

#### Plus (Premium)
- All OSS features
- Enhanced analytics
- Team collaboration
- Priority support
- Advanced benchmark sharing

## Metadata Structure

### Component-Level Metadata

Every PS-LANG component includes:

```typescript
{
  // Identity
  "component": "newsletter-signup",
  "componentVersion": "v1.0.0",
  "interactionType": "form_submission",

  // Context
  "source": "journal_page",
  "accessLevel": "authenticated",
  "journalTier": "OSS",

  // Segmentation
  "userSegment": "business",
  "intentLevel": "high_intent",

  // Workflow
  "workflowStage": "lead_capture",
  "conversionFunnel": "newsletter_signup",
  "dataStream": "agentic_ux_v1",

  // Privacy
  "privacyLabel": "private",
  "publicSecretsKey": null,

  // Platform
  "platformVersion": "v0.1.0-alpha.1",
  "timestamp": "2025-10-06T12:00:00Z",
  "agenticSignature": "agentic_ux_v1:postscript-journaling"
}
```

### Journal Signature Format

Format: `{tier}_v{version}_{access-model}`

Examples:
- `OSS_v1.0.0_public-access` - Open source with public metadata sharing enabled
- `Plus_v1.2.0_private-only` - Premium tier with all metadata private
- `OSS_v1.0.0_private-only` - Open source with no public sharing

## Data Streams

### 1. Public Metadata Stream
- **Access:** Public via user's public_secrets_key
- **Content:** User-selected fields only
- **Use Cases:** Public benchmarks, community insights, research

### 2. Private Metadata Stream
- **Access:** Clerk session only
- **Content:** All detailed metadata
- **Use Cases:** Personal analytics, private benchmarks, audit trails

### 3. Analytics Stream
- **Access:** Anonymized, aggregated
- **Content:** Usage patterns, feature adoption
- **Use Cases:** Product improvements, A/B testing

### 4. Benchmark Stream
- **Access:** User-controlled
- **Content:** Performance metrics, workflow improvements
- **Use Cases:** Sharing productivity gains, research studies

## SEO & Discoverability

### Meta Tags

PS-LANG pages include comprehensive meta tags:

```html
<!-- Standard SEO -->
<meta name="description" content="..." />
<meta name="keywords" content="..." />

<!-- OpenGraph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />

<!-- PS-LANG Agentic Metadata -->
<meta name="ps-lang:version" content="v0.1.0-alpha.1" />
<meta name="ps-lang:agentic-signature" content="agentic_ux_v1:postscript-journaling" />
<meta name="ps-lang:journal-signature" content="OSS_v1.0.0_public-access" />
<meta name="ps-lang:mission" content="..." />
<meta name="ps-lang:vision" content="..." />
<meta name="ps-lang:goals" content="..." />

<!-- Token Management -->
<meta name="ps-lang:token-model" content="clerk-based:private-by-default" />
<meta name="ps-lang:public-access-key" content="user-controlled-settings" />
<meta name="ps-lang:encryption-model" content="self-hosted:user-managed-keys" />
```

### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PS-LANG Journal",
  "applicationCategory": "DeveloperApplication",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "ps-lang:journal-signature",
      "value": "OSS_v1.0.0_public-access"
    },
    {
      "@type": "PropertyValue",
      "name": "ps-lang:privacy-token",
      "value": "private-label:user-controlled"
    }
  ]
}
```

### llms.txt Integration

PS-LANG includes agentic metadata in `/llms.txt` for AI crawler discovery:

```
# Agentic Metadata
ps-lang:version: v0.1.0-alpha.1
ps-lang:agentic-signature: agentic_ux_v1
ps-lang:data-stream: public-metadata-stream
ps-lang:access-model: public_secrets_key:enabled

# PS-LANG Journal Metadata
journal-signature: OSS_v1.0.0_public-access
journal-tier: OSS|Plus
encryption-model: self-hosted:user-managed-keys
privacy-token: private-label:user-controlled

# Mission, Vision, Goals
mission: Empower developers with self-hosted AI workflow tracking
vision: Privacy-first AI productivity tools for individuals and teams
goals: 100% data ownership, zero vendor lock-in, open source forever
```

## DOM Data Attributes

Components include data attributes for DOM-based analytics:

```html
<div
  data-page="postscript-journaling"
  data-ps-lang-version="v0.1.0-alpha.1"
  data-agentic-signature="agentic_ux_v1:postscript-journaling"
  data-journal-tier="OSS"
  data-access-level="authenticated"
  data-data-stream="agentic_ux_v1"
>
  <!-- Component content -->
</div>
```

## Analytics Integration

### PostHog Events

```javascript
posthog.capture('newsletter_signup_success', {
  component: 'newsletter-signup',
  componentVersion: 'v1.0.0',
  source: 'journal_page',
  interests: ['PS-LANG Journal Features', 'AI Workflow Tracking'],
  userSegment: 'business',
  intentLevel: 'high_intent',
  workflowStage: 'lead_capture',
  dataStream: 'agentic_ux_v1',
  privacyLabel: 'private'
})
```

### Google Analytics Events

```javascript
gtag('event', 'newsletter_signup', {
  event_category: 'engagement',
  event_label: 'journal_page',
  value: 2, // number of interests selected
  // Full agentic metadata included
})
```

### Convex Database Storage

```typescript
// Newsletter subscription with agentic metadata
{
  email: "user@example.com",
  interests: ["PS-LANG Journal Features"],
  agenticMetadata: {
    userSegment: "business",
    intentLevel: "high_intent",
    workflowStage: "lead_capture",
    conversionFunnel: "newsletter_signup",
    dataStream: "agentic_ux_v1",
    platformVersion: "v0.1.0-alpha.1",
    capturedAt: 1728216000000
  }
}
```

## User Flow: Private to Public Sharing

### Step 1: Default Private State
1. User signs up for PS-LANG Journal
2. All metadata stored privately in Clerk account
3. No public sharing enabled

### Step 2: User Enables Public Sharing
1. User navigates to Settings → Privacy → Public Sharing
2. Sees list of metadata fields they can share:
   - [ ] Benchmark data
   - [ ] Interest categories
   - [ ] Usage statistics
   - [ ] Workflow improvements
3. User enables specific fields
4. System generates `public_secrets_key`

### Step 3: Public Metadata Available
1. Selected metadata becomes accessible via public API
2. Metadata labeled with `privacyLabel: "public"`
3. Other users/researchers can access via public_secrets_key
4. Private metadata remains encrypted

### Step 4: User Revokes Access
1. User disables public sharing in settings
2. Public_secrets_key invalidated
3. All metadata returns to private state

## Mission, Vision, Goals

### Mission
Empower developers with self-hosted AI workflow tracking

### Vision
Privacy-first AI productivity tools for individuals and teams

### Goals
- 100% data ownership
- Zero vendor lock-in
- Open source forever

## Contact & Support

- **Email:** hello@ps-lang.dev
- **Website:** https://ps-lang.dev
- **Documentation:** https://ps-lang.dev/docs
- **GitHub:** https://github.com/ps-lang/ps-lang

## License

MIT License - See [LICENSE](https://ps-lang.dev/LICENSE) for details

---

**PS-LANG Agentic Metadata System v1.0.0**
Built with privacy, transparency, and user control at its core.
