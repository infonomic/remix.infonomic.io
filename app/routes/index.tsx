
import { Hero, links as heroLinks } from '~/modules/home/hero'

import FrontLayout from '~/ui/layouts/front-layout'

import styles from '~/styles/app/routes/index.css'

/**
 * meta
 * @returns 
 */
export const meta = () => ({
  title: 'Home - Infonomic Remix Workbench',
})

/**
 * links
 * @returns 
 */
export function links() {
  return [
    ...heroLinks(),
    { rel: 'stylesheet', href: styles },
  ]
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
