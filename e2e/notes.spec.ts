import { test, expect } from '@playwright/test'

import { authenticateUser } from './helpers/authenticate'

test.describe('notes', () => {
  test.use(authenticateUser)

  test('@functional create', async ({ page }) => {
    await page.goto('/notes')
    await page.getByRole('link', { name: 'New Note' }).click()
    await page.getByPlaceholder('Title').click()
    await page.getByPlaceholder('Title').fill('A note')
    await page.getByLabel('Body').click()
    await page.getByLabel('Body').fill('This is a wonderful note.')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page).toHaveURL('/notes')
  })
})
