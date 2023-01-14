// TODO: Implement general purpose pager
import * as React from 'react'

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

type PageSizeValue = {
  label: string
  value: string
}

const pageSizeValues: PageSizeValue[] = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '20',
    value: '20',
  },
  {
    label: '30',
    value: '30',
  },
  {
    label: '50',
    value: '50',
  },
]

const BUTTON_NAME = 'PagerButton'

type ButtonProps = JSX.IntrinsicElements['button']

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }: ButtonProps, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cx(
          'inline-flex select-none items-center justify-center text-sm font-medium',
          'rounded-md border border-slate-300 px-4 py-2 dark:border-slate-700',
          'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-900',
          'hover:bg-slate-50',
          'focus:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75',
          // Register all radix states
          'group',
          'radix-state-open:bg-slate-50 dark:radix-state-open:bg-slate-900',
          'radix-state-on:bg-slate-50 dark:radix-state-on:bg-slate-900',
          'radix-state-delayed-open:bg-slate-50 radix-state-instant-open:bg-slate-50'
        )}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = BUTTON_NAME

type SelectProps = {
  data: any
  onPageSizeChange?: (value: string) => void
  values: PageSizeValue[]
}

const Select = ({ data, values, onPageSizeChange }: SelectProps) => {
  return (
    <SelectPrimitive.Root
      onValueChange={onPageSizeChange}
      defaultValue={data?.meta?.pageSize.toString()}
    >
      <SelectPrimitive.Trigger asChild aria-label="Page Size">
        <Button>
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className="ml-2">
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </Button>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-slate-700 dark:text-slate-300">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="rounded-lg border border-slate-300 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <SelectPrimitive.Group>
            {values.map(item => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                className={cx(
                  'relative flex items-center rounded-md px-6 py-2 text-sm font-medium text-slate-700 dark:text-slate-300',
                  'focus:bg-slate-100 radix-disabled:opacity-50 dark:focus:bg-slate-900',
                  'select-none focus:outline-none'
                )}
              >
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute left-1 inline-flex items-center">
                  <CheckIcon />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-slate-700 dark:text-slate-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
}

const NAME = 'Pager'

interface PagerProps {
  data: any
  onPageChange: (value: number) => void
  onPageSizeChange: (value: string) => void
  className?: string
}

const Pager = React.forwardRef<HTMLElement, PagerProps>(
  ({ className, data, onPageChange, onPageSizeChange }, ref) => {
    const first = data?.meta?.currentPage * data?.meta?.pageSize - (data?.meta?.pageSize - 1)
    const last = first + (data?.meta?.pageSize - 1)

    const classes = twMerge(
      'flex flex-col md:flex-row md:gap-4 items-start md:items-center py-4 px-1',
      className
    )

    return (
      <nav ref={ref} className={classes} aria-label="Page navigation">
        <div className="mr-auto mb-3 text-sm font-normal text-slate-500 dark:text-slate-400 md:mb-0">
          Showing
          <span className="font-semibold text-slate-900 dark:text-white">
            {' '}
            {first}-{last < data?.meta?.total ? last : data?.meta?.total}{' '}
          </span>
          of{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{data?.meta?.total}</span>
        </div>

        <div className="mb-3 md:mb-0">
          <Select data={data} values={pageSizeValues} onPageSizeChange={onPageSizeChange} />
        </div>

        <ul className="flex items-center -space-x-px">
          <li className="flex">
            <button
              className="ml-0 flex rounded-l-md border border-slate-300 bg-white py-2 px-2 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={() => onPageChange(1)}
              disabled={data.meta.currentPage === first}
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
            </button>
          </li>
          <li className="flex">
            <button
              className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={() => onPageChange(data.meta.currentPage - 1)}
              disabled={data.meta.currentPage === first}
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
            </button>
          </li>
          <li className="flex">
            <button className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
              1
            </button>
          </li>
          <li className="flex">
            <button className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
              2
            </button>
          </li>
          <li className="flex">
            <button
              aria-current="page"
              className="z-10 border border-slate-300 bg-slate-100 py-2 px-3 leading-tight text-slate-600 hover:bg-slate-200 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
            >
              3
            </button>
          </li>
          <li className="flex">
            <button className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
              ...
            </button>
          </li>
          <li className="flex">
            <button className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
              100
            </button>
          </li>
          <li className="flex">
            <button
              className="border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={() => onPageChange(data.meta.currentPage + 1)}
              disabled={data.meta.currentPage === last}
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
            </button>
          </li>
          <li className="flex">
            <button
              className="flex rounded-r-md border border-slate-300 bg-white py-2 px-2 leading-tight text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={() => onPageChange(last)}
              disabled={data.meta.currentPage === last}
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
            </button>
          </li>
        </ul>
      </nav>
    )
  }
)

Pager.displayName = NAME

export { Pager }

export type { PagerProps }
