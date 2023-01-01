import { Link, useSubmit } from '@remix-run/react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {
  CaretRightIcon,
  FileIcon,
  FileTextIcon,
  Link2Icon,
  MixerHorizontalIcon,
  PersonIcon,
  TransparencyGridIcon,
  ExitIcon,
} from '@radix-ui/react-icons'
import cx from 'classnames'
import { useUser } from '~/utils/utils'

import { Avatar } from '~/ui/components/avatar'

interface User {
  name: string
  url?: string
}

const users: User[] = [
  {
    name: 'Adam',
    url: 'https://github.com/adamwathan.png',
  },
  {
    name: 'Steve',
    url: 'https://github.com/steveschoger.png',
  },
  {
    name: 'Robin',
    url: 'https://github.com/robinmalfait.png',
  },
]

export const MainMenu = () => {
  const submit = useSubmit()
  const user = useUser()

  const menuItemClasses = cx(
    'flex cursor-default select-none items-center rounded-md px-2 py-2 md:text-sm outline-none',
    'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
  )

  /**
   * handleSignOut
   * reCaptcha token.
   * @param event
   */
  const handleSignOut = async () => {
    submit({}, { method: 'post', action: '/sign-out', replace: true })
  }

  return (
    <div className="relative h-10 w-10 text-left">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button className="inline-flex h-10 w-10 rounded-full outline-none">
            <Avatar />
          </button>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="end"
            sideOffset={18}
            className={cx(
              'radix-side-bottom:animate-slide-down radix-side-top:animate-slide-up',
              'w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56',
              'bg-white dark:bg-gray-800'
            )}
          >
            <DropdownMenuPrimitive.Item asChild className={menuItemClasses}>
              <Link to="/notes/new">
                <FileTextIcon className="mr-2 h-3.5 w-3.5" />
                <span className="flex-grow text-gray-700 dark:text-gray-300">New Note</span>
                <span className="text-sm">⌘+N</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item asChild className={menuItemClasses}>
              <Link to="/notes">
                <FileIcon className="mr-2 h-3.5 w-3.5" />
                <span className="flex-grow text-gray-700 dark:text-gray-300">Notes</span>
                <span className="text-sm">⌘+L</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <DropdownMenuPrimitive.Item asChild className={menuItemClasses}>
              <Link to="/account">
                <MixerHorizontalIcon className="mr-2 h-3.5 w-3.5" />
                <span className="flex-grow text-gray-700 dark:text-gray-300">Account</span>
                <span className="text-sm">⌘+A</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <DropdownMenuPrimitive.Item asChild className={menuItemClasses}>
              <Link to="/theme">
                <TransparencyGridIcon className="mr-2 h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                <span className="flex-grow text-gray-700 dark:text-gray-300">Theme</span>
                <span className="text-sm">⌘+T</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            {user.isAdmin && (
              <>
                <DropdownMenuPrimitive.Label className="select-none px-2 py-2 text-sm text-gray-700 dark:text-gray-200">
                  Admin Tools
                </DropdownMenuPrimitive.Label>

                <DropdownMenuPrimitive.Item asChild className={menuItemClasses}>
                  <Link to="/admin/users">
                    <PersonIcon className="mr-2 h-3.5 w-3.5" />
                    <span className="flex-grow text-gray-700 dark:text-gray-300">Users</span>
                    <span className="text-sm">⌘+U</span>
                  </Link>
                </DropdownMenuPrimitive.Item>

                <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              </>
            )}

            <DropdownMenuPrimitive.Sub>
              <DropdownMenuPrimitive.SubTrigger className={menuItemClasses}>
                <Link2Icon className="mr-2 h-3.5 w-3.5" />
                <span className="flex-grow text-gray-700 dark:text-gray-300">Share</span>
                <CaretRightIcon className="h-3.5 w-3.5" />
              </DropdownMenuPrimitive.SubTrigger>
              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.SubContent
                  className={cx(
                    'origin-radix-dropdown-menu radix-side-right:animate-scale-in',
                    'w-full rounded-md px-1 py-1 text-sm shadow-md',
                    'bg-white dark:bg-gray-800'
                  )}
                >
                  {users.map(({ name, url }, i) => (
                    <DropdownMenuPrimitive.Item
                      key={`${name}-${i}`}
                      className={cx(menuItemClasses, 'w-28 md:w-32')}
                    >
                      {url
? (
                        <img className="mr-2.5 h-6 w-6 rounded-full" src={url} alt={name} />
                      )
: (
                        <PersonIcon className="mr-2.5 h-6 w-6" />
                      )}
                      <span className="text-gray-700 dark:text-gray-300">{name}</span>
                    </DropdownMenuPrimitive.Item>
                  ))}
                </DropdownMenuPrimitive.SubContent>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Sub>

            <DropdownMenuPrimitive.Item onSelect={handleSignOut} className={menuItemClasses}>
              <ExitIcon className="mr-2 h-3.5 w-3.5" />
              <span className="flex-grow text-gray-700 dark:text-gray-300">Sign Out</span>
              <span className="text-sm">⌘+Q</span>
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  )
}
