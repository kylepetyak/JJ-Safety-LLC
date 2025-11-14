import Hero from '@/components/marketing/Hero'
import PlatformLogos from '@/components/marketing/PlatformLogos'
import ServicesOverview from '@/components/marketing/ServicesOverview'
import WhyJJSafety from '@/components/marketing/WhyJJSafety'
import Testimonials from '@/components/marketing/Testimonials'
import RecentBlogPosts from '@/components/marketing/RecentBlogPosts'
import CTASection from '@/components/marketing/CTASection'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PlatformLogos />
        <ServicesOverview />
        <WhyJJSafety />
        <Testimonials />
        <RecentBlogPosts />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
