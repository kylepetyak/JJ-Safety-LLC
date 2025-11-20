import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
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
  const allPosts = await getAllPosts()

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
      <main className="bg-white min-h-screen">
        {/* Breadcrumbs */}
        <div className="border-b border-gray-200 pt-32 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/blog" className="hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article with TOC */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <article className="min-w-0">
              {/* Article Header */}
              <header className="mb-12 pb-8 border-b border-gray-200">
                {/* Category */}
                <div className="mb-4">
                  <span className="inline-flex items-center text-accent-600 font-medium uppercase tracking-wide text-xs">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{post.author}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time>{formatDate(post.date)}</time>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>

                {/* Platform Tags */}
                {post.platforms && post.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg prose-gray max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ol:my-6
                prose-li:text-gray-600 prose-li:mb-2
                prose-code:text-accent-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-blockquote:border-l-accent-600 prose-blockquote:bg-gray-50 prose-blockquote:py-2
              ">
                <MDXRemote source={post.content} />
              </div>
            </article>

            {/* Table of Contents - Desktop Only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedPosts posts={allPosts} currentSlug={post.slug} />
        </div>

        {/* CTA */}
        <div className="mt-20">
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  )
}
