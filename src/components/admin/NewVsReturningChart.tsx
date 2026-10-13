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

export default function NewVsReturningChart({
  data,
}: {
  data: NewVsReturningPoint[]
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-80 flex items-center justify-center">
        <p className="text-gray-500">No visitor data yet.</p>
      </div>
    )
  }

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f0f0f',
              border: '1px solid #374151',
              borderRadius: '10px',
              fontSize: 13,
            }}
            labelStyle={{ color: '#9ca3af' }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
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
  )
}