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
  const pageSize = 20

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
 * ThemeRadixDialog
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
            currentPage={data?.meta?.currentPage - 1}
            totalPages={data?.meta?.pageTotal}
            edgePageCount={2}
            middlePagesSiblingCount={2}
            className="flex h-10 w-full select-none items-center text-sm"
            truncableText="..."
            truncableClassName="w-10 px-0.5 text-center"
          >
            <Pagination.PrevButton
              asChild
              dataTestId="pager-prev-page-button"
              className={cx({
                'cursor-pointer': data?.meta?.currentPage !== 0,
                'opacity-50': data?.meta?.currentPage === 0,
              })}
            >
              <Link to=".?page=1">First</Link>
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
              asChild
              dataTestId="pager-next-page-button"
              className={cx(
                'mr-2 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none dark:hover:text-gray-200',
                {
                  'cursor-pointer': data?.meta?.currentPage !== data?.meta?.pageTotal - 1,
                  'opacity-50': data?.meta?.currentPage === data?.meta?.pageTotal - 1,
                }
              )}
            >
              <Link to={`.?page=${data?.meta?.pageTotal}`}>Last</Link>
            </Pagination.NextButton>
          </Pagination>
        </Container>
      </Section>
    </MainLayout>
  )
}
