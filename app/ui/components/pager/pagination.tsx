// Initial styling adapted from https://flowbite.com/docs/components/pagination/
// https://github.com/themesberg/flowbite/blob/main/LICENSE.md
// usePagination hook from...
// https://github.com/mui/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js
// https://github.com/mui/material-ui/blob/master/LICENSE
/* eslint-disable react/jsx-pascal-case */
import * as React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { usePagination } from './hooks/usePagination'
import { FirstIcon, PreviousIcon, NextIcon, LastIcon } from './icons'

import type { UsePaginationProps, UsePaginationItem } from './hooks/types/usePagination'
import type * as Radix from '@radix-ui/react-primitive'

const PAGINATION_NAME = 'Pagination'
const ROOT_NAME = 'Root'
const PAGER_NAME = 'Pager'
const FIRST_BUTTON_NAME = 'FirstButton'
const PREV_BUTTON_NAME = 'PreviousButton'
const PAGE_NUMBER_BUTTON_NAME = 'PageNumberButton'
const NEXT_BUTTON_NAME = 'NextButton'
const LAST_BUTTON_NAME = 'LastButton'

type PagerContextType = {
  count: number
  currentPage: number
  hideNextButton?: boolean
  hidePrevButton?: boolean
  items: UsePaginationItem[]
  showFirstButton?: boolean
  showLastButton?: boolean
  eventsEnabled?: boolean
}

const PagerContext = React.createContext<PagerContextType>({
  count: 1,
  currentPage: 1,
  hideNextButton: false,
  hidePrevButton: false,
  items: [],
  showFirstButton: false,
  showLastButton: false,
  eventsEnabled: false,
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Pagination

/**
 * See ./hooks/types/usePagination.ts
 */
export interface PaginationProps extends UsePaginationProps {
  children?: React.ReactNode
}

export const Pagination = ({ children, ...rest }: PaginationProps) => {
  const { items } = usePagination({
    ...rest,
  })

  const {
    count,
    page: currentPage,
    hideNextButton,
    hidePrevButton,
    showFirstButton,
    showLastButton,
    onChange,
  } = rest

  const eventsEnabled = !!onChange

  const context = React.useMemo(() => {
    return {
      items,
      count,
      currentPage,
      hideNextButton,
      hidePrevButton,
      showFirstButton,
      showLastButton,
      eventsEnabled,
    }
  }, [
    items,
    count,
    currentPage,
    hideNextButton,
    hidePrevButton,
    showFirstButton,
    showLastButton,
    eventsEnabled,
  ])

  return <PagerContext.Provider value={context}>{children}</PagerContext.Provider>
}

Pagination.displayName = PAGINATION_NAME

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// First, Previous, Next, Last and Page number buttons
export type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>

export interface ButtonProps extends PrimitiveButtonProps {
  className?: string
  disabled: boolean
  children?: React.ReactNode
  onClick?: React.ReactEventHandler<Element> | undefined
}

const FirstButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ className, disabled, onClick, ...rest }, ref) => {
    const { eventsEnabled } = React.useContext(PagerContext)

    const hoverClasses =
      'hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white'

    const classes = twMerge(
      cx(
        'first ml-0 flex rounded-l-md py-2 px-2 leading-tight border',
        'border-slate-300 bg-white text-slate-500',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
        { 'cursor-default': disabled },
        { [hoverClasses]: !disabled }
      ),
      className
    )

    return (
      <li className="hidden sm:flex">
        <Primitive.button
          ref={ref}
          className={classes}
          onClick={eventsEnabled ? onClick : undefined}
          disabled={disabled}
          title="First"
          aria-label="First"
          data-testid="first-page-button"
          {...rest}
        >
          {rest.asChild ? rest.children : <FirstIcon />}
        </Primitive.button>
      </li>
    )
  }
)

FirstButton.displayName = FIRST_BUTTON_NAME

const PreviousButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ className, disabled, onClick, ...rest }, ref) => {
    const { eventsEnabled, showFirstButton } = React.useContext(PagerContext)

    const hoverClasses =
      'hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white'

    const classes = twMerge(
      cx(
        'previous  py-2 px-3 leading-tight border',
        'border-slate-300 bg-white text-slate-500',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
        { 'cursor-default': disabled },
        { [hoverClasses]: !disabled },
        { 'rounded-l-md': !showFirstButton }
      ),
      className
    )

    return (
      <li className="hidden sm:flex">
        <Primitive.button
          ref={ref}
          className={classes}
          onClick={eventsEnabled ? onClick : undefined}
          disabled={disabled}
          title="Previous"
          aria-label="Previous"
          data-testid="prev-page-button"
          {...rest}
        >
          {rest.asChild ? rest.children : <PreviousIcon />}
        </Primitive.button>
      </li>
    )
  }
)

PreviousButton.displayName = PREV_BUTTON_NAME

export interface PageNumberButtonProps extends ButtonProps {
  page: number | null
  activeClassName?: string
  selected?: boolean
}

const PageNumberButton = React.forwardRef<ButtonElement, PageNumberButtonProps>(
  ({ page, className, disabled, onClick, activeClassName, ...rest }, ref) => {
    const {
      currentPage,
      count,
      eventsEnabled,
      showFirstButton,
      showLastButton,
      hideNextButton,
      hidePrevButton,
    } = React.useContext(PagerContext)

    const active = page === currentPage

    let roundedFirstClasses = ''
    if (page === 1 && !showFirstButton && hidePrevButton) {
      roundedFirstClasses = 'rounded-l-md'
    } else if (page === 1) {
      roundedFirstClasses = 'rounded-l-md sm:rounded-none' // opinionated mobile
    }

    let roundedLastClasses = ''
    if (page === count && !showLastButton && hideNextButton) {
      roundedLastClasses = 'rounded-r-md'
    } else if (page === count) {
      roundedLastClasses = 'rounded-r-md sm:rounded-none' // opinionated mobile
    }

    const defaultBackground = cx(
      'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
      'dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
    )
    const activeBackground = cx(
      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-white',
      activeClassName
    )

    const classes = twMerge(
      cx(
        'block min-w-[42px] py-2 px-2 leading-tight text-center border border-slate-300 select-none dark:border-slate-700',
        { 'cursor-default': disabled },
        roundedFirstClasses,
        roundedLastClasses,
        { [defaultBackground]: !active },
        { [activeBackground]: active }
      ),
      className
    )

    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          className={classes}
          onClick={eventsEnabled ? onClick : undefined}
          data-testid={
            cx({
              'active-page-button': currentPage === page,
              [`inactive-page-button-${page}`]: currentPage !== page,
            }) || undefined
          }
          disabled={disabled}
          {...rest}
        >
          {rest.asChild ? rest.children : <>{page}</>}
        </Primitive.button>
      </li>
    )
  }
)

PageNumberButton.displayName = PAGE_NUMBER_BUTTON_NAME

export interface NextButtonProps extends ButtonProps {
  page: number | null
}

const NextButton = React.forwardRef<ButtonElement, NextButtonProps>(
  ({ className, page, disabled, onClick, ...rest }, ref) => {
    const { eventsEnabled, showLastButton } = React.useContext(PagerContext)

    const hoverClasses =
      'hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white'

    const classes = twMerge(
      cx(
        'previous  py-2 px-3 leading-tight border',
        'border-slate-300 bg-white text-slate-500',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
        { 'cursor-default': disabled },
        { [hoverClasses]: !disabled },
        { 'rounded-r-md': !showLastButton }
      ),
      className
    )
    return (
      <li className="hidden sm:flex">
        <Primitive.button
          ref={ref}
          className={classes}
          onClick={eventsEnabled ? onClick : undefined}
          disabled={disabled}
          title="Next"
          aria-label="Next"
          data-testid="next-page-button"
          {...rest}
        >
          {rest.asChild ? rest.children : <NextIcon />}
        </Primitive.button>
      </li>
    )
  }
)

NextButton.displayName = NEXT_BUTTON_NAME

export interface LastButtonProps extends ButtonProps {
  count: number
}

