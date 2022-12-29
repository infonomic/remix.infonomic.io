/* eslint-disable @typescript-eslint/no-throw-literal */
import { createCookieSessionStorage, redirect } from '@remix-run/node'

import invariant from 'tiny-invariant'
import { getUserById } from '~/models/user.server'

import type { User } from '~/models/user.server'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})


// Export convenience methods
const { commitSession, destroySession } = sessionStorage
export { commitSession, destroySession }

const USER_SESSION_KEY = 'userId'
const USER_IS_ADMIN = 'isAdmin'

// Convenience getSession helper
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

/**
 * Logout
 * @param request 
 * @returns 
 */
export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

/**
 * getUserId
 * 
 * @param request 
 * @returns 
 */
export async function getUserId(
  request: Request): Promise<User['id'] | undefined> {
  const session = await getSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}

/**
 * getUser
 * @param request 
 * @returns 
 */
export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (userId === undefined) return null

  const user = await getUserById(userId)
  if (user) return user

  throw await logout(request)
}

/**
 * requireUserId
 * 
 * @param request 
 * @param redirectTo 
 * @returns 
 */
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/sign-in?${searchParams}`)
  }
  return userId
}

/**
 * requireAdmin
 * 
 * @param request 
 * @returns 
 */
export async function requireAdmin(
  request: Request
) {
  const session = await getSession(request)
  const isAdmin = session.get(USER_IS_ADMIN)
  if (!isAdmin) {
    throw new Response('Access Denied', { status: 403 })
  }
}

/**
 * requireUser
 * 
 * @param request 
 * @returns 
 */
export async function requireUser(request: Request) {
  const userId = await requireUserId(request)

  const user = await getUserById(userId)
  if (user) return user

  throw await logout(request)
}

/**
 * createUserSession
 * 
 * @param param0 
 * @returns 
 */
export async function createUserSession({
  request,
  userId,
  isAdmin,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  isAdmin: boolean;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  session.set(USER_IS_ADMIN, isAdmin)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        // 7 days if remember or undefined
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
      }),
    },
  })
}
