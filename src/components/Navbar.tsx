'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useMemo } from 'react'
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  TrendingUp,
  Package,
  ChevronDown,
  LogOut,
  UserCircle,
  Heart,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { useWishlist } from '@/components/WishlistProvider'
import { parseProductImages } from '@/lib/utils'
import { track } from '@/lib/tracking/client'

interface SearchProduct {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  category_main: string
  is_new_arrival: boolean
  is_featured: boolean
}

type NavItem =
  | { name: string; action: () => void; isButton: true; href?: undefined }
  | { name: string; href: string; isButton: false; action?: undefined }

/**
 * Sanitize user input before passing to PostgREST `.or()` filter.
 * Strips characters that would break the OR syntax: comma, parens, %.
 */
function sanitizeSearchTerm(input: string): string {
  return input.replace(/[,()%]/g, '').trim()
}

/**
 * Build singular/plural variants of the search term so that typing
 * "shirts" also matches products named "shirt" and vice-versa.
 */
function buildSearchVariants(raw: string): string[] {
  const cleaned = sanitizeSearchTerm(raw)
  if (cleaned.length < 2) return []

  const variants = new Set<string>([cleaned])

  if (cleaned.endsWith('s') && cleaned.length > 3) {
    // "shirts" → also try "shirt"
    variants.add(cleaned.slice(0, -1))
  } else if (!cleaned.endsWith('s')) {
    // "shirt" → also try "shirts"
    variants.add(cleaned + 's')
  }

  return Array.from(variants)
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()
  const { count: wishlistCount } = useWishlist()

  const isHomePage = pathname === '/'

  // ─────────────────────────────────────────────
  // Scroll — enhanced with two-step threshold
  // ─────────────────────────────────────────────
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ─────────────────────────────────────────────
  // Cart count
  // ─────────────────────────────────────────────
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(
        cart.reduce(
          (sum: number, item: { quantity?: number }) =>
            sum + (item.quantity ?? 0),
          0
        )
      )
    }
    updateCart()
    window.addEventListener('cartUpdated', updateCart)
    return () => window.removeEventListener('cartUpdated', updateCart)
  }, [])

  // ─────────────────────────────────────────────
  // Recent searches
  // ─────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {
        // ignore malformed
      }
    }
  }, [])

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    )
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // ─────────────────────────────────────────────
  // Search — with singular/plural handling
  // ─────────────────────────────────────────────
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      const variants = buildSearchVariants(searchQuery)
      if (variants.length === 0) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      // Build OR filter: name.ilike.%shirts%,name.ilike.%shirt%
      const orFilter = variants
        .map((v) => `name.ilike.%${v}%`)
        .join(',')

      const { data } = await supabase
        .from('products')
        .select(
          'id, name, price, compare_at_price, images, category_main, is_new_arrival, is_featured'
        )
        .eq('is_active', true)
        .or(orFilter)
        .limit(8)

      const parsed = (data || []).map((p) => ({
        ...p,
        images: parseProductImages(p.images),
      })) as SearchProduct[]

      setSearchResults(parsed)
      setIsSearching(false)

      if (searchQuery.trim().length >= 2) {
        track('search', {
          query: searchQuery,
          resultCount: parsed.length,
        })
      }
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, supabase])

  const handleProductClick = (productId: string, productName: string) => {
    saveRecentSearch(productName)
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    router.push(`/products/${productId}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // ─────────────────────────────────────────────
  // ESC key — closes search or user menu
  // ─────────────────────────────────────────────
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false)
          setSearchQuery('')
          setSearchResults([])
        }
        if (userMenuOpen) setUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isSearchOpen, userMenuOpen])

  // ─────────────────────────────────────────────
  // Body scroll lock — mobile menu OR search modal
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (isOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isSearchOpen])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) router.push('/')
  }

  const scrollToCategory = () => {
    setIsOpen(false)
    if (isHomePage) {
      const el = document.getElementById('category-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#category-section')
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const navItems: NavItem[] = [
    { name: 'Category', action: scrollToCategory, isButton: true },
    { name: 'Products', href: '/products', isButton: false },
    { name: 'Featured', href: '/featured', isButton: false },
    { name: 'New Arrivals', href: '/new-arrivals', isButton: false },
  ]

  const popularSearches = [
    'Pants',
    'Shirts',
    'Coats',
    'Waistcoats',
    'Suits',
    'Gurkha',
    '2 Piece',
    '3 Piece',
  ]

  const isActivePath = (href: string) =>
    href !== '/' && (pathname === href || pathname.startsWith(href + '/'))

  // Navbar visual state
  const navSolid = scrolled || !isHomePage

  return (
    <>
      {/* ─────────────────────────────────────────────
          NAVBAR
         ───────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out ${
          navSolid
            ? 'bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_-12px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-28">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group relative text-lg md:text-xl font-semibold tracking-[0.15em] text-white transition-colors hover:text-white"
              aria-label="VESTIOR home"
            >
              <span className="relative inline-flex items-center">
                VESTIOR
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const active = !item.isButton && isActivePath(item.href)
                const sharedClass = `relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                  active ? 'text-white' : 'text-gray-300 hover:text-white'
                }`

                const inner = (
                  <>
                    <span className="relative z-10">{item.name}</span>
                    {/* Underline */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-px origin-center bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 transition-transform duration-300 ${
                        active
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )

                return item.isButton ? (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className={`group ${sharedClass}`}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group ${sharedClass}`}
                  >
                    {inner}
                  </Link>
                )
              })}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="group relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label="Open search"
              >
                <Search
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </button>

              {/* User */}
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 p-1 rounded-full transition-all duration-200 hover:bg-white/[0.06]"
                    aria-label="Open user menu"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border border-white/10 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
                      {user.email?.charAt(0).toUpperCase()}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0A0A0A]"
                      />
                    </div>
                    <ChevronDown
                      className={`hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-3 w-56 bg-[#121212]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-medium">
                            Signed in as
                          </p>
                          <p className="text-xs text-white font-medium truncate mt-1">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors group"
                          >
                            <UserCircle
                              size={16}
                              className="text-gray-500 group-hover:text-blue-400 transition-colors"
                              aria-hidden="true"
                            />
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors group"
                          >
                            <Package
                              size={16}
                              className="text-gray-500 group-hover:text-blue-400 transition-colors"
                              aria-hidden="true"
                            />
                            Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors group"
                          >
                            <Heart
                              size={16}
                              className="text-gray-500 group-hover:text-red-400 transition-colors"
                              aria-hidden="true"
                            />
                            Wishlist
                          </Link>
                          <div className="my-1 h-px bg-white/[0.06]" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setUserMenuOpen(false)
                              handleLogout()
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] rounded-xl transition-colors"
                          >
                            <LogOut size={16} aria-hidden="true" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/[0.06] transition-all duration-200"
                  aria-label="Sign in"
                >
                  <User size={17} aria-hidden="true" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="group relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label={`Wishlist${
                  wishlistCount > 0 ? ` (${wishlistCount} items)` : ''
                }`}
              >
                <Heart
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key="wishlist-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/40"
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="group relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label={`Shopping cart${
                  cartCount > 0 ? ` (${cartCount} items)` : ''
                }`}
              >
                <ShoppingBag
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-white/20"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    {isOpen ? (
                      <X size={20} aria-hidden="true" />
                    ) : (
                      <Menu size={20} aria-hidden="true" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            Mobile menu
           ───────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-white/[0.06] bg-[#0A0A0A]/98 backdrop-blur-xl"
            >
              <div className="px-5 sm:px-8 pt-2 pb-4">
                {/* Nav items */}
                <div className="space-y-0.5">
                  {navItems.map((item, idx) =>
                    item.isButton ? (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={item.action}
                        className="flex items-center justify-between w-full py-3 px-3 text-[14px] text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors text-left"
                      >
                        {item.name}
                        <ArrowRight
                          size={14}
                          className="text-gray-600"
                          aria-hidden="true"
                        />
                      </motion.button>
                    ) : (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between py-3 px-3 text-[14px] text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                          <ArrowRight
                            size={14}
                            className="text-gray-600"
                            aria-hidden="true"
                          />
                        </Link>
                      </motion.div>
                    )
                  )}
                </div>

                {/* User section */}
                {user ? (
                  <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-0.5">
                    <div className="flex items-center gap-3 px-3 pb-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">
                          Signed in
                        </p>
                        <p className="text-[12px] text-white truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 py-2.5 px-3 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserCircle size={16} className="text-gray-500" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 py-2.5 px-3 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package size={16} className="text-gray-500" />
                      Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 py-2.5 px-3 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart size={16} className="text-gray-500" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center gap-3 w-full py-2.5 px-3 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[13px] font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={15} />
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for non-home pages */}
      {!isHomePage && <div className="md:h-6" />}

      {/* ─────────────────────────────────────────────
          SEARCH MODAL
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
              setSearchResults([])
            }}
          >
            {/* Ambient orb */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/[0.07] blur-[120px]"
            />

            <div
              className="relative min-h-screen w-full px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Sparkles size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-white leading-tight">
                        Search Collection
                      </h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Find products, categories, and more
                      </p>
                    </div>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                    aria-label="Close search"
                  >
                    <X size={20} aria-hidden="true" />
                  </motion.button>
                </div>

                {/* Search input */}
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="relative mb-8"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="relative group">
                    <Search
                      size={20}
                      className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                      aria-hidden="true"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What are you looking for today?"
                      className="w-full pl-12 sm:pl-14 pr-24 sm:pr-28 py-4 sm:py-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] transition-all duration-200"
                      autoFocus
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
                        aria-label="Clear search"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    ) : (
                      <kbd className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-white/[0.04] border border-white/[0.08] rounded-md">
                        ESC
                      </kbd>
                    )}
                  </div>
                </motion.form>

                {/* Results area */}
                <div className="min-h-[400px]">
                  {/* Loading */}
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      </div>
                      <p className="text-gray-400 text-sm mt-4">
                        Searching our collection…
                      </p>
                    </motion.div>
                  )}

                  {/* Results */}
                  {!isSearching &&
                    searchQuery.length >= 2 &&
                    searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                            {searchResults.length}{' '}
                            {searchResults.length === 1 ? 'result' : 'results'}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {searchResults.map((product, idx) => (
                            <motion.button
                              key={product.id}
                              type="button"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              onClick={() =>
                                handleProductClick(product.id, product.name)
                              }
                              className="group flex items-center gap-4 p-3 bg-white/[0.03] rounded-2xl border border-white/[0.06] hover:border-blue-500/40 hover:bg-white/[0.06] cursor-pointer transition-all duration-200 text-left w-full"
                            >
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/[0.06]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    product.images?.[0] ||
                                    'https://placehold.co/64x64/1a1a1a/3B82F6?text=+'
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h4 className="text-[13px] sm:text-sm font-medium text-white group-hover:text-blue-400 transition line-clamp-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                      {product.category_main}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-[13px] font-semibold text-white">
                                      ₹{product.price.toLocaleString()}
                                    </span>
                                    {product.compare_at_price &&
                                      product.compare_at_price >
                                        product.price && (
                                        <p className="text-[10px] text-gray-500 line-through">
                                          ₹
                                          {product.compare_at_price.toLocaleString()}
                                        </p>
                                      )}
                                  </div>
                                </div>
                                {(product.is_new_arrival ||
                                  product.is_featured) && (
                                  <div className="flex gap-1.5 mt-1.5">
                                    {product.is_new_arrival && (
                                      <span className="text-[9px] font-semibold tracking-wider bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded">
                                        NEW
                                      </span>
                                    )}
                                    {product.is_featured && (
                                      <span className="text-[9px] font-semibold tracking-wider bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded">
                                        FEATURED
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <ArrowRight
                                size={14}
                                className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                                aria-hidden="true"
                              />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  {/* No results */}
                  {!isSearching &&
                    searchQuery.length >= 2 &&
                    searchResults.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                          <Package
                            size={26}
                            className="text-gray-600"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-white text-base font-medium mb-1.5">
                          No products found
                        </p>
                        <p className="text-gray-500 text-sm max-w-sm">
                          We couldn&apos;t find anything matching{' '}
                          <span className="text-gray-300">
                            &quot;{searchQuery}&quot;
                          </span>
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                          Try a different keyword or browse categories below
                        </p>
                      </motion.div>
                    )}

                  {/* Initial state */}
                  {!searchQuery && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                    >
                      {/* Popular */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp
                            size={14}
                            className="text-blue-400"
                            aria-hidden="true"
                          />
                          <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 font-medium">
                            Popular Searches
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => setSearchQuery(term)}
                              className="px-3.5 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-[12px] text-gray-300 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/[0.06] transition-all duration-200"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Clock
                                size={13}
                                className="text-gray-500"
                                aria-hidden="true"
                              />
                              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 font-medium">
                                Recent Searches
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={clearRecentSearches}
                              className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
                            >
                              Clear all
                            </button>
                          </div>
                          <div className="space-y-1">
                            {recentSearches.map((term, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSearchQuery(term)}
                                className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group text-left"
                              >
                                <Search
                                  size={13}
                                  className="text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="text-[13px] text-gray-400 group-hover:text-white transition-colors truncate">
                                  {term}
                                </span>
                                <ArrowRight
                                  size={12}
                                  className="text-gray-700 group-hover:text-blue-400 ml-auto opacity-0 group-hover:opacity-100 transition-all"
                                  aria-hidden="true"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Too short */}
                  {searchQuery.length > 0 && searchQuery.length < 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <p className="text-gray-500 text-sm">
                        Keep typing… need at least 2 characters
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}