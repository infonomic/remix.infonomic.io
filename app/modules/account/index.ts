import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const emailSchema = zfd.formData({
  email: zfd.text(
    z
      .string({
        required_error: 'Email address is required.',
        invalid_type_error: 'Email must be a string.',
      })
      .email({ message: 'Please enter a valid email address.' })
  ),
})

export const passwordSchema = zfd
  .formData({
    currentPassword: zfd.text(
      z
        .string({
          required_error: 'Password is required.',
          invalid_type_error: 'Password must be a string.',
        })
        .transform(s => s.trim())
        .refine(s => s.length > 0, 'Password cannot be empty.')
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
    confirmPassword: zfd.text(
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
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirmed password does not match new password.',
        path: ['confirmPassword'],
      })
    }
  })
