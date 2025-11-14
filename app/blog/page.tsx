import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { getAllPosts, getAllCategories, getAllPlatforms } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Safety compliance tips, platform updates, and industry insights for contractors.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const categories = getAllCategories()
  const platforms = getAllPlatforms()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <Section spacing="lg" background="gradient" className="pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Safety Compliance Insights
            </h1>
            <p className="text-xl text-gray-300">
              Platform updates, compliance tips, and industry news to keep your business qualified
            </p>
          </div>
        </Section>

        {/* Blog Posts */}
        <Section spacing="lg">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No blog posts yet. Check back soon for safety compliance insights and platform updates!
              </p>
            </div>
          ) : (
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
                    <h2 className="text-xl font-bold text-navy-950 mb-3 hover:text-navy-700 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>

                  {/* Platform Tags */}
                  {post.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="text-xs bg-navy-100 text-navy-700 px-2 py-1 rounded"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>{post.readingTime} min</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  )
}
