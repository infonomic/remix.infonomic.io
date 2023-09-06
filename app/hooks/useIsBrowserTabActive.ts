import { useEffect, useRef } from 'react'

// Check if the tab is active in the user browser
const useIsBrowserTabActive = (): boolean => {
  const isBrowserTabActiveRef = useRef<boolean>(true)

  useEffect(() => {
    const onVisibilityChange = (): void => {
      isBrowserTabActiveRef.current = document.visibilityState === 'visible'
    }

    window.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return isBrowserTabActiveRef.current
}

export default useIsBrowserTabActive
