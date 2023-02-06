import { PassThrough } from 'stream'

import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'

import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady'

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          // https://wicg.github.io/user-preference-media-features-headers/
          // https://caniuse.com/mdn-http_headers_sec-ch-prefers-color-scheme
          // These headers, set on every page response, instruct the browser to
          // send the sec-ch-prefers-color-scheme header (if it supports it). If
          // the browser didn't send that header on its initial request to the
          // site, it will see these response headers, and _resubmit_ its
          // initial request with that header included.  The browser will then
          // remember that the sec-ch-prefers-color-scheme header has been
          // requested, and send it on subsequent page requests as well (i.e. it
          // will not have to double-submit further page requests).  Browsers
          // that don't support this standard will obviously ignore the headers.
          responseHeaders.set('Accept-CH', 'Sec-CH-Prefers-Color-Scheme')
          responseHeaders.set('Vary', 'Sec-CH-Prefers-Color-Scheme')
          responseHeaders.set('Critical-CH', 'Sec-CH-Prefers-Color-Scheme')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )

          pipe(body)
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
