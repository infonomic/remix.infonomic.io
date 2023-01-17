import { Link } from '@remix-run/react'

import { Pagination, FirstIcon, PreviousIcon, NextIcon, LastIcon } from '~/ui/components/pager'
import type { PaginationProps } from '~/ui/components/pager'

/**
 * A convenience Remix Router pager, wrapped around Pagination with
 * example render methods and 'asChild' props. 'asChild' will allow you
 * supply a new child to render while also merging the existing props
 * (including styles) of the default component (First, Previous, PageNumber,
 * Nest, Last buttons etc.)
 */
export const RouterPager = ({ ...rest }: PaginationProps) => {
  return (
    <Pagination {...rest}>
      <Pagination.Root>
        <Pagination.Pager
          renderFirst={(key, item) => (
            <Pagination.First asChild key={key} disabled={item.disabled}>
              {item.disabled ? (
                <div>
                  <FirstIcon />
                </div>
              ) : (
                <Link to=".">
                  <FirstIcon />
                </Link>
              )}
            </Pagination.First>
          )}
          renderPrevious={(key, item) => (
            <Pagination.Previous asChild key={key} page={item.page} disabled={item.disabled}>
              {item.disabled ? (
                <div>
                  <PreviousIcon />
                </div>
              ) : (
                <Link to={`.?page=${item.page - 1}`}>
                  <PreviousIcon />
                </Link>
              )}
            </Pagination.Previous>
          )}
          renderPageNumber={(key, item) => (
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
                <Link to={`.?page=${item.page}`}>{item.page}</Link>
              )}
            </Pagination.PageNumber>
          )}
          renderNext={(key, item) => (
            <Pagination.Next asChild key={key} page={item.page} disabled={item.disabled}>
              {item.disabled ? (
                <div>
                  <NextIcon />
                </div>
              ) : (
                <Link to={`.?page=${item.page + 1}`}>
                  <NextIcon />
                </Link>
              )}
            </Pagination.Next>
          )}
          renderLast={(key, item, count) => (
            <Pagination.Last asChild key={key} disabled={item.disabled} count={count}>
              {item.disabled ? (
                <div>
                  {' '}
                  <LastIcon />
                </div>
              ) : (
                <Link to={`.?page=${count}`}>
                  <LastIcon />
                </Link>
              )}
            </Pagination.Last>
          )}
        />
      </Pagination.Root>
    </Pagination>
  )
}
