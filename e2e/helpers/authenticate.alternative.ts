import { test as base } from '@playwright/test'

import { testAdmin, testUser } from './authenticate'

import type { Page } from '@playwright/test'

// This file represents an alternative approach to authenticating users for tests.
// Rather than creating storageState json files and sharing those among tests, we
// could use a fixture as below, and manually sign the user in at the start of each
// test that needed it.  global-setup and global-teardown would still be useful for
// creating and deleting the test users (though they could also be created and
// destroyed per-test, by adding some code to this Auth fixture).

// Class implementing helpers for signing users in and out on a Page.
class Auth {
  readonly page: Page
  
  constructor(page: Page) {
    this.page = page
  }
  
  async signIn({ email, password }: { email: string, password: string }) {
    await this.page.request.post('/sign-in', {
      form: {
        email,
        password,
      }
    })
  }
  
  signInUser() {
    return this.signIn(testUser)
  }
  
  signInAdmin() {
    return this.signIn(testAdmin)
  }
  
  async signOut() {
    await this.page.request.post('/sign-out')
  }
}

// Extend playwright's test object with an auth fixture providing an instance of
// the Auth class defined above.  This fixture can be used in tests, e.g. by
// calling
//
//   test.beforeEach(async ({ auth }) => {
//     await auth.signInUser()
//   })

type AuthFixtures = {
  auth: Auth
}

export const test = base.extend<AuthFixtures>({
  auth: async ({ page }, use) => {
    const auth = new Auth(page)
    await use(auth)
  }
})

// Convenience, as test and expect are usually imported together
export { expect } from '@playwright/test'
