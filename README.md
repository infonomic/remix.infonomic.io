# A Remix Demo App

A Remix demo app based on the [Remix Indie Stack](https://github.com/remix-run/indie-stack) quick-start project (a simple note-taking application)

![A Remix Note-taking App](https://github.com/infonomic/remix.infonomic.io/raw/develop/screenshot.png)

Learn more about [Remix Stacks](https://remix.run/stacks).

The original README is [further below](#original-indie-stack-quick-start-readme---whats-in-the-stack) (with some modifications)

## Rationale 

The quick-start [Indie stack example](https://github.com/remix-run/indie-stack) is a great way to get started with Remix, however, we wanted to create a fuller example with a few goals in mind:

1. We wanted to experiment with headless UI systems, in particular [Radix](https://www.radix-ui.com/) and [Radix with Tailwind CSS](https://tailwindcss-radix.vercel.app/).
2. We wanted to use [Tailwind CSS](https://tailwindcss.com/), but also wanted to configure [postcss](https://postcss.org/) to allow the creation of `.css` sidecar files for any route or component. We've followed the [styling guide](https://remix.run/docs/en/v1/guides/styling#surfacing-styles) at Remix for 'surfacing' component-level styles in routes.
3. With the above, we wanted to create a 'skeletal' UI system with core components styled for our basic light and dark themes (with a theme provider courtesy Matt Stobbs and his excellent [The Complete Guide to Dark Mode with Remix](https://www.mattstobbs.com/remix-dark-mode/) blog post). [Material UI](https://mui.com/), [Bootstrap](https://getbootstrap.com/) and others, represent great value and are a good way to kick start a design system. The MUI team in particular produce an amazing collection of free-to-use components. But we wanted to try and create a 'back to basics' design system, primarily built using CSS (as opposed to CSS-in-JS). Our design system is far from perfect, and far from complete - but it was an interesting exercise in hand picking the best available headless components out there, and adapting them to suit our needs.

## Getting Started

1. Clone or fork this repo.
2. Run `npm install` to install dependencies. If you don't want `package-lock.json` to be 'touched', or are planning on submitting a PR - please use `npm ci` instead.
3. Copy the `.env.example` file to `.env` - and optionally fill in your reCAPTCHA keys from [Google reCAPTCHA](https://www.google.com/recaptcha/about/).
4. Run `node makeSessionSecret.js` to generate your session secret and place it in your `.env` file above.
5. Copy the `prisma/users.example.json` file to `prisma/users.json` - these are the seed user accounts, including an admin user.
6. Run `npm run setup` to initialize the local SQLite database and seed users.
7. Run `npm run dev` to start your local development environment.
8. Run `rm -rf build` and `npm run build`  and `npm run start` to run a production build.
9. If you'd like to deploy the application to [Fly.io](https://fly.io) - follow the instructions below in the original README. Be sure to rename the application (and unique Fly.io app code) in the `name` section of `package.json` and the `app` section of `fly.toml`.

## Approach

### Remix

Remix is pretty cool and we admire the [Remix Philosophy](https://remix.run/docs/en/v1/pages/philosophy). We've tried to do things the Remix way - but, obviously we're new to Remix and so suggestions are welcome. There are a lot of good example Remix projects out there - including (but not limited to)...

[https://github.com/jacob-ebey/remix-dashboard-template](https://github.com/jacob-ebey/remix-dashboard-template)<br>
[https://github.com/jacob-ebey/remix-ecommerce](https://github.com/jacob-ebey/remix-ecommerce)<br>
[https://github.com/kentcdodds/kentcdodds.com](https://github.com/kentcdodds/kentcdodds.com)<br>
[https://github.com/epicweb-dev/rocket-rental](https://github.com/epicweb-dev/rocket-rental)<br>

### Directory Structure

We've seen a few different ways to organize both routes and the overall Remix directory structure. We've mostly followed the original quick-start structure, with the addition of a `modules` directory (called `route-containers`, or even `components` in other projects).

For us `modules` represent any functional or feature area of the application associated with a route. It's where route-specific React components live - like the `Hero.tsx` component in the `home` module for the home / index route.

See the [Style System](#style-system) section below for the directory structure of our style system

### Data Layer

As in the original quick-start app, this project uses [Prisma](https://www.prisma.io/) with `User` and `Note` Prisma models for data access. Prisma looks great, and we should probably spent more time with this - but we're new to Prisma as well, having relied on [Knex](https://knexjs.org/) and plain SQL for relational database query building for years now. 

We've updated the Prisma `/prisma/schema.prisma` `User` model to include an `isAdmin` field. We've also created a `/prisma/users.example.json` source user file for seeding users, including an admin account. Follow the [Getting Started](#getting-started) instructions above to rename this file and seed your database.

Again, as in the original project - we're using SQLite as the database, which makes experimenting with Remix and deploying to Fly.io a breeze.

### Style System

The project is configured to use [Tailwind CSS](https://tailwindcss.com/) and plain CSS via [postcss](https://postcss.org/) and [postcss-cli](https://github.com/postcss/postcss-cli). There is a ['SMACSS-like'](http://smacss.com/) CSS bundle in the root level `/shared/css` directory - along with the main `/shared/css/tailwind.css` and `/shared/css/app.css` source stylesheets. The 'root-level' shared CSS files and imports are processed and placed in the 'app level' styles directory with a corresponding directory structure. We've named the root-level styles directory `shared` for a reason. ;-)

We've configured postcss-cli with the `--base` switch, which will re-create the source directory structure in the target output directory. And we've configured the postcss tasks to look for 'side car' stylesheets sitting next to route or module components (see [Directory Structure](#directory-structure) above).

So...

CSS files in the root level `/shared` directory are processed and placed in the `/app/styles/shared` app-level styles directory. Any `.css` files that appear next to components or routes in the routes or modules directories are also processed and placed in the `/app/styles/app` directory.

The entire system can be illustrated as follows:

Source
<pre>
/shared
└── css
    ├── app.css
    ├── base
    │   ├── autofill.css
    │   ├── base.css
    │   ├── fonts.css
    │   ├── reset.css
    │   ├── scrollbars.css
    │   └── typography.css
    ├── components
    │   ├── components.css
    │   ├── icon-element.css
    │   └── theme-switcher.css
    ├── layouts
    │   ├── global.css
    │   └── layouts.css
    └── tailwind.css
</pre>

<pre>
/app
├── modules
│   ├── home
│   │   ├── hero.css
│   │   ├── hero.tsx
│   │   └── index.ts
└── routes
    ├── index.css
    └── index.tsx
</pre>

Output 

<pre>
/app
└── styles
    ├── app
    │   ├── modules
    │   │   └── home
    │   │       └── hero.css
    │   └── routes
    │       └── index.css
    └── shared
        └── css
            ├── app.css
            └── tailwind.css

</pre>

This means of course that you will need to import stylesheets from the `/app/styles` directory, and not the source route, module or shared CSS directories. In order to 'surface' module-level stylesheets in a route, we followed the [styling guide](https://remix.run/docs/en/v1/guides/styling#surfacing-styles) at Remix. It's not a perfect 'co-located' setup - but it works, and it was the best we could come up with for now. Again - suggestions welcome. You can see an example that combines the `Hero.css` stylesheet with the `index.css` stylesheet here in the [index.tsx route](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/routes/index.tsx). 

### Components and Design System

Building a complete design system including design language and tokens is not a small task and we've barely scratched the surface. We've mostly relied on Tailwind CSS utility classes and Tailwind plugins for typography, spacing and color. No effort was made to extract a configurable theme system (apart from the light and dark mode switcher). We simply built what worked. We also think there's value in 'intents' - such as 'primary', 'secondary', 'info', 'success', 'warning', 'danger' - and so button, alert and toast components implement an 'intent' system. We may create mapping definitions for these in `tailwind.config.js` to make swapping out a base color theme and color system easier.

Below is a brief introduction to the core components, where they came from, and how they've been configured. And here's what's on our current [TODO](./TODO.md) list if you felt like lending a hand (take a look at the [Contributions](#contributions) section).

[Alert](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/components/notifications/alert.tsx) - supports 'intents', and is based on the Radix `@radix-ui/react-primitive` - which in turn means it supports 'slots' and the  `asChild` prop - allowing you to takeover the alert completely, merging default alert styles and props with your own styles and props ('slot' uses `React.cloneElement` and `mergeProps` under the hood. It's very cool). Alerts are animated via [Headless UI Transition](https://headlessui.com/react/transition).

[BreadcrumbTrail](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/breadcrumbs) - is a 'typed' implementation of Breadcrumbs that used Remix's `useMatches` to match route `handle` methods - looking for Breadcrumbs. You can see an example here in the [Note Delete](https://github.com/infonomic/remix.infonomic.io/blob/22138d74257fc1f71c5ce4d2d8464ccd04d35389/app/routes/notes/%24noteId.delete.tsx#L70) route. We have no idea if this is the best way to implement a BreadcrumbTrail in Remix - but it seems to work. We _think_ - but may be wrong, that with Remix's file-based router, there's no other way to get or annotate route information, such as a route label - hence this approach. Note too that the `handle` method can implement as many `handle` functions as you like by `&&`-ing or `||`-ing additional handle method types (i.e. handle isn't limited to `BreadcrumbHandle<T>` when Breadcrumbs are implemented on a `handle` method).

[Button](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/button) - supports 'variants' and 'intents', and is also based on the Radix `@radix-ui/react-primitive` - which in turn means it supports 'slots' and the  `asChild` prop - allowing you to takeover the button completely, merging default button styles and props with your own styles and props ('slot' uses `React.cloneElement` and `mergeProps` under the hood). This makes it trivial to 'wrap' and customize the Remix router `Link` component as follows:

```TSX
<Button
  asChild // <-- asChild - render as the children
  variant="outlined"
  intent="primary"
  size="lg"
  className="rounded-lg py-3 px-10 !text-black bg-amber-500/70 hover:bg-amber-400/70">
  <Link to="/notes">
    View notes for {user.email}
  </Link>
</Button>
```
The core button style system was adapted from [Sajad Ahmad Nawabi's](https://github.com/sajadevo) excellent [Material Tailwind](https://github.com/creativetimofficial/material-tailwind) project. The Button component supports [Material Ripple Effects](https://github.com/sajadevo/material-ripple-effects) - also from [Sajad Ahmad Nawabi](https://github.com/sajadevo). 

As mentioned in the introduction to this section, we've intentionally removed any advanced theme configuration system for now. We're also aware of Joe Bell's work on [CVA](https://github.com/joe-bell/cva) - but haven't looked closely enough yet to know whether this would be a better approach.

[Card](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/card) - is a simple `div` component with default 'card' styling - also implementing Radix `asChild`.

[Container](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/components/container.tsx) - is one of our building-block layout components supporting content-width layout, and 'shy edges' from max widths.

[FocusTrap](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/elements/focus-trap.client.ts) - is a very cool module for 'trapping' focus within a component - like a modal, dialog, or toast. We're using it in our [Toast](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/components/notifications/toast.tsx) component. We found this in Jacob Ebey's [Remix dashboard app](https://github.com/jacob-ebey/remix-dashboard-template). It was bequeathed to us under the 'Just take it. I do not care.' license.

[Input](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/input) - inputs include Input, Checkbox, and TextArea components. Input and TextArea support labels, help text and error messages. We've not yet implemented a 'variant' system for these components. CheckBox is a functional component wrapper around the [Radix Tailwind project Checkbox](https://github.com/ecklf/tailwindcss-radix/blob/main/demo/components/checkbox.tsx) component.

[Pager](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/pager) - is a styled 'placeholder' component for a general purpose pager. It has not been fully implemented - unlike TablePager below. Initial Pager styling courtesy of [Flowbite Pager](https://flowbite.com/docs/components/pagination/).

[ScrollToTop](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/components/scroll-to-top.tsx) - is a simple and dynamic 'scroll to top' component. It will only appear after scrolling down. This is a CSS-styled component with the component stylesheet located at `/shared/css/components/scroll-to-top.css`.

[Section](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/components/section.tsx) - like Container above, is one of our building-block layout components.

[Select](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/select) - is a functional component wrapper around the [Radix Tailwind project Select](https://github.com/ecklf/tailwindcss-radix/blob/main/demo/components/select.tsx) component.

[Table](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/table) - components include all styled table elements and a TablePager component. The TablePager component is dependent on the excellent [TanStack Table](https://tanstack.com/table/v8) component (formerly React Table), however, this probably isn't the 'Remix way'. A better implementation might be to surround all of the pager controls in a form element with a 'get' method and action that simply submits updated url search params (aka query string parameters). Initial TablePager styling courtesy of [Flowbite Pager](https://flowbite.com/docs/components/pagination/).

[ThemeSwitch](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/components/theme-switch.tsx) - is our component for changing between light and dark themes via [ThemeProvider](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/ui/theme/theme-provider.tsx) - all based on Matt Stobbs' excellent blog post - [The Complete Guide to Dark Mode with Remix](https://www.mattstobbs.com/remix-dark-mode/).

[Toast](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/notifications) - is an 'intent'-enabled functional component wrapper around the [Radix Tailwind project Toast](https://github.com/ecklf/tailwindcss-radix/blob/main/demo/components/toast.tsx) component.

[Tooltip](https://github.com/infonomic/remix.infonomic.io/tree/develop/app/ui/components/tooltip) - is a functional component wrapper around the [Radix Tailwind project Tooltip](https://github.com/ecklf/tailwindcss-radix/blob/main/demo/components/tooltip.tsx) component.


### Validation and Errors

Data input is validated by both client- and server-side [Zod schemas](https://github.com/colinhacks/zod) and [React Hook Form Zod resolvers](https://github.com/react-hook-form/resolvers) - with errors reported either at field-level for form data errors, or via general alerts for any non-field-based errors. We've tried to implement utility methods for server and client errors returned via Zod, as well as other conditions such as unique constraint violations. You can see an example in the [/account/$userId.email.tsx](https://github.com/infonomic/remix.infonomic.io/blob/develop/app/routes/account/%24userId.email.tsx) route.

### i18n and L10n

We've yet to implement localization / translations, although another interesting aspect of Remix as a 'first class' SSR framework, is that client preferred language detection can be done via the Accept-Language HTTP header. 

[Sergio Xalambrí](https://github.com/sergiodxa) appears to show the way....

[https://sergiodxa.com/articles/localizing-remix-apps-with-i18next](https://sergiodxa.com/articles/localizing-remix-apps-with-i18next)<br>
[https://github.com/sergiodxa/remix-i18next](https://github.com/sergiodxa/remix-i18next)
<br>

This is high on our TODO list


### A11y

We're committed to enabling people with limited abilities to use websites. Many of the components we've used have been built with a11y in mind. We've also tried to include WAI-ARIA compliant roles and labels where appropriate although there is almost certainly more to do here. We've not yet completed a WAI-ARIA review of this project, and so yet again, suggestions, or raised issues related to omissions or errors greatly appreciated.

### ESLint

We've included the [eslint-config-airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript) plugin in our ESLint configuration, along with a handful of custom rules. The rest comes from the quick-start app.

### Tests

We removed Cypress and have configured [Playwright](https://playwright.dev/) for end-to-end tests. Vitest is still enabled - which explains the test, tests, tests-examples directories. We'll follow [Kent Dodd's lead here](https://github.com/epicweb-dev/rocket-rental) and er... em... we're going to write some tests.<br> ¯\\_(ツ)_/¯

Also high on our TODO list

### Docker

The Docker image that came with the quick-start app for deployment to Fly.io (and [Firecracker microVMs](https://firecracker-microvm.github.io/)) has been updated to Node v18 LTS. There are also `docker-build.sh`, `docker-compose.yml` and `docker-exec.sh` files that will allow you to build and run the Docker image and container locally if you'd like to test a local Docker environment. Note that we don't currently mount the SQLite data directory, and so starting a new container instance will create a new database. This is also a great start for creating your own deployment pipeline via Docker and say for example [AWS ECS](https://aws.amazon.com/ecs/), or other.

## Contributions

Feedback, thoughts and suggestions are most welcome. Issues and even PRs would be super too! We've created [TODO list](TODO.md).

We use a husky task and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. 

[@commitlint/cli @commitlint/config-conventional](https://github.com/conventional-changelog/commitlint) are included in the dev dependencies of this project.

Common commit message types according to [commitlint-config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum) (based on the Angular convention) can be:

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

To prepare husky and the conventional commit task for development run the following:

`npm run prepare` - will prepare local husky tasks.

Note that the `.husky/commit-msg` task should already be present when you clone this repo. If it's not, you can add it with the following:

`npx husky add .husky/commit-msg 'npx commitlint --edit $1'` - will add the commit message task.

Hope some of this is of help to those of you just getting started with Remix and headless UI component systems (as we are).

<p>&nbsp;</p>

<hr>

## Original Indie Stack quick-start README - What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

## Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

  ```sh
  npx remix init
  ```

- Initial setup: _If you just generated this project, this step has been done for you._

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create remix-infonomic-io-c6b7
  fly apps create remix-infonomic-io-c6b7-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-infonomic-io-c6b7
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-infonomic-io-c6b7-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app remix-infonomic-io-c6b7
  fly volumes create data --size 1 --app remix-infonomic-io-c6b7-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
