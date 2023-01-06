import { request } from 'undici'

export class AppError extends Error {
  constructor(message: string) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }

  // Http status code to return if this error is not caught.
  get status() {
    return 500
  }

  // Application-specific error code to help clients identify this error.
  get code() {
    return 'ERROR'
  }
}

/**
 * Error for reporting general server errors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class HTTP_REQUEST_ERROR extends AppError {
  get status() {
    return 500
  }

  get code() {
    return 'HTTP_REQUEST_ERROR'
  }
}

/**
 * Error for reporting general reCAPTCHA errors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class RECAPTCHA_VALIDATION_ERROR extends AppError {
  get status() {
    return 400
  }

  get code() {
    return 'RECAPTCHA_VALIDATION_ERROR'
  }
}

/**
 * reCaptchaCheck - perform a server-side reCaptcha validation
 * @param secretKey
 * @param token
 * @param score
 * @param ip
 * @param headers
 * @returns
 */
export const reCaptchaCheck = async (
  secretKey: string,
  token: string,
  score = 0.5,
  ip = '0.0.0.0',
  headers = {}
) => {
  const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`

  if (process.env.NODE_ENV == 'development') return true

  try {
    const { statusCode, body } = await request(VERIFY_URL, { method: 'POST' })

    if (statusCode === 200) {
      let result = await body.json()
      if (result.success && result.score >= score) {
        // TODO: Configure server-side logger
        // eslint-disable-next-line no-console
        console.info({ recaptcha_result: result, ip: ip, headers: headers })
      } else if (!result.success || result.score < score) {
        // TODO: Configure server-side logger
        // eslint-disable-next-line no-console
        console.error({ recaptcha_result: result, ip: ip, headers: headers })
        throw new RECAPTCHA_VALIDATION_ERROR(`Recaptcha verification failed for ip: ${ip}`)
      }
    } else {
      throw new RECAPTCHA_VALIDATION_ERROR(`Error in HTTP response reCaptchaCheck: ${statusCode}.`)
    }
  } catch (error) {
    // TODO: Configure server-side logger
    // eslint-disable-next-line no-console
    console.log(error)
    throw new HTTP_REQUEST_ERROR('Error in making reCaptcha request')
  }

  return true
}
