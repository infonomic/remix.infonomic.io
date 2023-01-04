import { useMemo } from 'react'

import { useMatches } from '@remix-run/react'

import type { User } from '~/models/user.server'

const DEFAULT_REDIRECT = '/'

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  // eslint-disable-next-line no-undef
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }

  return to
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(() => matchingRoutes.find(r => r.id === id), [matchingRoutes, id])
  return route?.data
}

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}

export function useUser(): User {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
    )
  }
  return maybeUser
}

// TODO: remove and replace in utils.tests - as we don't need this (using zod now)
export function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length > 3 && email.includes('@')
}

/**
 * mergeMeta
 * @returns [] merged metatags
 * TODO: this is a temporary merge meta function for the 
 * new v2 meta api. It may not be completed or the best way 
 * to do this - but it works for the moment.
 * TODO: types
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462 
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export function mergeMeta(matches: any, tags: any[] = []) {
  function findMatch(upperTag: any, tag: any) {
    let found = false
    const rules = [
      { k: 'charSet', f: () => !!tag?.charSet },
      { k: 'title', f: () => !!tag?.title },
      { k: 'name', f: () => upperTag?.name === tag.name },
      { k: 'property', f: () => upperTag?.property === tag.property },
      { k: 'httpEquiv', f: () => upperTag?.httpEquiv === tag.httpEquiv },
    ]

    for (let index = 0; index < rules.length; index += 1) {
      const rule = rules[index]
      if (upperTag[rule.k] !== undefined) {
        found = rule.f()
        break
      }
    }

    return found
  }

  const filteredMeta = matches.map((match: any) => match.meta)
    .map((upperTags: any[]) => {
      const filteredUpperTags: any[] = []
      for (const upperTag of upperTags) {
        let found = false
        for (const tag of tags) {
          found = findMatch(upperTag, tag)
          if (found) break
        }
        if (!found) filteredUpperTags.push(upperTag)
      }
      return filteredUpperTags
    })

  return [...filteredMeta, tags]
}