export interface SearchParams {
  page: number
  pageSize: number
  orderBy: string
  orderDesc: boolean
}

export const SEARCH_PARAMS_DEFAULTS: SearchParams = {
  page: 1,
  pageSize: 10,
  orderBy: 'createdAt',
  orderDesc: true,
}
