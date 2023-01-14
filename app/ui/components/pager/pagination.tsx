// Adapted from https://github.com/fullhdpixel/react-headless-pagination
// https://github.com/fullhdpixel/react-headless-pagination/blob/main/LICENSE
/* eslint-disable react/jsx-pascal-case */
import type { FC } from 'react'
import React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { usePagination } from './hooks/usePagination'

import type * as Radix from '@radix-ui/react-primitive'

const PAGINATION_NAME = 'Pagination'
const ROOT_NAME = 'Root'
const PREV_BUTTON_NAME = 'PrevButton'
const NEXT_BUTTON_NAME = 'NextButton'
const PAGE_BUTTON_NAME = 'PageButton'

interface PaginationProps {
  page: number
  count: number
  className?: string
  showFirstButton?: boolean
  showLastButton?: boolean
  children?: string | React.ReactNode
}

type RootElement = React.ElementRef<typeof Primitive.nav>
type PrimitiveRootProps = Radix.ComponentPropsWithoutRef<typeof Primitive.nav>

interface RootProps extends PrimitiveRootProps {
  className?: string
  dataTestId?: string
  children?: string | React.ReactNode
}

type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>

interface ButtonProps extends PrimitiveButtonProps {
  page: number | null
  count: number
  currentPage: number
  className?: string
  dataTestId?: string
  children?: string | React.ReactNode
}

interface PageButtonProps extends ButtonProps {
  activeClassName?: string
  inactiveClassName?: string
  dataTestIdActive?: string
  dataTestIdInactive?: string
}

const PrevButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ page, count, currentPage, className, children, dataTestId, ...rest }, ref) => {
    return (
      <Primitive.button
        ref={ref}
        className={className}
        {...rest}
        // onClick={() => previous()}
        disabled={currentPage === 1}
        data-testid={dataTestId}
      >
        {children}
      </Primitive.button>
    )
  }
)

PrevButton.displayName = PREV_BUTTON_NAME

const NextButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ page, count, currentPage, className, children, dataTestId, ...rest }, ref) => {
    return (
      <Primitive.button
        ref={ref}
        className={className}
        {...rest}
        // onClick={() => next()}
        disabled={currentPage === count}
        data-testid={dataTestId}
      >
        {children}
      </Primitive.button>
    )
  }
)

NextButton.displayName = NEXT_BUTTON_NAME

const PageButton = React.forwardRef<ButtonElement, PageButtonProps>(
  (
    {
      page,
      count,
      currentPage,
      className,
      activeClassName,
      inactiveClassName,
      dataTestIdActive,
      dataTestIdInactive,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Primitive.button
        ref={ref}
        key={page}
        data-testid={
          cx({
            [`${dataTestIdActive}-page-button`]: dataTestIdActive && currentPage === page,
            [`${dataTestIdInactive}-page-button-${page}`]: dataTestIdActive && currentPage !== page,
          }) || undefined
        }
        // onClick={() => pagination.setCurrentPage(page - 1)}
        className={
          cx(className, currentPage === page ? activeClassName : inactiveClassName) || undefined
        }
        {...rest}
      >
        {children}
      </Primitive.button>
    )
  }
)

PageButton.displayName = PAGE_BUTTON_NAME

const Root = React.forwardRef<RootElement, RootProps>(
  ({ className, children, dataTestId, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        className="flex flex-col items-start py-4 px-1 md:flex-row md:items-center md:gap-4"
        {...rest}
        aria-label="Page navigation"
      >
        <ul className="flex items-center -space-x-px">{children}</ul>
      </nav>
    )
  }
)

Root.displayName = ROOT_NAME

export const Pagination = ({
  page: currentPage,
  count,
  className,
  showFirstButton = false,
  showLastButton = false,
}: PaginationProps) => {
  const { items } = usePagination({
    page: currentPage,
    count,
    showFirstButton,
    showLastButton,
  })

  return (
    <Pagination.Root className={className}>
      {items.map(({ page, type, selected, ...item }, index) => {
        let component = null
        switch (type) {
          case 'start-ellipsis':
          case 'end-ellipsis':
            component = (
              <button className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
                ...
              </button>
            )
            break
          case 'first':
            component = (
              <Pagination.First
                page={page}
                count={count}
                currentPage={currentPage}
                dataTestId="first-page-button"
                className="first ml-0 flex rounded-l-md border border-slate-300 bg-white py-2 px-2 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
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
              </Pagination.First>
            )
            break
          case 'previous':
            component = (
              <Pagination.Prev
                page={page}
                count={count}
                currentPage={currentPage}
                dataTestId="prev-page-button"
                className="previous border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
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
              </Pagination.Prev>
            )
            break
          case 'page':
            component = (
              <Pagination.Page
                page={page}
                count={count}
                currentPage={currentPage}
                className={cx(
                  { 'font-bold': selected },
                  'border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
                )}
                activeClassName="active"
                inactiveClassName="inactive"
                dataTestIdActive="active"
                dataTestIdInactive="inactive"
                {...item}
              >
                {page}
              </Pagination.Page>
            )
            break
          case 'next':
            component = (
              <Pagination.Next
                page={page}
                count={count}
                currentPage={currentPage}
                dataTestId="next-page-button"
                className="next border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
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
              </Pagination.Next>
            )
            break
          case 'last':
            component = (
              <Pagination.Last
                page={page}
                count={count}
                currentPage={currentPage}
                dataTestId="last-page-button"
                className="last flex rounded-r-md border border-slate-300 bg-white py-2 px-2 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
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
              </Pagination.Last>
            )
            break
          default:
            component = (
              <button type="button" {...item}>
                {type}
              </button>
            )
        }
        return <li key={index}>{component}</li>
      })}
    </Pagination.Root>
  )
}

// export const Pagination = React.forwardRef<PaginationElement, PaginationProps>(PaginationImpl)

Pagination.displayName = PAGINATION_NAME

Pagination.Root = Root
Pagination.First = PrevButton
Pagination.Prev = PrevButton
Pagination.Page = PageButton
Pagination.Next = NextButton
Pagination.Last = NextButton
