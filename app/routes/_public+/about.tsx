import ReactMarkdown from 'react-markdown'

import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'

import remarkGfm from 'remark-gfm'
import { mergeMeta } from '~/utils/utils'

import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns V2_MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ matches }: any) => {
  const title = 'About - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader() {
  const response = await fetch(
    'https://raw.githubusercontent.com/infonomic/remix.infonomic.io/develop/README.md'
  )
  const text = await response.text()
  return json({ text })
}

/**
 * AboutInPage
 * @returns
 */
export default function AboutPage() {
  const data = useLoaderData()

  return (
    <article className="prose mx-auto mt-[1rem] max-w-[960px] dark:prose-invert md:mt-[3rem] ">
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
