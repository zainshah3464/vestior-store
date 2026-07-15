'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { FiHeart, FiPhone, FiMail } from 'react-icons/fi'
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa'
import { IoMdArrowRoundUp } from 'react-icons/io'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  // Check scroll position to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      // Show button when user is in footer area (last 30% of page)
      const isNearFooter = scrollTop + windowHeight > documentHeight - 300
      setShowScrollButton(isNearFooter)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail('')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const currentYear = new Date().getFullYear()

  return (
    <>
      <motion.footer
        ref={footerRef}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative bg-[#0A0A0A] overflow-hidden"
      >
        {/* Glassmorphism Effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />

        {/* Gradient Border Top */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {/* Main Content - Compact */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Brand */}
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-2">
                VESTIOR
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Premium fashion for the modern gentleman.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h4 className="text-xs font-semibold text-white mb-3 tracking-wide">QUICK LINKS</h4>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 justify-center sm:justify-start">
                <Link href="/category/Suits" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">
                  Shop
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">
                  Contact
                </Link>
                <Link href="/shipping" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">
                  Shipping
                </Link>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h4 className="text-xs font-semibold text-white mb-3 tracking-wide">CONNECT</h4>
              <div className="space-y-1.5">
                <a href="mailto:hello@vestior.com" className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 hover:text-blue-400 text-xs transition-colors">
                  <FiMail size={12} />
                  <span>hello@vestior.com</span>
                </a>
                <a href="tel:+1234567890" className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 hover:text-blue-400 text-xs transition-colors">
                  <FiPhone size={12} />
                  <span>+1 (234) 567-890</span>
                </a>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h4 className="text-xs font-semibold text-white mb-3 tracking-wide">NEWSLETTER</h4>
              <form onSubmit={handleSubscribe} className="relative max-w-[200px] mx-auto sm:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] rounded-md transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-green-500 mt-1 text-center sm:text-left"
                >
                  Subscribed! 🎉
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Bottom Bar - Compact */}
          <motion.div
            variants={itemVariants}
            className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2"
          >
            <div className="flex gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <FaInstagram size={14} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <FaTwitter size={14} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <FaFacebookF size={14} />
              </motion.a>
            </div>

            <p className="text-[10px] text-gray-600 text-center">
              &copy; {currentYear} VESTIOR. All rights reserved.
            </p>

            <p className="text-[10px] text-gray-600 flex items-center gap-1">
              Made with <FiHeart size={8} className="text-red-500" /> 
            </p>
          </motion.div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button - Only shows near footer */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollButton ? 1 : 0,
          scale: showScrollButton ? 1 : 0,
          y: showScrollButton ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300"
        style={{ pointerEvents: showScrollButton ? 'auto' : 'none' }}
      >
        <IoMdArrowRoundUp size={20} />
      </motion.button>
    </>
  )
}