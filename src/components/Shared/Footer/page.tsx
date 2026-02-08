import Image from "next/image";
import Logo from "../../../app/assets/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <footer className="footer bg-linear-to-br from-primary via-primary to-primary/90 text-secondary p-10 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Top section with logo and contact info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-2 pb-8 border-b border-secondary/20">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-16 h-16 overflow-hidden rounded-full bg-white/10 p-2">
                  <Image
                    src={Logo}
                    alt="TR Tuition Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">TR Tuition</p>
                  <p className="text-sm text-secondary/70">Quality Tuition Services</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-secondary/80">
                Connecting students with expert tutors for personalized learning experiences since 2015.
              </p>

              {/* Social Media Links */}
              <div className="flex space-x-4 pt-2">
                <Link href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 hover:scale-110">
                  <FaFacebook className="text-lg" />
                </Link>
                <Link href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 hover:scale-110">
                  <FaTwitter className="text-lg" />
                </Link>
                <Link href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 hover:scale-110">
                  <FaInstagram className="text-lg" />
                </Link>
                <Link href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 hover:scale-110">
                  <FaLinkedin className="text-lg" />
                </Link>
              </div>
            </div>

            {/* Services Section */}
            <nav className="space-y-4">
              <h6 className="footer-title text-xl font-semibold text-secondary border-l-4 border-accent pl-3">Services</h6>
              <div className="space-y-3">
                <Link href="/tuition-jobs" className="link link-hover flex items-center group transition-all duration-300 hover:translate-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tuition Jobs
                </Link>
                <Link href="/tutors" className="link link-hover flex items-center group transition-all duration-300 hover:translate-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tutors
                </Link>
                <Link href="/tuition-request" className="link link-hover flex items-center group transition-all duration-300 hover:translate-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tuition Request
                </Link>
              </div>
            </nav>

            {/* Company Section */}
            <nav className="space-y-4">
              <h6 className="footer-title text-xl font-semibold text-secoendary border-l-4 border-accent pl-3">Company</h6>
              <div className="space-y-3">
                <Link href="/about" className="link link-hover flex items-center group transition-all duration-300 hover:translate-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About us
                </Link>
                <Link href="/contact" className="link link-hover flex items-center group transition-all duration-300 hover:translate-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secoendary mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
                <Link href="/careers" className="link link-hover flex items-center group transition-all duration-300 hover:translate-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Careers
                </Link>

              </div>
            </nav>

            {/* Contact & Legal Section */}
            <div className="space-y-6">
              <div>
                <h6 className="footer-title text-xl font-semibold text-accent border-l-4 border-accent pl-3">Contact Info</h6>
                <div className="space-y-3 mt-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-accent mt-1" />
                    <span className="text-sm">ECB, Dhaka</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-accent" />
                    <span className="text-sm">018286853371</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-accent" />
                    <span className="text-sm">trtuition@gmail.com</span>
                  </div>
                </div>
              </div>

              <nav>
                <h6 className="footer-title text-xl font-semibold text-accent border-l-4 border-accent pl-3">Legal</h6>
                <div className="space-x-3 mt-3 ">
                  <Link href="/terms" className="link link-hover text-sm">Terms of use</Link>
                  <Link href="/privacy" className="link link-hover text-sm">Privacy policy</Link>
                  <Link href="/cookie" className="link link-hover text-sm">Cookie policy</Link>
                </div>
              </nav>
            </div>
          </div>

          {/* Bottom section with copyright and newsletter */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 pb-4 md:gap-64 lg:gap-80">

            <div className="text-center md:text-left">
              <p className="text-sm text-secondary">
                © {new Date().getFullYear()} TR Tuition. All rights reserved.
              </p>
              <p className="text-xs text-secondary/80 mt-1">
                Empowering learners through personalized education.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className=" ">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <p className="text-sm text-secondary mb-2 sm:mb-0">Subscribe to our newsletter:</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 md:w-64 rounded-l-lg bg-white/10 border border-accent text-secondary placeholder:text-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <button className="px-4 py-2 bg-accent text-white font-medium rounded-r-lg hover:bg-accent/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;