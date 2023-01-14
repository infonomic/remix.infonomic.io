// Adapted from https://github.com/fullhdpixel/react-headless-pagination
// https://github.com/fullhdpixel/react-headless-pagination/blob/main/LICENSE
/* eslint-disable react/jsx-pascal-case */
import type { FC } from 'react'
import React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import type * as Radix from '@radix-ui/react-primitive'

const PREV_BUTTON_NAME = 'PrevButton'
const NEXT_BUTTON_NAME = 'NextButton'
const PAGE_BUTTON_NAME = 'PageButton'
const PAGINATION_NAME = 'Pagination'

type PaginationElement = React.ElementRef<typeof Primitive.nav>
type PrimitivePaginationProps = Radix.ComponentPropsWithoutRef<typeof Primitive.nav>

interface PaginationProps extends PrimitivePaginationProps {
  className?: string
  dataTestId?: string
  children?: string | React.ReactNode
}

type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>

interface ButtonProps extends PrimitiveButtonProps {
  page: number | null
  currentPage: number
  lastPage: number
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
  ({ currentPage = 1, className, children, dataTestId, ...rest }, ref) => {
    return (
      <li>
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
      </li>
    )
  }
)

PrevButton.displayName = PREV_BUTTON_NAME

const NextButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ currentPage = 1, lastPage, className, children, dataTestId, ...rest }, ref) => {
    return (
      <li>
        <Primitive.button
          ref={ref}
          className={className}
          {...rest}
          // onClick={() => next()}
          disabled={currentPage === lastPage}
          data-testid={dataTestId}
        >
          {children}
        </Primitive.button>
      </li>
    )
  }
)

NextButton.displayName = NEXT_BUTTON_NAME

const PageButton = React.forwardRef<ButtonElement, PageButtonProps>(
  (
    {
      page,
      currentPage = 1,
      lastPage,
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
        key={currentPage}
        data-testid={
          cx({
            [`${dataTestIdActive}-page-button`]: dataTestIdActive && currentPage === page,
            [`${dataTestIdInactive}-page-button-${currentPage}`]:
              dataTestIdActive && currentPage !== page,
          }) || undefined
        }
        // onClick={() => pagination.setCurrentPage(page - 1)}
        className={
          cx(className, currentPage + 1 === currentPage ? activeClassName : inactiveClassName) ||
          undefined
        }
        {...rest}
      >
        {children}
      </Primitive.button>
    )
  }
)

PageButton.displayName = PAGE_BUTTON_NAME

export const Pagination = ({ className, children, dataTestId, ...rest }: PaginationProps) => {
  return (
    <nav className={className} {...rest} aria-label="Page navigation">
      <ul className="flex items-center -space-x-px">{children}</ul>
    </nav>
  )
}

// export const Pagination = React.forwardRef<PaginationElement, PaginationProps>(PaginationImpl)

Pagination.displayName = PAGINATION_NAME

Pagination.PrevButton = PrevButton
Pagination.NextButton = NextButton
Pagination.PageButton = PageButton
