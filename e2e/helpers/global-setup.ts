import { request } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { testUsers } from './authenticate'

import type { FullConfig } from '@playwright/test'

const prisma = new PrismaClient()

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL

  for (const user of testUsers) {
    const { email, password, isAdmin, path } = user
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        isAdmin,
        password: { create: { hash } }
      }
    })

    const context = await request.newContext()
    await context.post(`${baseURL}/sign-in`, {
      form: {
        email,
        password,
      }
    })
    await context.storageState({ path })
    await context.dispose()

    // The above approach works by sending an api request to the /sign-in
    // endpoint, and getting back a single session cookie.  But during a normal
    // login flow, other cookies might be set as well.  If we want those cookies
    // to be part of the shared storageState used in tests, simulating an actual
    // login flow as below might work better.

    // This first line, creating the browser, should be lifted outside of the for loop.
    // const browser = await chromium.launch()
    // const context = await browser.newContext()
    // const page = await context.newPage()
    // await page.goto(`${baseURL}/sign-in`)
    // await page.getByPlaceholder('Email').fill(email)
    // await page.getByPlaceholder('Password').fill(password)
    // await page.getByRole('button', { name: 'Sign in' }).click()
    // await page.waitForNavigation()
    // await page.context().storageState({ path })
  }
}

export default globalSetup