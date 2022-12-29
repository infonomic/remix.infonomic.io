import bcrypt from 'bcryptjs'
import { prisma } from '~/db.server'
import { SEARCH_PARAMS_DEFAULTS } from '~/models/user'

import type { Password, User } from '@prisma/client'
import type { SearchParams } from '~/models/user'

export type { User } from '@prisma/client'

export async function verifyLogin(
  email: User['email'],
  password: Password['hash']
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  )

  if (!isValid) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
}

export async function getUsers(
  {
    page = SEARCH_PARAMS_DEFAULTS.page,
    pageSize = SEARCH_PARAMS_DEFAULTS.pageSize,
    orderBy = SEARCH_PARAMS_DEFAULTS.orderBy,
    orderDesc = SEARCH_PARAMS_DEFAULTS.orderDesc,
  }: SearchParams
) {
  const count = await prisma.user.count()
  const meta = {
    total: count,
    pageSize: pageSize,
    pageTotal: Math.ceil(count / pageSize),
    currentPage: page,
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      [orderBy]: orderDesc ? 'desc' : 'asc',
    },
  })

  return { users, meta }
}

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } })
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } })
}

export async function getUserWithNotes(id: User['id']) {
  return prisma.user.findUnique({
    where: { id }, include: {
      notes: true,
    },
  })
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })
}

export async function updateUserEmail(id: User['id'], email: User['email']) {

  // Check for another user with this email address
  const result = await prisma.user.findMany({
    where: {
      email,
      NOT: {
        id: {
          equals: id,
        },
      },
    },
    select: {
      email: true,
    },
  })

  if (result.length > 0) return null

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      email,
    },
  })
}

export async function updateUserPassword(id: User['id'], currentPassword: string, newPassword: string) {
  const hashedNewPassword = await bcrypt.hash(newPassword, 10)
  const userWithPassword = await prisma.user.findUnique({
    where: { id },
    include: {
      password: true,
    },
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(
    currentPassword,
    userWithPassword.password.hash
  )

  if (!isValid) {
    return null
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      password: {
        update: {
          hash: hashedNewPassword,
        },
      },
    },
  })
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } })
}
