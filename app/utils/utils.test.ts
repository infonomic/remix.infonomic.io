// TODO: create real tests
import { validateEmail, mergeMeta } from './utils'

test('validateEmail returns false for non-emails', () => {
  expect(validateEmail(undefined)).toBe(false)
  expect(validateEmail(null)).toBe(false)
  expect(validateEmail('')).toBe(false)
  expect(validateEmail('not-an-email')).toBe(false)
  expect(validateEmail('n@')).toBe(false)
})

test('validateEmail returns true for emails', () => {
  expect(validateEmail('kody@example.com')).toBe(true)
})

test('mergeMeta returns a valid title and og:title', () => {
  const siteTitle = 'Site Title'
  window.ENV = { SITE_TITLE: siteTitle }
  const matches = [
    {
      meta: [
        {
          title: 'Mock title',
        },
        {
          name: 'description',
          content: 'Mock description',
        },

        {
          property: 'og:title',
          content: 'Mock og:title',
        },
      ],
      id: 'root',
    },
  ]

  const titleAfter = 'Bar'
  const merged = mergeMeta(matches, [
    { title: titleAfter },
    { property: 'og:title', content: titleAfter },
  ])

  const mergedTitle: any = merged.find((item: any) => item.title)
  const mergedOGTitle: any = merged.find((item: any) => item.property === 'og:title')
  expect(mergedTitle?.title).toEqual(`${titleAfter} - ${siteTitle}`)
  expect(mergedOGTitle?.content).toEqual(`${titleAfter} - ${siteTitle}`)
})
