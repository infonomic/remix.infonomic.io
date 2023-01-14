import * as React from 'react'

import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import cx from 'classnames'
import { requireUserId } from '~/session.server'
import { mergeMeta } from '~/utils/utils'

import { Button } from '~/ui/components/button'
import { Container } from '~/ui/components/container'
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

  const url = new URL(request.url)

  // TODO: zod validator for query string params
  const pageString = url.searchParams.get('page') || '1'
  const page = parseInt(pageString, 10) || 1

  const count = 76
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

  return (
    <MainLayout>
      <Section className="py-4">
        <Container>
          Current page: {data?.meta?.currentPage}
          <Pagination
            page={data?.meta?.currentPage}
            count={data?.meta?.pageTotal}
            showFirstButton
            showLastButton
          />
        </Container>
      </Section>
    </MainLayout>
  )
}
