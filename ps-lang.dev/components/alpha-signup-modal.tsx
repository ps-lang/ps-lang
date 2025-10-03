"use client"

import Link from 'next/link'
import { useState } from "react"
import { useSignUp } from '@clerk/nextjs'
import { motion, AnimatePresence } from "framer-motion"

interface AlphaSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AlphaSignupModal({ isOpen, onClose }: AlphaSignupModalProps) {
  const { signUp, setActive } = useSignUp()
  const [formData, setFormData] = useState({
    email: '',
    persona: 'solo_developer',
    githubUrl: '',
    interestedIn: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(value)
        ? prev.interestedIn.filter(item => item !== value)
        : [...prev.interestedIn, value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!signUp) {
        throw new Error('SignUp not initialized')
      }

      // Create signup with email only
      await signUp.create({
        emailAddress: formData.email,
        unsafeMetadata: {
          persona: formData.persona,
          githubUrl: formData.githubUrl,
          interestedIn: formData.interestedIn,
          alphaSignup: true,
          signupDate: new Date().toISOString(),
        }
      })

      // Send magic link to email
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_link',
        redirectUrl: `${window.location.origin}/verify-email`
      })

      // Track signup event with PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('alpha_signup_started', {
          persona: formData.persona,
          interested_in: formData.interestedIn,
          has_github: !!formData.githubUrl,
        })
      }

      setPendingVerification(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-stone-300 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-stone-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-block mb-2">
                      <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Alpha Testing</span>
                    </div>
                    <h2 className="text-2xl font-light text-stone-900 tracking-tight">
                      {pendingVerification ? 'Check Your Email' : 'Join Alpha Testing'}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
                {pendingVerification ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-light text-stone-900 mb-2">Check Your Email</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      We sent a magic link to <strong>{formData.email}</strong>
                    </p>
                    <p className="text-xs text-stone-500">
                      Click the link in your email to complete signup. You can close this window.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Get early access to PS-LANG and help shape the future of multi-agent context control.
                    </p>

                    <div>
                      <label htmlFor="email" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="persona" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        I am a... *
                      </label>
                      <select
                        id="persona"
                        name="persona"
                        value={formData.persona}
                        onChange={handleInputChange}
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                        required
                      >
                        <option value="solo_developer">Solo Developer</option>
                        <option value="researcher">Researcher</option>
                        <option value="creator">Creator / Writer</option>
                        <option value="analyst">Data Analyst</option>
                        <option value="generalist">Generalist</option>
                        <option value="explorer">Explorer / Learner</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="githubUrl" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        GitHub Profile <span className="text-stone-400 normal-case">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="githubUrl"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-wide text-stone-600 uppercase mb-3 font-medium">
                        Interested In
                      </label>
                      <div className="space-y-2.5">
                        {[
                          { value: 'multi_agent', label: 'Multi-agent workflows' },
                          { value: 'benchmarking', label: 'Benchmarking & testing' },
                          { value: 'privacy', label: 'Privacy-first AI tools' },
                          { value: 'journaling', label: 'AI workflow journaling' },
                          { value: 'mcp_integration', label: 'MCP integration' },
                        ].map(item => (
                          <label key={item.value} className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.interestedIn.includes(item.value)}
                              onChange={() => handleCheckboxChange(item.value)}
                              className="w-4 h-4 border-stone-300 text-stone-900 focus:ring-stone-900 rounded"
                            />
                            <span className="text-sm text-stone-600">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 text-white font-light text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-mono tracking-wide"
                      style={{ backgroundColor: '#C5B9AA' }}
                    >
                      {isSubmitting ? "Creating Account..." : "Sign Up for Alpha →"}
                    </button>

                    <p className="text-xs text-stone-500 text-center">
                      By signing up, you agree to our{' '}
                      <Link href="/terms" className="underline hover:text-stone-900">Terms</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="underline hover:text-stone-900">Privacy Policy</Link>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
