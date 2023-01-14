import { rmdir, unlink } from 'fs/promises'

import { PrismaClient } from '@prisma/client'

import { storageStateDir, testUsers } from './authenticate'

const prisma = new PrismaClient()

const globalTeardown = async () => {
  // NOTE: This teardown function currently assumes that all data created during
  // the e2e tests will be deleted simply by deleting the test users (i.e. that
  // data in other tables will be deleted via ON DELETE CASCADE).  Were that not
  // true, more care would be needed here.
  const emails = testUsers.map(user => user.email)
  await prisma.user.deleteMany({
    where: {
      email: { in: emails }
    }
  })

  // Could just do a recursive rmdir, but the conservative approach of deleting
  // only the expected files / directories seems safer.
  const paths = testUsers.map(user => user.path)
  for (const path of paths) {
    try {
      await unlink(path)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`Failed to remove storageState ${path}:`)
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  try {
    await rmdir(storageStateDir)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to remove storageStateDir:')
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

export default globalTeardown
