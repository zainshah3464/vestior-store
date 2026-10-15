'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import type { NewVsReturningPoint } from '@/lib/tracking/queries'

// ─────────────────────────────────────────────
// Custom tooltip — glass, matching site-wide style
// ─────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name?: string; color?: string }>
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0)

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f]/95 backdrop-blur-xl px-3 py-2 shadow-xl shadow-black/60">
      {label && (
        <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500 mb-1.5">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {payload.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 text-[12px]"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: entry.color }}
                aria-hidden="true"
              />
              <span className="text-gray-400">{entry.name}</span>
            </span>
            <span className="font-semibold text-white tabular-nums">
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-white/[0.06] pt-1 mt-1 flex items-center justify-between gap-3 text-[11px]">
          <span className="text-gray-500">Total</span>
          <span className="font-semibold text-white tabular-nums">
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function NewVsReturningChart({
  data,
}: {
  data: NewVsReturningPoint[]
}) {
  // ─────────────────────────────────────────────
  // Empty state
  // ─────────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center h-80 overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-violet-500/[0.06] blur-[100px]"
        />
        <div className="relative px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
              aria-hidden="true"
            >
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <p className="text-[12px] text-gray-500">No visitor data yet.</p>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Format date labels
  // ─────────────────────────────────────────────
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
        className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-violet-500/[0.05] blur-[100px]"
      />

      <div className="relative p-3 sm:p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formatted}
            margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
          >
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
              allowDecimals={false}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(139, 92, 246, 0.06)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="newVisitors"
              name="New"
              stackId="a"
              fill="#8b5cf6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="returning"
              name="Returning"
              stackId="a"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}