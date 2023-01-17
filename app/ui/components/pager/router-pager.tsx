import { Link } from '@remix-run/react'

import { Pagination, FirstIcon, PreviousIcon, NextIcon, LastIcon } from '~/ui/components/pager'

export interface RouterPagerProps {
  page: number
  count: number
  showFirstButton?: boolean
  showLastButton?: boolean
}

/**
 * A convenience Remix Router pager, wrapped around Pagination with
 * example render methods and 'asChild' props. 'asChild' will allow you
 * supply a new child to render while also merging the existing props
 * (including styles) of the default component (First, Previous, PageNumber,
 * Nest, Last buttons etc.)
 */
export const RouterPager = ({
  page,
  count,
  showFirstButton = true,
  showLastButton = true,
}: RouterPagerProps) => {
  return (
    <Pagination
      page={page}
      count={count}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
    >
      <Pagination.Root>
        <Pagination.Pager
          renderFirst={(key, disabled) => (
            <Pagination.First asChild key={key} disabled={disabled}>
              {disabled ? (
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
          renderPrevious={(key, item, disabled) => (
            <Pagination.Previous asChild key={key} page={item.page} disabled={disabled}>
              {disabled ? (
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
          renderPageNumber={(key, item, disabled) => (
            <Pagination.PageNumber
              asChild
              key={key}
              page={item.page}
              selected={item.selected}
              disabled={disabled}
              activeClassName="active"
            >
              {disabled ? (
                <div>{item.page}</div>
              ) : (
                <Link to={`.?page=${item.page}`}>{item.page}</Link>
              )}
            </Pagination.PageNumber>
          )}
          renderNext={(key, item, disabled) => (
            <Pagination.Next asChild key={key} page={item.page} disabled={disabled}>
              {disabled ? (
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
          renderLast={(key, disabled) => (
            <Pagination.Last asChild key={key} disabled={disabled}>
              {disabled ? (
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
