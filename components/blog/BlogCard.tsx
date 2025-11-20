import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/lib/mdx'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className="text-accent-600 font-medium uppercase tracking-wide text-xs">
            {post.category}
          </span>
          <span className="text-gray-300">•</span>
          <time className="text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.date)}
          </time>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent-600 transition-colors leading-tight">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.description}
        </p>

        {/* Platform Tags */}
        {post.platforms && post.platforms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.platforms.map((platform) => (
              <span
                key={platform}
                className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {platform}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <div className="flex items-center text-accent-600 font-medium text-sm">
          Read more
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  )
}
