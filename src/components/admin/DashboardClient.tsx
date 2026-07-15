'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  productCount: number
  orderCount: number
  userCount: number
  totalRevenue: number
  avgOrderValue: number
  chartData: { date: string; total: number }[]
  statusChartData: { name: string; value: number }[]
  recentOrders: {
    id: string
    user_email: string
    total: number
    status: string
    created_at: string
  }[]
  revenueTrend: number
  orderTrend: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#a855f7',
  delivered: '#22c55e',
  cancelled: '#ef4444'
}

const PIE_COLORS = ['#eab308', '#3b82f6', '#a855f7', '#22c55e', '#ef4444']

export default function DashboardClient({
  productCount, orderCount, userCount, totalRevenue,
  avgOrderValue, chartData, statusChartData, recentOrders,
  revenueTrend, orderTrend
}: Props) {
  const [shapes, setShapes] = useState<{
    x: number; y: number; size: number; duration: number; delay: number;
  }[]>([]) // start empty (server match)

  // Generate random shapes only on client to avoid hydration mismatch
  useEffect(() => {
    setShapes(
      Array.from({ length: 6 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 60,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5
      }))
    )
  }, [])

  const formatTrend = (trend: number) => {
    if (trend === 0) return null
    const abs = Math.abs(trend).toFixed(1)
    return trend > 0 ? `+${abs}%` : `-${abs}%`
  }

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* ------ Continuous Animated Background Shapes ------ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl border border-white/5"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              repeat: Infinity,
              duration: shape.duration,
              delay: shape.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, here’s your business overview.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          {
            label: 'Total Products',
            value: productCount,
            icon: Package,
            trend: null,
            color: 'border-l-indigo-500'
          },
          {
            label: 'Total Orders',
            value: orderCount,
            icon: ShoppingCart,
            trend: formatTrend(orderTrend),
            color: 'border-l-emerald-500'
          },
          {
            label: 'Total Users',
            value: userCount,
            icon: Users,
            trend: null,
            color: 'border-l-purple-500'
          },
          {
            label: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: formatTrend(revenueTrend),
            color: 'border-l-amber-500'
          },
          {
            label: 'Avg Order Value',
            value: `₹${avgOrderValue.toFixed(0)}`,
            icon: TrendingUp,
            trend: null,
            color: 'border-l-rose-500'
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 overflow-hidden group shadow-xl"
          >
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${stat.color}`} />
            <div className="relative z-10 pl-3">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-white/60" />
                {stat.trend && (
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Revenue (Last 7 Days)
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">No sales data yet.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Order Status
          </h2>
          {statusChartData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">No orders yet.</p>
          )}
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0f0f0f]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Recent Orders
          </h2>
        </div>
        {recentOrders.length > 0 ? (
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left text-sm text-gray-400">Order ID</th>
                <th className="p-4 text-left text-sm text-gray-400">Customer</th>
                <th className="p-4 text-left text-sm text-gray-400">Amount</th>
                <th className="p-4 text-left text-sm text-gray-400">Status</th>
                <th className="p-4 text-left text-sm text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-sm text-indigo-400 font-mono">#{order.id.slice(0, 8)}</td>
                  <td className="p-4 text-sm text-white">{order.user_email}</td>
                  <td className="p-4 text-sm text-white font-medium">₹{order.total?.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 text-xs rounded-full"
                      style={{
                        background: `${STATUS_COLORS[order.status]}20`,
                        color: STATUS_COLORS[order.status]
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-GB')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-12">No orders yet.</p>
        )}
      </motion.div>
    </div>
  )
}