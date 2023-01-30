import ReactMarkdown from 'react-markdown'

import type {
  HeadersFunction,
  LoaderFunction,
  LoaderArgs,
  V2_MetaFunction,
  V2_HtmlMetaDescriptor,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'

import cx from 'classnames'
import remarkGfm from 'remark-gfm'
import { mergeMeta } from '~/utils/utils'

import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns {V2_MetaFunction}
 */
export const meta: V2_MetaFunction = ({ matches }): V2_HtmlMetaDescriptor[] => {
  const title = 'About - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') || 'no-cache',
  }
}

/**
 * loader
 * @param param0
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const response = await fetch(
    'https://raw.githubusercontent.com/infonomic/remix.infonomic.io/develop/README.md'
  )
  const text = await response.text()
  return json(
    { text },
    {
      headers: {
        // max-age controls the browser cache
        // s-maxage controls a CDN cache
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    }
  )
}

/**
 * AboutInPage
 * @returns
 */
export default function AboutPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <article
      className={cx(
        'mx-auto mt-[2.5rem] max-w-[960px]',
        'prose prose-lg prose-slate dark:prose-invert',
        'md:mt-[3rem] md:prose-lg'
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.text}</ReactMarkdown>
    </article>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  // eslint-disable-next-line no-console
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <ErrorLayout>
        <div>
          <h1>Not Found</h1>
          <p>Oops. About content note found.</p>
        </div>
      </ErrorLayout>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
