/** 
  Note: This is a modified version of the Material Tailwind input found here...
  https://github.com/creativetimofficial/material-tailwind It will be further
  updated / refactored to remove most of that project's code.
  The material-tailwind project is a great effort, but its theming 
  configuration adds another layer to the project. The goal of this 
  project is to take only headless, or lightly css- or tailwind-styled 
  components, and build a base-level UI-kit that can be used here and
  on other projects with minimum dependencies. 
*/
import React from 'react'

import classnames from 'classnames'

// utils
import objectsToString from '../../../utils/objectsToString'
// context
import { input } from './styles'

import type { InputVariantStylesType, InputSizeStylesType } from './styles'
// types
import type {
  variant,
  intent,
  size,
  label,
  error,
  success,
  icon,
  labelProps,
  containerProps,
  className,
} from './types/input'


export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  variant?: variant;
  size?: size;
  intent?: intent;
  label?: label;
  error?: error;
  success?: success;
  icon?: icon;
  labelProps?: labelProps;
  containerProps?: containerProps;
  className?: className;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      intent,
      size,
      label,
      error,
      success,
      icon,
      containerProps,
      labelProps,
      className,
      ...rest
    },
    ref
  ) => {
    // 1. init
    const { defaultProps, styles } = input
    const { base, variants } = styles

    // 2. set default props
    variant = variant ?? defaultProps.variant
    size = size ?? defaultProps.size
    intent = intent ?? defaultProps.intent
    label = label ?? defaultProps.label
    labelProps = labelProps ?? defaultProps.labelProps
    className = className ?? defaultProps.className
    icon = icon ?? defaultProps.icon

    // 3. set styles
    const inputVariant: InputVariantStylesType = variants[variant as keyof object]
    const inputSize: InputSizeStylesType = inputVariant.sizes[size as keyof object]
    const inputError = objectsToString(inputVariant.error.input)
    const inputSuccess = objectsToString(inputVariant.success.input)
    const inputColor = objectsToString(
      inputVariant.intent.input[intent as keyof object]
    )
    const labelError = objectsToString(inputVariant.error.label)
    const labelSuccess = objectsToString(inputVariant.success.label)
    const labelColor = objectsToString(
      inputVariant.intent.label[intent as keyof object]
    )
    const containerClasses = classnames(
      objectsToString(base.container),
      objectsToString(inputSize.container),
      containerProps?.className
    )
    const inputClasses = classnames(
      objectsToString(base.input),
      objectsToString(inputVariant.base.input),
      objectsToString(inputSize.input),
      { [objectsToString(inputVariant.base.inputWithIcon)]: icon },
      { [inputColor]: !error && !success },
      { [inputError]: error },
      { [inputSuccess]: success },
      className
    )
    const labelClasses = classnames(
      objectsToString(base.label),
      objectsToString(inputVariant.base.label),
      objectsToString(inputSize.label),
      { [labelColor]: !error && !success },
      { [labelError]: error },
      { [labelSuccess]: success },
      labelProps?.className
    )
    const iconClasses = classnames(
      objectsToString(base.icon),
      objectsToString(inputVariant.base.icon),
      objectsToString(inputSize.icon)
    )

    // 4. return
    return (
      <div {...containerProps} ref={ref} className={containerClasses}>
        {icon && <div className={iconClasses}>{icon}</div>}
        <input {...rest} className={inputClasses} placeholder={rest?.placeholder || ' '} />
        <label {...labelProps} className={labelClasses}>
          {label}
        </label>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input