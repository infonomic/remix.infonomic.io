import { useEffect } from 'react'

const SCRIPT_ELEMENT = 'recaptcha-script'
let SITE_KEY, ENABLED, URL

if (typeof window !== 'undefined') {
  SITE_KEY = window.ENV.RECAPTCHA_SITE_KEY
  ENABLED = window.ENV.RECAPTCHA_ENABLED
  // const URL = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
  // recaptcha.net is in theory more accessible for Chinese users.
  URL = `https://www.recaptcha.net/recaptcha/api.js?render=${SITE_KEY}`
}

const defaultOptions = { action: 'default', callback: () => {} }
export const useReCaptcha = (options = defaultOptions) => {
  useEffect(() => {
    if (ENABLED === 'true') {
      const element = document.getElementById(SCRIPT_ELEMENT)
      if (!element) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = SCRIPT_ELEMENT
        script.onload = options.callback
        // src must come after onload
        script.src = URL
        // const head = document.getElementsByTagName('head')[0]
        // head.appendChild(script)
        document.body.appendChild(script)
      } else {
        options.callback()
      }
    } else {
      options.callback()
    }
  }, [options])
}

export const reCaptchaExecute = async action => {
  return new Promise((resolve, reject) => {
    if (ENABLED === 'true') {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(SITE_KEY, { action }).then(token => {
          resolve(token)
        }, reject)
      })
    } else {
      resolve('')
    }
  })
}
