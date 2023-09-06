import { useEffect } from 'react'

/**
  NOTE: This is a client-side JavaScript-dependent hook and helper for
  Google reCAPTCHA v3 https://developers.google.com/recaptcha/docs/v3
  The Google reCAPTCHA script will be injected into the client dynamically
  on client render in the browser. useEffect will only be called on 
  the client, and the helper reCaptchaExecute should only ever be called
  on the client via an event handler - like a click event from a button.

  It's likely that a better way to do this is via loader and link functions
  on the Remix route for the page using reCAPTCHA (like a login page and form,
  or a 'contact us' page and form). This would then support Remix's idea of
  'progressive enhancement' and no-js clients and environments.
 */

const defaultOptions = { action: 'default', callback: () => { } }

export const useReCaptcha = (options = defaultOptions): void => {
  useEffect(() => {
    const ENABLED = window.ENV.RECAPTCHA_ENABLED
    const SCRIPT_ELEMENT = 'recaptcha-script'
    const SITE_KEY = window.ENV.RECAPTCHA_SITE_KEY
    // const URL = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    // recaptcha.net is in theory more accessible for Chinese users.
    const URL = `https://www.recaptcha.net/recaptcha/api.js?render=${SITE_KEY}`
    if (ENABLED === 'true') {
      const element = document.getElementById(SCRIPT_ELEMENT)
      if (element == null) {
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

export const reCaptchaExecute = async (action: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ENABLED = window.ENV.RECAPTCHA_ENABLED
    const SITE_KEY = window.ENV.RECAPTCHA_SITE_KEY
    if (ENABLED === 'true') {
      // @ts-expect-error: we know this
      window.grecaptcha.ready(() => {
        // @ts-expect-error: we know this
        window.grecaptcha.execute(SITE_KEY, { action }).then((token: string) => {
          resolve(token)
        }, reject)
      })
    } else {
      resolve('')
    }
  })
}
