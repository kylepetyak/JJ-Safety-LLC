import type { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import BlogContent from '@/components/blog/BlogContent'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Expert insights on contractor compliance, safety platform management, and industry best practices.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Clean Header Section */}
        <section className="border-b border-gray-200 pb-12 mb-12 pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Expert insights on contractor compliance, safety platform management, and industry best practices. Stay informed with the latest updates and strategies.
            </p>
          </div>
        </section>

        <BlogContent posts={posts} />
      </main>
      <Footer />
    </>
  )
}
