import type { V2_MetaFunction } from '@remix-run/node'

import { mergeMeta } from '~/utils/utils'

import { Hero, links as heroLinks } from '~/modules/home/hero'

import styles from '~/styles/app/routes/_landing+/index.css'

/**
 * meta
 * @returns V2_MetaFunction
 */
export const meta: V2_MetaFunction = ({ matches }) => {
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
