'use client'

import { useUser, SignOutButton } from '@clerk/nextjs'
import { getUserRole, getRoleDisplayName, getRoleBadgeColor } from '@/lib/roles'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { siteConfig } from '@/config/site'
import { Tabs } from '@/components/ui/tabs'
import {
  getConsentPreferences,
  grantConsent,
  revokeConsent,
  detectGPC,
  trackConsentEvent,
  type GranularConsent,
  type ConsentPreferences
} from '@/lib/consent'

const PERSONAS = [
  { id: 'explorer', name: 'Explorer', slogan: 'Discover More · Learn As I Go', description: 'Let the system adapt to your style over time' },
  { id: 'solo_developer', name: 'Solo Developer', slogan: 'Ship Fast · Build Better · Own Your Stack', description: 'You ship code, iterate fast, and own your infrastructure' },
  { id: 'researcher', name: 'Researcher', slogan: 'Think Deep · Test Everything · Question More', description: 'You analyze thoroughly, validate assumptions, and seek truth' },
  { id: 'creator', name: 'Creator', slogan: 'Write More · Create Daily · Share Freely', description: 'You write, design, and create content that inspires others' },
  { id: 'analyst', name: 'Analyst', slogan: 'Measure Twice · Cut Once · Data-Driven', description: 'You optimize metrics, track performance, and make data-backed decisions' },
  { id: 'generalist', name: 'Generalist', slogan: 'Learn Everything · Master Anything · Stay Curious', description: 'You explore broadly, adapt quickly, and connect the dots' },
  { id: 'prefer_not_to_say', name: 'Prefer not to say', slogan: 'Privacy First · Keep It Simple', description: 'Keep your preferences private' },
]

const ALPHA_INTERESTS = [
  { id: 'multi_agent_workflows', label: 'Multi-agent workflows' },
  { id: 'benchmarking_testing', label: 'Benchmarking & testing' },
  { id: 'privacy_first_tools', label: 'Privacy-first AI tools' },
  { id: 'ai_workflow_journaling', label: 'AI workflow journaling' },
  { id: 'mcp_integration', label: 'MCP integration' },
]

