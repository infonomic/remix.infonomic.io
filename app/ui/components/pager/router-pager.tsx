import { Link } from '@remix-run/react'
import { useSearchParams } from '@remix-run/react'

import { Pagination, FirstIcon, PreviousIcon, NextIcon, LastIcon } from '~/ui/components/pager'
import type { PaginationProps } from '~/ui/components/pager'

/**
 * A convenience Remix Router pager, wrapped around Pagination with
 * example render methods and 'asChild' props. 'asChild' will allow you
 * supply a new child to render while also merging the existing props
 * (including styles) of the default component (First, Previous, PageNumber,
 * Nest, Last buttons etc.)
 */
export const RouterPager = (props: PaginationProps) => {
  const [searchParams] = useSearchParams()

  return (
    <Pagination {...props}>
      <Pagination.Root>
        <Pagination.Pager
          renderFirst={(key, item) => {
            searchParams.delete('page')
            return (
              <Pagination.First asChild key={key} disabled={item.disabled}>
                {item.disabled ? (
                  <div>
                    <FirstIcon />
                  </div>
                ) : (
                  <Link to={`.?${searchParams.toString()}`}>
                    <FirstIcon />
                  </Link>
                )}
              </Pagination.First>
            )
          }}
          renderPrevious={(key, item) => {
            searchParams.set('page', (item.page - 1).toString())
            return (
              <Pagination.Previous asChild key={key} disabled={item.disabled}>
                {item.disabled ? (
                  <div>
                    <PreviousIcon />
                  </div>
                ) : (
                  <Link to={`.?${searchParams.toString()}`}>
                    <PreviousIcon />
                  </Link>
                )}
              </Pagination.Previous>
            )
          }}
          renderPageNumber={(key, item) => {
            searchParams.set('page', item.page.toString())
            return (
              <Pagination.PageNumber
                asChild
                key={key}
                page={item.page}
                selected={item.selected}
                disabled={item.disabled}
                activeClassName="active"
              >
                {item.disabled ? (
                  <div>{item.page}</div>
                ) : (
                  <Link to={`.?${searchParams.toString()}`}>{item.page}</Link>
                )}
              </Pagination.PageNumber>
            )
          }}
          renderNext={(key, item) => {
            searchParams.set('page', (item.page + 1).toString())
            return (
              <Pagination.Next asChild key={key} page={item.page} disabled={item.disabled}>
                {item.disabled ? (
                  <div>
                    <NextIcon />
                  </div>
                ) : (
                  <Link to={`.?${searchParams.toString()}`}>
                    <NextIcon />
                  </Link>
                )}
              </Pagination.Next>
            )
          }}
          renderLast={(key, item, count) => {
            searchParams.set('page', count.toString())
            return (
              <Pagination.Last asChild key={key} disabled={item.disabled} count={count}>
                {item.disabled ? (
                  <div>
                    {' '}
                    <LastIcon />
                  </div>
                ) : (
                  <Link to={`.?${searchParams.toString()}`}>
                    <LastIcon />
                  </Link>
                )}
              </Pagination.Last>
            )
          }}
        />
      </Pagination.Root>
    </Pagination>
  )
}
