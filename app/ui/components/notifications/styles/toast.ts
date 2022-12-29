
// types

import type { intent, className, icon, close } from '../types/toast'

const intentStyles: object = {
  primary: {
    background: 'bg-white dark:bg-slate-900 bg-gradient-to-tr from-amber-600/20 to-amber-600/20',
    border: 'border border-amber-600/50',
    color: 'text-gray-800 dark:text-gray-200',
    focus: 'focus:outline-none focus:ring-amber-500 dark:focus:ring-amber-600/20 focus:ring-1 focus:ring-offset-1 dark:ring-offset-amber-600/20',
  },
  secondary: {
    background: 'bg-white dark:bg-slate-900 bg-gradient-to-tr from-gray-400/10 to-gray-400/10 dark:from-gray-600/20 dark:to-gray-600/20',
    border: 'border border-gray-500/50',
    color: 'text-gray-800 dark:text-gray-200',
    focus: 'focus:outline-none focus:ring-gray-400 dark:focus:ring-gray-600/30 focus:ring-1 focus:ring-offset-1 dark:ring-offset-gray-600/20',
  },
  success: {
    background: 'bg-white dark:bg-slate-900 bg-gradient-to-tr from-green-500/20 to-green-500/20',
    border: 'border border-green-600/50',
    color: 'text-gray-800 dark:text-gray-200',
    focus: 'focus:outline-none focus:ring-green-400 dark:focus:ring-green-600/30 focus:ring-1 focus:ring-offset-1 dark:ring-offset-green-600/20',
  },
  info: {
    background: 'bg-white bg-gradient-to-tr from-[#388bfd]/20 to-[#388bfd]/20',
    border: 'border border-[#388bfd]/50',
    color: 'text-gray-800 dark:text-gray-200',
    focus: 'focus:outline-none focus:ring-[#388bfd] dark:focus:ring-[#388bfd]/30 focus:ring-1 focus:ring-offset-1 dark:ring-offset-[#388bfd]/20',
  },
  warning: {
    background: 'bg-white bg-gradient-to-tr from-amber-600/20 to-amber-600/20',
    border: 'border border-amber-600/50',
    color: 'text-gray-800 dark:text-gray-200',
    focus: 'focus:outline-none focus:ring-amber-500 dark:focus:ring-amber-600/20 focus:ring-1 focus:ring-offset-1 dark:ring-offset-amber-600/20',
  },
  danger: {
    background: 'bg-white bg-gradient-to-tr from-red-600/20 to-red-600/20',
    border: 'border border-red-600/50',
    color: 'text-gray-800 dark:text-gray-200',
    focus: 'focus:outline-none focus:ring-red-500 dark:focus:ring-red-600/20 focus:ring-1 focus:ring-offset-1 dark:ring-offset-red-600/20',
  },
}

export interface ToastStyleTypes {
  defaultProps: {
    intent: intent;
    icon: icon,
    close: close,
    className: className;
  };
  styles: {
    base: {
      initial: object;
    };
    intents: typeof intentStyles
  };
}

export const toastStyles: ToastStyleTypes = {
  defaultProps: {
    intent: 'success',
    icon: true,
    close: true,
    className: 'toast',
  },
  styles: {
    base: {
      initial: {
        display: 'z-50 fixed bottom-4 inset-x-3 w-auto rounded-md shadow-md',
        position: 'md:top-[68px] md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm',
        typography: 'font-base font-normal text-sm',
      },
    },
    intents: intentStyles,
  },
}

export default toastStyles