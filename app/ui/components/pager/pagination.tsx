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
}

const PagerContext = React.createContext<PagerContextType>({
  count: 1,
  currentPage: 1,
  hideNextButton: false,
  hidePrevButton: false,
  items: [],
  showFirstButton: false,
  showLastButton: false,
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
  } = rest

  const context = React.useMemo(() => {
    return {
      items,
      count,
      currentPage,
      hideNextButton,
      hidePrevButton,
      showFirstButton,
      showLastButton,
    }
  }, [items, count, currentPage, hideNextButton, hidePrevButton, showFirstButton, showLastButton])

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
  onClick?: React.ReactEventHandler
}

const FirstButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ className, disabled, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'first ml-0 flex rounded-l-md py-2 px-2 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
        { 'cursor-default': disabled }
      ),
      className
    )

    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          className={classes}
          // onClick={() => previous()}
          disabled={disabled}
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
  ({ className, disabled, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'previous  py-2 px-3 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
        { 'cursor-default': disabled }
      ),
      className
    )

    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          className={classes}
          // onClick={() => previous()}
          disabled={disabled}
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
  ({ page, className, disabled, activeClassName, ...rest }, ref) => {
    const { currentPage } = React.useContext(PagerContext)
    const classes = twMerge(
      cx(
        'block min-w-[42px] py-2 px-2 leading-tight text-center border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
        { 'cursor-default': disabled }
      ),
      className
    )

    const active = twMerge(
      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-white',
      classes,
      activeClassName
    )

    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          // onClick={() => pagination.setCurrentPage(page - 1)}
          className={cx(currentPage === page ? active : classes) || undefined}
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
  ({ className, page, disabled, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'previous  py-2 px-3 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
        { 'cursor-default': disabled }
      ),
      className
    )
    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          className={classes}
          // onClick={() => next()}
          disabled={disabled}
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
  ({ className, disabled, count, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'last flex rounded-r-md py-2 px-2 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
        { 'cursor-default': disabled }
      ),
      className
    )
    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          className={classes}
          // onClick={() => next()}
          disabled={disabled}
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
                    'min-w-[44px] cursor-default border py-2 px-3 leading-tight',
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
