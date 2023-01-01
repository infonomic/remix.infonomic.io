import { useCatch } from '@remix-run/react'

import ErrorLayout from '~/ui/layouts/error-layout'
import PublicLayout from '~/ui/layouts/public-layout'

/**
 * meta
 * @returns 
 */
export const meta = () => ({
  title: '404 - Infonomic - Remix Workbench',
})

/**
 * loader
 * @returns Response 404 not found
 */
export async function loader() {
  /** 
   * Using the top level splat route here allows us to throw a 
   * 'correct' 404 response - which is handled by the CatchBoundary
   * below. This in turn means that our root.tsx loader and 
   * App/Document components will succeed - including our theme 
   * provider settings. So we'll get a proper 'themeable' 
   * 404 not found page that we can customize in the CatchBoundary.
  **/

  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw new Response('Not Found', { status: 404 })
}


/**
 * Index
 * @returns ReactNode
 */
export default function CatchAll() {
  return (
    <p>We should never see this.</p>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  if (caught.status === 404) {
    return (
      <PublicLayout>
        <ErrorLayout>
          <div>
            <h1>404</h1>
            <p>Oops. The page you tried to visit does not exist.</p>
          </div>
        </ErrorLayout>
      </PublicLayout>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
