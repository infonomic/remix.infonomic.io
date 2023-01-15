// Adapted from https://github.com/fullhdpixel/react-headless-pagination
// https://github.com/fullhdpixel/react-headless-pagination/blob/main/LICENSE
/* eslint-disable react/jsx-pascal-case */
import type { FC } from 'react'
import * as React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'
import { TypeOf } from 'zod'

import { usePagination } from './hooks/usePagination'

import type { UsePaginationItem } from './hooks/types/usePagination'
import type * as Radix from '@radix-ui/react-primitive'

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

const PAGINATION_NAME = 'Pagination'
const ROOT_NAME = 'Root'
const FIRST_BUTTON_NAME = 'FirstButton'
const PREV_BUTTON_NAME = 'PrevButton'
const PAGES_NAME = 'Pages'
const PAGE_BUTTON_NAME = 'PageButton'
const NEXT_BUTTON_NAME = 'NextButton'
const LAST_BUTTON_NAME = 'LastButton'

interface PagesProps {
  children?: React.ReactNode
  renderPage?: (key: string, item: UsePaginationItem) => React.ReactNode
}

interface PaginationProps {
  page: number
  count: number
  className?: string
  showFirstButton?: boolean
  showLastButton?: boolean
  children?: React.ReactNode
}

type RootElement = React.ElementRef<typeof Primitive.nav>
type PrimitiveRootProps = Radix.ComponentPropsWithoutRef<typeof Primitive.nav>

interface RootProps extends PrimitiveRootProps {
  className?: string
  dataTestId?: string
  children?: React.ReactNode
}

type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>

interface ButtonProps extends PrimitiveButtonProps {
  className?: string
  dataTestId?: string
  children?: React.ReactNode
}

interface PageButtonProps extends ButtonProps {
  page: number | null
  activeClassName?: string
  dataTestIdActive?: string
  dataTestIdInactive?: string
  selected?: boolean
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
    return { items, count, currentPage, showFirstButton, showLastButton }
  }, [items, count, currentPage, showFirstButton, showLastButton])

  return <PagerContext.Provider value={context}>{children}</PagerContext.Provider>
}

Pagination.displayName = PAGINATION_NAME

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
    <li>
      <Primitive.button
        ref={ref}
        className={classes}
        // onClick={() => previous()}
        disabled={disabled}
        data-testid="first-page-button"
        {...rest}
      >
        {rest.asChild ? (
          rest.children
        ) : (
          <>
            <span className="sr-only">First</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="-ml-2 h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </>
        )}
      </Primitive.button>
    </li>
  )
})

FirstButton.displayName = FIRST_BUTTON_NAME

const PrevButton = React.forwardRef<ButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
  const { currentPage } = React.useContext(PagerContext)
  const disabled = currentPage === 1
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
    <li>
      <Primitive.button
        ref={ref}
        className={classes}
        {...rest}
        // onClick={() => previous()}
        disabled={disabled}
        data-testid="prev-page-button"
      >
        {rest.asChild ? (
          rest.children
        ) : (
          <>
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </>
        )}
      </Primitive.button>
    </li>
  )
})

PrevButton.displayName = PREV_BUTTON_NAME

const PageButton = React.forwardRef<ButtonElement, PageButtonProps>(
  ({ page, className, activeClassName, ...rest }, ref) => {
    const { currentPage } = React.useContext(PagerContext)
    const classes = twMerge(
      cx(
        'previous py-2 px-3 leading-tight border',
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
      <li key={page}>
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

const NextButton = React.forwardRef<ButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
  const { count, currentPage } = React.useContext(PagerContext)
  const disabled = currentPage === count
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
    <li>
      <Primitive.button
        ref={ref}
        className={classes}
        {...rest}
        // onClick={() => next()}
        disabled={disabled}
        data-testid="next-page-button"
      >
        {rest.asChild ? (
          rest.children
        ) : (
          <>
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </>
        )}
      </Primitive.button>
    </li>
  )
})

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
    <li>
      <Primitive.button
        ref={ref}
        className={classes}
        {...rest}
        // onClick={() => next()}
        disabled={disabled}
        data-testid="last-page-button"
      >
        {rest.asChild ? (
          rest.children
        ) : (
          <>
            <span className="sr-only">Last</span>
            <svg
              className="-mr-2 h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </>
        )}
      </Primitive.button>
    </li>
  )
})

LastButton.displayName = LAST_BUTTON_NAME

const Pages = ({
  renderPage = (key, item) => (
    <Pagination.Page key={key} page={item.page} selected={item.selected} activeClassName="active" />
  ),
}: PagesProps) => {
  debugger
  const { items } = React.useContext(PagerContext)

  return (
    <>
      {items.map(({ page, type, selected, ...item }, index) => {
        let component = null
        switch (type) {
          case 'start-ellipsis':
          case 'end-ellipsis':
            component = (
              <div className="cursor-default border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
                ...
              </div>
            )
            break
          case 'page':
            if (renderPage) {
              return renderPage(`${page}-${index}`, { page, type, selected, ...item })
            } else {
              component = (
                <Pagination.Page
                  key={`${page}-${index}`}
                  page={page}
                  selected={selected}
                  activeClassName="active"
                  {...item}
                />
              )
            }
            break
          default:
            component = null
        }
        return (
          <li className="flex" key={`${page}-${index}`}>
            {component}
          </li>
        )
      })}
    </>
  )
}

Pages.displayName = PAGES_NAME

const Root = React.forwardRef<RootElement, RootProps>(
  ({ className, children, dataTestId, ...rest }, ref) => {
    return (
      <Primitive.nav
        ref={ref}
        className="flex flex-col items-start py-4 px-1 md:flex-row md:items-center md:gap-4"
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
Pagination.Prev = PrevButton
Pagination.Pages = Pages
Pagination.Page = PageButton
Pagination.Next = NextButton
Pagination.Last = LastButton
