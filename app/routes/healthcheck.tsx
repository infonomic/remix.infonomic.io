// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
// import type { DataFunctionArgs } from '@remix-run/node'

import { prisma } from '~/db.server'

/**
 * loader
 * @param param0
 * @returns
 */
// export async function loader({ request }: DataFunctionArgs) {
export async function loader() {
  // const host =
  //   request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    // const url = new URL("/", `http://${host}`);
    // When we're deployed in a Docker container, the localhost on port 8080
    // (depending on the Dockerfile ) will respond, whereas the host value
    // above might not - depending on how the container and its environment
    // have been configured - for example when testing the Docker image under
    // WSL 2.
    const url = new URL('/', 'http://127.0.0.1:8080')
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: 'HEAD' }).then(r => {
        if (!r.ok) return Promise.reject(r)
      }),
    ])
    return new Response('OK')
  } catch (error: unknown) {
    // TODO: Configure server-side logger
    // eslint-disable-next-line no-console
    console.log('healthcheck ❌', { error })
    return new Response('ERROR', { status: 500 })
  }
}
