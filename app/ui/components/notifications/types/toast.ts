/* eslint-disable @typescript-eslint/naming-convention */

// generic types
import type { intent as t, icons as i, position as p } from '~/ui/components/types/shared'

/**
 * This file contains the types and prop-types for Toast component.
 */

// typescript types
export type intent = 'primary' | t
export type position = 'top-right' | p
export type className = string
export type title = string
export type description = string
export type open = boolean
export type icon = boolean
export type iconType = 'success' | i
export type close = boolean
export type onOpenChange = (open: boolean) => void
