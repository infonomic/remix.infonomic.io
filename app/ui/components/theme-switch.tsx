import React from 'react'

import LightIcon from '~/ui/icons/light-icon'
import MoonIcon from '~/ui/icons/moon-icon'
import { Theme, useTheme } from '~/ui/theme/theme-provider'

type ThemeSwitchIntrinsicProps = JSX.IntrinsicElements['div'];
interface ThemeSwitchProps extends ThemeSwitchIntrinsicProps { }

const ThemeSwitch = React.forwardRef<HTMLDivElement, ThemeSwitchProps>(
  ({ ...rest }, ref) => {
    const tcx = useTheme()
    const isDark = tcx.theme == Theme.DARK

    const handleThemeChange = () => {
      tcx.setTheme(previous => (previous === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))
    }

    return (
      <div
        ref={ref}
        className="theme-switch"
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
