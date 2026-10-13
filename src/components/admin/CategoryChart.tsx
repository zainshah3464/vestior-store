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
import type { CategoryStat } from '@/lib/analytics/types'

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#ef4444',
]

export default function CategoryChart({ data }: { data: CategoryStat[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-80 flex items-center justify-center">
        <p className="text-gray-500">No category data.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="category"
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
            cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
          />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}