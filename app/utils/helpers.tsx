import type { Transition } from '@remix-run/react/dist/transition'

export function truncate(str: string, length: number, useWordBoundary: boolean) {
  if (!str || str.length <= length) {
    return str
  }
  const subString = str.slice(0, length - 2) // the original check - less 2 so zero based + '...' will respect length
  return (useWordBoundary ? subString.slice(0, subString.lastIndexOf(' ')) : subString) + '...'
}

export function isBusy(transition: Transition) {
  const loading = {
    actionRedirect: true,
    actionReload: true,
  }

  return transition.state === 'submitting'
    ? true
    : transition.state === 'loading'
    ? loading[transition.type as keyof typeof loading]
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
