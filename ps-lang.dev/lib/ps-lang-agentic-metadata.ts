/**
 * PS-LANG Agentic Metadata Types
 *
 * Defines the metadata structure for PS-LANG Journal components,
 * including public/private token management via Clerk authentication.
 *
 * @version v1.0.0
 * @license MIT
 */

/**
 * PS-LANG Journal Tier
 * - OSS: Open source, self-hosted, MIT licensed
 * - Plus: Premium features with enhanced analytics and team collaboration
 */
export type JournalTier = 'OSS' | 'Plus'

/**
 * Access Level based on Clerk authentication
 * - public: Not authenticated, public metadata only
 * - authenticated: Logged in user, access to user-controlled settings
 * - alpha_tester: Early access users with Plus features
 */
export type AccessLevel = 'public' | 'authenticated' | 'alpha_tester'

/**
 * Privacy Token Model
 *
 * PS-LANG Journal uses a "private-by-default" model where:
 * 1. All agentic metadata starts as private (stored with user's Clerk account)
 * 2. Users can explicitly share metadata via their "public_secrets_key" in settings
 * 3. Shared metadata is labeled with ps-lang:access-level="public"
 *
 * Example flow:
 * - User creates journal entry → metadata tagged as private
 * - User enables "Share benchmark data" in settings → specific metadata becomes public
 * - Public metadata can be accessed via user's public_secrets_key
 * - Private metadata remains encrypted and accessible only via Clerk session
 */
export interface PrivacyTokenModel {
  /** Default privacy level for new metadata */
  default: 'private'

  /** Clerk-based authentication controls access */
  authProvider: 'clerk'

  /** User-controlled public sharing key */
  publicSecretsKey?: string

  /** Fields user has chosen to make public */
  publicFields: string[]

  /** Encryption model for private data */
  encryptionModel: 'self-hosted' | 'user-managed-keys'
}

/**
 * Agentic Metadata Structure
 *
 * Comprehensive metadata attached to components, events, and data streams
 * for AI-powered analytics, personalization, and workflow optimization.
 */
export interface AgenticMetadata {
  // Component identity
  component: string
  componentVersion: string
  interactionType: 'form_submission' | 'navigation' | 'content_interaction' | 'feature_usage'

  // User context
  source: string
  accessLevel: AccessLevel
  journalTier?: JournalTier

  // Segmentation
  userSegment?: 'consumer' | 'business' | 'enterprise'
  intentLevel?: 'browsing' | 'general_interest' | 'high_intent' | 'conversion'

  // Agentic UX metadata
  uiVariant?: string
  workflowStage: string
  conversionFunnel: string
  dataStream: 'agentic_ux_v1'

  // Privacy and access control
  privacyLabel: 'private' | 'public'
  publicSecretsKey?: string

  // Platform metadata
  platformVersion: string
  timestamp: string

  // PS-LANG specific
  journalSignature?: string
  agenticSignature: string
}

/**
 * PS-LANG Journal Signature
 *
 * Unique identifier for journal instances that includes:
 * - Tier (OSS or Plus)
 * - Version
 * - Access model (public-access or private-only)
 *
 * Format: {tier}_v{version}_{access-model}
 * Examples:
 * - "OSS_v1.0.0_public-access"
 * - "Plus_v1.2.0_private-only"
 */
export type JournalSignature = `${JournalTier}_v${string}_${string}`

/**
 * Data Stream Types
 *
 * Categorizes different types of data being tracked:
 * - public-metadata-stream: Publicly accessible metadata (via public_secrets_key)
 * - private-metadata-stream: User-private metadata (Clerk session only)
 * - analytics-stream: Anonymized analytics data
 * - benchmark-stream: Performance benchmarks (user-controlled sharing)
 */
export type DataStreamType =
  | 'public-metadata-stream'
  | 'private-metadata-stream'
  | 'analytics-stream'
  | 'benchmark-stream'

/**
 * PS-LANG Mission, Vision, Goals
 *
 * Core values embedded in metadata for AI crawlers and documentation
 */
export const PS_LANG_METADATA = {
  mission: 'Empower developers with self-hosted AI workflow tracking',
  vision: 'Privacy-first AI productivity tools for individuals and teams',
  goals: '100% data ownership, zero vendor lock-in, open source forever',

  // Token model explanation
  tokenModel: {
    type: 'clerk-based:private-by-default',
    description: 'All metadata starts private. Users control what becomes public via settings.',
    publicAccessKey: 'user-controlled-settings',
    encryptionModel: 'self-hosted:user-managed-keys'
  }
} as const

/**
 * Example: Creating agentic metadata for a component
 */
export function createAgenticMetadata(
  component: string,
  source: string,
  accessLevel: AccessLevel,
  additionalData?: Partial<AgenticMetadata>
): AgenticMetadata {
  return {
    component,
    componentVersion: 'v1.0.0',
    interactionType: 'content_interaction',
    source,
    accessLevel,
    journalTier: accessLevel === 'alpha_tester' ? 'Plus' : 'OSS',
    workflowStage: 'engagement',
    conversionFunnel: 'feature-discovery',
    dataStream: 'agentic_ux_v1',
    privacyLabel: 'private', // Default to private
    platformVersion: 'v0.1.0-alpha.1',
    timestamp: new Date().toISOString(),
    agenticSignature: 'agentic_ux_v1:ps-lang-journal',
    ...additionalData
  }
}

/**
 * Example: Determining what metadata is public vs private
 */
export function filterPublicMetadata(
  metadata: AgenticMetadata,
  userSettings: { publicFields: string[] }
): Partial<AgenticMetadata> {
  const publicMetadata: Partial<AgenticMetadata> = {}

  for (const field of userSettings.publicFields) {
    if (field in metadata) {
      const key = field as keyof AgenticMetadata
      const value = metadata[key]
      if (value !== undefined) {
        (publicMetadata as any)[key] = value
      }
    }
  }

  // Always include public signature
  publicMetadata.agenticSignature = metadata.agenticSignature
  publicMetadata.privacyLabel = 'public'

  return publicMetadata
}
