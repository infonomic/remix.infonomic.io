import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import cx from 'classnames'

import { Button } from '~/ui/components/button'
import type { intent } from '~/ui/components/types/shared'

type SelectValue = {
  label: string
  value: string
}

type Props = {
  values: SelectValue[]
  defaultValue: string
  disabledValue?: string
  intent?: intent
}

export const Select = ({ values, defaultValue, disabledValue, intent }: Props) => {
  return (
    <SelectPrimitive.Root defaultValue={defaultValue}>
      <SelectPrimitive.Trigger asChild aria-label="Food">
        <Button intent={intent} className="min-h-[23px] py-2 px-4">
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className="ml-2">
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </Button>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
          <SelectPrimitive.Group>
            {values.map(item => (
              <SelectPrimitive.Item
                disabled={item.value === disabledValue}
                key={item.value}
                value={item.value}
                className={cx(
                  'relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-900',
                  'radix-disabled:opacity-50',
                  'select-none focus:outline-none'
                )}
              >
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
}

export default Select
