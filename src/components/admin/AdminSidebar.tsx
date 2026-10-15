'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Star,
  Ticket,
  ShoppingBag,
  BarChart3,
  Users2,
  FileBarChart,
  Mail,
  ShieldCheck,
  Download,
  Users,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react'

// ─────────────────────────────────────────────
// Menu — SAME ITEMS, SAME ORDER, SAME HREFS
//   Grouped visually for better scan-ability.
// ─────────────────────────────────────────────
type MenuItem = {
  name: string
  href: string
  icon: React.ElementType
}

const MENU_GROUPS: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Payments', href: '/admin/payments', icon: Wallet },
      { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
      { name: 'Abandoned', href: '/admin/abandoned-carts', icon: ShoppingBag },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    label: 'Audience',
    items: [
      { name: 'Visitors', href: '/admin/visitors', icon: Users2 },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Emails', href: '/admin/emails', icon: Mail },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Audit', href: '/admin/audit', icon: ShieldCheck },
      { name: 'Exports', href: '/admin/exports', icon: Download },
    ],
  },
]

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href))

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      className="w-64 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col h-full"
    >
      {/* ─────────────────────────────────────────────
          Brand header
         ───────────────────────────────────────────── */}
      <div className="relative flex-shrink-0 px-5 py-5 border-b border-white/[0.06]">
        {/* Ambient accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-16 w-[200px] h-[200px] bg-blue-500/[0.06] blur-[80px]"
        />

        <div className="relative flex items-center justify-between gap-3">
          <Link
            href="/admin"
            className="group block min-w-0"
            aria-label="VESTIOR Admin"
          >
            <h1 className="text-[20px] font-bold tracking-[0.15em] text-white group-hover:text-blue-400 transition-colors duration-300">
              VESTIOR
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-1 h-1 rounded-full bg-blue-500"
                aria-hidden="true"
              />
              <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                Admin Panel
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 -mr-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Navigation
         ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-5 scrollbar-hide">
        {MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500">
              {group.label}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      active
                        ? 'bg-blue-500/[0.1] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Left accent bar */}
                    {active && (
                      <motion.span
                        layoutId="admin-sidebar-active"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                      />
                    )}

                    <span
                      className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        active ? 'text-blue-400' : ''
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>

                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ─────────────────────────────────────────────
          Footer
         ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.06]">
        <Link
          href="/"
          onClick={onClose}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <LogOut size={16} aria-hidden="true" />
          </span>
          <span className="flex-1 truncate">Back to Site</span>
          <ExternalLink
            size={12}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.aside>
  )
}