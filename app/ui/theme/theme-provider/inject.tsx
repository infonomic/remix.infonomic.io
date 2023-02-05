// Based on Matt Stobbs' excellent article https://www.mattstobbs.com/remix-dark-mode/
import { prefersDarkMQ, getPrefersColorScheme } from './utils'

// JavaScript - needs to be run BEFORE React. See root.tsx
// Sets the system preference theme if no SSR theme / cookie
// has been set. Note that this will only execute once - before
// entry.client.tsx hydrate - and so will only execute on a
// full page load or reload.
const clientThemeCode = `
;(() => {
  const head = document.documentElement;
  if(head.dataset.themeNoprefs === "true") {
    const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
      ? 'dark'
      : 'light';
    
    head.classList.toggle('dark', theme === 'dark');
    head.classList.toggle('light', theme === 'light');

    const meta = document.querySelector('meta[name=color-scheme]');
    if (meta) {
      if (theme === 'dark') {
        meta.content = 'dark light';
      } else if (theme === 'light') {
        meta.content = 'light dark';
      }
    } else {
      console.warn(
        "meta tag name='color-scheme' not found",
      );
    }
  }
})();
`

function InjectPrefersTheme({ ssrTheme }: { ssrTheme: string | null }) {
  const colorScheme = getPrefersColorScheme(ssrTheme)
  return (
    <>
      <meta name="color-scheme" content={colorScheme} />
      {ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}
    </>
  )
}

export { InjectPrefersTheme }