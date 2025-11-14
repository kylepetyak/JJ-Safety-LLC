import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import CTASection from '@/components/marketing/CTASection'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { getArticleSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.description,
    author: post.author,
    datePublished: post.date,
    url: `https://www.jjsafety.com/blog/${post.slug}`,
  })

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      </head>
      <Navbar />
      <main>
        <Section spacing="md" className="pt-32">
          <Container size="md">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-navy-600 hover:text-navy-950 mb-8"
            >
              <ArrowLeft size={18} />
              <span>Back to Blog</span>
            </Link>

            {/* Article Header */}
            <article>
              <header className="mb-12">
                {/* Category */}
                <div className="mb-4">
                  <span className="inline-block bg-accent-400/10 text-accent-600 text-sm font-semibold px-4 py-2 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-navy-950 mb-6">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-6">{post.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">By {post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>

                {/* Platform Tags */}
                {post.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="bg-navy-100 text-navy-700 text-sm px-3 py-1 rounded-full"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg prose-navy max-w-none">
                <MDXRemote source={post.content} />
              </div>
            </article>
          </Container>
        </Section>

        {/* CTA */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
