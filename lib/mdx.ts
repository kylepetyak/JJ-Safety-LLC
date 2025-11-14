import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { calculateReadingTime } from './utils'

const contentDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  platforms: string[]
  featured: boolean
  image?: string
  content: string
  readingTime: number
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const files = fs.readdirSync(contentDirectory)
  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(contentDirectory, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'JJ Safety Team',
        category: data.category || 'General',
        platforms: data.platforms || [],
        featured: data.featured || false,
        image: data.image,
        content,
        readingTime: calculateReadingTime(content),
      } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'JJ Safety Team',
      category: data.category || 'General',
      platforms: data.platforms || [],
      featured: data.featured || false,
      image: data.image,
      content,
      readingTime: calculateReadingTime(content),
    }
  } catch {
    return null
  }
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.category === category)
}

export async function getPostsByPlatform(platform: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.platforms.includes(platform))
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.featured).slice(0, 3)
}

export function getAllCategories(): string[] {
  return [
    'Getting Started',
    'Platform Updates',
    'Compliance Tips',
    'Industry News',
    'Case Studies',
    'How-To',
  ]
}

export function getAllPlatforms(): string[] {
  return [
    'ISNetworld',
    'Avetta',
    'Veriforce',
    'ComplyWorks',
    'PEC Safety',
    'BROWZ',
  ]
}
