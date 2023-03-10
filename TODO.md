# TODO

## General

- [ ] Create mapping definitions for color theme and 'intents' in tailwind.config.js to make swapping out a base color theme and color system easier.
- [ ] Tests! Playwright and unit tests, and configure Playwright tests to run during Github deploy action
- [ ] Implement i18n and L10n - likely via [https://sergiodxa.com/articles/localizing-remix-apps-with-i18next](https://sergiodxa.com/articles/localizing-remix-apps-with-i18next) and
      [https://github.com/sergiodxa/remix-i18next](https://github.com/sergiodxa/remix-i18next)
- [ ] A11y audit
- [ ] Configure server logger with [Pino](https://github.com/pinojs/pino)
- [ ] Consider form error handling where after receiving server errors, any changes in values of the form reset server errors, and only client form errors are display
- [x] Meta - implmement meta v2, and experimental mergeMeta helper util

## Components

- [ ] Button: add 'busy' state and loader indicator (as in sign-in.tsx)
- [x] Pager: implement general purpose pager component
- [ ] Table: implement sortable columns and filter / search
- [ ] Menu: extract and create MenuItem component to DRY-up main-menu.tsx
- [ ] Input: consider implementing variants for Inputs
- [ ] Toast:
  - [x] props for position, intent and icon
  - [ ] finer grain style configuration for entrance direction, swipe direction, and exit direction
