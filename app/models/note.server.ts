import { prisma } from '~/db.server'

import type { User, Note } from '@prisma/client'

export type { Note } from '@prisma/client'

export function getNote({
  id,
  userId,
}: Pick<Note, 'id'> & {
  userId: User['id']
}) {
  return prisma.note.findFirst({
    select: { id: true, title: true, body: true },
    where: { id, userId },
  })
}

export function getNoteListItems({ userId }: { userId: User['id'] }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true, body: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export function createNote({
  title,
  body,
  userId,
}: Pick<Note, 'body' | 'title'> & {
  userId: User['id']
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export function editNote({
  id,
  title,
  body,
  userId,
}: Pick<Note, 'id' | 'title' | 'body'> & { userId: User['id'] }) {
  return prisma.note.updateMany({
    where: { id, userId },
    data: {
      title,
      body,
    },
  })
}

export function deleteNote({ id, userId }: Pick<Note, 'id'> & { userId: User['id'] }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  })
}
