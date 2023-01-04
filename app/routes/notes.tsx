import { Outlet } from '@remix-run/react'

import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'
import MainLayout from '~/ui/layouts/main-layout'

// /**
//  * meta
//  * @returns
//  */
// export const meta = () => ({
//   title: 'Notes - Infonomic Remix Workbench',
// })

/**
 * meta
 * @returns MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462 
 */
export const meta = ({ data, matches }: any) => {
  return [
    { title: 'Notes - Infonomic Remix Workbench' },
  ]
}

/**
 * NotesPage template route
 * @returns
 */
export default function NotesPage() {
  return (
    <MainLayout>
      <Section className="flex flex-1 flex-col py-4">
        <Container className="prose dark:prose-invert">
          <Outlet />
        </Container>
      </Section>
    </MainLayout>
  )
}
