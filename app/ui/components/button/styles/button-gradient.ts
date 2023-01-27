const buttonGradient: object = {
  white: {
    background: 'bg-white',
    color: 'text-blue-gray-900',
    hover: 'hover:bg-white/80',
    focus: 'focus:outline-none focus:ring-white focus:ring-offset-2 dark:ring-offset-slate-900',
    active: 'active:bg-white/80',
  },
  primary: {
    background: 'bg-gradient-to-tr from-amber-500 to-amber-300 dark:from-amber-600 dark:to-amber-400',
    color: 'text-black',
    hover: 'hover:opacity-[0.85]',
    focus:
      'focus:outline-none focus:ring-amber-500 focus:ring-1 focus:ring-offset-2 dark:ring-offset-slate-900',
    active: 'hover:opacity-[0.85]',
  },
  secondary: {
    background: 'bg-gradient-to-tr from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-700',
    color: 'text-black dark:text-white',
    hover: 'hover:opacity-[0.85] dark:hover:opacity-[0.85]',
    focus:
      'focus:outline-none focus:ring-gray-500 focus:ring-1 focus:ring-offset-2 dark:ring-offset-slate-900',
    active: 'dark:hover:opacity-[0.85]',
  },
  success: {
    background: 'bg-gradient-to-tr from-green-600 to-green-400',
    color: 'text-white',
    hover: 'hover:shadow-lg hover:shadow-green-500/40',
    active: 'active:opacity-[0.85]',
  },
  info: {
    background: 'bg-gradient-to-tr from-blue-600 to-blue-400',
    color: 'text-white',
    hover: 'hover:shadow-lg hover:shadow-blue-500/40',
    active: 'active:opacity-[0.85]',
  },
  warning: {
    background: 'bg-gradient-to-tr from-yellow-600 to-yellow-400',
    color: 'text-black',
    hover: 'hover:shadow-lg hover:shadow-yellow-500/40',
    active: 'active:opacity-[0.85]',
  },
  danger: {
    background: 'bg-gradient-to-tr from-red-600 to-red-400',
    color: 'text-white',
    hover: 'hover:shadow-lg hover:shadow-red-500/40',
    active: 'active:opacity-[0.85]',
  },
}

export default buttonGradient
