'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { TrendingUp, CheckCircle2 } from 'lucide-react'

interface AdminChartsProps {
  chartData: { date: string; total: number }[]
  statusChartData: { name: string; value: number }[]
}

const PIE_COLORS = ['#eab308', '#3b82f6', '#a855f7', '#22c55e', '#ef4444']

export default function AdminCharts({
  chartData,
  statusChartData,
}: AdminChartsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 relative z-10">
      {/* Revenue (Last 7 Days) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
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
                contentStyle={{
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-16">No sales data yet.</p>
        )}
      </motion.div>

      {/* Order Status */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Order Status
        </h2>
        {statusChartData.some((d) => d.value > 0) ? (
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
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-16">No orders yet.</p>
        )}
      </motion.div>
    </div>
  )
}