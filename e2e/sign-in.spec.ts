import { test, expect } from '@playwright/test'

const describe = test.describe

describe('sign in page', () => {
  test('@functional sign in', async ({ page }) => {
    console.log(process.env.NODE_ENV)
    console.log(process.env.RECAPTCHA_MANDATORY)
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign In' }).click()
    await page.getByPlaceholder('Email').click()
    await page.getByPlaceholder('Email').fill('anthony@abouch.com')
    await page.getByPlaceholder('Email').press('Tab')
    await page.getByPlaceholder('Password').fill('Welcome100!')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/notes')
  })
})
