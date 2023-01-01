const inProduction = process.env.NODE_ENV === 'production'
const warnDev = inProduction ? 'error' : 'warn'

/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
    es2021: true,
  },
  ignorePatterns: [
    "mocks",
    "node_modules",
    ".eslintrc.js",
    "playwright.config.ts",
    "tailwind.config.js",
    "postcss.config.js",
    "e2e-examples/demo-todo-app.spec.ts",
    "coverage",
    "vitest.config.ts",
    "remix.config.js",
    "prettier.config.js",
    "makeSessionSecret.js",
    "commitlint.config.js"
  ],
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript',
    "prettier",
  ],
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it means we have to explicitly
  // set the jest version.
  settings: {
    react: {
      version: 'detect', // Detect react version
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'app/'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
    jest: {
      version: 28,
    },
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module', // Allows for the use of imports
    ecmaVersion: "latest",
    project: ['tsconfig.json']
  },
  plugins: [
    'react',
    'import',
  ],

  // root: true, // For configuration cascading.
  rules: {
    // Warn but allow console in production
    'no-console': ['warn'],
    quotes: ["error", "single"],
    "@typescript-eslint/quotes": ["error", "single"],
    // At most this should be a warning.  For now, since our api is returning
    // snake-cased data, just turn it off.
    camelcase: ['off'],
    /** ***************************************************************
     * Development relaxations.
     *
     * A few things that should be avoided in production, but which
     * are useful for playing around in development.  These will
     * generate an error in production, and a warning in development.
     *************************************************************** */
    // 'max-len': ['off'],
    'no-alert': [warnDev],
    'no-debugger': [warnDev],
    'no-unused-vars': ['off'],
    "@typescript-eslint/no-unused-vars": "warn",
    'no-restricted-globals': [warnDev],
    'no-constant-condition': [warnDev],
    'react/jsx-props-no-spreading': ['off'],
    'react/jsx-no-useless-fragment': ['off'],
    'react/jsx-no-constructed-context-values': ['warn'],

    'react/react-in-jsx-scope': ['off'],

    /** ***************************************************************
     * Error prevention and best practices.
     *
     * Important rules for avoiding common errors go here.  Many such
     * rules are already covered by the "extends:" configs above, so
     * only extra ones go here.  There are plenty more to choose from
     * that aren't included above -- worth exploring further.
     **************************************************************** */

    // Airbnb makes this an error, but since create-react-app and
    // react-scripts manages many dependencies for us, the simplest thing
    // is to downgrade this to a warning.
    'import/no-extraneous-dependencies': ['warn'],

    // airbnb makes this an error, but having one named export absolutely
    // makes sense in some cases, depending on how the module is consumed
    // (e.g. modules that export named constants -- sometimes there will only
    // be one constant in a given file).
    'import/prefer-default-export': ['off'],

    // custom order of imports split to custom sections.
    // groups array contains all predefined group names. Order can be customized.
    // can be put together in array like parent and sibling
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#groups-array
    // pathGroups specify rules of custom patterns position, relative to groups. e.g. react* is before builtin imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#pathgroups-array-of-objects
    'import/order': [
      'error',
      {
        groups: ['builtin', ['external', 'internal'], ['parent', 'sibling'], 'unknown', 'index', 'object', 'type'],
        'newlines-between': 'always',
        pathGroups: [
          { pattern: 'react*', group: 'builtin', position: 'before' },
          { pattern: '@remix*/**', group: 'external', position: 'before' },
          { pattern: 'redux*/**', group: 'external', position: 'before' },
          { pattern: '~/lib/**', group: 'parent', position: 'before' },
          { pattern: '~/modules/**', group: 'parent', position: 'after' },
          { pattern: '~/ui/**', group: 'parent', position: 'after' },
          { pattern: '~/styles/**', group: 'parent', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
          caseInsensitive: true /* ignore case. Options: [true, false] */
        },
      },
    ],

    // Feels draconian -- sometimes "if (a) { return x } else { return y }"
    // does a better job of conveying intention.
    'no-else-return': ['off'],

    // Worth discussing?  Prevents use of hoisting (which is good), but I
    // think this rule disallows too many things it shouldn't.  I.e.,
    // there's generally nothing wrong with defining a function whose _body_
    // contains a reference to a variable lower down in the file, but this
    // rule prevents that.
    'no-use-before-define': ['off'],

    // If we could make an exception for arrow functions, I'd say leave
    // this on.  But of the following three, the first contains a potential
    // bug (if myFunc returns a value), the second is correct but unclear
    // (you wouldn't think removing the curly braces would break it) and
    // the third is correct and self-documenting.
    // 1:  useEffect(() => myFunc())
    // 2:  useEffect(() => { myFunc() })
    // 3:  useEffect(() => void myFunc())
    'no-void': ['off'],

    // At the very least, code flagged by this rule is tricky to
    // reason about, and probably warrants close inspection, even if the
    // resolution is just to disable the rule on a case-by-case basis.
    'require-atomic-updates': ['warn'],

    // Allow jsx syntax in .js files.
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],

    // airbnb makes this an error, but seems annoying for now.  Possibly
    // add this back later?  If enabled, prevents things like:
    //   names.map((name, index) => <Name name={name} key={index} />
    // where the component key comes from an array index.
    'react/no-array-index-key': ['off'],

    // airbnb makes this an error, but seems annoying for now.  Eventually
    // add this back.  Requires explicitly setting propTypes on all custom
    // components.
    'react/prop-types': ['off'],

    /** **************************************************************
     * Style enforcement rules.
     *
     * Plenty of room for tweaking here... so add more rules, or adjust
     * the existing ones, as needed.  Most of these are fixable (meaning
     * eslint --fix will automatically correct them), so leaving those
     * as 'error' seems reasonable.
     **************************************************************** */

    // Ensure consistent newlines at start/end of array literals.
    'array-bracket-newline': ['error', 'consistent'],

    // Ensure consistent newlines between array literal elements.
    'array-element-newline': ['error', 'consistent'],

    // Allow both "() => { return foo }" and "() => foo".
    'arrow-body-style': ['off'],

    // Prefer no parens for single-argument arrow functions.
    'arrow-parens': ['error', 'as-needed'],

    // Require extra trailing commas in multiline lists and similar contexts,
    // but not on last function argument.
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],

    // Allow newlines either before or after "=>".
    'implicit-arrow-linebreak': ['off'],

    // Consistent newlines in multi-line ternary expressions (single-line still ok).
    'multiline-ternary': ['error', 'always-multiline'],

    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1, maxEOF: 0 }],

    // No semicolons (except single-line)
    semi: ['error', 'never'],
  },
}
