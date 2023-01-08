import { Outlet } from '@remix-run/react'

import FrontLayout from '~/ui/layouts/front-layout'

/**
 * Index
 * @returns
 */
export default function Landing() {
  return (
    <FrontLayout>
      <Outlet />
    </FrontLayout>
  )
}
