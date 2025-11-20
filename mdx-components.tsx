import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/mdx/Callout'
import { PlatformBadge } from '@/components/mdx/PlatformBadge'
import { ChecklistItem } from '@/components/mdx/ChecklistItem'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    PlatformBadge,
    ChecklistItem,
    ...components,
  }
}
