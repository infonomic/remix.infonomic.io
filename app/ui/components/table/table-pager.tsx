import * as React from 'react'

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { Tooltip } from '~/ui/components/tooltip'

type PageSizeValue = {
  label: string,
  value: string,
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
          'border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2',
          'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-900',
          'hover:bg-slate-50',
          'focus:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75',
          // Register all radix states
          'group',
          'radix-state-open:bg-slate-50 dark:radix-state-open:bg-slate-900',
          'radix-state-on:bg-slate-50 dark:radix-state-on:bg-slate-900',
          'radix-state-instant-open:bg-slate-50 radix-state-delayed-open:bg-slate-50'
        )}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = BUTTON_NAME

type SelectProps = {
  data: any,
  onPageSizeChange?: (value: string) => void
  values: PageSizeValue[]
};

const Select = ({ data, values, onPageSizeChange }: SelectProps) => {
  return (
    <SelectPrimitive.Root onValueChange={onPageSizeChange} defaultValue={data?.meta?.pageSize.toString()}>
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
        <SelectPrimitive.Viewport className="bg-white dark:bg-slate-800 p-1 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700">
          <SelectPrimitive.Group>
            {values.map(item => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                className={cx(
                  'relative flex items-center px-6 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 font-medium',
                  'focus:bg-slate-100 dark:focus:bg-slate-900 radix-disabled:opacity-50',
                  'focus:outline-none select-none'
                )}
              >
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute left-1 inline-flex items-center">
                  <CheckIcon />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            )
            )}
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-slate-700 dark:text-slate-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
}


const NAME = 'TablePager'

interface TablePagerProps {
  data: any,
  table: any,
  onPageSizeChange?: (value: string) => void,
  className?: string;
}

const TablePager = React.forwardRef<HTMLElement, TablePagerProps>(
  ({ className, data, table, onPageSizeChange }, ref) => {

    const first = (data?.meta?.currentPage * data?.meta?.pageSize) - (data?.meta?.pageSize - 1)
    const last = first + (data?.meta?.pageSize - 1)

    const classes = twMerge(
      'flex flex-col md:flex-row md:gap-4 items-start md:items-center py-4 px-1',
      className
    )

    return (
      <nav ref={ref} className={classes} aria-label="Table navigation">
        <div className="mr-auto text-sm font-normal mb-3 md:mb-0 text-slate-500 dark:text-slate-400">
          Showing
          <span className="font-semibold text-slate-900 dark:text-white">
            {' '}
            {first}-{last < data?.meta?.total ? last : data?.meta?.total}
            {' '}
          </span>
          of
          {' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {data?.meta?.total}
          </span>
        </div>

        <div className="mb-3 md:mb-0">
          <Select data={data} values={pageSizeValues} onPageSizeChange={onPageSizeChange} />
        </div>

        <ul className="flex items-center -space-x-px">
          <li className="flex">
            <Tooltip text="First" side="bottom" delay={400}>
              <button
                className="flex py-2 px-2 ml-0 leading-tight text-slate-500 bg-white rounded-l-md border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">First</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <svg className="w-5 h-5 -ml-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              </button>
            </Tooltip>
          </li>
          <li className="flex">
            <Tooltip text="Previous" side="bottom" delay={400}>
              <button
                className="py-2 px-3 leading-tight text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              </button>
            </Tooltip>
          </li>
          <li className="flex">
            <Tooltip text="Next" side="bottom" delay={400}>
              <button
                className="py-2 px-3 leading-tight text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              </button>
            </Tooltip>
          </li>
          <li className="flex">
            <Tooltip text="Last" side="bottom" delay={400}>
              <button
                className="flex py-2 px-2 leading-tight text-slate-500 bg-white rounded-r-md border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Last</span>
                <svg className="w-5 h-5 -mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              </button>
            </Tooltip>
          </li>
        </ul>
      </nav>
    )
  }
)

TablePager.displayName = NAME

export { TablePager }

export type { TablePagerProps }