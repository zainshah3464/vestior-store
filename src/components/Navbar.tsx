'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, Menu, X, Search, User, TrendingUp, Package, ChevronDown, LogOut, UserCircle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { parseProductImages } from '@/lib/utils' // ← safe parser

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
  | { name: string; action: () => void; isButton: true }
  | { name: string; href: string; isButton: false }

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
  const supabase = createClient()
  const { user } = useAuth()

  // ---- Helpers ----
  const isHomePage = pathname === '/'

  // --- Scroll effect ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- Cart count ---
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0))
    }
    updateCart()
    window.addEventListener('cartUpdated', updateCart)
    return () => window.removeEventListener('cartUpdated', updateCart)
  }, [])

  // --- Recent searches ---
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) setRecentSearches(JSON.parse(saved))
  }, [])

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // --- Search logic – image parsing fixed ---
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      const { data } = await supabase
        .from('products')
        .select('id, name, price, compare_at_price, images, category_main, is_new_arrival, is_featured')
        .eq('is_active', true)
        .ilike('name', `%${searchQuery}%`)
        .limit(8)

      const parsed = (data || []).map(p => ({
        ...p,
        images: parseProductImages(p.images),
      }))
      setSearchResults(parsed as SearchProduct[])
      setIsSearching(false)
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

  // --- ESC key ---
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isSearchOpen])

  // --- Body scroll lock mobile ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) router.push('/')
  }

  // --- Category action: work from any page ---
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

  const popularSearches = ['Pants', 'Shirts', 'Coats', 'Waistcoats', 'Suits', 'Gurkha', '2 Piece', '3 Piece']

  // Navbar background: transparent on homepage (until scrolled), solid dark on other pages
  const navBg = scrolled || !isHomePage
    ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10'
    : 'bg-transparent'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="text-xl md:text-2xl font-semibold tracking-tight text-white"
            >
              VESTIOR
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) =>
                item.isButton ? (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="text-sm text-gray-300 hover:text-white transition relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                  </Link>
                )
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-white transition"
              >
                <Search size={18} />
              </button>

              {user ? (
                <div className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <button className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 border border-white/20 flex items-center justify-center text-white text-sm font-medium transition-all hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:border-white/30">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-52 bg-[#121212]/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                      >
                        <div className="p-2 space-y-1">
                          <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
                            {user.email?.split('@')[0]}
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition"
                          >
                            <UserCircle size={16} className="text-gray-400" />
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition"
                          >
                            <Package size={16} className="text-gray-400" />
                            Orders
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded-lg transition"
                          >
                            <LogOut size={16} />
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
                  className="text-sm text-gray-300 hover:text-white transition flex items-center gap-1"
                >
                  <User size={18} />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}

              <Link href="/cart" className="relative text-gray-300 hover:text-white transition">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden py-2 border-t border-white/10 mt-1"
              >
                {navItems.map((item) =>
                  item.isButton ? (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="block py-2 text-gray-300 hover:text-white w-full text-left text-sm"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-gray-300 hover:text-white text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}

                {/* 👇 User links only when navbar is solid (scrolled or not on home) */}
                {(scrolled || !isHomePage) && user && (
                  <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-300 hover:text-white text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block py-2 text-gray-300 hover:text-white text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left py-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ---- Spacer for non-home pages to avoid content touching navbar ---- */}
      {!isHomePage && <div className="h-12 md:h-14" />}  {/* adjust as you like */}

      {/* ---------- Search Modal (unchanged except images now parsed) ---------- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-md overflow-y-auto"
          >
            <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                >
                  Search Collection
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-8"
              >
                <div className="relative group">
                  <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for today?"
                    className="w-full pl-14 pr-24 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </motion.form>

              <div className="min-h-[400px]">
                {isSearching && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 mt-4">Searching our collection...</p>
                  </motion.div>
                )}

                {!isSearching && searchQuery.length >= 2 && searchResults.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-sm text-gray-400 mb-4">Found {searchResults.length} products</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {searchResults.map((product, idx) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleProductClick(product.id, product.name)}
                          className="group flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 cursor-pointer transition-all"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                            <img
                              src={product.images?.[0] || 'https://placehold.co/64x64'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-white font-medium group-hover:text-blue-400 transition">
                                  {product.name}
                                </h4>
                                <p className="text-gray-500 text-xs mt-1">{product.category_main}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-blue-400 font-bold">₹{product.price.toLocaleString()}</span>
                                {product.compare_at_price && product.compare_at_price > product.price && (
                                  <p className="text-gray-500 text-xs line-through">₹{product.compare_at_price.toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {product.is_new_arrival && (
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">NEW</span>
                              )}
                              {product.is_featured && (
                                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">FEATURED</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <Package size={32} className="text-gray-600" />
                    </div>
                    <p className="text-white text-lg font-medium mb-2">No products found</p>
                    <p className="text-gray-500 text-sm">We couldn't find anything matching "{searchQuery}"</p>
                    <p className="text-gray-500 text-sm mt-1">Try searching with different keywords</p>
                  </motion.div>
                )}

                {!searchQuery && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-blue-400" />
                        <h3 className="text-white font-medium">Popular Searches</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:border-blue-500 hover:text-blue-400 hover:bg-white/10 transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Search size={14} className="text-gray-500" />
                            <h3 className="text-white font-medium">Recent Searches</h3>
                          </div>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-500 hover:text-red-400 transition"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((term, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSearchQuery(term)}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition group"
                            >
                              <Search size={14} className="text-gray-600 group-hover:text-blue-400" />
                              <span className="text-gray-400 group-hover:text-white transition">{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
                    <p className="text-gray-500 text-center">Type at least 2 characters to start searching</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}