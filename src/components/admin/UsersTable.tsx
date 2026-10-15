'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Users,
  UserCheck,
  UserCog,
  UserPlus,
  Eye,
  Crown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2,
  Activity,
  X,
  ExternalLink,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import UserDetailsModal from './UserDetailsModal'
import { changeUserRole } from '@/actions/admin-management'

interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  role: string
  is_super_admin?: boolean
  created_at: string
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  updated_at?: string | null
}

interface Props {
  profiles: Profile[]
  viewerIsSuperAdmin: boolean
  viewerId: string | null
}

// ─────────────────────────────────────────────
// Role badge styling
// ─────────────────────────────────────────────
const ROLE_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  superadmin: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  admin: {
    bg: 'bg-indigo-500/[0.1]',
    text: 'text-indigo-300',
    border: 'border-indigo-500/25',
    dot: 'bg-indigo-400',
  },
  customer: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
}

const DEFAULT_ROLE = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
}

export default function UsersTable({
  profiles,
  viewerIsSuperAdmin,
  viewerId,
}: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [roleMenuFor, setRoleMenuFor] = useState<string | null>(null)
  const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const perPage = 10

  // ─────────────────────────────────────────────
  // Close role menu on outside click
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!roleMenuFor) return
    const handler = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setRoleMenuFor(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [roleMenuFor])

  // ─────────────────────────────────────────────
  // Filter — preserved logic
  // ─────────────────────────────────────────────
  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch =
      p.full_name?.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone?.includes(search)
    const matchesRole = roleFilter === 'all' || p.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  // ─────────────────────────────────────────────
  // Stats — preserved
  // ─────────────────────────────────────────────
  const totalUsers = profiles.length
  const adminCount = profiles.filter((p) => p.role === 'admin').length
  const customerCount = profiles.filter((p) => p.role !== 'admin').length
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  const newThisWeek = profiles.filter(
    (p) => new Date(p.created_at) >= last7Days
  ).length

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Admins',
      value: adminCount,
      icon: UserCog,
      accent: 'border-l-violet-500',
      glow: 'bg-violet-500/[0.06]',
      iconBg: 'bg-violet-500/[0.1]',
      iconText: 'text-violet-400',
    },
    {
      label: 'Customers',
      value: customerCount,
      icon: UserCheck,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'New This Week',
      value: newThisWeek,
      icon: UserPlus,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
  ]

  const hasActiveFilters = search !== '' || roleFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setCurrentPage(1)
  }

  // ─────────────────────────────────────────────
  // Role change — preserved logic
  // ─────────────────────────────────────────────
  const handleRoleChange = async (
    target: Profile,
    newRole: 'admin' | 'customer'
  ) => {
    if (newRole === target.role) return

    const label = newRole === 'admin' ? 'Admin' : 'Customer'
    if (
      !confirm(
        `Change ${target.email}'s role to ${label}?\n\nThis will grant or remove access to the admin panel.`
      )
    ) {
      return
    }

    setChangingRoleFor(target.id)
    setRoleMenuFor(null)

    try {
      await changeUserRole(target.id, newRole)
      toast.success(`${target.email} is now a ${label.toLowerCase()}`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change role')
    } finally {
      setChangingRoleFor(null)
    }
  }

  const canChangeRole = (p: Profile) =>
    viewerIsSuperAdmin && p.id !== viewerId && !p.is_super_admin

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ═════════════════════════════════════════════
          Header — Editorial
         ═════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Users size={11} className="text-indigo-400" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Directory
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Users
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Manage customers, admins, and roles across your platform.
            </p>
          </div>

          {totalUsers > 0 && (
            <p className="text-[11px] sm:text-[12px] text-gray-500 font-medium tabular-nums flex-shrink-0">
              {totalUsers.toLocaleString()} total
            </p>
          )}
        </div>
      </motion.header>

      {/* ═════════════════════════════════════════════
          Stats cards
         ═════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-colors duration-300"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${stat.accent}`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${stat.glow} blur-[70px]`}
              />
              <div className="relative pl-3">
                <div
                  className={`w-8 h-8 rounded-xl ${stat.iconBg} border border-white/[0.06] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={14}
                    className={stat.iconText}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═════════════════════════════════════════════
          Filter bar
         ═════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-9 pr-9 text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCurrentPage(1)
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Clear search"
            >
              <X size={11} aria-hidden="true" />
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter by role"
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white min-w-[150px]"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* ═════════════════════════════════════════════
          Empty state
         ═════════════════════════════════════════════ */}
      {paginated.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-indigo-500/[0.05] blur-[100px]"
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Users
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              No users found
            </h3>
            <p className="text-[12px] text-gray-500 max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query.'
                : 'Users will appear here once they sign up.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
              >
                <X size={11} aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    User
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Role
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((profile, i) => {
                  const initial =
                    profile.full_name?.charAt(0)?.toUpperCase() ||
                    profile.email?.charAt(0)?.toUpperCase() ||
                    '?'

                  // Determine role styling
                  let roleKey = 'customer'
                  if (profile.is_super_admin) roleKey = 'superadmin'
                  else if (profile.role === 'admin') roleKey = 'admin'
                  const roleStyle = ROLE_STYLES[roleKey] ?? DEFAULT_ROLE

                  return (
                    <motion.tr
                      key={profile.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.02, 0.25),
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[12px] font-semibold ring-1 ring-white/[0.08] flex-shrink-0"
                            aria-hidden="true"
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-white truncate leading-tight">
                              {profile.full_name || 'N/A'}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5 truncate md:hidden">
                              {profile.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-gray-300 truncate max-w-[220px]">
                            {profile.email}
                          </p>
                          {profile.phone && (
                            <p className="text-[10px] text-gray-500 tabular-nums">
                              {profile.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                        >
                          {roleKey === 'superadmin' ? (
                            <Crown size={9} aria-hidden="true" />
                          ) : roleKey === 'admin' ? (
                            <Shield size={9} aria-hidden="true" />
                          ) : (
                            <span
                              className={`w-1 h-1 rounded-full ${roleStyle.dot}`}
                              aria-hidden="true"
                            />
                          )}
                          {profile.is_super_admin
                            ? 'Super Admin'
                            : profile.role}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        <span className="text-[11px] text-gray-400 tabular-nums">
                          {new Date(profile.created_at).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => setSelectedUser(profile)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/[0.08] transition-all duration-200"
                            aria-label={`View ${profile.email}`}
                          >
                            <Eye size={12} aria-hidden="true" />
                            View
                          </button>

                          {/* Activity */}
                          <Link
                            href={`/admin/users/${profile.id}/activity`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-all duration-200"
                            aria-label={`Activity for ${profile.email}`}
                          >
                            <Activity size={12} aria-hidden="true" />
                            <span className="hidden sm:inline">Activity</span>
                          </Link>

                          {/* Role dropdown */}
                          {canChangeRole(profile) && (
                            <div
                              className="relative"
                              ref={
                                roleMenuFor === profile.id
                                  ? menuContainerRef
                                  : undefined
                              }
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setRoleMenuFor(
                                    roleMenuFor === profile.id
                                      ? null
                                      : profile.id
                                  )
                                }}
                                disabled={changingRoleFor === profile.id}
                                aria-label={`Change role for ${profile.email}`}
                                aria-haspopup="menu"
                                aria-expanded={roleMenuFor === profile.id}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/[0.08] disabled:opacity-50 transition-all duration-200"
                              >
                                {changingRoleFor === profile.id ? (
                                  <Loader2
                                    size={12}
                                    className="animate-spin"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Crown
                                    size={12}
                                    aria-hidden="true"
                                  />
                                )}
                                <span className="hidden sm:inline">Role</span>
                                <ChevronDown
                                  size={10}
                                  className={`transition-transform duration-200 ${
                                    roleMenuFor === profile.id
                                      ? 'rotate-180'
                                      : ''
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>

                              <AnimatePresence>
                                {roleMenuFor === profile.id && (
                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      y: -6,
                                      scale: 0.96,
                                    }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{
                                      opacity: 0,
                                      y: -6,
                                      scale: 0.96,
                                    }}
                                    transition={{
                                      duration: 0.18,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                    role="menu"
                                    className="absolute right-0 mt-2 w-48 bg-[#121212]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-30"
                                  >
                                    <div className="px-3 py-2 border-b border-white/[0.06]">
                                      <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                                        Change Role
                                      </p>
                                    </div>

                                    <div className="p-1">
                                      <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() =>
                                          handleRoleChange(profile, 'admin')
                                        }
                                        disabled={profile.role === 'admin'}
                                        className="w-full text-left px-3 py-2 rounded-lg text-[12px] text-gray-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors flex items-center gap-2"
                                      >
                                        <Shield
                                          size={13}
                                          className="text-indigo-400 flex-shrink-0"
                                          aria-hidden="true"
                                        />
                                        Make Admin
                                      </button>

                                      <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() =>
                                          handleRoleChange(
                                            profile,
                                            'customer'
                                          )
                                        }
                                        disabled={
                                          profile.role === 'customer'
                                        }
                                        className="w-full text-left px-3 py-2 rounded-lg text-[12px] text-gray-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors flex items-center gap-2"
                                      >
                                        <UserCheck
                                          size={13}
                                          className="text-emerald-400 flex-shrink-0"
                                          aria-hidden="true"
                                        />
                                        Make Customer
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ─────────────────────────────────────────────
              Pagination
             ───────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border-t border-white/[0.06]">
              <span className="text-[11px] text-gray-500 tabular-nums">
                Page{' '}
                <span className="text-gray-300 font-medium">
                  {currentPage}
                </span>{' '}
                of{' '}
                <span className="text-gray-300 font-medium">
                  {totalPages}
                </span>{' '}
                ·{' '}
                <span className="text-gray-300 font-medium">
                  {filtered.length.toLocaleString()}
                </span>{' '}
                filtered
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
                >
                  <ChevronLeft
                    size={12}
                    className="transition-transform duration-300 group-hover:-translate-x-0.5 group-disabled:translate-x-0"
                    aria-hidden="true"
                  />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
                >
                  Next
                  <ChevronRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}