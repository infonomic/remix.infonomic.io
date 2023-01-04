import { useState } from 'react'


import * as ToastPrimitive from '@radix-ui/react-toast'
import cx from 'classnames'
import { mergeMeta } from '~/utils/utils'

import { Button } from '~/ui/components/button'
import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'
import PublicLayout from '~/ui/layouts/public-layout'


/**
 * meta
 * @returns MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462 
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ matches }: any) => {
  const title = 'Radix Toast - Infonomic Remix Workbench'
  return mergeMeta(matches,
    [
      { title },
      { property: 'og:title', content: title },
    ]
  )
}

/**
 * ThemeRadixToast
 * @returns
 */
export default function ThemeRadixToast() {
  let [toast, setToast] = useState(false)

  return (
    <PublicLayout>
      <Section className="flex-1 py-4">
        <Container className="text-black">
          <Button
            onClick={() => {
              if (toast) {
                setToast(false)
                setTimeout(() => {
                  setToast(true)
                }, 400)
              } else {
                setToast(true)
              }
            }}
          >
            Click
          </Button>
          <ToastPrimitive.Root
            open={toast}
            onOpenChange={setToast}
            className={cx(
              'fixed inset-x-4 bottom-4 z-50 w-auto rounded-lg shadow-lg md:top-[62px] md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm',
              'bg-white dark:bg-gray-800',
              'radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right',
              'radix-state-closed:animate-toast-hide',
              'radix-swipe-end:animate-toast-swipe-out',
              'translate-x-radix-toast-swipe-move-x',
              'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]',
              'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
            )}
          >
            <div className="flex">
              <div className="flex w-0 flex-1 items-center py-4 pl-5">
                <div className="radix w-full">
                  <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Pull Request Review
                  </ToastPrimitive.Title>
                  <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                    Someone requested your review on{' '}
                    <span className="font-medium">repository/branch</span>
                  </ToastPrimitive.Description>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col space-y-1 px-3 py-2">
                  <div className="flex h-0 flex-1">
                    <ToastPrimitive.Action
                      altText="view now"
                      className="flex w-full items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-purple-600 hover:bg-gray-50 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:text-purple-500 dark:hover:bg-gray-900"
                      onClick={e => {
                        e.preventDefault()
                        window.open('https://github.com')
                      }}
                    >
                      Review
                    </ToastPrimitive.Action>
                  </div>
                  <div className="flex h-0 flex-1">
                    <ToastPrimitive.Close className="flex w-full items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:text-gray-100 dark:hover:bg-gray-900">
                      Dismiss
                    </ToastPrimitive.Close>
                  </div>
                </div>
              </div>
            </div>
          </ToastPrimitive.Root>
        </Container>
      </Section>
    </PublicLayout>
  )
}
