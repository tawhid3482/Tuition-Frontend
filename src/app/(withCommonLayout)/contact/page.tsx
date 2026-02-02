/* eslint-disable react/no-unescaped-entities */
// app/contact/page.tsx
import ContactForm from "@/src/components/contact/contactForm";
import type { Metadata } from "next";
import { FaRegEnvelope, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { BsHeadset } from "react-icons/bs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | CodeBase - Get Expert Support & Assistance",
  description:
    "Connect with CodeBase support team for technical assistance, feedback, or urgent issues. We're here to help you succeed. Based in Bangladesh with global reach.",
  keywords:
    "contact support, technical help, feedback, urgent support, Bangladesh tech",
  openGraph: {
    title: "Contact CodeBase Support | 24/7 Assistance Available",
    description:
      "Get professional support from our team. Quick response within 24 hours.",
    type: "website",
  },
};

const ContactPage = () => {
  return (
    <section className="min-h-screen py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Let's Build Together
            </span>
          </h1>
          <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
            Your ideas matter. Reach out to us and let's create something
            amazing. Our team is ready to support your journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content - Contact Info Cards */}
          <div className="space-y-8">
            <div className="bg-linear-to-br from-white to-base-100 dark:from-base-200 dark:to-base-300 rounded-2xl p-4 shadow-2xl border border-base-300/50">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BsHeadset className="text-primary" />
                Get In Touch
              </h2>
              <p className="text-base-content/70 mb-8 text-lg">
                Have a question, suggestion, or urgent issue? Fill out the form
                and our team will get back to you shortly.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 group">
                  <div className="p-3 rounded-full bg-primary/20 group-hover:scale-110 transition-transform">
                    <FaRegEnvelope className="text-xl text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-primary font-medium">
                      support@codebase.com
                    </p>
                    <p className="text-sm text-base-content/60">
                      We reply within 4-6 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all duration-300 group">
                  <div className="p-3 rounded-full bg-secondary/20 group-hover:scale-110 transition-transform">
                    <FaClock className="text-xl text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-secondary font-medium">
                      Within 24 Hours
                    </p>
                    <p className="text-sm text-base-content/60">
                      Usually much faster
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all duration-300 group">
                  <div className="p-3 rounded-full bg-accent/20 group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt className="text-xl text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Our Location</p>
                    <p className="text-accent font-medium">Bangladesh</p>
                    <p className="text-sm text-base-content/60">
                      Serving clients worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-10 pt-8 border-t border-base-300/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">98%</p>
                    <p className="text-sm text-base-content/60">
                      Satisfaction Rate
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">4.2h</p>
                    <p className="text-sm text-base-content/60">
                      Avg. Response Time
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">24/7</p>
                    <p className="text-sm text-base-content/60">
                      Support Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-xl border border-base-300/50 text-center">
              <h3 className="font-bold text-lg mb-3">Quick Questions?</h3>
              <p className="text-sm text-base-content/70 mb-4">
                Check our FAQ section for instant answers to common questions.
              </p>
              <Link href="/faq">
                <button className="text-primary font-semibold text-sm hover:underline cursor-pointer">
                  Visit FAQ →
                </button>
              </Link>
            </div>
          </div>

          {/* Right Form - Spanning 2 columns */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
