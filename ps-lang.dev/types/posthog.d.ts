interface PostHogIdentity {
  userId?: string
  properties?: Record<string, any>
}

interface PostHog {
  capture(eventName: string, properties?: Record<string, any>): void
  identify(userId: string, properties?: Record<string, any>): void
  reset(): void
  group(groupType: string, groupKey: string, properties?: Record<string, any>): void
}

interface Window {
  posthog?: PostHog
}
