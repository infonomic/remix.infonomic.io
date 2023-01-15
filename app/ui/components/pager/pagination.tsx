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
const FIRST_BUTTON_NAME = 'FirstButton'
const PREV_BUTTON_NAME = 'PrevButton'
const PAGE_BUTTON_NAME = 'PageButton'
const NEXT_BUTTON_NAME = 'NextButton'
const LAST_BUTTON_NAME = 'LastButton'

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
  dataTestIdActive?: string
  dataTestIdInactive?: string
  selected?: boolean
}

const FirstButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ page, count, currentPage, className, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'first ml-0 flex rounded-l-md py-2 px-2 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      ),
      className
    )

    return (
      <Primitive.button
        ref={ref}
        className={classes}
        // onClick={() => previous()}
        disabled={currentPage === 1}
        data-testid="first-page-button"
        {...rest}
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
      </Primitive.button>
    )
  }
)

FirstButton.displayName = FIRST_BUTTON_NAME

const PrevButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ page, count, currentPage, className, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'previous  py-2 px-3 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      ),
      className
    )

    return (
      <Primitive.button
        ref={ref}
        className={classes}
        {...rest}
        // onClick={() => previous()}
        disabled={currentPage === 1}
        data-testid="prev-page-button"
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
      </Primitive.button>
    )
  }
)

PrevButton.displayName = PREV_BUTTON_NAME

const PageButton = React.forwardRef<ButtonElement, PageButtonProps>(
  ({ page, count, currentPage, className, activeClassName, children, ...rest }, ref) => {
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
      <Primitive.button
        ref={ref}
        key={page}
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
        {page}
      </Primitive.button>
    )
  }
)

PageButton.displayName = PAGE_BUTTON_NAME

const NextButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ page, count, currentPage, className, children, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'previous  py-2 px-3 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      ),
      className
    )
    return (
      <Primitive.button
        ref={ref}
        className={classes}
        {...rest}
        // onClick={() => next()}
        disabled={currentPage === count}
        data-testid="next-page-button"
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
      </Primitive.button>
    )
  }
)

NextButton.displayName = NEXT_BUTTON_NAME

const LastButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ page, count, currentPage, className, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'last flex rounded-r-md py-2 px-2 leading-tight border',
        'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      ),
      className
    )
    return (
      <Primitive.button
        ref={ref}
        className={classes}
        {...rest}
        // onClick={() => next()}
        disabled={currentPage === count}
        data-testid="last-page-button"
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
      </Primitive.button>
    )
  }
)

LastButton.displayName = LAST_BUTTON_NAME

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
              <div className="cursor-default border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
                ...
              </div>
            )
            break
          case 'first':
            component = <Pagination.First page={page} count={count} currentPage={currentPage} />
            break
          case 'previous':
            component = <Pagination.Prev page={page} count={count} currentPage={currentPage} />
            break
          case 'page':
            component = (
              <Pagination.Page
                page={page}
                count={count}
                currentPage={currentPage}
                selected={selected}
                activeClassName="active"
                {...item}
              />
            )
            break
          case 'next':
            component = <Pagination.Next page={page} count={count} currentPage={currentPage} />
            break
          case 'last':
            component = <Pagination.Last page={page} count={count} currentPage={currentPage} />
            break
          default:
            component = (
              <button type="button" {...item}>
                {type}
              </button>
            )
        }
        return (
          <li className="flex" key={index}>
            {component}
          </li>
        )
      })}
    </Pagination.Root>
  )
}

// export const Pagination = React.forwardRef<PaginationElement, PaginationProps>(PaginationImpl)

Pagination.displayName = PAGINATION_NAME

Pagination.Root = Root
Pagination.First = FirstButton
Pagination.Prev = PrevButton
Pagination.Page = PageButton
Pagination.Next = NextButton
Pagination.Last = LastButton
