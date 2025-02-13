import { test, expect } from '@playwright/test'

import { TOTAL_HORSE_COUNT } from '../src/constants/horse.js'

test.describe('Horse Racing Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the application and display initial state', async ({ page }) => {
    // Check header
    await expect(page.getByTestId('app-header')).toBeVisible()

    // Check main sections
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('section h4:text("Horse List")')).toBeVisible()
    await expect(page.getByTestId('race-track-area')).toBeVisible()
    await expect(page.getByTestId('program-container')).toBeVisible()
    await expect(page.getByTestId('results-container')).toBeVisible()
  })

  test('should display correct number of horses with proper information', async ({ page }) => {
    const horseList = page.locator('section:has(h4:text("Horse List"))')

    // Check if all horses are displayed
    const horses = await horseList.locator('tbody tr').all()
    expect(horses.length).toBe(TOTAL_HORSE_COUNT)

    // Check first horse details
    const firstHorse = horses[0]
    await expect(firstHorse.locator('td').first()).toHaveText(/[A-Za-z]+ ?[A-Za-z]*/) // Horse name
    await expect(firstHorse.locator('td').nth(1)).toHaveText(/\d+/) // Condition
  })

  test('should allow selecting horses and starting a race', async ({ page }) => {
    // Generate program
    await page.getByTestId('generate-program-btn').click()

    // Start race button should be enabled
    const startButton = page.getByTestId('race-control-btn')
    await expect(startButton).toBeEnabled()

    // Start the race
    await startButton.click()

    // Race should be in running state
    await expect(page.getByTestId('race-control-btn')).toHaveText('Pause')
  })

  test('should execute race and display results', async ({ page }) => {
    // Generate program
    await page.getByTestId('generate-program-btn').click()

    // Start race
    await page.getByTestId('race-control-btn').click()

    // Wait for first round results to appear (up to 30 seconds depending on the speed of the horses)
    await expect(page.getByTestId('round-result')).toBeVisible({ timeout: 30000 })

    // Check if we have result rows
    const resultRows = await page.getByTestId('result-row').all()
    expect(resultRows.length).toBeGreaterThan(0)

    // Verify result details
    for (const row of resultRows) {
      // Check position is a number
      await expect(row.locator('td').first()).toHaveText(/^\d+$/)
      // Check horse name
      await expect(row.locator('td').nth(1)).toHaveText(/[A-Za-z]+ ?[A-Za-z]*/)
    }
  })

  test('should handle race state transitions', async ({ page }) => {
    // Generate program
    await page.getByTestId('generate-program-btn').click()

    // Start -> Pause -> Resume flow
    await page.getByTestId('race-control-btn').click()
    await expect(page.getByTestId('race-control-btn')).toHaveText('Pause')

    await page.getByTestId('race-control-btn').click()
    await expect(page.getByTestId('race-control-btn')).toHaveText('Resume')

    await page.getByTestId('race-control-btn').click()
    await expect(page.getByTestId('race-control-btn')).toHaveText('Pause')
  })
})
