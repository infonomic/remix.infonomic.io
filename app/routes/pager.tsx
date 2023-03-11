import * as React from 'react'

import { json } from '@remix-run/node'
import type { LoaderArgs, V2_MetaFunction, V2_HtmlMetaDescriptor } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { requireUserId } from '~/session.server'
import { mergeMeta } from '~/utils/utils'

import { Container } from '~/ui/components/container'
import { RouterPager, EventPager } from '~/ui/components/pager'
import { Section } from '~/ui/components/section'
import MainLayout from '~/ui/layouts/main-layout'

/**
 * meta
 * @returns {V2_HtmlMetaDescriptor[]}
 */
export const meta: V2_MetaFunction = ({ matches }): V2_HtmlMetaDescriptor[] => {
  const title = 'Pager'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request }: LoaderArgs) {
  await requireUserId(request)

  const url = new URL(request.url)

  // TODO: zod validator for query string params
  const pageString = url.searchParams.get('page') || '1'
  const page = parseInt(pageString, 10) || 1

  const count = 232
  const pageSize = 10

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const meta: {
    total: number
    pageSize: number
    pageTotal: number
    currentPage: number
  } = {
    total: count,
    pageSize,
    pageTotal: Math.ceil(count / pageSize),
    currentPage: page,
  }

  const users: { name: string; age: number }[] = []

  return json({ users, meta })
}

/**
 * Pager
 * @returns
 */
export default function Pager() {
  const data = useLoaderData<typeof loader>()

  const [page, setPage] = React.useState(1)

  const handlePageChange = (event: any, number: number) => {
    setPage(number)
  }

  return (
    <MainLayout>
      <Section className="py-4">
        <Container>
          <p>Stateful Pagers: Current page: {page}</p>
          <EventPager
            page={page}
            count={24}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            componentName="pager1"
          />
          <EventPager page={page} count={24} onChange={handlePageChange} componentName="pager2" />
          <EventPager
            page={page}
            count={24}
            onChange={handlePageChange}
            componentName="pager3"
            hideNextButton
            hidePrevButton
          />

          <p>Stateless Pager: Current page: {data?.meta?.currentPage}</p>

          <RouterPager
            page={data?.meta?.currentPage}
            count={data?.meta?.pageTotal}
            showFirstButton
            showLastButton
            componentName="pager4"
          />
        </Container>
      </Section>
    </MainLayout>
  )
}
