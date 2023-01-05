import { Link, useMatches } from '@remix-run/react'

import { truncate } from '~/utils/utils'

import type { Breadcrumb } from '~/ui/components/breadcrumbs/types/breadcrumbs'

const NAME = 'BreadcrumbTrail'

function BreadcrumbTrail() {
  const matches = useMatches()
  const crumbs: Breadcrumb[] = []

  const handles = matches.filter(match => match.handle && match.handle.breadcrumb)

  if (handles && handles.length > 0) {
    handles.forEach(match => {
      const crumb = match.handle?.breadcrumb(match)
      if (crumb) {
        if (Array.isArray(crumb)) {
          crumbs.push(...crumb)
        } else {
          crumbs.push(crumb)
        }
      }
    })
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ul className="m-0 inline-flex list-inside list-none flex-wrap items-center space-x-1 p-0 md:space-x-1">
        <li className="m-0 inline-flex items-center p-0">
          <a
            href="/"
            className="text inline-flex items-center font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </a>
        </li>
        {crumbs &&
          crumbs.length > 0 &&
          crumbs.map((crumb, index) => {
            if (index < crumbs.length - 1) {
              return (
                <li key={crumb.path} className="m-0 p-0">
                  <div className="flex items-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
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
                    <Link
                      to={crumb.path}
                      className="text font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {truncate(crumb.label, 20, true)}
                    </Link>
                  </div>
                </li>
              )
            } else {
              return (
                <li key={crumb.path} aria-current="page" className="m-0 p-0">
                  <div className="flex items-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
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
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      {truncate(crumb.label, 20, true)}
                    </span>
                  </div>
                </li>
              )
            }
          })}
      </ul>
    </nav>
  )
}

BreadcrumbTrail.displayName = NAME

export { BreadcrumbTrail }
