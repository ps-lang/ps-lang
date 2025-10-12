/**
 * Typography Utilities
 *
 * Utilities for preventing widows, orphans, and awkward text wrapping
 */

/**
 * Prevents widow words (single word on last line) by adding non-breaking space
 * before the last word in a string.
 *
 * @example
 * preventWidow("Settings may evolve as we refine the platform.")
 * // Returns: "Settings may evolve as we refine the\u00A0platform."
 */
export function preventWidow(text: string): string {
  // Find the last space in the text
  const lastSpaceIndex = text.lastIndexOf(' ')

  if (lastSpaceIndex === -1) {
    // No space found, return as-is
    return text
  }

  // Replace the last space with a non-breaking space
  return text.substring(0, lastSpaceIndex) + '\u00A0' + text.substring(lastSpaceIndex + 1)
}

/**
 * Prevents orphans by keeping the last N words together on the same line
 *
 * @param text - The text to process
 * @param wordCount - Number of words to keep together (default: 2)
 */
export function preventOrphan(text: string, wordCount: number = 2): string {
  const words = text.split(' ')

  if (words.length <= wordCount) {
    // Not enough words to prevent orphan
    return text
  }

  // Join all but the last N words normally
  const mainText = words.slice(0, -wordCount).join(' ')
  // Join the last N words with non-breaking spaces
  const protectedWords = words.slice(-wordCount).join('\u00A0')

  return mainText + ' ' + protectedWords
}

/**
 * Balances text wrapping using CSS text-wrap: balance
 * This is a CSS-only solution that works in modern browsers
 *
 * Usage: Add this class to your text elements
 */
export const balancedTextClass = 'text-wrap-balance'

/**
 * Pretty text wrapping using CSS text-wrap: pretty
 * This prevents orphans and improves line breaking
 *
 * Usage: Add this class to your text elements
 */
export const prettyTextClass = 'text-wrap-pretty'
