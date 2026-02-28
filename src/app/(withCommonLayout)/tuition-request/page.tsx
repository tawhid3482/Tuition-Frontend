import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post Tuition Job - Find Qualified Tutors in Bangladesh",
  description:
    "Post your tuition requirements and find qualified tutors in your area. Free to post, connect with verified tutors.",
  keywords:
    "tuition posting, find tutor, home tuition, online tutor, Bangladesh tutors",
  openGraph: {
    title: "Post Tuition Job - Find Qualified Tutors",
    description:
      "Connect with thousands of qualified tutors across Bangladesh",
    type: "website",
  },
};

export default function TuitionRequestPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 to-secondary">
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Post Your Tuition Job
          </h1>
          <p className="mt-3 text-gray-600">
            Tuition request form is temporarily unavailable. You can still explore
            tutors and contact support to submit your requirement.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tutors"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse Tutors
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Verified Tutors</h3>
              <p className="text-gray-600">
                All tutors are verified through our screening process ensuring
                quality and reliability.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Secure Connection</h3>
              <p className="text-gray-600">
                Your contact information is protected until you decide to share
                it with selected tutors.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Flexible Options</h3>
              <p className="text-gray-600">
                Choose from online, offline, or hybrid tutoring options based
                on your preference.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">
                Best Match Guarantee
              </h3>
              <p className="text-gray-600">
                Our algorithm matches you with tutors who best fit your
                requirements and location.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
