import { Hero, links as heroLinks } from '~/modules/home/hero'

import FrontLayout from '~/ui/layouts/front-layout'

import styles from '~/styles/app/routes/index.css'

// /**
//  * meta
//  * @returns
//  */
// export const meta = () => ({
//   title: 'Home - Infonomic Remix Workbench',
// })

/**
 * meta
 * @returns MetaFunction
 * TODO: ts types for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462 
 */
export const meta = ({ data, matches }: any) => {
  return [
    ...matches.map((match: any) => match.meta),
    { title: 'Home - Infonomic Remix Workbench' },
  ]
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
  return (
    <FrontLayout>
      <Hero />
    </FrontLayout>
  )
}
