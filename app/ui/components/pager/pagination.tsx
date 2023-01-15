/* eslint-disable react/jsx-pascal-case */
import * as React from 'react'

import { render } from '@headlessui/react/dist/utils/render'
import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { usePagination } from './hooks/usePagination'
import { FirstIcon, PreviousIcon, NextIcon, LastIcon } from './icons'

import type { UsePaginationItem } from './hooks/types/usePagination'
import type * as Radix from '@radix-ui/react-primitive'

const PAGINATION_NAME = 'Pagination'
const ROOT_NAME = 'Root'
const FIRST_BUTTON_NAME = 'FirstButton'
const PREV_BUTTON_NAME = 'PreviousButton'
const PAGES_NAME = 'Pages'
const PAGE_BUTTON_NAME = 'PageButton'
const NEXT_BUTTON_NAME = 'NextButton'
const LAST_BUTTON_NAME = 'LastButton'

type PagerContextType = {
  count: number
  currentPage: number
  items: UsePaginationItem[]
  showFirstButton: boolean
  showLastButton: boolean
}

const PagerContext = React.createContext<PagerContextType>({
  count: 10,
  currentPage: 1,
  items: [],
  showFirstButton: false,
  showLastButton: false,
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Pagination
export interface PaginationProps {
  page: number
  count: number
  className?: string
  showFirstButton?: boolean
  showLastButton?: boolean
  children?: React.ReactNode
}

export const Pagination = ({
  page: currentPage,
  count,
  showFirstButton = false,
  showLastButton = false,
  children,
}: PaginationProps) => {
  const { items } = usePagination({
    page: currentPage,
    count,
    showFirstButton,
    showLastButton,
  })

  const context = React.useMemo(() => {
    return { count, currentPage, items, showFirstButton, showLastButton }
  }, [count, currentPage, items, showFirstButton, showLastButton])

  return <PagerContext.Provider value={context}>{children}</PagerContext.Provider>
}

Pagination.displayName = PAGINATION_NAME

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// First, Pre, Next, Last, Pages Buttons
export type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>

export interface ButtonProps extends PrimitiveButtonProps {
  className?: string
  dataTestId?: string
  children?: React.ReactNode
}

const FirstButton = React.forwardRef<ButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
  const { currentPage } = React.useContext(PagerContext)
  const disabled = currentPage === 1
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
})

FirstButton.displayName = FIRST_BUTTON_NAME

export interface PreviousButtonProps extends ButtonProps {
  page: number | null
  disabled: boolean
}

const PreviousButton = React.forwardRef<ButtonElement, PreviousButtonProps>(
  ({ className, page, disabled, ...rest }, ref) => {
    const { currentPage } = React.useContext(PagerContext)
    disabled = currentPage === 1
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
          {...rest}
          // onClick={() => previous()}
          disabled={disabled}
          data-testid="prev-page-button"
        >
          {rest.asChild ? rest.children : <PreviousIcon />}
        </Primitive.button>
      </li>
    )
  }
)

PreviousButton.displayName = PREV_BUTTON_NAME

export interface PageButtonProps extends ButtonProps {
  page: number | null
  activeClassName?: string
  dataTestIdActive?: string
  dataTestIdInactive?: string
  selected?: boolean
}

const PageButton = React.forwardRef<ButtonElement, PageButtonProps>(
  ({ page, className, activeClassName, ...rest }, ref) => {
    const { currentPage } = React.useContext(PagerContext)
    const classes = twMerge(
      cx(
        'block min-w-[42px] py-2 px-2 leading-tight text-center border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      ),
      className
    )

    const active = twMerge(
      classes,
      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-white',
      activeClassName
    )

    return (
      <li className="flex">
        <Primitive.button
          ref={ref}
          data-testid={
            cx({
              'active-page-button': currentPage === page,
              [`inactive-page-button-${page}`]: currentPage !== page,
            }) || undefined
          }
          // onClick={() => pagination.setCurrentPage(page - 1)}
          className={cx(currentPage === page ? active : classes) || undefined}
          {...rest}
        >
          {rest.asChild ? rest.children : <>{page}</>}
        </Primitive.button>
      </li>
    )
  }
)

PageButton.displayName = PAGE_BUTTON_NAME

export interface NextButtonProps extends ButtonProps {
  page: number | null
  disabled: boolean
}

const NextButton = React.forwardRef<ButtonElement, NextButtonProps>(
  ({ className, page, disabled, ...rest }, ref) => {
    const { count, currentPage } = React.useContext(PagerContext)
    disabled = currentPage === count
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
          {...rest}
          // onClick={() => next()}
          disabled={disabled}
          data-testid="next-page-button"
        >
          {rest.asChild ? rest.children : <NextIcon />}
        </Primitive.button>
      </li>
    )
  }
)

NextButton.displayName = NEXT_BUTTON_NAME

const LastButton = React.forwardRef<ButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
  const { count, currentPage } = React.useContext(PagerContext)
  const disabled = currentPage === count
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
        {...rest}
        // onClick={() => next()}
        disabled={disabled}
        data-testid="last-page-button"
      >
        {rest.asChild ? rest.children : <LastIcon />}
      </Primitive.button>
    </li>
  )
})

LastButton.displayName = LAST_BUTTON_NAME

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Pages container component
export interface PagesProps {
  children?: React.ReactNode
  renderFirst?: (key: string) => React.ReactNode
  renderPrevious?: (key: string, item: UsePaginationItem, disabled: boolean) => React.ReactNode
  renderPage?: (key: string, item: UsePaginationItem) => React.ReactNode
  renderNext?: (key: string, item: UsePaginationItem, disabled: boolean) => React.ReactNode
  renderLast?: (key: string) => React.ReactNode
}

const Pages = ({
  renderFirst = key => <Pagination.First key={key} />,
  renderPrevious = (key, item, disabled) => (
    <Pagination.Previous key={key} page={item.page} disabled={disabled} />
  ),
  renderPage = (key, item) => (
    <Pagination.Page key={key} page={item.page} selected={item.selected} activeClassName="active" />
  ),
  renderNext = (key, item, disabled) => (
    <Pagination.Next key={key} page={item.page} disabled={disabled} />
  ),
  renderLast = key => <Pagination.Last key={key} />,
}: PagesProps) => {
  const { items, count, currentPage } = React.useContext(PagerContext)

  return (
    <>
      {items.map((item, index) => {
        const key = `${item.page}-${index}`
        let disabled = false
        switch (item.type) {
          case 'start-ellipsis':
          case 'end-ellipsis':
            return (
              <li className="flex" key={key}>
                <div className="min-w-[44px] cursor-default border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
                  ...
                </div>
              </li>
            )
          case 'first':
            return renderFirst(key)
          case 'previous':
            disabled = currentPage === 1
            return renderPrevious(key, item, disabled)
          case 'page':
            return renderPage(key, item)
          case 'next':
            disabled = currentPage === count
            return renderNext(key, item, disabled)
          case 'last':
            return renderLast(key)
          default:
            return null
        }
      })}
    </>
  )
}

Pages.displayName = PAGES_NAME

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
Pagination.First = FirstButton
Pagination.Previous = PreviousButton
Pagination.Pages = Pages
Pagination.Page = PageButton
Pagination.Next = NextButton
Pagination.Last = LastButton
