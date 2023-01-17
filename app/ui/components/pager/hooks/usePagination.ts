// https://github.com/mui/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js
// https://github.com/mui/material-ui/blob/master/LICENSE

import type { UsePaginationResult, UsePaginationProps, UsePaginationItem } from './types/usePagination'

export function usePagination(props: UsePaginationProps): UsePaginationResult {
  const {
    boundaryCount = 1,
    count = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page = 1,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    ...other
  } = props

  const handleClick = (event: any, value: number) => {
    if (handleChange) {
      handleChange(event, value)
    }
  }

  // https://dev.to/namirsab/comment/2050
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  )

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList = [
    ...(showFirstButton ? ['first'] : []),
    ...(hidePrevButton ? [] : ['previous']),
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['end-ellipsis']
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : ['next']),
    ...(showLastButton ? ['last'] : []),
  ]

  // Map the button type to its page number
  const buttonPage = (type: string) => {
    switch (type) {
      case 'first':
        return 1
      case 'previous':
        return page - 1
      case 'next':
        return page + 1
      case 'last':
        return count
      default:
        return 1
    }
  }

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map(item => {
    return typeof item === 'number'
      ? {
        onClick: (event: any) => {
          handleClick(event, item)
        },
        type: 'page',
        page: item,
        selected: item === page,
        disabled: item === page,
        'aria-current': item === page ? 'true' : undefined,
      } as UsePaginationItem
      : {
        onClick: (event: any) => {
          handleClick(event, buttonPage(item))
        },
        type: item,
        page: buttonPage(item),
        selected: false,
        disabled:
          disabled ||
          (item.indexOf('ellipsis') === -1 &&
            (item === 'next' || item === 'last' ? page >= count : page <= 1)),
      } as UsePaginationItem
  })

  return {
    items,
    ...other,
  }
}