const LastButton = React.forwardRef<ButtonElement, LastButtonProps>(
  ({ className, disabled, count, onClick, ...rest }, ref) => {
    const { eventsEnabled } = React.useContext(PagerContext)

    const hoverClasses =
      'hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white'

    const classes = twMerge(
      cx(
        'last flex rounded-r-md py-2 px-2 leading-tight border',
        'border-slate-300 bg-white text-slate-500',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
        { 'cursor-default': disabled },
        { [hoverClasses]: !disabled }
      ),
      className
    )
    return (
      <li className="hidden sm:flex">
        <Primitive.button
          ref={ref}
          className={classes}
          onClick={eventsEnabled ? onClick : undefined}
          disabled={disabled}
          title="Last"
          aria-label="Last"
          data-testid="last-page-button"
          {...rest}
        >
          {rest.asChild ? rest.children : <LastIcon />}
        </Primitive.button>
      </li>
    )
  }
)

LastButton.displayName = LAST_BUTTON_NAME

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Pager container component
export interface PagerProps {
  children?: React.ReactNode
  renderFirst?: (key: string, item: UsePaginationItem) => React.ReactNode
  renderPrevious?: (key: string, item: UsePaginationItem) => React.ReactNode
  renderPageNumber?: (key: string, item: UsePaginationItem) => React.ReactNode
  renderNext?: (key: string, item: UsePaginationItem) => React.ReactNode
  renderLast?: (key: string, item: UsePaginationItem, count: number) => React.ReactNode
}

const Pager = ({
  renderFirst = (key, item) => (
    <Pagination.First key={key} disabled={item.disabled} onClick={item.onClick} />
  ),
  renderPrevious = (key, item) => (
    <Pagination.Previous key={key} disabled={item.disabled} onClick={item.onClick} />
  ),
  renderPageNumber = (key, item) => (
    <Pagination.PageNumber
      key={key}
      page={item.page}
      disabled={item.disabled}
      selected={item.selected}
      activeClassName="active"
      onClick={item.onClick}
    />
  ),
  renderNext = (key, item) => (
    <Pagination.Next key={key} page={item.page} disabled={item.disabled} onClick={item.onClick} />
  ),
  renderLast = (key, item, count) => (
    <Pagination.Last key={key} disabled={item.disabled} count={count} onClick={item.onClick} />
  ),
}: PagerProps) => {
  const { items, count } = React.useContext(PagerContext)

  return (
    <>
      {items.map((item, index) => {
        const key = `${item.page}-${index}`
        switch (item.type) {
          case 'start-ellipsis':
          case 'end-ellipsis':
            return (
              // TODO - extract ellipses component
              <li className="flex" key={key}>
                <div
                  className={cx(
                    'min-w-[44px] cursor-default select-none border py-2 px-3 leading-tight',
                    'border-slate-300 bg-white  text-slate-500',
                    'hover:bg-slate-100 hover:text-slate-700',
                    'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
                    'dark:hover:bg-slate-700 dark:hover:text-white'
                  )}
                >
                  ...
                </div>
              </li>
            )
          case 'first':
            return renderFirst(key, item)
          case 'previous':
            return renderPrevious(key, item)
          case 'page':
            return renderPageNumber(key, item)
          case 'next':
            return renderNext(key, item)
          case 'last':
            return renderLast(key, item, count)
          default:
            return null
        }
      })}
    </>
  )
}

Pager.displayName = PAGER_NAME

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Root
export type RootElement = React.ElementRef<typeof Primitive.nav>
type PrimitiveRootProps = Radix.ComponentPropsWithoutRef<typeof Primitive.nav>

export interface RootProps extends PrimitiveRootProps {
  className?: string
  dataTestId?: string
  children?: React.ReactNode
}

const Root = React.forwardRef<RootElement, RootProps>(
  ({ className, children, dataTestId, ...rest }, ref) => {
    const classes = twMerge(
      'flex flex-col items-start py-4 px-1 md:flex-row md:items-center md:gap-4',
      className
    )
    return (
      <Primitive.nav
        data-testid={dataTestId}
        ref={ref}
        className={classes}
        {...rest}
        aria-label="Page navigation"
      >
        <ul className="flex items-center -space-x-px">{children}</ul>
      </Primitive.nav>
    )
  }
)

Root.displayName = ROOT_NAME

Pagination.Root = Root
Pagination.Pager = Pager
Pagination.First = FirstButton
Pagination.Previous = PreviousButton
Pagination.PageNumber = PageNumberButton
Pagination.Next = NextButton
Pagination.Last = LastButton
