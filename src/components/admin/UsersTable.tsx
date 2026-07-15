'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, UserCheck, UserCog, UserPlus, Eye } from 'lucide-react'
import UserDetailsModal from './UserDetailsModal'

interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  role: string
  created_at: string
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  updated_at?: string | null
}

export default function UsersTable({ profiles }: { profiles: Profile[] }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const perPage = 10

  // ---- Animated background shapes ----
  const [shapes, setShapes] = useState<{ x: number; y: number; size: number; duration: number; delay: number }[]>([])
  useEffect(() => {
    setShapes(
      Array.from({ length: 5 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 30 + Math.random() * 60,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  // Filtering
  const filtered = profiles.filter(p => {
    const matchesSearch =
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
    const matchesRole = roleFilter === 'all' || p.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  // Stats
  const totalUsers = profiles.length
  const adminCount = profiles.filter(p => p.role === 'admin').length
  const customerCount = profiles.filter(p => p.role !== 'admin').length
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  const newThisWeek = profiles.filter(p => new Date(p.created_at) >= last7Days).length

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'border-l-indigo-500' },
    { label: 'Admins', value: adminCount, icon: UserCog, color: 'border-l-purple-500' },
    { label: 'Customers', value: customerCount, icon: UserCheck, color: 'border-l-emerald-500' },
    { label: 'New This Week', value: newThisWeek, icon: UserPlus, color: 'border-l-amber-500' },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl border border-white/5"
            style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: shape.size, height: shape.size }}
            animate={{ x: [0, 20, -15, 0], y: [0, -30, 15, 0], scale: [1, 1.08, 0.95, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: shape.duration, delay: shape.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1) }}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">All Roles</option>
              <option value="admin" className="bg-[#1a1a1a]">Admin</option>
              <option value="customer" className="bg-[#1a1a1a]">Customer</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative bg-[#0f0f0f]/60 backdrop-blur-md p-4 rounded-xl border border-white/10 overflow-hidden shadow-xl"
            >
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full ${stat.color}`} />
              <div className="relative z-10 pl-3">
                <div className="flex items-center justify-between mb-1">
                  <stat.icon className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No users found.</div>
        ) : (
          <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left text-sm text-gray-400">User</th>
                    <th className="p-4 text-left text-sm text-gray-400">Email</th>
                    <th className="p-4 text-left text-sm text-gray-400 hidden md:table-cell">Phone</th>
                    <th className="p-4 text-left text-sm text-gray-400">Role</th>
                    <th className="p-4 text-left text-sm text-gray-400 hidden sm:table-cell">Joined</th>
                    <th className="p-4 text-left text-sm text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((profile, i) => (
                    <motion.tr
                      key={profile.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {profile.full_name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-white text-sm font-medium">{profile.full_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-400">{profile.email}</td>
                      <td className="p-4 text-sm text-gray-400 hidden md:table-cell">{profile.phone || '—'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs rounded-full ${
                          profile.role === 'admin'
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {profile.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">
                        {new Date(profile.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedUser(profile)}
                          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}