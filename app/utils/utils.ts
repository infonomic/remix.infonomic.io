import { useMemo } from 'react'

import type { V2_MetaDescriptor } from '@remix-run/react'
import { useMatches } from '@remix-run/react'
import type { Navigation } from '@remix-run/router'

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

export function truncate(str: string, length: number, useWordBoundary: boolean) {
  if (!str || str.length <= length) {
    return str
  }
  const subString = str.slice(0, length - 2) // the original check - less 2 so zero based + '...' will respect length
  return (useWordBoundary ? subString.slice(0, subString.lastIndexOf(' ')) : subString) + '...'
}

export function isBusy(navigation: Navigation) {
  // prettier-ignore
  return navigation.state === 'submitting'
    ? true
    : navigation.state === 'loading'
      ? navigation.formMethod === 'post'
      : false
}

export function getDomainUrl(request: Request) {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) {
    throw new Error('Could not determine domain URL.')
  }
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.slice(0, -1) : s
}

export function getUrl(origin: string, path: string) {
  return removeTrailingSlash(`${origin ?? 'https://remix.infonomic.io'}${path ?? ''}`)
}

export function appendSiteTitle(tags: V2_MetaDescriptor[]): void {
  let SITE_TITLE
  if (typeof document === 'undefined') {
    SITE_TITLE = process?.env.SITE_TITLE
  } else {
    SITE_TITLE = window?.ENV?.SITE_TITLE
  }
  // Would love to use this instead - but - when Remix crashes elsewhere, this will also
  // fail with a "Cannot destructure property 'SITE_TITLE' of '(intermediate value)(intermediate value)
  // (intermediate value)' as it is undefined."
  // const { SITE_TITLE } = typeof document === 'undefined' ? process.env : window.ENV

  const siteTitle = SITE_TITLE != null ? `- ${SITE_TITLE}` : ''
  for (const tag of tags as any) {
    if (tag.title != null) {
      tag.title = `${tag.title} ${siteTitle}`
    }
    if (tag.property === 'og:title') {
      tag.content = `${tag.content} ${siteTitle}`
    }
  }
}

/**
 * A utility function for the v2 meta API. It will
 * merge (filter) root metatags - replacing any that match
 * the supplied route module meta tags. It may not be complete
 * or the best way to do this but it works for the moment.
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462
 * https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069
 *
 * @returns {V2_MetaDescriptor[]} Merged metatags
 */
export function mergeMeta(matches: any, tags: V2_MetaDescriptor[] = []): V2_MetaDescriptor[] {
  const rootModule = matches.find((match: any) => match.id === 'root')
  const rootMeta = rootModule.meta
  appendSiteTitle(tags)

  function findMatch(rootTag: any, tag: any): boolean {
    const rules = [
      { k: 'charSet', f: () => tag.charSet != null },
      { k: 'title', f: () => tag.title != null },
      { k: 'name', f: () => rootTag.name === tag.name },
      { k: 'property', f: () => rootTag.property === tag.property },
      { k: 'httpEquiv', f: () => rootTag.httpEquiv === tag.httpEquiv },
    ]

    for (const rule of rules) {
      if (rootTag[rule.k] !== undefined) {
        return rule.f()
      }
    }
    return false
  }

  if (rootMeta != null) {
    const filteredRootMeta = rootMeta.filter((rootTag: V2_MetaDescriptor) => {
      for (const tag of tags) {
        if (findMatch(rootTag, tag)) {
          return false
        }
      }
      return true
    })

    return [...filteredRootMeta, ...tags]
  } else {
    return tags
  }
}
