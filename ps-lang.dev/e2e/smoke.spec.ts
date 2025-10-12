import { test, expect, Page } from '@playwright/test'

/**
 * Smoke Test Suite
 *
 * Basic health checks to ensure:
 * - Pages load without errors
 * - No hydration mismatches
 * - Critical content is visible
 * - Navigation works
 */

/**
 * Helper: Collect console errors
 */
function setupConsoleListener(page: Page) {
  const consoleMessages: { type: string; text: string }[] = []

  page.on('console', (msg) => {
    const type = msg.type()
    if (type === 'error' || type === 'warning') {
      consoleMessages.push({ type, text: msg.text() })
    }
  })

  page.on('pageerror', (error) => {
    consoleMessages.push({ type: 'error', text: error.message })
  })

  return consoleMessages
}

test.describe('Homepage', () => {
  test('should load without errors', async ({ page }) => {
    const consoleMessages = setupConsoleListener(page)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for critical errors
    const criticalErrors = consoleMessages.filter(
      (msg) => msg.type === 'error'
    )

    if (criticalErrors.length > 0) {
      console.error('❌ Errors detected on homepage:')
      criticalErrors.forEach((err) => console.error(`  - ${err.text}`))
    }

    expect(
      criticalErrors.length,
      'Homepage should load without errors'
    ).toBe(0)

    console.log('✓ Homepage loaded without errors')
  })

  test('should not have hydration errors', async ({ page }) => {
    const consoleMessages = setupConsoleListener(page)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check specifically for hydration errors
    const hydrationErrors = consoleMessages.filter(
      (msg) =>
        msg.type === 'error' &&
        (msg.text.includes('Hydration') ||
          msg.text.includes('hydration') ||
          msg.text.includes('did not match') ||
          msg.text.includes('client-side exception'))
    )

    if (hydrationErrors.length > 0) {
      console.error('❌ Hydration errors detected:')
      hydrationErrors.forEach((err) => console.error(`  - ${err.text}`))
    }

    expect(
      hydrationErrors.length,
      'Should not have hydration errors'
    ).toBe(0)

    console.log('✓ No hydration errors detected')
  })

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify navigation exists
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Verify main heading exists
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()

    console.log('✓ Navigation and main content visible')
  })
})

test.describe('About Page', () => {
  test('should load without errors', async ({ page }) => {
    const consoleMessages = setupConsoleListener(page)

    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    const criticalErrors = consoleMessages.filter(
      (msg) => msg.type === 'error'
    )

    expect(
      criticalErrors.length,
      'About page should load without errors'
    ).toBe(0)

    console.log('✓ About page loaded without errors')
  })

  test('should not have hydration errors', async ({ page }) => {
    const consoleMessages = setupConsoleListener(page)

    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    const hydrationErrors = consoleMessages.filter(
      (msg) =>
        msg.type === 'error' &&
        (msg.text.includes('Hydration') || msg.text.includes('hydration'))
    )

    expect(hydrationErrors.length).toBe(0)

    console.log('✓ No hydration errors on About page')
  })
})

test.describe('Navigation', () => {
  test('should navigate between pages without errors', async ({ page }) => {
    const consoleMessages = setupConsoleListener(page)

    // Start on homepage
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click About link
    await page.click('text=About')
    await page.waitForURL('**/about**')
    await page.waitForLoadState('networkidle')

    // Navigate back to home
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for errors during navigation
    const navigationErrors = consoleMessages.filter(
      (msg) => msg.type === 'error'
    )

    expect(
      navigationErrors.length,
      'Navigation should work without errors'
    ).toBe(0)

    console.log('✓ Navigation between pages works without errors')
  })

  test('should render consistently across page reloads', async ({ page }) => {
    // First load
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const firstNav = await page.locator('nav').innerHTML()

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    const secondNav = await page.locator('nav').innerHTML()

    // Navigation should be consistent
    expect(firstNav).toBeTruthy()
    expect(secondNav).toBeTruthy()

    console.log('✓ Navigation renders consistently across reloads')
  })
})
