import type {
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  V2_MetaFunction,
  V2_HtmlMetaDescriptor,
  HtmlLinkDescriptor,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from '@remix-run/react'

import * as ToastPrimitive from '@radix-ui/react-toast'

import { getUser } from './session.server'
import { getThemeSession } from './theme.server'
import ErrorLayout from './ui/layouts/error-layout'
import { getDomainUrl, getUrl, removeTrailingSlash } from './utils/utils'

import type { Theme } from '~/ui/theme/theme-provider'
import { DEFAULT_THEME, isTheme, ThemeSource, ThemeProvider } from '~/ui/theme/theme-provider'

import appStyles from '~/styles/shared/css/app.css'
import tailwindStyles from '~/styles/shared/css/tailwind.css'

import type { User } from '~/models/user.server'

export type LoaderData = {
  theme: Theme
  themeSource: ThemeSource
  user: User | null
  origin: string
  path: string
  ENV: object | null
}

/**
 * links
 * @returns {HtmlLinkDescriptor []}
 */
export const links: LinksFunction = (): HtmlLinkDescriptor[] => {
  return [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=10' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png?v=10' },
    { rel: 'icon', type: 'image/png', sizes: '48x38', href: '/favicon-48x48.png?v=10' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=10' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=10' },
    { rel: 'icon', href: '/favicon.ico?v=10' },
    { rel: 'manifest', href: '/manifest.webmanifest?v=10', crossOrigin: 'use-credentials' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg?v=10', color: '#501c76' },

    { rel: 'stylesheet', href: tailwindStyles },
    { rel: 'stylesheet', href: appStyles },
  ]
}

/**
 * meta
 * @returns {V2_HtmlMetaDescriptor[]}
 */
export const meta: V2_MetaFunction = ({ data }): V2_HtmlMetaDescriptor[] => {
  return [
    { charset: 'utf-8' },
    { title: 'Infonomic Remix Workbench App' },
    {
      name: 'description',
      content: 'A Remix demo app with CSS, Tailwind, Radix UI and other headless UI components.',
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'theme-color', content: '#f59e0b' },
    { name: 'color-scheme', content: `${data.theme === 'dark' ? 'dark light' : 'light dark'}` },
    { name: 'msapplication-TileColor', content: '#f59e0b' },
    { property: 'og:title', content: 'Infonomic Remix Workbench App' },
    {
      property: 'og:description',
      content: 'A Remix demo app with CSS, Tailwind, Radix UI and other headless UI components.',
    },
    // Note - og:url will not update on route changes, but it should be fine for
    // og links being crawled or shared (i.e. a full SSR)
    { property: 'og:url', content: getUrl(data?.origin, data?.path) },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://remix.infonomic.io/og.png' },
  ]
}

// Helper to extract theme from session or header; returns the theme value and
// its source.  TODO:  Move this elsewhere?  Better typing?
async function getTheme(request: Request): Promise<{
  theme: Theme
  source: ThemeSource
}> {
  // First, try to get the theme from the session.
  const themeSession = await getThemeSession(request)
  const theme = themeSession.getTheme()
  if (theme) {
    return {
      theme: theme,
      source: ThemeSource.SESSION,
    }
  }

  // If there's no theme in the session, look for the prefers-color-scheme
  // header.
  const headerVal = request.headers.get('sec-ch-prefers-color-scheme')
  if (isTheme(headerVal)) {
    return {
      theme: headerVal,
      source: ThemeSource.HEADER,
    }
  }

  // Fall back to the default theme.
  return {
    theme: DEFAULT_THEME,
    source: ThemeSource.DEFAULT,
  }
}

/**
 * loader
 * @param LoaderArgs
 * @returns LoaderFunction
 */
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const { theme, source } = await getTheme(request)
  const user = await getUser(request)

  const data: LoaderData = {
    theme,
    themeSource: source,
    user: user,
    origin: getDomainUrl(request),
    path: new URL(request.url).pathname,
    ENV: {
      RECAPTCHA_ENABLED:
        process.env.NODE_ENV === 'development' ? 'false' : process.env.RECAPTCHA_ENABLED,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  }

  return json(data)
}

export default function App() {
  const data = useLoaderData<LoaderData>()
  // Note: useLocation will force the canonical URL to update
  // for all route changes (unlike the og:url meta tag above)
  const { pathname } = useLocation()
  const canonicalUrl = removeTrailingSlash(`${data?.origin}${pathname}`)
  const { theme, themeSource } = data

  return (
    <html lang="en" className={theme}>
      <head>
        <Meta />
        <link rel="canonical" href={canonicalUrl} />
        <Links />
      </head>
      <body className="bg-white selection:bg-amber-400 dark:bg-gray-900 dark:selection:text-black">
        <ThemeProvider theme={theme} themeSource={themeSource}>
          <ToastPrimitive.Provider swipeDirection="right">
            <Outlet />
            <ToastPrimitive.Viewport />
          </ToastPrimitive.Provider>
        </ThemeProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  // eslint-disable-next-line no-console
  console.error(error)

  // we're in an error state, so no loader data
  const theme = DEFAULT_THEME // getPrefersTheme(null)

  return (
    <html lang="en" data-theme={false} className={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-900">
        <ThemeProvider theme={theme}>
          <ErrorLayout>
            <div>
              <h1>There was an error</h1>
              <p>{error.message}</p>
              <p>Oops. Something went wrong. We&apos;re looking into it.</p>
            </div>
          </ErrorLayout>
        </ThemeProvider>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>
      break
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  // we're in an error state, so no loader data
  const theme = DEFAULT_THEME //getPrefersTheme(null)

  return (
    <html lang="en" data-theme={false} className={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-900">
        <ThemeProvider theme={theme}>
          <ErrorLayout>
            <h1>
              {caught.status}: {caught.statusText}
            </h1>
            {message}
          </ErrorLayout>
        </ThemeProvider>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
