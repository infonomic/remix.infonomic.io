import type { V2_MetaFunction, V2_HtmlMetaDescriptor } from '@remix-run/node'

import { mergeMeta } from '~/utils/utils'

import { Hero, links as heroLinks } from '~/modules/home/hero'

import styles from '~/styles/app/routes/_landing+/index.css'

/**
 * meta
 * @returns {V2_HtmlMetaDescriptor[]}
 */
export const meta: V2_MetaFunction = ({ data, matches }): V2_HtmlMetaDescriptor[] => {
  const title = 'Home'
  return mergeMeta(data, matches, [{ title }, { property: 'og:title', content: title }])
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
