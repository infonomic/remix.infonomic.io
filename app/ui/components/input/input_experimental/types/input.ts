/* eslint-disable @typescript-eslint/naming-convention */
import type { ReactNode } from 'react'

import type { intent as t } from '~/ui/components/types/shared'

/**
 * This file contains the types and prop-types for Input and Textarea components.
 */

// typescript types
export type variant = 'standard' | 'outlined' | 'static';
export type size = 'md' | 'lg';
export type intent = t;
export type label = string;
export type error = boolean;
export type success = boolean;
export type icon = ReactNode;
export type resize = boolean;
export type labelProps = {
  [key: string]: any;
};
export type containerProps = {
  [key: string]: any;
};
export type className = string;
