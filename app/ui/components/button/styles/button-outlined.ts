const buttonOutlined: object = {
  white: {
    border: 'border border-white',
    color: 'text-white',
    hover: 'hover:opacity-75',
    focus: 'focus:ring focus:ring-white/50',
    active: 'active:opacity-[0.85]',
  },
  primary: {
    border: 'outline-none border border-amber-500',
    color: 'text-amber-700 dark:text-amber-500',
    hover: 'outline-none hover:bg-amber-400/10',
    focus: 'focus:outline-none focus:ring-amber-500 focus:ring-1 focus:ring-offset-2 dark:ring-offset-slate-900',
    active: 'outline-none active:opacity-[0.85]',
  },
  secondary: {
    border: 'border border-gray-500',
    color: 'text-gray-500',
    hover: 'outline-none hover:bg-gray-400/10',
    focus: 'focus:outline-none focus:ring-gray-500 focus:ring-1 focus:ring-offset-2 dark:ring-offset-slate-900',
    active: 'active:opacity-[0.85]',
  },
  success: {
    border: 'border border-green-500',
    color: 'text-green-500',
    hover: 'hover:opacity-75',
    focus: 'focus:ring focus:ring-green-200',
    active: 'active:opacity-[0.85]',
  },
  info: {
    border: 'border border-blue-500',
    color: 'text-blue-500',
    hover: 'hover:opacity-75',
    focus: 'focus:ring focus:ring-blue-200',
    active: 'active:opacity-[0.85]',
  },
  warning: {
    border: 'border border-yellow-500',
    color: 'text-yellow-500',
    hover: 'hover:opacity-75',
    focus: 'focus:ring focus:ring-yellow-200',
    active: 'active:opacity-[0.85]',
  },
  danger: {
    border: 'border border-red-500',
    color: 'text-red-500',
    hover: 'hover:opacity-75',
    focus: 'focus:ring focus:ring-red-200',
    active: 'active:opacity-[0.85]',
  },
}

export default buttonOutlined