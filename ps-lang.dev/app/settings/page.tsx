'use client'

import { useUser, SignOutButton } from '@clerk/nextjs'
import { getUserRole, getRoleDisplayName, getRoleBadgeColor } from '@/lib/roles'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const PERSONAS = [
  { id: 'explorer', name: 'Explorer', slogan: 'Discover More · Learn As I Go', description: 'Let the system adapt to your style over time' },
  { id: 'solo_developer', name: 'Solo Developer', slogan: 'Ship Fast · Build Better · Own Your Stack', description: 'You ship code, iterate fast, and own your infrastructure' },
  { id: 'researcher', name: 'Researcher', slogan: 'Think Deep · Test Everything · Question More', description: 'You analyze thoroughly, validate assumptions, and seek truth' },
  { id: 'creator', name: 'Creator', slogan: 'Write More · Create Daily · Share Freely', description: 'You write, design, and create content that inspires others' },
  { id: 'analyst', name: 'Analyst', slogan: 'Measure Twice · Cut Once · Data-Driven', description: 'You optimize metrics, track performance, and make data-backed decisions' },
  { id: 'generalist', name: 'Generalist', slogan: 'Learn Everything · Master Anything · Stay Curious', description: 'You explore broadly, adapt quickly, and connect the dots' },
  { id: 'prefer_not_to_say', name: 'Prefer not to say', slogan: 'Privacy First · Keep It Simple', description: 'Keep your preferences private' },
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
        </div>

        {/* Profile */}
        <div className="border border-stone-300 bg-white p-8 sm:p-12 mb-6">
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
                <span className="text-xs text-stone-400 italic">Coming Soon</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 opacity-50 pointer-events-none">
                <div>
                  <label className="text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium">GitHub</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    disabled
                    className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-stone-50 focus:border-stone-900 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium">Twitter</label>
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/username"
                    disabled
                    className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-stone-50 focus:border-stone-900 focus:outline-none transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs tracking-wide text-stone-600 uppercase block mb-2 font-medium">Website</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    disabled
                    className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-stone-50 focus:border-stone-900 focus:outline-none transition-colors"
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

        {/* Approach */}
        <div className="border border-stone-300 bg-white p-8 sm:p-12 mb-6">
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

        {/* Quick Links */}
        <div className="border border-stone-300 bg-white p-8 sm:p-12">
          <div className="mb-8">
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Resources</span>
          </div>
          <div className="space-y-4">
            <Link
              href="/privacy"
              className="block text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="block text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Terms of Use →
            </Link>
            <a
              href="https://github.com/PS-Lang/ps-lang"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              GitHub Repository ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
