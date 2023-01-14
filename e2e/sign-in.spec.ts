import { test, expect } from '@playwright/test'

import { testUser } from './helpers/authenticate'

const describe = test.describe

describe('sign in page', () => {
  test('@functional sign in', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign In' }).click()
    await page.getByPlaceholder('Email').click()
    await page.getByPlaceholder('Email').fill(testUser.email)
    await page.getByPlaceholder('Email').press('Tab')
    await page.getByPlaceholder('Password').fill(testUser.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/notes')
  })
})
