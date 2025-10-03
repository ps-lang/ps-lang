'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { getUserRole, getRoleDisplayName, getRoleBadgeColor } from '@/lib/roles'
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey, validatePassword } from '@/lib/crypto-keys'
import type { KeyPair, StoredKeyPair } from '@/lib/crypto-keys'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isSignedIn } = useUser()
  const userRole = getUserRole(user)

  // State
  const [keyPairs, setKeyPairs] = useState<StoredKeyPair[]>([])
  const [generating, setGenerating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState<StoredKeyPair | null>(null)
  const [unlockPassword, setUnlockPassword] = useState('')
  const [unlockedPrivateKey, setUnlockedPrivateKey] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Check role access
  const hasAccess = userRole === 'super_admin' || userRole === 'admin'

  // Load keys from localStorage
  useEffect(() => {
    if (isSignedIn && user && hasAccess) {
      const storedKeys = localStorage.getItem(`ps-lang-keys-${user.id}`)
      if (storedKeys) {
        setKeyPairs(JSON.parse(storedKeys))
      }
    }
  }, [isSignedIn, user, hasAccess])

  // Generate new key pair
  const handleGenerateKeys = async () => {
    if (!password || !confirmPassword) {
      setPasswordError('Please enter password')
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    const validation = validatePassword(password)
    if (!validation.valid) {
      setPasswordError(validation.error || 'Invalid password')
      return
    }

    setGenerating(true)
    setPasswordError('')

    try {
      // Generate key pair
      const keyPair = await generateKeyPair()

      // Encrypt private key with password
      const encryptedPrivateKey = await encryptPrivateKey(keyPair.privateKey, password)

      // Create stored key pair
      const storedKeyPair: StoredKeyPair = {
        publicKey: keyPair.publicKey,
        encryptedPrivateKey,
        keyId: keyPair.keyId,
        createdAt: keyPair.createdAt,
        algorithm: 'RSA-OAEP-2048',
      }

      // Save to localStorage
      const newKeyPairs = [...keyPairs, storedKeyPair]
      setKeyPairs(newKeyPairs)
      localStorage.setItem(`ps-lang-keys-${user?.id}`, JSON.stringify(newKeyPairs))

      // Track in PostHog
      if (window.posthog) {
        window.posthog.capture('key_pair_generated', {
          key_id: keyPair.keyId,
          algorithm: 'RSA-OAEP-2048',
          role: userRole,
        })
      }

      // Reset form
      setPassword('')
      setConfirmPassword('')
      setShowCreateModal(false)

      alert('Key pair generated successfully! Keep your password safe - you\'ll need it to unlock your private key.')
    } catch (error) {
      console.error('Error generating keys:', error)
      alert('Failed to generate keys. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // Unlock private key
  const handleUnlockKey = async (keyPair: StoredKeyPair) => {
    if (!unlockPassword) {
      alert('Please enter password')
      return
    }

    try {
      const privateKey = await decryptPrivateKey(keyPair.encryptedPrivateKey, unlockPassword)
      setUnlockedPrivateKey(privateKey)
      setSelectedKey(keyPair)
      setUnlockPassword('')
    } catch (error) {
      alert('Wrong password or corrupted key')
    }
  }

  // Copy to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  // Delete key pair
  const handleDeleteKey = (keyId: string) => {
    if (!confirm('Are you sure? This cannot be undone. Make sure you have a backup!')) {
      return
    }

    const newKeyPairs = keyPairs.filter(k => k.keyId !== keyId)
    setKeyPairs(newKeyPairs)
    localStorage.setItem(`ps-lang-keys-${user?.id}`, JSON.stringify(newKeyPairs))

    if (selectedKey?.keyId === keyId) {
      setSelectedKey(null)
      setUnlockedPrivateKey(null)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="paper-card p-8 text-center">
            <h1 className="font-editorial text-2xl font-bold text-ink mb-4">Sign in required</h1>
            <p className="font-typewriter text-ink-light">Please sign in to access your dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="paper-card p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="font-editorial text-2xl font-bold text-ink mb-4">
              Alpha Testing Feature
            </h1>
            <p className="font-typewriter text-ink-light mb-2">
              Encryption dashboard is currently available to admins only.
            </p>
            <p className="font-typewriter text-sm text-ink-light">
              Your role: <span className={`px-2 py-1 rounded-full border ${getRoleBadgeColor(userRole)}`}>
                {getRoleDisplayName(userRole)}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="paper-card stacked-papers p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-editorial text-3xl font-bold text-ink mb-2">
                Encryption Dashboard
              </h1>
              <p className="font-typewriter text-ink-light mb-2">
                Generate and manage your encryption keys
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full border font-typewriter text-xs ${getRoleBadgeColor(userRole)}`}>
                  {getRoleDisplayName(userRole)}
                </span>
                <span className="font-typewriter text-xs text-ink-light">• Alpha Testing Access</span>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-stone-900 text-white font-typewriter text-sm rounded-lg hover:bg-stone-800 transition-colors"
            >
              + Generate Key Pair
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="paper-card p-6 mb-6 bg-blue-50 border-blue-200">
          <h2 className="font-typewriter font-bold text-blue-900 text-sm mb-2">
            🔐 Your Secrets Stay With You
          </h2>
          <ul className="font-typewriter text-xs text-blue-800 space-y-1">
            <li>• Private keys are encrypted with YOUR password (not stored on our servers)</li>
            <li>• We cannot recover your keys if you forget your password</li>
            <li>• Download and backup your keys securely</li>
            <li>• Public keys can be shared safely - private keys must remain secret</li>
          </ul>
        </div>

        {/* Key Pairs List */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {keyPairs.length === 0 ? (
            <div className="md:col-span-2 paper-card p-12 text-center">
              <div className="text-6xl mb-4">🔑</div>
              <h2 className="font-editorial text-xl font-bold text-ink mb-2">
                No keys yet
              </h2>
              <p className="font-typewriter text-sm text-ink-light mb-4">
                Generate your first encryption key pair to start securing your secrets
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-stone-900 text-white font-typewriter text-sm rounded-lg hover:bg-stone-800 transition-colors"
              >
                Generate Key Pair
              </button>
            </div>
          ) : (
            keyPairs.map((keyPair) => (
              <div key={keyPair.keyId} className="paper-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-typewriter font-bold text-ink text-sm mb-1">
                      Key ID: {keyPair.keyId}
                    </h3>
                    <p className="font-typewriter text-xs text-ink-light">
                      {keyPair.algorithm} • Created {new Date(keyPair.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(keyPair.keyId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    title="Delete key"
                  >
                    🗑️
                  </button>
                </div>

                {/* Public Key */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-typewriter text-xs text-ink-light font-bold">
                      Public Key (shareable)
                    </label>
                    <button
                      onClick={() => handleCopy(keyPair.publicKey, `public-${keyPair.keyId}`)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {copied === `public-${keyPair.keyId}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-stone-100 border border-stone-200 rounded p-2 font-mono text-xs text-stone-600 overflow-x-auto max-h-24 overflow-y-auto">
                    {keyPair.publicKey}
                  </div>
                </div>

                {/* Private Key (locked) */}
                <div>
                  <label className="font-typewriter text-xs text-ink-light font-bold block mb-2">
                    Private Key (password protected)
                  </label>
                  {selectedKey?.keyId === keyPair.keyId && unlockedPrivateKey ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-green-600">🔓 Unlocked</span>
                        <button
                          onClick={() => handleCopy(unlockedPrivateKey, `private-${keyPair.keyId}`)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {copied === `private-${keyPair.keyId}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-stone-100 border border-stone-200 rounded p-2 font-mono text-xs text-stone-600 overflow-x-auto max-h-24 overflow-y-auto">
                        {unlockedPrivateKey}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedKey(null)
                          setUnlockedPrivateKey(null)
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-800"
                      >
                        Lock Private Key
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Enter password to unlock"
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlockKey(keyPair)}
                      />
                      <button
                        onClick={() => handleUnlockKey(keyPair)}
                        className="px-4 py-2 bg-stone-900 text-white text-xs rounded hover:bg-stone-800"
                      >
                        Unlock
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Section */}
        <div className="paper-card p-6">
          <h2 className="font-typewriter font-bold text-ink mb-4">How to use your keys</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                1️⃣ Generate Keys
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                Create a key pair with a strong password. You'll get a public key (shareable) and a private key (secret).
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                2️⃣ Encrypt Secrets
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                Use your public key to encrypt sensitive data. Only your private key can decrypt it.
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                3️⃣ Backup Keys
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                Download and securely store your keys. We cannot recover them if you lose your password.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="font-editorial text-2xl font-bold text-ink mb-4">
              Generate Key Pair
            </h2>
            <p className="font-typewriter text-sm text-ink-light mb-6">
              Create a new RSA-2048 encryption key pair. Choose a strong password to protect your private key.
            </p>

            <div className="space-y-4">
              <div>
                <label className="font-typewriter text-sm text-ink font-bold block mb-2">
                  Password (min 12 chars, uppercase, lowercase, number)
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm"
                  placeholder="Enter strong password"
                />
              </div>

              <div>
                <label className="font-typewriter text-sm text-ink font-bold block mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm"
                  placeholder="Re-enter password"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span className="font-typewriter text-xs text-ink-light">Show password</span>
              </label>

              {passwordError && (
                <p className="font-typewriter text-xs text-red-600">{passwordError}</p>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="font-typewriter text-xs text-yellow-800">
                  ⚠️ <strong>Important:</strong> We cannot recover your password. Write it down and store it securely!
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setPassword('')
                  setConfirmPassword('')
                  setPasswordError('')
                }}
                className="flex-1 px-4 py-2 bg-stone-200 text-stone-700 font-typewriter text-sm rounded-lg hover:bg-stone-300 transition-colors"
                disabled={generating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateKeys}
                disabled={generating}
                className="flex-1 px-4 py-2 bg-stone-900 text-white font-typewriter text-sm rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Keys'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
