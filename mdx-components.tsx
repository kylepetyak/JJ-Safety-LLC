import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/mdx/Callout'
import { PlatformBadge } from '@/components/mdx/PlatformBadge'
import { ChecklistItem } from '@/components/mdx/ChecklistItem'

// Generate slug from heading text
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Custom heading components with auto-generated IDs
function H2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = typeof children === 'string' ? generateId(children) : undefined
  return <h2 id={id} {...props}>{children}</h2>
}

function H3({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = typeof children === 'string' ? generateId(children) : undefined
  return <h3 id={id} {...props}>{children}</h3>
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: H2,
    h3: H3,
    Callout,
    PlatformBadge,
    ChecklistItem,
    ...components,
  }
}
