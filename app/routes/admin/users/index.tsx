import type { MetaFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SEARCH_PARAMS_DEFAULTS } from '~/models/user'
import { getUsers } from '~/models/user.server'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Checkbox } from '~/ui/components/input'
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadingCell,
  TableCell,
  TablePager,
  // TableFooter,
} from '~/ui/components/table'

import type { PaginationState, Updater } from '@tanstack/react-table'

type User = {
  id: string,
  email: string,
  createdAt: string
}

// TODO: implement correct SSR locale detection
const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' })

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('email', {
    header: () => 'Email',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created',
    cell: info => dateFormatter.format(Date.parse(info.renderValue() || Date.now().toString())),
    footer: () => 'Created',
  }),
]

/**
 * meta
 * @returns 
 */
export const meta: MetaFunction = () => ({
  title: 'Users - Infonomic Remix Workbench',
})

/**
 * loader
 * @param param0 
 * @returns 
 */
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)

  // TODO: zod validator for query string params
  const pageString = url.searchParams.get('page') || SEARCH_PARAMS_DEFAULTS.page.toString()
  const page = parseInt(pageString, 10)
  const pageSizeString = url.searchParams.get('pageSize') || SEARCH_PARAMS_DEFAULTS.pageSize.toString()
  const pageSize = parseInt(pageSizeString, 10)
  const { users, meta: usersMeta } = await getUsers({ ...SEARCH_PARAMS_DEFAULTS, page, pageSize })
  return json({ users, meta: usersMeta })
}

/**
 * handle
 */
export const handle: BreadcrumbHandle = {
  breadcrumb: () => {
    return [
      {
        path: '/admin',
        label: 'Admin',
      },
      {
        path: '/admin/users',
        label: 'Users',
      },
    ]
  },
}

/**
 * UserIndexPage
 * @returns 
 */
export default function UserIndexPage() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const fill = data?.meta?.pageSize - data?.users?.length ?? 10

  const pagination: PaginationState = {
    pageIndex: data?.meta?.currentPage - 1 ?? 0,
    pageSize: data?.meta?.pageSize ?? 10,
  }

  const handlePaginationChange = (state: Updater<PaginationState>) => {
    let values
    if (state instanceof Function) {
      values = state(pagination)
    } else {
      values = state
    }

    const query = new URLSearchParams()

    if (values.pageIndex + 1 !== SEARCH_PARAMS_DEFAULTS.page) {
      query.append('page', (values.pageIndex + 1).toString())
    }

    if (values.pageSize !== SEARCH_PARAMS_DEFAULTS.pageSize) {
      query.append('pageSize', values.pageSize.toString())
    }

    navigate(`?${query.toString()}`)
  }

  const handlePageSizeChange = (value: string) => {
    const query = new URLSearchParams()
    // Always go back to page 1 on pageSize change
    query.append('page', '1')
    const pageSize = parseInt(value, 10)
    if (pageSize !== SEARCH_PARAMS_DEFAULTS.pageSize) {
      query.append('pageSize', value)
    }

    navigate(`?${query.toString()}`)
  }

  // TODO: implement sortable columns

  const table = useReactTable({
    data: data?.users,
    columns,
    pageCount: data?.meta?.pageTotal ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  })

  return (
    <>
      <div className="prose dark:prose-invert mb-4">
        <h1 className="text-3xl text-slate-600">Registered Users</h1>
      </div>
      {data.users.length === 0
        ? (
          <p className="p-4">No users yet</p>
        )
        : (
          <>
            <TableContainer>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id} >
                      <TableHeadingCell scope="col" className="p-4">
                        <Checkbox id="checkbox-all-search" name="checkbox-all-search" label="" className="dark:ring-offset-slate-800" />
                      </TableHeadingCell>
                      {headerGroup.headers.map(header => (
                        <TableHeadingCell key={header.id} scope="col" className="p-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHeadingCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.map((row, index) => (
                    <TableRow key={row.id} className="bg-white border-b border-solid border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/30">
                      <TableCell className="p-4 w-4">
                        <Checkbox id={`checkbox-${index}`} name={`checkbox-${index}`} label="" className="dark:ring-offset-slate-800" />
                      </TableCell>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="p-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {fill > 0 && (
                    <TableRow
                      className="bg-white border-b border-solid border-slate-200 dark:bg-slate-800 dark:border-slate-700/60"
                      style={{ height: 54 * fill }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer >

            <TablePager data={data} table={table} onPageSizeChange={handlePageSizeChange} />
          </>
        )
      }
    </>
  )
}
