import * as React from 'react'

import type { LoaderArgs } from '@remix-run/node'

import cx from 'classnames'
import { requireUserId } from '~/session.server'
import { mergeMeta } from '~/utils/utils'

import { Button } from '~/ui/components/button'
import { Card } from '~/ui/components/card'
import { Container } from '~/ui/components/container'
// import { Checkbox } from '~/ui/components/input'
import { Alert } from '~/ui/components/notifications'
import { Pagination } from '~/ui/components/pager'
import { Section } from '~/ui/components/section'
import MainLayout from '~/ui/layouts/main-layout'

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
  const title = 'Theme - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request }: LoaderArgs) {
  await requireUserId(request)
  return null
}

/**
 * ThemeRadixDialog
 * @returns
 */
export default function Theme() {
  const [page, setPage] = React.useState<number>(0)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <MainLayout>
      <Section className="flex-1 py-4">
        <Container className="text-black">
          <div className="grid-cols-2 mx-auto max-w-[420px] gap-4 lg:grid lg:max-w-none">
            <div className="primary">
              <div className="prose dark:prose-invert">
                <span>Primary - Filled</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>

              <div className="prose dark:prose-invert">
                <span>Primary - Gradient</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button variant="gradient" size="sm">
                  Small
                </Button>
                <Button variant="gradient" size="md">
                  Medium
                </Button>
                <Button variant="gradient" size="lg">
                  Large
                </Button>
                <Button variant="gradient" disabled>
                  Disabled
                </Button>
              </div>

              <div className="prose dark:prose-invert">
                <span>Primary - Outline</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button variant="outlined" size="sm">
                  Small
                </Button>
                <Button variant="outlined" size="md">
                  Medium
                </Button>
                <Button variant="outlined" size="lg">
                  Large
                </Button>
                <Button variant="outlined" disabled>
                  Disabled
                </Button>
              </div>

              <div className="prose dark:prose-invert">
                <span>Primary - Text</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button variant="text" size="sm">
                  Small
                </Button>
                <Button variant="text" size="md">
                  Medium
                </Button>
                <Button variant="text" size="lg">
                  Large
                </Button>
                <Button variant="text" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="secondary">
              <div className="prose dark:prose-invert">
                <span>Secondary - Filled</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button intent="secondary" size="sm">
                  Small
                </Button>
                <Button intent="secondary" size="md">
                  Medium
                </Button>
                <Button intent="secondary" size="lg">
                  Large
                </Button>
                <Button intent="secondary" disabled>
                  Disabled
                </Button>
              </div>

              <div className="prose dark:prose-invert">
                <span>Secondary - Gradient</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button variant="gradient" intent="secondary" size="sm">
                  Small
                </Button>
                <Button variant="gradient" intent="secondary" size="md">
                  Medium
                </Button>
                <Button variant="gradient" intent="secondary" size="lg">
                  Large
                </Button>
                <Button variant="gradient" intent="secondary" disabled>
                  Disabled
                </Button>
              </div>

              <div className="prose dark:prose-invert">
                <span>Secondary - Outline</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button variant="outlined" intent="secondary" size="sm">
                  Small
                </Button>
                <Button variant="outlined" intent="secondary" size="md">
                  Medium
                </Button>
                <Button variant="outlined" intent="secondary" size="lg">
                  Large
                </Button>
                <Button variant="outlined" intent="secondary" disabled>
                  Disabled
                </Button>
              </div>

              <div className="prose dark:prose-invert">
                <span>Secondary - Text</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button variant="text" intent="secondary" size="sm">
                  Small
                </Button>
                <Button variant="text" intent="secondary" size="md">
                  Medium
                </Button>
                <Button variant="text" intent="secondary" size="lg">
                  Large
                </Button>
                <Button variant="text" intent="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="py-4">
        <Container>
          <Card>This is a card</Card>
        </Container>
      </Section>
      <Section className="py-4">
        <Container>
          <Alert intent="primary">This is a primary alert - with some additional text here.</Alert>
          <Alert intent="secondary">
            This is a secondary alert - with some additional text here.
          </Alert>
          <Alert intent="success">This is a success alert - with some additional text here.</Alert>
          <Alert intent="info">This is a info alert - with some additional text here.</Alert>
          <Alert intent="warning">This is a warning alert - with some additional text here.</Alert>
          <Alert intent="danger">This is a danger alert - with some additional text here.</Alert>
        </Container>
      </Section>
      <Section className="py-4">
        <Container>
          Current page: {page}
          <Pagination
            currentPage={page}
            setCurrentPage={handlePageChange}
            totalPages={10}
            edgePageCount={2}
            middlePagesSiblingCount={2}
            className="flex h-10 w-full select-none items-center text-sm"
            truncableText="..."
            truncableClassName="w-10 px-0.5 text-center"
          >
            <Pagination.PrevButton
              dataTestId="pager-prev-page-button"
              className={cx(
                'mr-2 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none dark:hover:text-gray-200',
                {
                  'cursor-pointer': page !== 0,
                  'opacity-50': page === 0,
                }
              )}
            >
              Previous
            </Pagination.PrevButton>

            <div className="flex flex-grow items-center justify-center">
              <Pagination.PageButton
                dataTestIdActive="pager-active"
                dataTestIdInactive="pager-inactive"
                activeClassName="bg-primary-50 dark:bg-opacity-0 text-primary-600 dark:text-white"
                inactiveClassName="text-gray-500"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              />
            </div>

            <Pagination.NextButton
              dataTestId="pager-next-page-button"
              className={cx(
                'mr-2 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none dark:hover:text-gray-200',
                {
                  'cursor-pointer': page !== 10 - 1,
                  'opacity-50': page === 10 - 1,
                }
              )}
            >
              Next
            </Pagination.NextButton>
          </Pagination>
        </Container>
      </Section>
    </MainLayout>
  )
}
