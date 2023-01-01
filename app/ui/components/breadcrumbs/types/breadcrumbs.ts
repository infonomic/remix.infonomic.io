import type { RouteMatch } from '@remix-run/react'

export type BreadcrumbHandle<T = any> = {
  breadcrumb: (m: RouteMatch & { data: T }) => Breadcrumb | Breadcrumb[] | undefined
}

export type Breadcrumb = {
  path: string
  label: string
}
