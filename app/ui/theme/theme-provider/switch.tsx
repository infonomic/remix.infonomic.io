import React from 'react'

import cx from 'classnames'

import LightIcon from '~/ui/icons/light-icon'
import MoonIcon from '~/ui/icons/moon-icon'
import { Theme, useTheme } from '~/ui/theme/theme-provider'

type ThemeSwitchIntrinsicProps = JSX.IntrinsicElements['div']
interface ThemeSwitchProps extends ThemeSwitchIntrinsicProps {
  className?: string
}

const ThemeSwitch = React.forwardRef<HTMLDivElement, ThemeSwitchProps>(
  ({ className, ...rest }, ref) => {
    const themeContext = useTheme()
    const isDark = themeContext.theme == Theme.DARK

    const handleThemeChange = () => {
      themeContext.setTheme(isDark ? Theme.LIGHT : Theme.DARK)
    }

    const classes = cx('theme-switch', className)

    return (
      <div
        ref={ref}
        className={classes}
        role="button"
        tabIndex={0}
        aria-label="Change theme"
        onClick={handleThemeChange}
        onKeyDown={handleThemeChange}
        {...rest}
      >
        <div style={{ position: 'relative', width: '24px', height: '24px' }}>
          <div className={`light ${isDark ? 'shown' : 'hidden'}`}>
            <LightIcon svgClassName="dark:fill-white" />
          </div>
          <div className={`moon ${isDark ? 'hidden' : 'shown'}`}>
            <MoonIcon />
          </div>
        </div>
      </div>
    )
  }
)

ThemeSwitch.displayName = 'Container'

export { ThemeSwitch }

export type { ThemeSwitchProps }
