'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { Package } from 'lucide-react'
import type { CategoryStat } from '@/lib/analytics/types'

// ─────────────────────────────────────────────
// Palette — preserved
// ─────────────────────────────────────────────
const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#ef4444',
]

// Custom tooltip — glass morphism
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    value: number
    payload: CategoryStat
  }>
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  const stat = payload[0].payload

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f]/95 backdrop-blur-xl px-3 py-2.5 shadow-xl shadow-black/60">
      {label && (
        <p className="text-[11px] font-semibold text-white mb-1.5">
          {label}
        </p>
      )}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span className="text-gray-400">Revenue</span>
          <span className="font-semibold text-emerald-400 tabular-nums">
            ₹{stat.revenue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[10px]">
          <span className="text-gray-500">Units sold</span>
          <span className="text-gray-300 tabular-nums">
            {stat.units_sold.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[10px]">
          <span className="text-gray-500">Orders</span>
          <span className="text-gray-300 tabular-nums">
            {stat.order_count.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CategoryChart({ data }: { data: CategoryStat[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center h-80 overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-indigo-500/[0.06] blur-[100px]"
        />
        <div className="relative px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <Package
              size={20}
              className="text-gray-600"
              aria-hidden="true"
            />
          </div>
          <p className="text-[12px] text-gray-500">No category data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.05] blur-[100px]"
      />

      <div className="relative p-3 sm:p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#1f2937"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="category"
              stroke="#6b7280"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
            />

            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}