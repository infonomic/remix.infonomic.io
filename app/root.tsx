import type * as React from 'react'

import type { LinksFunction, LoaderArgs, LoaderFunction } from '@remix-run/node'
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
import cx from 'classnames'

import { getUser } from './session.server'
import { getThemeSession } from './theme.server'
import ErrorLayout from './ui/layouts/error-layout'
import { getDomainUrl, getUrl, removeTrailingSlash } from './utils/utils'

import { NonFlashOfWrongThemeEls, ThemeProvider, useTheme } from '~/ui/theme/theme-provider'
import type { Theme } from '~/ui/theme/theme-provider'

import appStyles from '~/styles/shared/css/app.css'
import tailwindStyles from '~/styles/shared/css/tailwind.css'

import type { User } from '~/models/user.server'

export type LoaderData = {
  theme: Theme | null
  user: User | null
  origin: string
  path: string
  ENV: object | null
}

/**
 * links
 * @returns LinksFunction
 */
export const links: LinksFunction = () => {
  return [
    { rel: 'apple-touch-icon', sized: '180x180', href: '/apple-touch-icon.png?v=10' },
    { rel: 'icon', type: 'image/png', sized: '96x96', href: '/favicon-96x96.png?v=10' },
    { rel: 'icon', type: 'image/png', sized: '48x38', href: '/favicon-48x48.png?v=10' },
    { rel: 'icon', type: 'image/png', sized: '32x32', href: '/favicon-32x32.png?v=10' },
    { rel: 'icon', type: 'image/png', sized: '16x16', href: '/favicon-16x16.png?v=10' },
    { rel: 'icon', href: '/favicon.ico?v=10' },
    { rel: 'manifest', href: '/manifest.webmanifest?v=10', crossOrigin: 'use-credentials' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg?v=10', color: '#501c76' },

    { rel: 'stylesheet', href: tailwindStyles },
    { rel: 'stylesheet', href: appStyles },
  ]
}

/**
 * meta
 * @returns V2_MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ data }: any) => {
  return [
    { charset: 'utf-8' },
    { title: 'Infonomic Remix Workbench App' },
    {
      name: 'description',
      content: 'A Remix demo app with CSS, Tailwind, Radix UI and other headless UI components.',
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'theme-color', content: '#f59e0b' },
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

/**
 * loader
 * @param LoaderArgs
 * @returns LoaderFunction
 */
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const themeSession = await getThemeSession(request)
  const user = await getUser(request)

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    user: user,
    origin: getDomainUrl(request),
    path: new URL(request.url).pathname,
    ENV: {
      RECAPTCHA_ENABLED: process.env.RECAPTCHA_ENABLED,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  }

  return json(data)
}

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

const Document = ({ children, title }: DocumentProps) => {
  const tcx = useTheme()
  const data = useLoaderData<LoaderData>()

  // Note: useLocation will force the canonical URL to update
  // for all route changes (unlike the og:url meta tag above)
  const { pathname } = useLocation()
  const canonicalUrl = removeTrailingSlash(`${data?.origin}${pathname}`)

  return (
    <html lang="en" className={cx(tcx.theme)}>
      <head>
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
        {title ? <title>{title}</title> : null}
        <Meta />
        <link rel="canonical" href={canonicalUrl} />
        <Links />
      </head>
      <body className="bg-white selection:bg-amber-400 dark:bg-gray-900 dark:selection:text-black">
        {children}
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

export default function App() {
  const data = useLoaderData<LoaderData>()

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <Document>
        <ToastPrimitive.Provider swipeDirection="right">
          <Outlet />
          <ToastPrimitive.Viewport />
        </ToastPrimitive.Provider>
      </Document>
    </ThemeProvider>
  )
}

const ErrorDocument = ({ children, title }: DocumentProps) => {
  return (
    <html lang="en" className="dark">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-900">
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  // eslint-disable-next-line no-console
  console.error(error)
  return (
    <ThemeProvider specifiedTheme={null}>
      <ErrorDocument title="Error! - Infonomic Remix Workbench App">
        <ErrorLayout>
          <div>
            <h1>There was an error</h1>
            <p>{error.message}</p>
            <p>Oops. Something went wrong. We&apos;re looking into it.</p>
          </div>
        </ErrorLayout>
      </ErrorDocument>
    </ThemeProvider>
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

  return (
    <ThemeProvider specifiedTheme={null}>
      <ErrorDocument title={`${caught.status} ${caught.statusText}`}>
        <ErrorLayout>
          <h1>
            {caught.status}: {caught.statusText}
          </h1>
          {message}
        </ErrorLayout>
      </ErrorDocument>
    </ThemeProvider>
  )
}
