# TODO

## General

- [ ] Configure server logger with [Pino](https://github.com/pinojs/pino)
- [ ] Consider form error handling where after receiving server errors, any changes in values of the form reset server errors, and only client form errors are display
- [ ] Implement i18n and L10n - likely via [https://sergiodxa.com/articles/localizing-remix-apps-with-i18next](https://sergiodxa.com/articles/localizing-remix-apps-with-i18next) and 
[https://github.com/sergiodxa/remix-i18next](https://github.com/sergiodxa/remix-i18next)
- [ ] A11y audit
- [ ] Tests! Playwright and unit tests

## Components

- [ ] Button: add 'busy' state and Loader indicator (as in sign-in.tsx)
- [ ] Pager: implement general purpose pager component
- [ ] Table: implement sortable columns, and filter / search