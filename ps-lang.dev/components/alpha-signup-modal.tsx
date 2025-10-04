"use client"

import Link from 'next/link'
import { useState } from "react"
import { useSignUp, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface AlphaSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AlphaSignupModal({ isOpen, onClose }: AlphaSignupModalProps) {
  const { signUp, setActive } = useSignUp()
  const { user, isSignedIn } = useUser()
  const recordAlphaSignup = useMutation(api.alphaSignups.recordSignup)
  const [formData, setFormData] = useState({
    email: user?.primaryEmailAddress?.emailAddress || '',
    persona: 'researcher',
    githubUrl: '',
    interestedIn: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

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
      // If user is already signed in, just save their preferences to Convex
      if (isSignedIn && user) {
        await recordAlphaSignup({
          email: formData.email,
          persona: formData.persona,
          githubUrl: formData.githubUrl || undefined,
          interestedIn: formData.interestedIn,
          clerkUserId: user.id,
        })

        // Track event
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('alpha_signup_completed', {
            persona: formData.persona,
            interested_in: formData.interestedIn,
            has_proj: !!formData.githubUrl,
          })
        }

        setIsSuccess(true)
        return
      }

      // If not signed in, do full Clerk signup flow
      if (!signUp) {
        throw new Error('SignUp not initialized')
      }

      // Create signup with email only
      const clerkSignup = await signUp.create({
        emailAddress: formData.email,
        unsafeMetadata: {
          persona: formData.persona,
          githubUrl: formData.githubUrl,
          interestedIn: formData.interestedIn,
          alphaSignup: true,
          signupDate: new Date().toISOString(),
        }
      })

      // Save to Convex database
      await recordAlphaSignup({
        email: formData.email,
        persona: formData.persona,
        githubUrl: formData.githubUrl || undefined,
        interestedIn: formData.interestedIn,
        clerkUserId: clerkSignup.createdUserId || undefined,
      })

      // Send verification code to email
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code'
      })

      // Track signup event with PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('alpha_signup_started', {
          persona: formData.persona,
          interested_in: formData.interestedIn,
          has_proj: !!formData.githubUrl,
        })
      }

      setPendingVerification(true)
    } catch (err: any) {
      console.error('Alpha signup error:', err)
      setError(err.errors?.[0]?.message || err.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError("")

    // PSL Diagnostic - Click 1 or 2
    const clickNumber = (window as any).__verificationClickCount || 0
    ;(window as any).__verificationClickCount = clickNumber + 1

    const diagnosticStart = {
      click: clickNumber + 1,
      timestamp: new Date().toISOString(),
      email: formData.email,
      code: verificationCode,
      signUpExists: !!signUp,
      signUpStatus: signUp?.status,
      createdSessionId: signUp?.createdSessionId,
      createdUserId: signUp?.createdUserId,
    }

    console.log('🔍 PSL DIAGNOSTIC - VERIFICATION START:', JSON.stringify(diagnosticStart, null, 2))

    try {
      if (!signUp) {
        throw new Error('SignUp not initialized')
      }

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      const diagnosticSuccess = {
        click: clickNumber + 1,
        result: 'SUCCESS',
        status: completeSignUp.status,
        createdSessionId: completeSignUp.createdSessionId,
        createdUserId: completeSignUp.createdUserId,
        hasSession: !!completeSignUp.createdSessionId,
        hasUserId: !!completeSignUp.createdUserId,
      }

      console.log('✅ PSL DIAGNOSTIC - VERIFICATION SUCCESS:', JSON.stringify(diagnosticSuccess, null, 2))

      // Handle both 'complete' and 'missing_requirements' status
      // For alpha signups, we don't require password - email verification is enough
      if (completeSignUp.status === 'complete' || completeSignUp.status === 'missing_requirements') {
        let userId = completeSignUp.createdUserId ||
                     (completeSignUp as any).userId ||
                     (signUp as any).createdUserId ||
                     (signUp as any).userId

        console.log('🔍 PSL DIAGNOSTIC - FULL SIGNUP OBJECT:', JSON.stringify({
          completeSignUpKeys: Object.keys(completeSignUp),
          signUpKeys: Object.keys(signUp || {}),
          completeSignUp_createdUserId: completeSignUp.createdUserId,
          completeSignUp_userId: (completeSignUp as any).userId,
          signUp_createdUserId: (signUp as any)?.createdUserId,
          signUp_userId: (signUp as any)?.userId,
        }, null, 2))

        // If status is missing_requirements and no userId, try to get it from Clerk backend
        if (completeSignUp.status === 'missing_requirements' && !userId) {
          console.log('🔧 PSL DIAGNOSTIC - ATTEMPTING TO FETCH USER ID FROM BACKEND')

          try {
            // Call our backend API to find the user by email
            const response = await fetch(`/api/admin/diagnose-user?email=${encodeURIComponent(formData.email)}`)
            const diagnosis = await response.json()

            console.log('🔍 PSL DIAGNOSTIC - BACKEND USER LOOKUP:', JSON.stringify({
              found: diagnosis.clerk?.found,
              userId: diagnosis.clerk?.userId,
              email: diagnosis.clerk?.email,
            }, null, 2))

            if (diagnosis.clerk?.found && diagnosis.clerk?.userId) {
              userId = diagnosis.clerk.userId
              console.log('✅ PSL DIAGNOSTIC - FOUND USER ID FROM BACKEND:', userId)
            }
          } catch (backendErr: any) {
            console.error('❌ PSL DIAGNOSTIC - BACKEND LOOKUP ERROR:', backendErr)
            // Continue anyway - we'll handle the missing userId gracefully
          }
        }

        // Set the session active if available
        if (completeSignUp.createdSessionId) {
          await setActive({ session: completeSignUp.createdSessionId })
        }

        console.log('🔍 PSL DIAGNOSTIC - USER ID CHECK:', JSON.stringify({
          fromCompleteSignUp_createdUserId: completeSignUp.createdUserId,
          fromCompleteSignUp_userId: (completeSignUp as any).userId,
          fromSignUpObject_createdUserId: (signUp as any)?.createdUserId,
          fromSignUpObject_userId: (signUp as any)?.userId,
          usingUserId: userId,
        }, null, 2))

        // Update Convex with clerkUserId if we have one
        if (userId) {
          const convexResult = await recordAlphaSignup({
            email: formData.email,
            persona: formData.persona,
            githubUrl: formData.githubUrl || undefined,
            interestedIn: formData.interestedIn,
            clerkUserId: userId,
          })

          console.log('💾 PSL DIAGNOSTIC - CONVEX SAVE:', JSON.stringify({
            click: clickNumber + 1,
            clerkUserId: userId,
            convexResult: convexResult,
          }, null, 2))
        } else {
          console.warn('⚠️ No user ID available to save to Convex')
        }

        setIsSuccess(true)

        // Track successful verification
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('alpha_signup_completed', {
            persona: formData.persona,
            interested_in: formData.interestedIn,
          })
        }
      }
    } catch (err: any) {
      const errorMsg = err.errors?.[0]?.message || err.message || 'Invalid verification code. Please try again.'

      const diagnosticError = {
        click: clickNumber + 1,
        result: 'ERROR',
        errorMessage: errorMsg,
        errorType: err.errors?.[0]?.code || 'unknown',
        fullError: err,
      }

      console.error('❌ PSL DIAGNOSTIC - VERIFICATION ERROR:', JSON.stringify(diagnosticError, null, 2))

      // Check if already verified
      if (errorMsg.toLowerCase().includes('already verified') ||
          errorMsg.toLowerCase().includes('already_verified') ||
          errorMsg.toLowerCase().includes('is verified')) {
        // User is already verified, try to activate session
        try {
          if (setActive && signUp?.createdSessionId) {
            await setActive({ session: signUp.createdSessionId })
          }
          console.log('🔄 PSL DIAGNOSTIC - ALREADY VERIFIED FALLBACK:', JSON.stringify({
            click: clickNumber + 1,
            action: 'showing_success_anyway',
          }, null, 2))
          setIsSuccess(true)
        } catch (activationErr) {
          console.error('Session activation error:', activationErr)
          // Even if activation fails, show success since they're verified
          setIsSuccess(true)
        }
      } else {
        setError(errorMsg)
        setVerificationCode("") // Clear the code on error
      }
    } finally {
      setIsVerifying(false)
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
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-light text-stone-900 mb-2">Thanks for Your Interest!</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      You're on the waitlist. Check your email for updates on early access.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 text-white font-light text-sm hover:opacity-90 transition-opacity font-mono tracking-wide"
                      style={{ backgroundColor: '#C5B9AA' }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : pendingVerification ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-light text-stone-900 mb-2">Check Your Email</h3>
                      <p className="text-sm text-stone-600">
                        We sent a verification code to <strong>{formData.email}</strong>
                      </p>
                    </div>

                    <form onSubmit={handleVerification} className="space-y-4">
                      <div>
                        <label htmlFor="verificationCode" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="verificationCode"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono text-center text-lg tracking-widest"
                          maxLength={6}
                          required
                          autoFocus
                        />
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isVerifying || verificationCode.length < 6}
                        className="w-full px-6 py-4 text-white font-light text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-mono tracking-wide"
                        style={{ backgroundColor: '#C5B9AA' }}
                      >
                        {isVerifying ? "Verifying... Please wait" : "Verify Email →"}
                      </button>

                      <p className="text-xs text-stone-500 text-center mt-2">
                        Didn't receive a code? Check your spam folder.
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <p className="text-sm text-stone-600 leading-relaxed max-w-md">
                      Get early access to PS-LANG Journal and help shape multi-agent context&nbsp;control.
                    </p>

                    {!isSignedIn && (
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
                    )}

                    <div>
                      <label htmlFor="githubUrl" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        Organization <span className="text-stone-400 normal-case">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="githubUrl"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        placeholder="Company or project name"
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="persona" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        What drives your ideas? *
                      </label>
                      <select
                        id="persona"
                        name="persona"
                        value={formData.persona}
                        onChange={handleInputChange}
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                        required
                      >
                        <option value="researcher">Research & experimentation</option>
                        <option value="solo_developer">Building things quick</option>
                        <option value="creator">Content & creative work</option>
                        <option value="analyst">Data analysis & insights</option>
                        <option value="generalist">General productivity</option>
                        <option value="explorer">Learning & exploration</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs tracking-wide text-stone-600 uppercase mb-3 font-medium">
                        Interested In
                      </label>
                      <div className="space-y-2.5">
                        {[
                          { value: 'multi_agent', label: 'Multi-Agent Workflows' },
                          { value: 'benchmarking', label: 'Benchmarking & Testing' },
                          { value: 'privacy', label: 'Privacy-First AI Tools' },
                          { value: 'journaling', label: 'Solo Dev Journaling' },
                          { value: 'mcp_integration', label: 'MCP Integration' },
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
                      <div className="p-3 bg-red-50 border border-red-200">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
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
                      <Link href="/terms" onClick={onClose} className="underline hover:text-stone-900">Terms</Link>
                      {' '}and{' '}
                      <Link href="/privacy" onClick={onClose} className="underline hover:text-stone-900">Privacy Policy</Link>
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
