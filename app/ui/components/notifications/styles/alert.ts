
// types

import type { intent, className, icon, close } from '../types/alert'

const intentStyles: object = {
  primary: {
    background: 'bg-gradient-to-tr from-amber-600/20 to-amber-600/20',
    border: 'border border-amber-600/50',
    color: 'text-gray-800 dark:text-gray-200',
  },
  secondary: {
    background: 'bg-gradient-to-tr from-gray-400/10 to-gray-400/10 dark:from-gray-600/20 dark:to-gray-600/20',
    border: 'border border-gray-500/50',
    color: 'text-gray-800 dark:text-gray-200',
  },
  success: {
    background: 'bg-gradient-to-tr from-green-500/20 to-green-500/20',
    border: 'border border-green-600/50',
    color: 'text-gray-800 dark:text-gray-200',
  },
  info: {
    background: 'bg-gradient-to-tr from-[#388bfd]/20 to-[#388bfd]/20',
    border: 'border border-[#388bfd]/50',
    color: 'text-gray-800 dark:text-gray-200',
  },
  warning: {
    background: 'bg-gradient-to-tr from-amber-600/20 to-amber-600/20',
    border: 'border border-amber-600/50',
    color: 'text-gray-800 dark:text-gray-200',
  },
  danger: {
    background: 'bg-gradient-to-tr from-red-600/20 to-red-600/20',
    border: 'border border-red-600/50',
    color: 'text-gray-800 dark:text-gray-200',
  },
}

export interface AlertStyleTypes {
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

export const alertStyles: AlertStyleTypes = {
  defaultProps: {
    intent: 'primary',
    icon: true,
    close: true,
    className: 'alert',
  },
  styles: {
    base: {
      initial: {
        display: 'flex gap-4 rounded-md py-4 px-4 mb-4',
        align: 'items-center',
        typography: 'font-base font-normal text-sm',
        width: 'w-full',
        transition: 'transition-all ease-in-out duration-300',
      },
    },
    intents: intentStyles,
  },
}

export default alertStyles