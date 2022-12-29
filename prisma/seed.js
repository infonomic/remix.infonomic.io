/* eslint-disable import/no-extraneous-dependencies */
// NOTE: This is a js file and not ts, to make running seeds in production
// easier at fly.io - since they can be run directly from node without 
// typescript dependencies.
// 
// i.e. in package.json
// "prisma": {
//  "seed": "node prisma/seed.js"
// },
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const users = require('./users.json')
const prisma = new PrismaClient()

const environment = process.env.NODE_ENV || 'development'

async function seedAdmin() {
  const adminUsers = users.admin_users

  adminUsers.forEach(async user => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await prisma.user.create({
      data: {
        email: user.email,
        isAdmin: true,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    })
  })

  // eslint-disable-next-line no-console
  console.log('Admin users seeded. 🌱')
}

async function seedUser() {
  const normalUsers = users.users

  normalUsers.forEach(async user => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    })

    await prisma.note.create({
      data: {
        title: 'My first note',
        body: 'Hello, world!',
        userId: newUser.id,
      },
    })

    await prisma.note.create({
      data: {
        title: 'My second note',
        body: 'Hello, world!',
        userId: newUser.id,
      },
    })

  })

  // eslint-disable-next-line no-console
  console.log('Users seeded. 🌱')
}

async function seedAutoUsers() {
  const { faker } = await import('@faker-js/faker')
  const autoUsers = users.auto_users
  const hashedPassword = await bcrypt.hash(autoUsers.password, 10)

  for (let index = 0; index < autoUsers.count; index++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    })
  }
  // eslint-disable-next-line no-console
  console.log('Auto users seeded. 🌱')
}


async function seed() {
  // cleanup the existing database
  await prisma.note.deleteMany({})
  await prisma.user.deleteMany({})
  await seedAdmin()
  if (environment === 'development') {
    await seedUser()
    await seedAutoUsers()
  }
  // eslint-disable-next-line no-console
  console.log('Database has been seeded. 🌱')
}

seed()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
