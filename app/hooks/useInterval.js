import { useEffect, useState, useRef } from 'react'

/**
 * If always options: always is true, the interval will be active
 * irrespective of tab state (i.e. tab is active and focused or not in
 * focus or minimized) effectively making useInterval an 'always on' check
 * (as long as the component using useInterval is still mounted)
 * @param {*} duration - interval in milliseconds
 * @param {*} options - { always: bool, running: bool}
 * @returns
 */
const useInterval = (duration, options = {}) => {
  const defaults = { always: false, running: true }
  const settings = { ...defaults, ...options }
  const isBrowserTabActiveRef = useRef(true)

  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(settings.running)

  const stop = () => {
    setRunning(false)
    setCount(0)
  }

  const start = () => {
    setRunning(true)
  }

  useEffect(() => {
    const onVisibilityChange = () => {
      isBrowserTabActiveRef.current = document.visibilityState === 'visible'
    }

    if (!settings.always) {
      window.addEventListener('visibilitychange', onVisibilityChange)
    }

    if (duration > 0 && running) {
      const interval = setInterval(() => {
        // will always be true if the always option is true but add the check here
        // for readability
        if (isBrowserTabActiveRef.current || settings.always) {
          setCount(prev => prev + 1)
        }
      }, duration)

      // Return the 'unmount' callback
      return () => {
        clearInterval(interval)
        if (!settings.always) {
          window.removeEventListener('visibilitychange', onVisibilityChange)
        }
      }
    } else {
      // Return no 'unmount' callback
      return null
    }
  }, [duration, isBrowserTabActiveRef, settings.always, running])

  return {
    count,
    stop,
    start,
    running,
  }
}

export default useInterval
