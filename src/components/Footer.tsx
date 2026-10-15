'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import {
  Heart,
  Phone,
  Mail,
  ArrowUp,
  ArrowUpRight,
  Code2,
  Sparkles,
} from 'lucide-react'

// ─────────────────────────────────────────────
// Developer info — update handles here
// ─────────────────────────────────────────────
const DEV = {
  name: 'Zain Shah',
  role: 'Full-Stack Developer',
  github: 'https://github.com/zainshah3464',
  instagram: 'https://instagram.com/zainshah3464',
  email: 'zainshahzs110@gmail.com',
  portfolio: 'https://zain-main-web.vercel.app/',
}

// ─────────────────────────────────────────────
// Custom brand icons (lucide removed them in v1+)
// Same stroke-based look as Lucide
// ─────────────────────────────────────────────
function GithubIcon({
  size = 16,
  className,
  ...props
}: {
  size?: number
  className?: string
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function InstagramIcon({
  size = 16,
  className,
  ...props
}: {
  size?: number
  className?: string
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const footerRef = useRef<HTMLElement>(null)
  const devCardRef = useRef<HTMLDivElement>(null)
  const [devMouse, setDevMouse] = useState({ x: -400, y: -400 })
  const isInView = useInView(footerRef, { once: true, amount: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const isNearFooter = scrollTop + windowHeight > documentHeight - 300
      setShowScrollButton(isNearFooter)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
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

  // ─────────────────────────────────────────────
  // Developer card — mouse-tracked spotlight
  // ─────────────────────────────────────────────
  const handleDevMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = devCardRef.current?.getBoundingClientRect()
      if (!rect) return
      setDevMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  const handleDevMouseLeave = useCallback(() => {
    setDevMouse({ x: -400, y: -400 })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const quickLinks = [
    { label: 'Shop Suits', href: '/category/Suits' },
    { label: 'All Products', href: '/products' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ]

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
        {/* ─────────────────────────────────────────────
            Ambient glow orbs (theme matched)
           ───────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 left-1/4 w-[500px] h-[300px] bg-indigo-500/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[380px] h-[280px] bg-blue-500/[0.03] blur-[110px]" />
        </div>

        {/* Top gradient accent line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="relative w-full px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-28 py-10 md:py-14 z-10">
          {/* ─────────────────────────────────────────────
              Main grid — Brand · Links · Connect · Newsletter
             ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Brand */}
            <motion.div
              variants={itemVariants}
              className="text-center sm:text-left"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-blue-300 bg-clip-text text-transparent tracking-[-0.02em] mb-2.5">
                VESTIOR
              </h3>
              <p className="text-gray-500 text-[12px] leading-relaxed max-w-[220px] mx-auto sm:mx-0">
                Premium fashion for the modern gentleman.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={itemVariants}
              className="text-center sm:text-left"
            >
              <h4 className="text-[10px] font-semibold text-gray-400 mb-4 tracking-[0.18em] uppercase flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className="w-1 h-3 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
                Quick Links
              </h4>
              <div className="flex flex-col gap-2 items-center sm:items-start">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-gray-500 hover:text-white text-[12px] transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={10}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blue-400"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Connect */}
            <motion.div
              variants={itemVariants}
              className="text-center sm:text-left"
            >
              <h4 className="text-[10px] font-semibold text-gray-400 mb-4 tracking-[0.18em] uppercase flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className="w-1 h-3 rounded-full bg-indigo-500"
                  aria-hidden="true"
                />
                Connect
              </h4>
              <div className="space-y-2.5">
                <a
                  href="mailto:hello@vestior.com"
                  className="group flex items-center justify-center sm:justify-start gap-2.5 text-gray-500 hover:text-white text-[12px] transition-colors duration-200"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.06] flex items-center justify-center transition-all duration-200">
                    <Mail
                      size={11}
                      className="text-blue-400"
                      aria-hidden="true"
                    />
                  </span>
                  <span>hello@vestior.com</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="group flex items-center justify-center sm:justify-start gap-2.5 text-gray-500 hover:text-white text-[12px] transition-colors duration-200"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-indigo-500/30 group-hover:bg-indigo-500/[0.06] flex items-center justify-center transition-all duration-200">
                    <Phone
                      size={11}
                      className="text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  <span>+1 (234) 567-890</span>
                </a>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              variants={itemVariants}
              className="text-center sm:text-left"
            >
              <h4 className="text-[10px] font-semibold text-gray-400 mb-4 tracking-[0.18em] uppercase flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className="w-1 h-3 rounded-full bg-violet-500"
                  aria-hidden="true"
                />
                Newsletter
              </h4>
              <p className="text-[11px] text-gray-500 mb-3 max-w-[240px] mx-auto sm:mx-0 leading-relaxed">
                Get early access to new drops &amp; private sales.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="relative max-w-[260px] mx-auto sm:mx-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-3.5 pr-20 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[12px] placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-200"
                  required
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[10px] font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20"
                >
                  Join
                </button>
              </form>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-emerald-400 mt-2 text-center sm:text-left flex items-center gap-1.5 justify-center sm:justify-start"
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Subscribed successfully
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* ─────────────────────────────────────────────
              Developer Card — spotlight engineer credit
             ───────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="mt-10 md:mt-12">
            <div
              ref={devCardRef}
              onMouseMove={handleDevMouseMove}
              onMouseLeave={handleDevMouseLeave}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#131313] to-[#0e0e0e] p-5 sm:p-6 transition-colors duration-500 hover:border-indigo-500/30"
            >
              {/* Top accent gradient line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
              />

              {/* Static ambient glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-[220px] h-[220px] bg-indigo-500/[0.07] blur-[90px]"
              />

              {/* Mouse-tracked spotlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(500px circle at ${devMouse.x}px ${devMouse.y}px, rgba(99,102,241,0.14), transparent 40%)`,
                }}
              />

              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
                {/* Left: avatar + info */}
                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                  {/* Avatar with live status */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
                      <span className="text-white text-[15px] sm:text-[17px] font-bold tracking-tight">
                        ZS
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0e0e0e]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-60"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Code2
                        size={10}
                        className="text-indigo-400"
                        aria-hidden="true"
                      />
                      <span className="text-[9px] tracking-[0.22em] uppercase font-semibold text-gray-500">
                        Engineered by
                      </span>
                    </div>
                    <a
                      href={DEV.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/name inline-flex items-center gap-1.5 max-w-full"
                      aria-label={`Visit ${DEV.name}'s portfolio`}
                    >
                      <span className="text-[17px] sm:text-lg font-bold bg-gradient-to-r from-white via-white to-indigo-300 bg-clip-text text-transparent group-hover/name:from-indigo-200 group-hover/name:via-violet-200 group-hover/name:to-white transition-all duration-500 tracking-[-0.01em]">
                        {DEV.name}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-indigo-400 group-hover/name:translate-x-0.5 group-hover/name:-translate-y-0.5 transition-transform duration-300 flex-shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <Sparkles
                        size={9}
                        className="text-indigo-400/70"
                        aria-hidden="true"
                      />
                      <span className="text-gray-400">{DEV.role}</span>
                      <span
                        className="w-1 h-1 rounded-full bg-gray-700"
                        aria-hidden="true"
                      />
                      <span>Building VESTIOR</span>
                    </p>
                  </div>
                </div>

                {/* Right: social links */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={DEV.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    aria-label="GitHub profile"
                    title="GitHub"
                  >
                    <GithubIcon size={16} />
                  </a>
                  <a
                    href={DEV.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-pink-500/30 hover:bg-pink-500/[0.06] flex items-center justify-center text-gray-400 hover:text-pink-400 transition-all duration-200"
                    aria-label="Instagram profile"
                    title="Instagram"
                  >
                    <InstagramIcon size={16} />
                  </a>
                  <a
                    href={`mailto:${DEV.email}`}
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-blue-500/30 hover:bg-blue-500/[0.06] flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-200"
                    aria-label="Send email"
                    title="Email"
                  >
                    <Mail size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────
              Bottom bar
             ───────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            {/* Social icons */}
            <div className="flex gap-2 order-2 sm:order-1">
              {[
                {
                  label: 'Instagram',
                  href: DEV.instagram,
                  icon: <InstagramIcon size={15} />,
                },
                {
                  label: 'GitHub',
                  href: DEV.github,
                  icon: <GithubIcon size={15} />,
                },
                {
                  label: 'Email',
                  href: `mailto:${DEV.email}`,
                  icon: <Mail size={15} aria-hidden="true" />,
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    social.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 hover:bg-blue-500/[0.06] flex items-center justify-center text-gray-500 hover:text-blue-400 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-gray-600 text-center order-3 sm:order-2">
              &copy; {currentYear} VESTIOR. All rights reserved.
            </p>

            {/* Crafted by */}
            <p className="text-[11px] text-gray-600 flex items-center gap-1.5 order-1 sm:order-3">
              <span>Crafted with</span>
              <Heart
                size={9}
                className="text-red-500"
                fill="currentColor"
                aria-hidden="true"
              />
              <span>by</span>
              <a
                href={DEV.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white font-medium transition-colors"
              >
                {DEV.name}
              </a>
            </p>
          </motion.div>
        </div>
      </motion.footer>

      {/* ─────────────────────────────────────────────
          Scroll to Top Button
         ───────────────────────────────────────────── */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollButton ? 1 : 0,
          scale: showScrollButton ? 1 : 0,
          y: showScrollButton ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300"
        style={{ pointerEvents: showScrollButton ? 'auto' : 'none' }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} aria-hidden="true" />
      </motion.button>
    </>
  )
}