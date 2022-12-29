
import { useState } from 'react'

import type { MetaFunction } from '@remix-run/node'

import * as ToastPrimitive from '@radix-ui/react-toast'
import cx from 'classnames'

import { Button } from '~/ui/components/button'
import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'
import PublicLayout from '~/ui/layouts/public-layout'

/**
 * meta
 * @returns 
 */
export const meta: MetaFunction = () => {
  return {
    title: 'Radix Toast - Infonomic Remix Workbench',
  }
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
              'z-50 fixed bottom-4 inset-x-4 w-auto md:top-[62px] md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg',
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
              <div className="w-0 flex-1 flex items-center pl-5 py-4">
                <div className="w-full radix">
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
                <div className="flex flex-col px-3 py-2 space-y-1">
                  <div className="h-0 flex-1 flex">
                    <ToastPrimitive.Action
                      altText="view now"
                      className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-500 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                      onClick={e => {
                        e.preventDefault()
                        window.open('https://github.com')
                      }}
                    >
                      Review
                    </ToastPrimitive.Action>
                  </div>
                  <div className="h-0 flex-1 flex">
                    <ToastPrimitive.Close className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
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