import TuitionRequestForm from '@/src/components/TuitionRequest/TuitionRequestForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post Tuition Job - Find Qualified Tutors in Bangladesh',
  description: 'Post your tuition requirements and find qualified tutors in your area. Free to post, connect with verified tutors.',
  keywords: 'tuition posting, find tutor, home tuition, online tutor, Bangladesh tutors',
  openGraph: {
    title: 'Post Tuition Job - Find Qualified Tutors',
    description: 'Connect with thousands of qualified tutors across Bangladesh',
    type: 'website',
  }
}

// Server Component - SEO optimized
export default function TuitionRequestPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 to-secondary">
      {/* Hero Section with SEO-friendly content */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Post Your Tuition Job
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reach thousands of qualified tutors across Bangladesh. Post your requirements and find the perfect match for your educational needs.
          </p>
        </div>

        

        {/* Main Form Section */}
        <div className="max-w-4xl mx-auto">
          <TuitionRequestForm />
        </div>

        {/* Additional SEO Content */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Verified Tutors</h3>
              <p className="text-gray-600">
                All tutors are verified through our screening process ensuring quality and reliability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Secure Connection</h3>
              <p className="text-gray-600">
                Your contact information is protected until you decide to share it with selected tutors.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Flexible Options</h3>
              <p className="text-gray-600">
                Choose from online, offline, or hybrid tutoring options based on your preference.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Best Match Guarantee</h3>
              <p className="text-gray-600">
                Our algorithm matches you with tutors who best fit your requirements and location.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}