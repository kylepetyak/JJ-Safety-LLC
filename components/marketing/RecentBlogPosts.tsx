import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getFeaturedPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'

export default async function RecentBlogPosts() {
  const posts = await getFeaturedPosts()

  if (posts.length === 0) {
    return null
  }

  return (
    <Section spacing="xl" background="gray">
      <SectionHeading
        subtitle="Latest Insights"
        title="Recent Blog Articles"
        description="Stay updated with the latest compliance tips and platform news"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.slug} hover padding="lg">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-accent-400/10 text-accent-600 text-xs font-semibold px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <Link href={`/blog/${post.slug}`}>
              <h3 className="text-xl font-bold text-navy-950 mb-3 hover:text-navy-700 transition-colors">
                {post.title}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Calendar size={14} />
                <span>{formatDate(post.date)}</span>
              </div>
              <span>{post.readingTime} min read</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button href="/blog" variant="primary" size="lg">
          View All Articles
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </Section>
  )
}
