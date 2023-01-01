import { z } from 'zod'
import { zfd } from 'zod-form-data'

// During sign in we don't want to 'leak' password policy
// Email constraints would need to be updated if a user
// can sign in with a username or email
export const signInSchema = zfd.formData({
  email: zfd.text(
    z
      .string({
        required_error: 'Email address is required.',
        invalid_type_error: 'Email must be a string.',
      })
      .email({ message: 'Please enter a valid email address.' })
  ),
  password: zfd.text(
    z.string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.',
    })
  ),
})

export const signUpSchema = zfd.formData({
  email: zfd.text(
    z
      .string({
        required_error: 'Email address is required.',
        invalid_type_error: 'Email must be a string.',
      })
      .email({ message: 'Please enter a valid email address.' })
  ),
  password: zfd.text(
    z
      .string({
        required_error: 'Password is required.',
        invalid_type_error: 'Password must be a string.',
      })
      .min(8, { message: 'Password must be 8 or more characters long.' })
      .transform(s => s.trim())
      .refine(s => s.length > 0, 'Password cannot be empty.')
  ),
})
