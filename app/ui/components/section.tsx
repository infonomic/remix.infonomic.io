
import React from 'react'

import cx from 'classnames'

type SectionIntrinsicProps = JSX.IntrinsicElements['section'];
interface SectionProps extends SectionIntrinsicProps { }

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <section className={cx('relative overflow-hidden', className)} ref={ref} {...rest}>
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

export { Section }

export type { SectionProps }
