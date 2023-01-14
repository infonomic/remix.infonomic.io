// Directory for storageState json files.
export const storageStateDir = './e2e/mocks'

// Data for test users, created in global-setup and deleted in global-teardown.
export const testUser = {
  email: 'e2e_test_user@infonomic.io',
  password: 'hello1234',
  isAdmin: false,
  path: `${storageStateDir}/user.json`,
}

export const testAdmin = {
  email: 'e2e_test_admin@infonomic.io',
  password: 'hello1234',
  isAdmin: true,
  path: `${storageStateDir}/admin.json`,
}

export const testUsers = [testUser, testAdmin]

// Helpers for using shared storageState for testUser and testAdmin in test
// suites (e.g. via test.use(authenticateUser))
export const authenticateUser = { storageState: testUser.path }
export const authenticateAdmin = { storageState: testAdmin.path }
