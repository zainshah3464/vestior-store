import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ArrowLeft, Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'VESTIOR returns, exchanges, and refund policy — 14-day return window for unused items.',
  alternates: { canonical: '/refund' },
}

const TOC = [
  { id: 'window', label: 'Return Window' },
  { id: 'eligibility', label: 'Eligibility for Return' },
  { id: 'damaged', label: 'Damaged or Incorrect Items' },
  { id: 'initiate', label: 'How to Initiate a Return' },
  { id: 'refund', label: 'Refund Process' },
  { id: 'exchanges', label: 'Exchanges' },
  { id: 'sale', label: 'Sale Items' },
  { id: 'cancellations', label: 'Order Cancellations' },
  { id: 'failed', label: 'Failed Deliveries' },
  { id: 'contact', label: 'Contact for Returns' },
]

export default function RefundPolicyPage() {
  return (
    <div className="relative min-h-screen bg-black pt-20 md:pt-24 xl:pt-28 pb-20 md:pb-24 xl:pb-28 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient backdrop — full width
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-teal-500/[0.03] blur-[110px]" />
      </div>

      <div className="relative z-10 w-full px-5 sm:px-8 md:px-10 lg:px-14">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-white mb-6 md:mb-8 transition-colors text-[12px] font-medium"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Home
          </Link>

          {/* ─────────────────────────────────────────────
              Hero header
             ───────────────────────────────────────────── */}
          <header className="mb-8 md:mb-12 xl:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-sm">
              <RotateCcw
                size={11}
                className="text-emerald-400"
                aria-hidden="true"
              />
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
                Support
              </span>
            </div>

            <div className="flex items-start gap-4 sm:gap-5 flex-wrap">
              <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/[0.15] to-teal-500/[0.1] border border-emerald-500/25 flex items-center justify-center shadow-[0_0_40px_-12px_rgba(16,185,129,0.5)]">
                <RotateCcw
                  size={26}
                  className="text-emerald-400"
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-3xl bg-emerald-500/[0.06] blur-2xl -z-10"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-tight">
                  Refund &amp; Return Policy
                </h1>
                <p className="text-[13px] sm:text-[14px] text-gray-500 mt-2 max-w-2xl leading-relaxed">
                  Customer satisfaction is our priority.
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-[10px] font-medium text-emerald-300">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                      aria-hidden="true"
                    />
                    14-day return window
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* ─────────────────────────────────────────────
              Content + TOC
             ───────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-12 items-start">
            <article className="w-full lg:flex-1 lg:min-w-0 space-y-10">
              <p className="text-[14px] text-gray-300 leading-relaxed">
                We want you to love your VESTIOR purchase. If something
                isn&apos;t right, we&apos;re here to help. This policy
                outlines how returns, exchanges, and refunds work.
              </p>

              <Section id="window" number="01" title="Return Window">
                <p>
                  You have{' '}
                  <strong className="text-white font-semibold">
                    14 days
                  </strong>{' '}
                  from the date of delivery to request a return. Requests
                  must be submitted within this window via email.
                </p>
              </Section>

              <Section
                id="eligibility"
                number="02"
                title="Eligibility for Return"
              >
                <p>To qualify for a return, items must be:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-emerald-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      Unused and unworn
                    </strong>{' '}
                    — no visible wear, stains, or alterations
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      In original packaging
                    </strong>{' '}
                    — with tags, boxes, and any accessories
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      With proof of purchase
                    </strong>{' '}
                    — order number or receipt
                  </li>
                </ul>
                <p className="mt-3">
                  <strong className="text-white font-semibold">
                    Non-returnable items:
                  </strong>
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-emerald-400/70">
                  <li>Custom-tailored or made-to-order items</li>
                  <li>
                    Underwear, innerwear, and socks (hygiene reasons)
                  </li>
                  <li>
                    Items marked &quot;Final Sale&quot;
                  </li>
                  <li>Gift cards</li>
                </ul>
              </Section>

              <Section
                id="damaged"
                number="03"
                title="Damaged or Incorrect Items"
              >
                <p>
                  If you received a damaged, defective, or incorrect item,
                  report it{' '}
                  <strong className="text-white font-semibold">
                    within 48 hours
                  </strong>{' '}
                  of delivery with:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-emerald-400/70">
                  <li>Photos of the item and packaging</li>
                  <li>Your order number</li>
                  <li>Description of the issue</li>
                </ul>
                <p className="mt-3">
                  We&apos;ll send a replacement or full refund — including
                  return shipping — at no cost to you.
                </p>
              </Section>

              <Section
                id="initiate"
                number="04"
                title="How to Initiate a Return"
              >
                <ol className="list-decimal list-outside ml-5 space-y-2 marker:text-emerald-400/70 marker:font-semibold">
                  <li>
                    Email us at{' '}
                    <a
                      href="mailto:zainshahzs110@gmail.com"
                      className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/30 hover:decoration-emerald-400 underline-offset-2 transition-colors"
                    >
                      zainshahzs110@gmail.com
                    </a>{' '}
                    with your order number and reason for return.
                  </li>
                  <li>
                    We&apos;ll review your request and respond within 24–48
                    hours with return instructions.
                  </li>
                  <li>
                    Pack the item securely in its original packaging with all
                    tags.
                  </li>
                  <li>
                    Ship the item to the address we provide. Return shipping
                    is at your cost unless the item was damaged/incorrect.
                  </li>
                  <li>Email us the tracking number once shipped.</li>
                </ol>
              </Section>

              <Section id="refund" number="05" title="Refund Process">
                <p>Once we receive and inspect your return:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-emerald-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      Approval time:
                    </strong>{' '}
                    2–3 business days after receipt
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Refund processing:
                    </strong>{' '}
                    5–7 business days after approval
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Card refunds:
                    </strong>{' '}
                    Credited back to the original card via Stripe
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      COD refunds:
                    </strong>{' '}
                    Processed via bank transfer to the account you provide
                  </li>
                </ul>
                <p className="mt-3">
                  Refunds cover the product price only. Original shipping
                  fees are non-refundable, except for damaged or incorrect
                  items.
                </p>
              </Section>

              <Section id="exchanges" number="06" title="Exchanges">
                <p>
                  We currently offer refunds rather than direct exchanges. To
                  get a different size or color:
                </p>
                <ol className="list-decimal list-outside ml-5 space-y-2 marker:text-emerald-400/70 marker:font-semibold">
                  <li>Return the original item per the process above</li>
                  <li>Place a new order for the desired item</li>
                </ol>
                <p className="mt-3">
                  This ensures you don&apos;t miss out on inventory and get
                  the fastest possible turnaround.
                </p>
              </Section>

              <Section id="sale" number="07" title="Sale Items">
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-emerald-400/70">
                  <li>
                    Sale items may be returned within 14 days for a refund of
                    the sale price.
                  </li>
                  <li>
                    Final Sale items are non-returnable and non-refundable.
                  </li>
                </ul>
              </Section>

              <Section
                id="cancellations"
                number="08"
                title="Order Cancellations"
              >
                <p>
                  You can cancel your order free of charge{' '}
                  <strong className="text-white font-semibold">
                    within 12 hours
                  </strong>{' '}
                  of placing it (before it ships). After shipping,
                  cancellations are subject to the return process.
                </p>
                <p className="mt-3">
                  To cancel, email us immediately with your order number.
                </p>
              </Section>

              <Section
                id="failed"
                number="09"
                title="Failed Deliveries"
              >
                <p>If a delivery fails because:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-emerald-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      You refused delivery:
                    </strong>{' '}
                    Return shipping and restocking fees apply
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      The address was incorrect or incomplete:
                    </strong>{' '}
                    We&apos;ll attempt re-delivery once at your cost
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      You were unavailable after 2 attempts:
                    </strong>{' '}
                    Order is returned to us; refunds issued minus shipping
                  </li>
                </ul>
              </Section>

              <Section id="contact" number="10" title="Contact for Returns">
                <p>For any return or refund question, contact us:</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="mailto:zainshahzs110@gmail.com"
                    className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500/[0.1] border border-emerald-500/25 flex items-center justify-center">
                      <Mail size={14} className="text-emerald-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500">
                        Email
                      </p>
                      <p className="text-[12px] text-white font-medium truncate group-hover:text-emerald-300 transition-colors">
                        zainshahzs110@gmail.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
                      <Clock size={14} className="text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500">
                        Response Time
                      </p>
                      <p className="text-[12px] text-white font-medium truncate">
                        Within 24 hours (business days)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] sm:col-span-2">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-500/[0.1] border border-teal-500/25 flex items-center justify-center">
                      <MapPin size={14} className="text-teal-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500">
                        Location
                      </p>
                      <p className="text-[12px] text-white font-medium truncate">
                        Karachi, Pakistan
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              <div className="pt-6 border-t border-white/[0.06] text-[11px] text-gray-500 leading-relaxed">
                <p>
                  This policy is provided in good faith and complies with
                  Pakistani consumer protection regulations. VESTIOR
                  reserves the right to modify this policy at any time.
                </p>
              </div>
            </article>

            {/* TOC Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <span
                    className="w-1 h-3 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  On This Page
                </p>
                <nav className="space-y-0.5 max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain">
                  {TOC.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block px-2.5 py-1.5 text-[11.5px] text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors truncate"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Section component — icon upar, title neeche, content neeche
// ─────────────────────────────────────────────
function Section({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/25 text-[11px] font-bold text-emerald-300 tabular-nums">
        {number}
      </span>
      <h2 className="text-[17px] sm:text-[18px] md:text-[20px] font-semibold text-white tracking-[-0.01em] leading-snug mt-3 mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-[13px] sm:text-[14px] text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  )
}