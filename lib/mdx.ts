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
  draft: boolean
  image?: string
  youtubeId?: string
  content: string
  readingTime: number
}

// Drafts are visible locally and on Vercel preview deployments, hidden in production.
const showDrafts = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== 'production'
  : process.env.NODE_ENV !== 'production'

function parsePost(slug: string, fileContents: string): BlogPost {
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
    draft: data.draft === true,
    image: data.image,
    youtubeId: data.youtubeId,
    content,
    readingTime: calculateReadingTime(content),
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs
    .readdirSync(contentDirectory)
    .filter(file => file.endsWith('.mdx'))
    .map(file => parsePost(file.replace('.mdx', ''), fs.readFileSync(path.join(contentDirectory, file), 'utf8')))
    .filter(post => showDrafts || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const post = parsePost(slug, fs.readFileSync(fullPath, 'utf8'))
    return post.draft && !showDrafts ? null : post
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
