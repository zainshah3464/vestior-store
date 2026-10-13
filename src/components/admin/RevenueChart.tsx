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
import type { DailySeriesPoint } from '@/lib/analytics/types'

export default function RevenueChart({ data }: { data: DailySeriesPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-80 flex items-center justify-center">
        <p className="text-gray-500">No revenue data for this range.</p>
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
    <div className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: '#0f0f0f',
              border: '1px solid #374151',
              borderRadius: '10px',
              fontSize: 13,
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value) => [
              `₹${Number(value ?? 0).toLocaleString()}`,
              'Revenue',
            ]}
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
  )
}