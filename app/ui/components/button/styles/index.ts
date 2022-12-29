import buttonFilled from './button-filled'
import buttonGradient from './button-gradient'
import buttonOutlined from './button-outlined'
import buttonText from './button-text'

// types

import type {
  variant,
  size,
  intent,
  fullWidth,
  ripple,
  className,
} from '../types/button'

export interface ButtonStyleTypes {
  defaultProps: {
    variant: variant;
    size: size;
    intent: intent;
    fullWidth: fullWidth;
    ripple: ripple;
    className: className;
  };
  styles: {
    base: {
      initial: object;
      fullWidth: object;
    };
    sizes: {
      sm: object;
      md: object;
      lg: object;
    };
    variants: {
      filled: typeof buttonFilled;
      gradient: typeof buttonGradient;
      outlined: typeof buttonOutlined;
      text: typeof buttonText;
    };
  };
}

export const button: ButtonStyleTypes = {
  defaultProps: {
    variant: 'filled',
    size: 'md',
    intent: 'primary',
    fullWidth: false,
    ripple: true,
    className: '',
  },
  styles: {
    base: {
      initial: {
        display: 'inline-flex',
        gap: 'gap-2',
        align: 'items-center justify-center',
        fontFamily: 'font-base',
        fontWeight: 'font-normal',
        textAlign: 'center',
        textDecoration: 'no-underline',
        border: 'outline-none',
        width: 'min-w-[80px]',
        transition: 'transition-all ease-in-out duration-300',
        disabled: 'disabled:opacity-70 disabled:pointer-events-none',
      },
      fullWidth: {
        display: 'block',
        width: 'w-full',
      },
    },
    sizes: {
      sm: {
        fontSize: 'text-xs',
        py: 'py-2',
        px: 'px-3',
        height: 'min-h-[32px]',
        borderRadius: 'rounded',
      },
      md: {
        fontSize: 'text-sm',
        py: 'py-2.5',
        px: 'px-5',
        height: 'min-h-[42px]',
        borderRadius: 'rounded',
      },
      lg: {
        fontSize: 'text-base',
        py: 'py-3',
        px: 'px-6',
        height: 'min-h-[48px]',
        borderRadius: 'rounded',
      },
    },
    variants: {
      filled: buttonFilled,
      gradient: buttonGradient,
      outlined: buttonOutlined,
      text: buttonText,
    },
  },
}

export default button