'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { DailySeriesPoint } from '@/lib/analytics/types'

// ─────────────────────────────────────────────
// Custom tooltip — glass morphism
// ─────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  const value = payload[0].value

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f]/95 backdrop-blur-xl px-3 py-2 shadow-xl shadow-black/60">
      {label && (
        <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500 mb-1">
          {label}
        </p>
      )}
      <p className="text-[13px] font-bold text-white tabular-nums">
        ₹{value.toLocaleString()}
      </p>
      <p className="text-[10px] text-gray-500 mt-0.5">Revenue</p>
    </div>
  )
}

export default function RevenueChart({
  data,
}: {
  data: DailySeriesPoint[]
}) {
  if (!data || data.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center h-80 overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-emerald-500/[0.06] blur-[100px]"
        />
        <div className="relative px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <TrendingUp
              size={20}
              className="text-gray-600"
              aria-hidden="true"
            />
          </div>
          <p className="text-[12px] text-gray-500">
            No revenue data for this range.
          </p>
        </div>
      </div>
    )
  }

  // Format: "2026-10-05" → "Oct 5"
  const formatted = data.map((d) => {
    const [y, m, day] = d.day.split('-')
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(day))
    return {
      ...d,
      label: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
    }
  })

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-emerald-500/[0.05] blur-[100px]"
      />

      <div className="relative p-3 sm:p-4">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={formatted}
            margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="revenueFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#1f2937"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="label"
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
              cursor={{ stroke: '#10b981', strokeOpacity: 0.2 }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}