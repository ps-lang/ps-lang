/**
 * Cryptographic Key Generation & Management
 *
 * Provides RSA key pair generation and management for user secrets encryption.
 * Private keys are encrypted with user's password before storage.
 */

export interface KeyPair {
  publicKey: string
  privateKey: string
  createdAt: string
  keyId: string
}

export interface StoredKeyPair {
  publicKey: string
  encryptedPrivateKey: string // Encrypted with user password
  keyId: string
  createdAt: string
  algorithm: string
}

/**
 * Generate RSA-OAEP key pair for encryption
 */
export async function generateKeyPair(): Promise<KeyPair> {
  try {
    // Generate RSA key pair (2048-bit for good security/performance balance)
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: 'SHA-256',
      },
      true, // extractable
      ['encrypt', 'decrypt']
    )

    // Export public key to PEM format
    const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const publicKeyPem = arrayBufferToPem(publicKeyBuffer, 'PUBLIC KEY')

    // Export private key to PEM format
    const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    const privateKeyPem = arrayBufferToPem(privateKeyBuffer, 'PRIVATE KEY')

    // Generate unique key ID
    const keyId = await generateKeyId(publicKeyBuffer)

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      createdAt: new Date().toISOString(),
      keyId,
    }
  } catch (error) {
    console.error('Error generating key pair:', error)
    throw new Error('Failed to generate key pair')
  }
}

/**
 * Encrypt private key with user password before storage
 */
export async function encryptPrivateKey(privateKeyPem: string, password: string): Promise<string> {
  try {
    // Derive encryption key from password using PBKDF2
    const passwordKey = await deriveKeyFromPassword(password)

    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    // Encrypt private key
    const encoder = new TextEncoder()
    const privateKeyData = encoder.encode(privateKeyPem)

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      passwordKey,
      privateKeyData
    )

    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)

    // Return base64 encoded
    return arrayBufferToBase64(combined)
  } catch (error) {
    console.error('Error encrypting private key:', error)
    throw new Error('Failed to encrypt private key')
  }
}

/**
 * Decrypt private key with user password
 */
export async function decryptPrivateKey(encryptedPrivateKey: string, password: string): Promise<string> {
  try {
    // Decode base64
    const combined = base64ToArrayBuffer(encryptedPrivateKey)

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encryptedData = combined.slice(12)

    // Derive decryption key from password
    const passwordKey = await deriveKeyFromPassword(password)

    // Decrypt
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      passwordKey,
      encryptedData
    )

    // Convert to string
    const decoder = new TextDecoder()
    return decoder.decode(decryptedData)
  } catch (error) {
    console.error('Error decrypting private key:', error)
    throw new Error('Failed to decrypt private key - wrong password?')
  }
}

/**
 * Derive encryption key from password using PBKDF2
 */
async function deriveKeyFromPassword(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)

  // Import password as key material
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  // Use fixed salt for now (in production, store unique salt per user)
  const salt = encoder.encode('ps-lang-salt-v1-change-in-production')

  // Derive AES-GCM key
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Generate unique key ID from public key
 */
async function generateKeyId(publicKeyBuffer: ArrayBuffer): Promise<string> {
  const hash = await window.crypto.subtle.digest('SHA-256', publicKeyBuffer)
  return arrayBufferToHex(hash).slice(0, 16) // First 16 chars of hash
}

/**
 * Convert ArrayBuffer to PEM format
 */
function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const base64 = arrayBufferToBase64(new Uint8Array(buffer))
  const pemBody = base64.match(/.{1,64}/g)?.join('\n') || ''
  return `-----BEGIN ${label}-----\n${pemBody}\n-----END ${label}-----`
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = ''
  const len = buffer.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
}

/**
 * Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * Convert ArrayBuffer to hex string
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Encrypt data with public key
 */
export async function encryptWithPublicKey(data: string, publicKeyPem: string): Promise<string> {
  try {
    // Import public key
    const publicKey = await importPublicKey(publicKeyPem)

    // Encrypt data
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      dataBuffer
    )

    return arrayBufferToBase64(new Uint8Array(encryptedBuffer))
  } catch (error) {
    console.error('Error encrypting with public key:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt data with private key
 */
export async function decryptWithPrivateKey(encryptedData: string, privateKeyPem: string): Promise<string> {
  try {
    // Import private key
    const privateKey = await importPrivateKey(privateKeyPem)

    // Decrypt data
    const encryptedBuffer = base64ToArrayBuffer(encryptedData)

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedBuffer
    )

    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error('Error decrypting with private key:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Import public key from PEM format
 */
async function importPublicKey(publicKeyPem: string): Promise<CryptoKey> {
  const pemBody = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s/g, '')

  const binaryDer = atob(pemBody)
  const len = binaryDer.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryDer.charCodeAt(i)
  }

  return await window.crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  )
}

/**
 * Import private key from PEM format
 */
async function importPrivateKey(privateKeyPem: string): Promise<CryptoKey> {
  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')

  const binaryDer = atob(pemBody)
  const len = binaryDer.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryDer.charCodeAt(i)
  }

  return await window.crypto.subtle.importKey(
    'pkcs8',
    bytes.buffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['decrypt']
  )
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain number' }
  }
  return { valid: true }
}
