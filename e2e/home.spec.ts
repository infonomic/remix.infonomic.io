/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'

test('homepage has title and links to sign in and sign up page', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home - Infonomic Remix Workbench/)

  // create a locator

  const signIn = page.getByRole('link', { name: 'Sign In' })

  // Expect an attribute "to be strictly equal" to the value.
  await expect(signIn).toHaveAttribute('href', '/sign-in')

  // create a locator
  const signUp = page.getByRole('link', { name: 'Sign U' })

  // Expect an attribute "to be strictly equal" to the value.
  await expect(signUp).toHaveAttribute('href', '/sign-up')

})
