'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^#{2,3}\s+(.+)$/gm
    const headings: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[0].split(' ')[0].length
      const title = match[1].trim()
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      headings.push({ id, title, level })
    }

    setToc(headings)
  }, [content])

  useEffect(() => {
    // Track scroll position for active heading
    const handleScroll = () => {
      const headings = toc.map(item => {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return {
            id: item.id,
            top: rect.top,
          }
        }
        return null
      }).filter(Boolean)

      const current = headings.find(h => h && h.top > 0 && h.top < 200)
      if (current) {
        setActiveId(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  if (toc.length === 0) {
    return null
  }

  return (
    <nav className="space-y-2">
      <p className="text-sm font-semibold text-gray-900 mb-4">
        On This Page
      </p>
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-sm transition-colors py-1 ${
            item.level === 3 ? 'pl-4' : ''
          } ${
            activeId === item.id
              ? 'text-accent-600 font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById(item.id)
            if (element) {
              const offset = 100 // Account for fixed navbar
              const elementPosition = element.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - offset

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              })
            }
          }}
        >
          {item.title}
        </a>
      ))}
    </nav>
  )
}
