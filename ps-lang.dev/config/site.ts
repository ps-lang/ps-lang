/**
 * Site Configuration - Single Source of Truth
 *
 * All canonical URLs, metadata, and site-wide constants.
 * This file is version controlled and serves as the authoritative source
 * for all URLs, social links, and site identity.
 */

export const siteConfig = {
  name: 'PS-LANG',
  description: 'Framework for multi-agent context control. Build PS Journals™ to track AI collaborations.',
  url: 'https://ps-lang.dev',

  // Canonical URLs
  urls: {
    github: 'https://github.com/ps-lang/ps-lang',
    npm: 'https://www.npmjs.com/package/ps-lang',
    vummoLabs: 'https://vummo.com',
    license: 'https://github.com/ps-lang/ps-lang/blob/main/LICENSE',
  },

  // Social & External Links
  social: {
    github: 'https://github.com/ps-lang/ps-lang',
    twitter: 'https://twitter.com/vummo',
  },

  // Legal
  legal: {
    privacy: '/privacy',
    terms: '/terms',
  },

  // Playground
  playground: {
    tokenComparison: '/playground/token-comparison',
    promptEditor: '/playground/prompt-editor',
  },

  // Version (should match root package.json)
  version: 'v0.2.3-alpha.1',

  // Analytics
  posthog: {
    enabled: process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true',
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },

  // Features
  features: {
    alphaSignup: true,
    newsletter: true,
    feedback: true,
  },
} as const

export type SiteConfig = typeof siteConfig
