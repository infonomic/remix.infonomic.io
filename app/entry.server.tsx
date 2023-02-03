import { PassThrough } from 'stream'

import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'

import isbot from 'isbot'
import { renderToPipeableStream, renderToString } from 'react-dom/server'
import { Head } from '~/root'

import { ThemeProvider, Theme } from '~/ui/theme/theme-provider'

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady'

  // get root loader data to set theme in SSR html
  const rootLoaderData = remixContext.staticHandlerContext.loaderData.root
  const theme = rootLoaderData.theme ?? Theme.DARK

  // swap out default component with <Head>
  const defaultRoot = remixContext.routeModules.root
  remixContext.routeModules.root = {
    ...defaultRoot,
    default: () => (
      <ThemeProvider theme={theme}>
        <Head />
      </ThemeProvider>
    ),
  }

  let head = renderToString(<RemixServer context={remixContext} url={request.url} />)

  // restore the default root component
  remixContext.routeModules.root = defaultRoot

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )
          body.write(
            `<!DOCTYPE html>
              <html lang="en" class="${theme}">
                <head><!--start head-->${head}<!--end head--></head>
                <body class="bg-white selection:bg-amber-400 dark:bg-gray-900 dark:selection:text-black">
                <div id="root">`
          )
          pipe(body)
          body.write('</div></body></html>')
        },
        onShellError: (err: unknown) => {
          reject(err)
        },
        onError: (error: unknown) => {
          didError = true
          // TODO: Configure server-side logger
          // eslint-disable-next-line no-console
          console.error(error)
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
