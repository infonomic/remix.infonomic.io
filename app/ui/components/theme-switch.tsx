import React from 'react'

import cx from 'classnames'

import LightIcon from '~/ui/icons/light-icon'
import MoonIcon from '~/ui/icons/moon-icon'
import { Theme, useTheme, getPrefers } from '~/ui/theme/theme-provider'

type ThemeSwitchIntrinsicProps = JSX.IntrinsicElements['div']
interface ThemeSwitchProps extends ThemeSwitchIntrinsicProps {
  className?: string
}

const ThemeSwitch = React.forwardRef<HTMLDivElement, ThemeSwitchProps>(
  ({ className, ...rest }, ref) => {
    const tcx = useTheme()
    const currentTheme = tcx.theme ? tcx.theme : getPrefers()
    const isDark = currentTheme === Theme.DARK

    const handleThemeChange = () => {
      let newTheme
      if (tcx.theme) {
        newTheme = tcx.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
      } else {
        newTheme = Theme.LIGHT
      }
      tcx.setTheme(newTheme)
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
