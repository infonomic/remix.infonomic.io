import { test, expect } from '@playwright/test'

const describe = test.describe

describe('home page', () => {
  test('@functional homepage has title and links to sign in and sign up page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Home - Infonomic Remix Workbench/)
    const signIn = page.getByRole('link', { name: 'Sign In' })
    await expect(signIn).toHaveAttribute('href', '/sign-in')
    const signUp = page.getByRole('link', { name: 'Sign U' })
    await expect(signUp).toHaveAttribute('href', '/sign-up')
  })
})
