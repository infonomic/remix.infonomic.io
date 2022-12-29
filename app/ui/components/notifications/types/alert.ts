/* eslint-disable @typescript-eslint/naming-convention */
import type { ReactNode } from 'react'

// generic types
import type { intent as t } from '~/ui/components/types/shared'

/**
 * This file contains the types and prop-types for Button and IconButton component.
 */

// typescript types
export type intent = 'primary' | t
export type className = string
export type children = ReactNode
export type icon = boolean
export type close = boolean