export default function SettingsPage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const userRole = getUserRole(user)
  const [selectedPersona, setSelectedPersona] = useState<string>('explorer')
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Profile fields
  const [displayName, setDisplayName] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [bio, setBio] = useState('')

  // Focus states for inputs
  const [displayNameFocused, setDisplayNameFocused] = useState(false)
  const [bioFocused, setBioFocused] = useState(false)

  // Alpha access request state
  const [alphaGithubUrl, setAlphaGithubUrl] = useState('')
  const [alphaInterests, setAlphaInterests] = useState<string[]>([])
  const [isSubmittingAlpha, setIsSubmittingAlpha] = useState(false)
  const [alphaSubmitted, setAlphaSubmitted] = useState(false)

  // Convex queries and mutations
  const existingAlphaRequest = useQuery(
    api.alphaRequests.getByClerkUserId,
    user?.id ? { clerkUserId: user.id } : "skip"
  )
  const submitAlphaRequest = useMutation(api.alphaRequests.submitRequest)

  // Data retention preferences
  const retentionPrefs = useQuery(
    api.dataRetention.getUserPreferences,
    user?.id ? { userId: user.id } : "skip"
  )
  const updateRetentionTier = useMutation(api.dataRetention.updateRetentionTier)
  const [selectedTier, setSelectedTier] = useState<string>('standard')
  const [isSavingTier, setIsSavingTier] = useState(false)
  const [showTierSaved, setShowTierSaved] = useState(false)

  // Cookie preferences
  const [cookiePrefs, setCookiePrefs] = useState<ConsentPreferences | null>(null)
  const [gpcDetected, setGpcDetected] = useState(false)
  const [granularCookiePrefs, setGranularCookiePrefs] = useState<GranularConsent>({
    analytics: false,
    sessionReplay: false,
    performance: false,
  })
  const [showCookieSaved, setShowCookieSaved] = useState(false)

  // Load all user metadata
  useEffect(() => {
    if (user?.unsafeMetadata) {
      setSelectedPersona((user.unsafeMetadata.persona as string) || 'explorer')
      setDisplayName((user.unsafeMetadata.displayName as string) || '')
      setGithubUrl((user.unsafeMetadata.githubUrl as string) || '')
      setTwitterUrl((user.unsafeMetadata.twitterUrl as string) || '')
      setWebsiteUrl((user.unsafeMetadata.websiteUrl as string) || '')
      setBio((user.unsafeMetadata.bio as string) || '')
      setIsInitialLoad(false)
    }
  }, [user])

  // Load retention preferences
  useEffect(() => {
    if (retentionPrefs) {
      setSelectedTier(retentionPrefs.tier)
    }
  }, [retentionPrefs])

  // Load cookie preferences
  useEffect(() => {
    const currentPrefs = getConsentPreferences()
    setCookiePrefs(currentPrefs)
    setGpcDetected(detectGPC())

    if (currentPrefs) {
      setGranularCookiePrefs(currentPrefs.granular)
    }
  }, [])

  const handlePersonaChange = async (personaId: string) => {
    setSelectedPersona(personaId)
    setIsSaving(true)
    setShowSaved(false)

    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          persona: personaId,
        },
      })
      setIsSaving(false)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save persona:', error)
      setIsSaving(false)
    }
  }

  const handleProfileSave = async () => {
    setIsSaving(true)
    setShowSaved(false)

    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          displayName,
          githubUrl,
          twitterUrl,
          websiteUrl,
          bio,
        },
      })
      setIsSaving(false)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
      setIsSaving(false)
    }
  }

  const handleAlphaSubmit = async () => {
    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) return

    setIsSubmittingAlpha(true)

    try {
      await submitAlphaRequest({
        clerkUserId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        persona: selectedPersona,
        githubUrl: alphaGithubUrl || undefined,
        interestedIn: alphaInterests,
      })

      setAlphaSubmitted(true)
      setTimeout(() => setAlphaSubmitted(false), 5000)
    } catch (error) {
      console.error('Failed to submit alpha request:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsSubmittingAlpha(false)
    }
  }

  const toggleAlphaInterest = (interestId: string) => {
    setAlphaInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleTierChange = async (tier: string) => {
    if (!user?.id) return

    setSelectedTier(tier)
    setIsSavingTier(true)
    setShowTierSaved(false)

    try {
      await updateRetentionTier({
        userId: user.id,
        tier,
      })
      setIsSavingTier(false)
      setShowTierSaved(true)
      setTimeout(() => setShowTierSaved(false), 3000)
    } catch (error) {
      console.error('Failed to update retention tier:', error)
      setIsSavingTier(false)
      alert('Failed to update data retention tier. Please try again.')
    }
  }

  // Cookie consent handlers
  const handleGrantAllCookies = () => {
    const fullConsent: GranularConsent = {
      analytics: true,
      sessionReplay: true,
      performance: true,
    }

    grantConsent(fullConsent)
    trackConsentEvent('granted', fullConsent)

    const updatedPrefs = getConsentPreferences()
    setCookiePrefs(updatedPrefs)
    setGranularCookiePrefs(fullConsent)
    setShowCookieSaved(true)
    setTimeout(() => setShowCookieSaved(false), 3000)
  }

  const handleRevokeAllCookies = () => {
    revokeConsent()
    trackConsentEvent('revoked')

    const updatedPrefs = getConsentPreferences()
    setCookiePrefs(updatedPrefs)
    setGranularCookiePrefs({
      analytics: false,
      sessionReplay: false,
      performance: false,
    })
    setShowCookieSaved(true)
    setTimeout(() => setShowCookieSaved(false), 3000)
  }

  const handleSaveGranularCookies = () => {
    const hasAnyConsent = granularCookiePrefs.analytics || granularCookiePrefs.sessionReplay || granularCookiePrefs.performance

    if (hasAnyConsent) {
      grantConsent(granularCookiePrefs)
      trackConsentEvent('updated', granularCookiePrefs)
    } else {
      revokeConsent()
      trackConsentEvent('revoked')
    }

    const updatedPrefs = getConsentPreferences()
    setCookiePrefs(updatedPrefs)
    setShowCookieSaved(true)
    setTimeout(() => setShowCookieSaved(false), 3000)
  }

  // Auto-save profile fields on change with 5-second debounce
  useEffect(() => {
    // Skip auto-save on initial load
    if (!user || isInitialLoad) {
      return
    }

    // Show saving indicator after 3 seconds
    const savingTimer = setTimeout(() => {
      setIsSaving(true)
    }, 3000)

    // Actually save after 5 seconds
    const saveTimer = setTimeout(async () => {
      setIsSaving(true)
      setShowSaved(false)

      try {
        await user?.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            displayName,
            githubUrl,
            twitterUrl,
            websiteUrl,
            bio,
          },
        })
        setIsSaving(false)
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 3000)
      } catch (error) {
        console.error('Failed to save profile:', error)
        setIsSaving(false)
      }
    }, 5000)

    return () => {
      clearTimeout(savingTimer)
      clearTimeout(saveTimer)
    }
  }, [displayName, githubUrl, twitterUrl, websiteUrl, bio, user, isInitialLoad])

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-sm text-stone-500">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="border border-stone-300 bg-white p-8 text-center">
            <h1 className="text-2xl font-light text-stone-900 mb-4">Sign in required</h1>
            <p className="text-sm text-stone-600">Please sign in to access settings.</p>
          </div>
        </div>
      </div>
    )
  }

  // Profile Tab Content
  const profileTabContent = (
    <div className="p-8 sm:p-12">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Profile</span>
        <div className="flex items-center gap-4">
          {isSaving && (
            <span className="text-xs text-stone-500 tracking-wide">Autosaving...</span>
          )}
          {showSaved && !isSaving && (
            <span className="text-xs text-green-700 tracking-wide animate-fadeOut">Saved</span>
          )}
          <button
            onClick={handleProfileSave}
            disabled={isSaving}
            className="text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save profile"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2 relative">
            <label className={`text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium transition-all duration-300 ${
              displayNameFocused || displayName ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            }`}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onFocus={() => setDisplayNameFocused(true)}
              onBlur={() => setDisplayNameFocused(false)}
              placeholder="Username, pseudonym, pen name, or nom de plume"
              className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-2 relative">
            <label className={`text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium transition-all duration-300 ${
              bioFocused || bio ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            }`}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onFocus={() => setBioFocused(true)}
              onBlur={() => setBioFocused(false)}
              placeholder="A few words about yourself"
              rows={3}
              className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:border-stone-900 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Social Links</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium">GitHub</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium">Twitter</label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/username"
                className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium">Website</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Footer Save Button */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <button
          onClick={handleProfileSave}
          disabled={isSaving}
          className="w-full py-2.5 text-xs tracking-[0.15em] uppercase font-medium text-stone-900 border border-stone-300 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )

  // Approach Tab Content
  const approachTabContent = (
    <div className="p-8 sm:p-12">
      <div className="mb-8">
        <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Approach</span>
      </div>
      <p className="text-sm text-stone-600 mb-8 leading-relaxed">
        What drives your ideas?
      </p>

      <div className="space-y-4">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => handlePersonaChange(persona.id)}
            className={`w-full text-left p-6 border transition-all ${
              selectedPersona === persona.id
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-stone-900 tracking-wide">{persona.name}</h3>
              <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                selectedPersona === persona.id
                  ? 'border-stone-900 bg-stone-900'
                  : 'border-stone-300'
              }`}>
                {selectedPersona === persona.id && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs text-stone-500 mb-3 tracking-wide">{persona.slogan}</p>
            <p className="text-xs text-stone-600 leading-relaxed">{persona.description}</p>
          </button>
        ))}
      </div>

      {isSaving && (
        <p className="text-xs text-stone-500 mt-6 tracking-wide">Autosaving...</p>
      )}
      {showSaved && !isSaving && (
        <p className="text-xs text-green-700 mt-6 tracking-wide animate-fadeOut">Saved</p>
      )}
    </div>
  )

  // Data & Privacy Tab Content
  const dataPrivacyTabContent = (
    <div className="p-8 sm:p-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Data & Privacy</span>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Control how long we keep your data and whether it's used for AI research
            </p>
          </div>
          {showTierSaved && !isSavingTier && (
            <span className="text-xs text-green-700 tracking-wide">Saved</span>
          )}
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 leading-relaxed text-pretty max-w-3xl">
          <strong>Alpha R&D:</strong> Your tier choice trains our RLHF system to understand privacy preferences. Research Contributors directly improve multi-agent AI safety.
        </div>
      </div>

      <div className="space-y-4">
        {/* Essential */}
        <button
          onClick={() => handleTierChange('privacy_essential')}
          disabled={isSavingTier}
          className={`w-full text-left p-6 border transition-all disabled:opacity-50 ${
            selectedTier === 'privacy_essential'
              ? 'border-stone-900 bg-stone-50'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-900 tracking-wide">Essential</h3>
                <p className="text-xs text-stone-500 mt-1">Maximum privacy</p>
              </div>
            </div>
            <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
              selectedTier === 'privacy_essential'
                ? 'border-stone-900 bg-stone-900'
                : 'border-stone-300'
            }`}>
              {selectedTier === 'privacy_essential' && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="text-xs text-stone-600 space-y-2 ml-8">
            <p><strong className="text-stone-900">Retention:</strong> 90 days · (anonymized after 30 days)</p>
            <p><strong className="text-stone-900">AI Training:</strong> Never used</p>
            <p><strong className="text-stone-900">Analytics:</strong> Minimal, for debugging only</p>
            <p className="text-stone-500 italic mt-3">Best for users who prioritize privacy above all else</p>
          </div>
        </button>

        {/* Standard */}
        <button
          onClick={() => handleTierChange('standard')}
          disabled={isSavingTier}
          className={`w-full text-left p-6 border transition-all disabled:opacity-50 ${
            selectedTier === 'standard'
              ? 'border-stone-900 bg-stone-50'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-900 tracking-wide">Standard</h3>
                <p className="text-xs text-stone-500 mt-1">Default · Recommended</p>
              </div>
            </div>
            <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
              selectedTier === 'standard'
                ? 'border-stone-900 bg-stone-900'
                : 'border-stone-300'
            }`}>
              {selectedTier === 'standard' && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="text-xs text-stone-600 space-y-2 ml-8">
            <p><strong className="text-stone-900">Retention:</strong> 2 years (anonymized after 90 days)</p>
            <p><strong className="text-stone-900">AI Training:</strong> Aggregated insights only</p>
            <p><strong className="text-stone-900">Analytics:</strong> UX analytics, interaction patterns</p>
            <p className="text-stone-500 italic mt-3">Best for users who want to help improve PS-LANG while maintaining privacy</p>
          </div>
        </button>

        {/* Research Contributor */}
        <button
          onClick={() => handleTierChange('research_contributor')}
          disabled={isSavingTier}
          className={`w-full text-left p-6 border transition-all disabled:opacity-50 ${
            selectedTier === 'research_contributor'
              ? 'border-stone-900 bg-stone-50'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-900 tracking-wide">Research Contributor</h3>
                <p className="text-xs text-stone-500 mt-1">Advanced · Opt-in benefits</p>
              </div>
            </div>
            <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
              selectedTier === 'research_contributor'
                ? 'border-stone-900 bg-stone-900'
                : 'border-stone-300'
            }`}>
              {selectedTier === 'research_contributor' && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="text-xs text-stone-600 space-y-2 ml-8">
            <p><strong className="text-stone-900">Retention:</strong> 5 years (anonymized after 90 days, aggregated after 2 years)</p>
            <p><strong className="text-stone-900">AI Training:</strong> Yes, used to train multi-agent models</p>
            <p><strong className="text-stone-900">Benefits:</strong> Early access · Research credits · Exclusive badge</p>
            <p className="text-stone-500 italic mt-3">Best for developers and researchers who want to advance multi-agent AI</p>
          </div>
        </button>
      </div>

      {isSavingTier && (
        <p className="text-xs text-stone-500 mt-6 tracking-wide">Saving...</p>
      )}

      <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-stone-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-stone-600 leading-relaxed">
            <p className="mb-2">
              You can change your data retention tier at any time. Changes take effect immediately.
            </p>
            <p>
              <Link href="/privacy#data-retention" className="text-stone-900 underline hover:no-underline">
                Learn more in our Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-stone-100 border border-stone-200 px-4 py-3 text-xs text-stone-700 leading-relaxed">
          <strong>Agentic UX in Action:</strong> This tier system uses reinforcement learning to optimize privacy controls. Your choices help us build better AI agents that respect user preferences.
        </div>
      </div>
    </div>
  )

  // Resources Tab Content
  const resourcesTabContent = (
    <div className="p-8 sm:p-12" data-ux-component="resource-cards" data-theme-version="v1.0-luxury-stationery" data-privacy="public" data-ps-lang-benchmark="settings-alpha-rlhf-v1">
      <div className="mb-8">
        <span className="text-xs tracking-[0.2em] text-stone-400 uppercase font-medium">Resources</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/privacy"
          className="group relative flex flex-col gap-3 p-6 bg-stone-50/50 border border-stone-200/60 hover:bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-300"
          data-ai-meta="legal-privacy"
        >
          <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">Legal</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-stone-900 font-light tracking-wide">Privacy Policy</span>
            <span className="text-stone-300 group-hover:text-stone-400 transition-colors text-xs">→</span>
          </div>
        </Link>
        <Link
          href="/terms"
          className="group relative flex flex-col gap-3 p-6 bg-stone-50/50 border border-stone-200/60 hover:bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-300"
          data-ai-meta="legal-terms"
        >
          <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">Legal</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-stone-900 font-light tracking-wide">Terms of Use</span>
            <span className="text-stone-300 group-hover:text-stone-400 transition-colors text-xs">→</span>
          </div>
        </Link>
        <a
          href={siteConfig.urls.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col gap-3 p-6 bg-stone-50/50 border border-stone-200/60 hover:bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-300"
          data-ai-meta="open-source-github"
        >
          <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium">Open Source</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-stone-900 font-light tracking-wide">GitHub</span>
            <span className="text-stone-300 group-hover:text-stone-400 transition-colors text-xs">↗</span>
          </div>
        </a>
      </div>
    </div>
  )

  // Cookies Tab Content
  const consentDate = cookiePrefs?.timestamp ? new Date(cookiePrefs.timestamp) : null

  const cookiesTabContent = (
    <div className="p-8 sm:p-12">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Cookie Preferences</span>
        {showCookieSaved && (
          <span className="text-xs text-green-700 tracking-wide animate-fadeOut">Saved</span>
        )}
      </div>

      {/* Current Status */}
      <div className="bg-stone-50 border border-stone-200 p-6 mb-8">
        <h3 className="text-sm font-medium text-stone-900 mb-4 tracking-wide">Current Status</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-stone-600">Cookie Consent:</span>
            <span className={`font-medium ${cookiePrefs?.status === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
              {cookiePrefs?.status === 'granted' ? 'Granted' : cookiePrefs?.status === 'denied' ? 'Denied' : 'Not Set'}
            </span>
          </div>
          {consentDate && (
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Last Updated:</span>
              <span className="text-stone-900 text-xs">
                {consentDate.toLocaleDateString()} at {consentDate.toLocaleTimeString()}
              </span>
            </div>
          )}
          {gpcDetected && (
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-stone-600">Global Privacy Control:</span>
              <span className="inline-flex items-center gap-1.5 text-stone-900 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Detected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Essential Cookies */}
      <div className="border border-stone-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-stone-900 tracking-wide">Essential Cookies</h3>
            <p className="text-xs text-stone-500 mt-1">Required for site functionality</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-stone-900 text-white tracking-wide">
            Always Active
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed text-pretty">
          These cookies are necessary for the website to function and cannot be disabled. They include session management, authentication, and security features.
        </p>
      </div>

      {/* Optional Cookies */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-medium text-stone-900 tracking-wide">Optional Cookies</h3>

        {/* Analytics */}
        <label className="flex items-start gap-4 p-6 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={granularCookiePrefs.analytics}
            onChange={(e) => setGranularCookiePrefs({ ...granularCookiePrefs, analytics: e.target.checked })}
            className="mt-1 w-5 h-5 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-stone-900">Analytics Cookies</span>
                <p className="text-xs text-stone-500 mt-0.5">Help us improve your experience</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide ${
                granularCookiePrefs.analytics ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
              }`}>
                {granularCookiePrefs.analytics ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-stone-600 mb-3 leading-relaxed text-pretty">
              Help us understand how you interact with our website by collecting and reporting information anonymously. We use Google Analytics for page view tracking, user engagement metrics, and traffic source analysis.
            </p>
          </div>
        </label>

        {/* Session Replay */}
        <label className="flex items-start gap-4 p-6 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={granularCookiePrefs.sessionReplay}
            onChange={(e) => setGranularCookiePrefs({ ...granularCookiePrefs, sessionReplay: e.target.checked })}
            className="mt-1 w-5 h-5 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-stone-900">Session Recording</span>
                <p className="text-xs text-stone-500 mt-0.5">Anonymized session replay</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide ${
                granularCookiePrefs.sessionReplay ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
              }`}>
                {granularCookiePrefs.sessionReplay ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-stone-600 mb-3 leading-relaxed text-pretty">
              Record anonymized sessions to improve UX and identify issues. We use PostHog with all sensitive data masked automatically and no PII captured in recordings.
            </p>
          </div>
        </label>

        {/* Performance */}
        <label className="flex items-start gap-4 p-6 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={granularCookiePrefs.performance}
            onChange={(e) => setGranularCookiePrefs({ ...granularCookiePrefs, performance: e.target.checked })}
            className="mt-1 w-5 h-5 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-stone-900">Performance Monitoring</span>
                <p className="text-xs text-stone-500 mt-0.5">Core Web Vitals tracking</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide ${
                granularCookiePrefs.performance ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
              }`}>
                {granularCookiePrefs.performance ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-stone-600 mb-3 leading-relaxed text-pretty">
              Track page load times, interaction delays, and layout stability to ensure optimal performance. Monitors Largest Contentful Paint, First Input Delay, and Cumulative Layout Shift.
            </p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200 mb-8">
        <button
          onClick={handleSaveGranularCookies}
          className="flex-1 px-6 py-3 bg-stone-900 text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-stone-800 transition-colors"
        >
          Save Preferences
        </button>
        <button
          onClick={handleGrantAllCookies}
          className="flex-1 px-6 py-3 border border-stone-300 text-stone-900 text-xs tracking-[0.15em] uppercase font-medium hover:border-stone-900 transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={handleRevokeAllCookies}
          className="flex-1 px-6 py-3 border border-stone-300 text-stone-900 text-xs tracking-[0.15em] uppercase font-medium hover:border-stone-900 transition-colors"
        >
          Decline All
        </button>
      </div>

      {/* Privacy Rights */}
      <div className="pt-6 border-t border-stone-200">
        <h3 className="text-sm font-medium text-stone-900 mb-3 tracking-wide">Your Privacy Rights</h3>
        <div className="text-sm text-stone-600 space-y-3 leading-relaxed">
          <p className="text-pretty">
            Under GDPR (Europe), CCPA/CPRA (California), and PIPEDA (Canada), you have the right to access your personal data, request data deletion, opt-out of data collection, and export your data in a portable format.
          </p>
          <p>
            <Link href="/privacy" className="text-stone-900 underline hover:no-underline">
              Read our full Privacy Policy
            </Link>
            {' '}for more information about how we handle your data.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-block mb-3">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Account</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight">
            Settings
          </h1>

          {/* Alpha Testing Notice */}
          <div className="mt-6 border border-stone-300 bg-stone-50/50 p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5">
                <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 max-w-3xl">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase font-medium">Alpha Testing Phase</span>
                  <span className="text-[9px] tracking-wider text-stone-400 uppercase">v0.2.4-alpha</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed text-pretty max-w-2xl">
                  PS-LANG is in alpha R&D with RLHF Agentic UX built in. Your interactions help train privacy-first multi-agent systems. Settings may evolve as we refine the platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Settings */}
        <Tabs
          tabs={[
            { id: 'profile', label: 'Profile', content: profileTabContent },
            { id: 'approach', label: 'Approach', content: approachTabContent },
            { id: 'privacy', label: 'Data & Privacy', content: dataPrivacyTabContent },
            { id: 'cookies', label: 'Cookies', content: cookiesTabContent },
            { id: 'resources', label: 'Resources', content: resourcesTabContent },
          ]}
          defaultTab="profile"
        />
      </div>
    </div>
  )
}
