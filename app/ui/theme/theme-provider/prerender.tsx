import { prefersDarkMQ, getPrefersColorScheme } from './utils'

// JavaScript - needs to be run BEFORE React. See root.tsx
// Sets the system preference theme if no SSR theme / cookie
// has been set. Note that this will only execute once - before
// entry.client.tsx hydrate - and so will only execute on a
// full page load or reload.
const clientThemeCode = `
;(() => {
  console.log('clientThemCode executed');
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

let renderCount = 0

function PrerenderPrefersSystem({ ssrTheme }: { ssrTheme: string | null }) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    renderCount += 1
    console.log(`${PrerenderPrefersSystem.name}. renderCount: `, renderCount)
  }

  const colorScheme = getPrefersColorScheme(ssrTheme)
  console.log(`ThemeMetaAndPrefs - prefers-color-scheme from :${colorScheme}`)

  return (
    <>
      <meta name="color-scheme" content={colorScheme} />
      {ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}
    </>
  )
}

export { PrerenderPrefersSystem }