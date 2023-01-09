/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require("tailwindcss-radix")(),
  ],
  variants: {
    extend: {},
  },
  theme: {
    ...defaultTheme,
    fontFamily: {
      ...defaultTheme.fontFamily,
      display: ["Roboto", ...defaultTheme.fontFamily.sans],
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      mono: ["Source Code Pro", ...defaultTheme.fontFamily.mono],
    },
    gridTemplateColumns: {
      'auto-fit-280': 'repeat(auto-fill, minmax(280px, 1fr))',
      'auto-fit-320': 'repeat(auto-fill, minmax(320px, 1fr))',
      'auto-fit-480': 'repeat(auto-fill, minmax(480px, 1fr))',
    },
    extend: {
      boxShadow: {
        slider: "0 0 0 5px rgba(0, 0, 0, 0.3)",
      },
      typography (theme) {
        return {
          DEFAULT: {
            css: {
              'code::before': {
                content: 'none', // don’t generate the pseudo-element
                //content: '""', // this is an alternative: generate pseudo element using an empty string
              },
              'code::after': {
                content: 'none'
              },
              code: {
                color: theme('colors.slate.700'),
                fontWeight: "400",
                backgroundColor: theme('colors.stone.100/30'),
                borderRadius: theme('borderRadius.DEFAULT'),
                borderWidth: '1px',
                paddingLeft: theme('spacing[1.5]'),
                paddingRight: theme('spacing[1.5]'),
                paddingTop: theme('spacing[0.5]'),
                paddingBottom: theme('spacing[0.5]'),
              },
              'pre code': {
                  fontSize: '1em !important',
                  borderWidth: '0',
                  paddingLeft: '0',
                  paddingRight: '0',
                  paddingTop: '0',
                  paddingBottom: '0',
                  backgroundColor: 'initial'
              }
            }
          },
          invert: {
            css: {
              code: {
                color: theme('colors.slate.100'),
                backgroundColor: theme('colors.slate.800'),
                borderColor: theme('colors.slate.600'),
              },
              'pre code': {
                backgroundColor: 'initial'
            }
            }
          }
        }
      },
      keyframes: {
        // Dropdown menu
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "slide-down": {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: 0, transform: "translateX(-2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: 0, transform: "translateX(2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(200px)", opacity: 0 },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-200px)", opacity: 0 },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: 0 },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        // Toast
        "toast-hide": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "toast-slide-in-right": {
          "0%": { transform: `translateX(calc(100% + 1rem))` },
          "100%": { transform: "translateX(0)" },
        },
        "toast-slide-in-left": {
          "0%": { transform: `translateX(calc(-1 * (100% + 1rem)))` },
          "100%": { transform: "translateX(0)" },
        },
        "toast-slide-in-bottom": {
          "0%": { transform: `translateY(calc(100% + 1rem))` },
          "100%": { transform: "translateY(0)" },
        },
        "toast-slide-in-top": {
          "0%": { transform: `translateY(-1 * (calc(100% + 1rem)))` },
          "100%": { transform: "translateY(0)" },
        },
        // Leave toast-swipe-out for compatibility - swipe out right
        "toast-swipe-out": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": {
            transform: `translateX(calc(100% + 1rem))`,
          },
        },
        "toast-swipe-out-right": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": {
            transform: `translateX(calc(100% + 1rem))`,
          },
        },
        "toast-swipe-out-left": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": {
            transform: `translateX(calc(-1 * (100% + 1rem)))`,
          },
        },
        "toast-swipe-out-down": {
          "0%": { transform: "translateY(var(--radix-toast-swipe-end-y))" },
          "100%": {
            transform: `translateY(calc(100% + 1rem))`,
          },
        },
        "toast-swipe-out-up": {
          "0%": { transform: "translateY(var(--radix-toast-swipe-end-y))" },
          "100%": {
            transform: `translateY(calc(-1 * (100% + 1rem)))`,
          },
        },
      },
      animation: {
        // Dropdown menu
        "scale-in": "scale-in 0.2s ease-in-out",
        "slide-down": "slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        "fade-in": "fade-in 0.2s ease",
        "fade-out": "fade-out 0.2s ease",
        // Toast
        "toast-hide": "toast-hide 100ms ease-in forwards",
        "toast-slide-in-right":
          "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-slide-in-left":
          "toast-slide-in-left 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-slide-in-bottom":
          "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-slide-in-top":
          "toast-slide-in-top 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        // Leave toast-swipe-out for compatibility - swipe out right.
        "toast-swipe-out": "toast-swipe-out 100ms ease-out forwards",
        "toast-swipe-out-right": "toast-swipe-out-right 100ms ease-out forwards",
        "toast-swipe-out-left": "toast-swipe-out-left 100ms ease-out forwards",
        "toast-swipe-out-down": "toast-swipe-out-down 100ms ease-out forwards",
        "toast-swipe-out-up": "toast-swipe-out-up 100ms ease-out forwards",
      },
    },
  },
}
