import BlogCard from './BlogCard'
import type { BlogPost } from '@/lib/mdx'

interface RelatedPostsProps {
  posts: BlogPost[]
  currentSlug: string
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  // Filter out current post and limit to 3
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-20 pt-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Related Articles
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
