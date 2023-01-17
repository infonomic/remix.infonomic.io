import { Pagination } from '~/ui/components/pager'
import type { PaginationProps } from '~/ui/components/pager'

/**
 * A convenience event-based pager
 */
export const EventPager = (props: PaginationProps) => {
  return (
    <Pagination {...props}>
      <Pagination.Root>
        <Pagination.Pager />
      </Pagination.Root>
    </Pagination>
  )
}
