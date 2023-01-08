import { mergeMeta } from '~/utils/utils'

import { Hero, links as heroLinks } from '~/modules/home/hero'

import FrontLayout from '~/ui/layouts/front-layout'

import styles from '~/styles/app/routes/_landing.index.css'

/**
 * meta
 * @returns V2_MetaFunction
 * TODO: ts types for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ matches }: any) => {
  const title = 'Home - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * links
 * @returns
 */
export function links() {
  return [...heroLinks(), { rel: 'stylesheet', href: styles }]
}

/**
 * Index
 * @returns
 */
export default function Index() {
  return <Hero />
}
