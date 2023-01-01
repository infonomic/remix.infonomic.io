/* eslint-disable @typescript-eslint/naming-convention */
import type { ReactNode } from 'react'

// generic types
import type { intent as t } from '~/ui/components/types/shared'

/**
 * This file contains the types and prop-types for Button and IconButton component.
 */

// typescript types
export type variant = 'filled' | 'outlined' | 'gradient' | 'text'
export type size = 'sm' | 'md' | 'lg'
export type intent = 'primary' | t
export type fullWidth = boolean
export type ripple = boolean
export type className = string
export type children = ReactNode
