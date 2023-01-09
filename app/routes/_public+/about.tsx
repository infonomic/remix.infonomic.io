import { mergeMeta } from '~/utils/utils'

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
 * AboutInPage
 * @returns
 */
export default function AboutPage() {
  return (
    <article className="mx-auto mt-[1rem] max-w-[960px] md:mt-[3rem] ">
      <div className="prose dark:prose-invert">
        <h1 className="mb-5 text-[2.25rem]">About</h1>
      </div>
      <div>Article here...</div>
    </article>
  )
}
