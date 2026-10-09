'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Package, Clock, CheckCircle, XCircle, Truck,
  MapPin, CreditCard, Receipt, Calendar,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OrderDetail } from '@/lib/orders/queries'


const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const STATUS_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  pending: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  processing: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  shipped: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  delivered: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  cancelled: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const

export default function CustomerOrderDetail({ detail }: { detail: OrderDetail }) {
  const [currentStatus, setCurrentStatus] = useState(detail.order.status)
  const supabase = createClient()

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`order-${detail.order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${detail.order.id}`,
        },
        (payload) => {
          setCurrentStatus(payload.new.status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, detail.order.id])

  const statusStyle = STATUS_COLORS[currentStatus] ?? STATUS_COLORS.pending
  const StatusIcon = STATUS_ICONS[currentStatus] ?? Package
  const currentStepIndex = STATUS_STEPS.indexOf(currentStatus as (typeof STATUS_STEPS)[number])

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-6 transition text-sm"
        >
          <ChevronLeft size={16} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs text-gray-400 font-mono">
              ORDER #{detail.order.id.slice(0, 8).toUpperCase()}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Order Details
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} />
              {new Date(detail.order.createdAt).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
          >
            <StatusIcon size={16} />
            <span className="text-sm font-medium capitalize">{currentStatus}</span>
          </div>
        </div>

        {/* Progress tracker */}
        {currentStatus !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => {
                const Icon = STATUS_ICONS[step]
                const isActive = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive
                            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                            : 'border-gray-700 bg-transparent text-gray-600'
                        } ${isCurrent ? 'ring-4 ring-indigo-500/20' : ''}`}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        className={`text-xs capitalize hidden sm:block ${
                          isActive ? 'text-indigo-400' : 'text-gray-600'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          i < currentStepIndex ? 'bg-indigo-500' : 'bg-gray-800'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Package size={18} className="text-indigo-400" />
                  Items ({detail.items.length})
                </h2>
              </div>
              <div className="divide-y divide-white/5">
                {detail.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 border border-white/10">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-indigo-400" />
                Shipping Address
              </h2>
              <div className="text-sm text-gray-300 space-y-1">
                <p className="font-medium text-white">
                  {String(detail.order.address.full_name ?? '')}
                </p>
                <p>{String(detail.order.address.phone ?? '')}</p>
                <p>{String(detail.order.address.line1 ?? '')}</p>
              {Boolean(detail.order.address.line2) && (
  <p>{String(detail.order.address.line2)}</p>
)}
                <p>
                  {String(detail.order.address.city ?? '')},{' '}
                  {String(detail.order.address.state ?? '')} —{' '}
                  {String(detail.order.address.pincode ?? '')}
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Payment summary */}
            <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                <Receipt size={18} className="text-indigo-400" />
                Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{detail.order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {detail.order.shipping === 0
                      ? 'Free'
                      : `₹${detail.order.shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>₹{detail.order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-indigo-400" />
                Payment
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white uppercase">
                    {detail.order.paymentProvider ?? detail.order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      detail.order.paymentStatus === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : detail.order.paymentStatus === 'refunded'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {detail.order.paymentStatus}
                  </span>
                </div>
                {detail.order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paid on</span>
                    <span className="text-white text-xs">
                      {new Date(detail.order.paidAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}