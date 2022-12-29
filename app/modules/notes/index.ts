import { z } from 'zod'
import { zfd } from 'zod-form-data'

import type { Note } from '~/models/note.server'

export interface NoteProps {
  note: Note
}

export const schema = zfd.formData({
  title: zfd.text(
    z
      .string({
        required_error: 'Title is required.',
        invalid_type_error: 'Title must be a string.',
      })
      .min(3, { message: 'Title must be 3 or more characters long.' })
      .transform(s => s.trim())
      .refine(s => s.length > 0, 'Title cannot be empty.')
  ),
  body: zfd.text(
    z
      .string({
        required_error: 'Body is required.',
        invalid_type_error: 'Body must be a string.',
      })
      .min(15, { message: 'Body must be 15 or more characters long.' })
      .transform(s => s.trim())
      .refine(s => s.length > 0, 'Body cannot be empty.')
  ),
})

export const badSchema = zfd.formData({
  title: zfd.text(
    z
      .string({
        required_error: 'Title is required.',
        invalid_type_error: 'Title must be a string.',
      })
      .min(3, { message: 'Title must be 3 or more characters long.' })
      .transform(s => s.trim())
      .refine(s => s.length > 0, 'Title cannot be empty.')
  ),
  body: zfd.text(
    z
      .string({
        required_error: 'Body is required.',
        invalid_type_error: 'Body must be a string.',
      })
      .min(5, { message: 'Body must be 5 or more characters long.' })
      .transform(s => s.trim())
      .refine(s => s.length > 0, 'Body cannot be empty.')
  ),
})