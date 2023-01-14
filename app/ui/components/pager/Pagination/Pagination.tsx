// Adapted from https://github.com/fullhdpixel/react-headless-pagination
// https://github.com/fullhdpixel/react-headless-pagination/blob/main/LICENSE
/* eslint-disable react/jsx-pascal-case */
import type { FC } from 'react'
import React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import usePagination from '../Hooks/usePagination'

import type { IPagination, IPaginationProps } from './Pagination.d'
import type * as Radix from '@radix-ui/react-primitive'

type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>

const defaultState: IPagination = {
  currentPage: 0,
  setCurrentPage: () => {},
  truncableText: '...',
  truncableClassName: '',
  pages: [],
  hasPreviousPage: false,
  hasNextPage: false,
  previousPages: [],
  isPreviousTruncable: false,
  middlePages: [],
  isNextTruncable: false,
  nextPages: [],
}

const PaginationContext: React.Context<IPagination> = React.createContext(defaultState)

const PREV_BUTTON_NAME = 'PrevButton'
const NEXT_BUTTON_NAME = 'NextButton'
const PAGE_BUTTON_NAME = 'PageButton'

interface ButtonProps extends PrimitiveButtonProps {
  children?: string | React.ReactNode
  className?: string
  dataTestId?: string
}

interface PageButtonProps extends ButtonProps {
  activeClassName?: string
  inactiveClassName?: string
  dataTestIdActive?: string
  dataTestIdInactive?: string
}

const PrevButton = React.forwardRef<ButtonElement, ButtonProps>(
  ({ className, children, dataTestId, ...rest }, ref) => {
    const pagination: IPagination = React.useContext(PaginationContext)
    const previous = () => {
      if (pagination.currentPage + 1 > 1) {
        pagination.setCurrentPage(pagination.currentPage - 1)
      }
    }

    return (
      <li>
        <Primitive.button
          ref={ref}
          className={className}
          {...rest}
          onClick={() => previous()}
          disabled={pagination.currentPage === 0}
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
  ({ className, children, dataTestId, ...rest }, ref) => {
    const pagination: IPagination = React.useContext(PaginationContext)
    const next = () => {
      if (pagination.currentPage + 1 < pagination.pages.length) {
        pagination.setCurrentPage(pagination.currentPage + 1)
      }
    }

    return (
      <li>
        <Primitive.button
          ref={ref}
          className={className}
          {...rest}
          onClick={() => next()}
          disabled={pagination.currentPage === pagination.pages.length - 1}
          data-testid={dataTestId}
        >
          {children}
        </Primitive.button>
      </li>
    )
  }
)

NextButton.displayName = NEXT_BUTTON_NAME

interface ITruncableElementProps {
  prev?: boolean
}

const TruncableElement: FC<ITruncableElementProps> = ({ prev }) => {
  const pagination: IPagination = React.useContext(PaginationContext)

  const { isPreviousTruncable, isNextTruncable, truncableText, truncableClassName } = pagination

  return (isPreviousTruncable && prev === true) || (isNextTruncable && !prev) ? (
    <li className={truncableClassName || undefined}>{truncableText}</li>
  ) : null
}

const PageButton = React.forwardRef<ButtonElement, PageButtonProps>(
  (
    {
      className,
      activeClassName,
      inactiveClassName,
      dataTestIdActive,
      dataTestIdInactive,
      ...rest
    },
    ref
  ) => {
    const pagination: IPagination = React.useContext(PaginationContext)

    const renderPageButton = (page: number) => (
      <li>
        <Primitive.button
          ref={ref}
          key={page}
          data-testid={
            cx({
              [`${dataTestIdActive}-page-button`]:
                dataTestIdActive && pagination.currentPage + 1 === page,
              [`${dataTestIdInactive}-page-button-${page}`]:
                dataTestIdActive && pagination.currentPage + 1 !== page,
            }) || undefined
          }
          onClick={() => pagination.setCurrentPage(page - 1)}
          className={
            cx(
              className,
              pagination.currentPage + 1 === page ? activeClassName : inactiveClassName
            ) || undefined
          }
          {...rest}
        >
          {page}
        </Primitive.button>
      </li>
    )

    return (
      <>
        {pagination.previousPages.map(renderPageButton)}
        <TruncableElement prev />
        {pagination.middlePages.map(renderPageButton)}
        <TruncableElement />
        {pagination.nextPages.map(renderPageButton)}
      </>
    )
  }
)

PageButton.displayName = PAGE_BUTTON_NAME

export const Pagination = (paginationProps: IPaginationProps) => {
  const pagination = usePagination(paginationProps)

  return (
    <PaginationContext.Provider value={pagination}>
      <nav className={paginationProps.className} aria-label="Page navigation">
        <ul className="flex items-center -space-x-px">{paginationProps.children}</ul>
      </nav>
    </PaginationContext.Provider>
  )
}

Pagination.PrevButton = PrevButton
Pagination.NextButton = NextButton
Pagination.PageButton = PageButton
