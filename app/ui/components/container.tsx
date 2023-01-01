import React from 'react'

import cx from 'classnames'

type ContainerIntrinsicProps = JSX.IntrinsicElements['div']
interface ContainerProps extends ContainerIntrinsicProps {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        {...rest}
        className={cx(
          'mx-auto w-full px-[18px] lg:max-w-[990px] xl:max-w-[1200px] 2xl:max-w-[1500px]',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export { Container }

export type { ContainerProps }
