'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileText,
  Lock,
} from 'lucide-react'

import type { InvoiceData } from '@/lib/invoice/generate'

interface Props {
  invoice: InvoiceData
  mode: 'customer' | 'admin'
}

export default function InvoiceView({ invoice, mode }: Props) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const backHref =
    mode === 'admin'
      ? `/admin/orders/${invoice.orderId}`
      : `/orders/${invoice.orderId}`

  const issuedDate = new Date(invoice.issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const paidDate = invoice.paidAt
    ? new Date(invoice.paidAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const isPaid = invoice.paymentStatus === 'completed'
  const isRefunded = invoice.paymentStatus === 'refunded'

  // Status banner config
  const statusConfig = isRefunded
    ? {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        border: 'border-violet-200',
        Icon: RotateCcw,
        label: 'This order has been refunded',
      }
    : isPaid
    ? {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        Icon: CheckCircle2,
        label: 'Payment received — thank you!',
      }
    : {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        Icon: Clock,
        label: 'Payment pending',
      }

  const StatusIcon = statusConfig.Icon

  return (
    <>
      {/* ─────────────────────────────────────────────
          Screen-only controls
         ───────────────────────────────────────────── */}
      <div className="print:hidden relative bg-black pt-20 pb-4 overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/[0.05] blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Order
          </Link>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[12px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
            />
            <Printer
              size={14}
              className="relative z-10"
              aria-hidden="true"
            />
            <span className="relative z-10">Print / Save as PDF</span>
          </motion.button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Invoice (print area — untouched classes)
         ───────────────────────────────────────────── */}
      <div className="bg-neutral-900 print:bg-white py-8 print:py-0 min-h-screen">
        <div
          ref={printRef}
          id="invoice-print-area"
          className="max-w-3xl mx-auto bg-white text-neutral-900 p-8 md:p-12 print:p-8 print:shadow-none shadow-2xl rounded-lg print:rounded-none"
        >
          {/* ─────────────────────────────────────────────
              Header
             ───────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-6 pb-6 border-b-2 border-neutral-200">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                VESTIOR
              </h1>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
                Premium Tailored Fashion
              </p>
              <div className="mt-4 text-xs text-neutral-600 leading-relaxed">
                <p>VESTIOR Studio</p>
                <p>Karachi, Pakistan</p>
                <p>hello@vestior.com</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-lg">
                <p className="text-xs uppercase tracking-widest opacity-70 flex items-center gap-1.5 justify-end">
                  <FileText size={10} aria-hidden="true" />
                  Invoice
                </p>
                <p className="text-lg font-bold font-mono mt-0.5">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                Issued: {issuedDate}
              </p>
              {paidDate && (
                <p className="text-xs text-neutral-500">Paid: {paidDate}</p>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Status banner
             ───────────────────────────────────────────── */}
          <div
            className={`mt-6 rounded-lg px-4 py-3 flex items-center gap-2.5 text-sm font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            <StatusIcon size={16} aria-hidden="true" />
            {statusConfig.label}
          </div>

          {/* ─────────────────────────────────────────────
              Customer & Shipping
             ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-semibold">
                Billed To
              </h2>
              <p className="text-sm font-semibold text-neutral-900">
                {invoice.customer.name}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {invoice.customer.email}
              </p>
              {invoice.customer.phone && (
                <p className="text-xs text-neutral-600">
                  {invoice.customer.phone}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-semibold">
                Shipping Address
              </h2>
              <div className="text-xs text-neutral-700 leading-relaxed">
                {invoice.customer.addressLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Items table
             ───────────────────────────────────────────── */}
          <div className="mt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="text-left text-xs uppercase tracking-widest text-neutral-500 py-3 font-semibold">
                    Item
                  </th>
                  <th className="text-center text-xs uppercase tracking-widest text-neutral-500 py-3 font-semibold">
                    Qty
                  </th>
                  <th className="text-right text-xs uppercase tracking-widest text-neutral-500 py-3 font-semibold">
                    Unit Price
                  </th>
                  <th className="text-right text-xs uppercase tracking-widest text-neutral-500 py-3 font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-100"
                  >
                    <td className="py-3 text-neutral-900 font-medium">
                      {item.name}
                    </td>
                    <td className="py-3 text-center text-neutral-600 tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-neutral-600 tabular-nums">
                      PKR {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-neutral-900 font-semibold tabular-nums">
                      PKR {item.lineTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ─────────────────────────────────────────────
              Totals
             ───────────────────────────────────────────── */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  PKR {invoice.subtotal.toLocaleString()}
                </span>
              </div>

              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>
                    Discount
                    {invoice.couponCode ? (
                      <span className="text-emerald-500 font-mono text-xs ml-1">
                        ({invoice.couponCode})
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                  <span className="tabular-nums font-medium">
                    − PKR {invoice.discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {invoice.shipping === 0
                    ? 'Free'
                    : `PKR ${invoice.shipping.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t-2 border-neutral-200">
                <span>Total</span>
                <span className="tabular-nums">
                  PKR {invoice.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Payment details
             ───────────────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3 font-semibold">
              Payment Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-neutral-500 mb-0.5">Method</p>
                <p className="font-medium text-neutral-900 uppercase">
                  {invoice.paymentProvider ?? invoice.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-neutral-500 mb-0.5">Status</p>
                <p className="font-medium text-neutral-900 capitalize">
                  {invoice.paymentStatus}
                </p>
              </div>
              {invoice.paymentIntentId && (
                <div className="col-span-2">
                  <p className="text-neutral-500 mb-0.5">Transaction ID</p>
                  <p className="font-mono text-neutral-700 truncate">
                    {invoice.paymentIntentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Footer
             ───────────────────────────────────────────── */}
          <div className="mt-10 pt-6 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500 flex items-center justify-center gap-1.5">
              <Lock size={10} aria-hidden="true" />
              Thank you for shopping with VESTIOR.
            </p>
            <p className="text-[10px] text-neutral-400 mt-1.5">
              For questions about this invoice, contact hello@vestior.com and
              reference {invoice.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Print-specific CSS — PRESERVED EXACTLY
         ───────────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          html,
          body {
            background: white !important;
          }
          body > * {
            visibility: hidden;
          }
          #invoice-print-area,
          #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}