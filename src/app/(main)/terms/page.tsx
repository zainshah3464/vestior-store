import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft, Clock, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions governing your use of the VESTIOR website and services.',
  alternates: { canonical: '/terms' },
}

const LAST_UPDATED = 'October 13, 2026'

const TOC = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'account', label: 'Account Registration' },
  { id: 'products', label: 'Products & Pricing' },
  { id: 'orders', label: 'Orders & Payments' },
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'coupons', label: 'Coupons & Promotions' },
  { id: 'content', label: 'User Content & Reviews' },
  { id: 'ip', label: 'Intellectual Property' },
  { id: 'prohibited', label: 'Prohibited Activities' },
  { id: 'disclaimers', label: 'Disclaimers' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'governing', label: 'Governing Law' },
  { id: 'changes', label: 'Changes to These Terms' },
  { id: 'termination', label: 'Termination' },
  { id: 'contact', label: 'Contact Us' },
]

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-black pt-20 md:pt-24 xl:pt-28 pb-20 md:pb-24 xl:pb-28 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient backdrop — full width
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.03] blur-[110px]" />
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
              <FileText size={11} className="text-blue-400" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
                Legal
              </span>
            </div>

            <div className="flex items-start gap-4 sm:gap-5 flex-wrap">
              <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500/[0.15] to-indigo-500/[0.1] border border-blue-500/25 flex items-center justify-center shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)]">
                <FileText size={26} className="text-blue-400" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-3xl bg-blue-500/[0.06] blur-2xl -z-10"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-tight">
                  Terms of Service
                </h1>
                <p className="text-[13px] sm:text-[14px] text-gray-500 mt-2 max-w-2xl leading-relaxed">
                  The terms and conditions governing your use of the VESTIOR
                  website and services.
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-medium text-gray-400">
                    <Clock size={10} aria-hidden="true" />
                    Last updated: {LAST_UPDATED}
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
                Welcome to{' '}
                <strong className="text-white font-semibold">VESTIOR</strong>
                . By accessing or using our website at{' '}
                <a
                  href="https://vestior.vercel.app"
                  className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-400 underline-offset-2 transition-colors"
                >
                  https://vestior.vercel.app
                </a>{' '}
                and purchasing our products, you agree to be bound by these
                Terms of Service. If you do not agree, please do not use our
                services.
              </p>

              <Section id="eligibility" number="01" title="Eligibility">
                <p>To use VESTIOR, you must:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>Be at least 18 years old, or have parental consent</li>
                  <li>
                    Provide accurate, current, and complete information
                  </li>
                  <li>
                    Maintain the security of your account credentials
                  </li>
                  <li>Not use our services for any illegal purpose</li>
                </ul>
              </Section>

              <Section
                id="account"
                number="02"
                title="Account Registration"
              >
                <p>
                  When you create an account, you are responsible for
                  maintaining the confidentiality of your login credentials.
                  You agree to:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>Provide a valid email address</li>
                  <li>
                    Verify your email address within a reasonable time of
                    signup
                  </li>
                  <li>
                    Choose a strong password meeting our requirements
                  </li>
                  <li>
                    Notify us immediately of any unauthorized account
                    activity
                  </li>
                </ul>
                <p className="mt-3">
                  We reserve the right to suspend or terminate accounts that
                  violate these terms.
                </p>
              </Section>

              <Section id="products" number="03" title="Products & Pricing">
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>
                    All prices are listed in{' '}
                    <strong className="text-white font-semibold">
                      Pakistani Rupees (PKR)
                    </strong>{' '}
                    unless otherwise noted.
                  </li>
                  <li>
                    We reserve the right to change prices without prior
                    notice.
                  </li>
                  <li>
                    Product images are for illustration. Actual colors may
                    vary slightly based on screen settings.
                  </li>
                  <li>
                    We strive for accurate product descriptions, but errors
                    may occur. We reserve the right to cancel orders
                    resulting from pricing or description errors.
                  </li>
                </ul>
              </Section>

              <Section id="orders" number="04" title="Orders & Payments">
                <p>
                  By placing an order, you make an offer to purchase. Orders
                  are accepted only when we confirm them via email.
                </p>
                <p className="mt-3">
                  <strong className="text-white font-semibold">
                    Payment methods:
                  </strong>
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      Cash on Delivery (COD):
                    </strong>{' '}
                    Pay the courier when you receive the order.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Card Payment:
                    </strong>{' '}
                    Processed securely via Stripe. We never see or store your
                    card details.
                  </li>
                </ul>
                <p className="mt-3">
                  We reserve the right to cancel any order if:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>Payment fails or cannot be verified</li>
                  <li>The product is out of stock</li>
                  <li>Fraud or suspicious activity is detected</li>
                  <li>You violate these terms</li>
                </ul>
              </Section>

              <Section
                id="shipping"
                number="05"
                title="Shipping & Delivery"
              >
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>
                    We ship within Pakistan. Free shipping on orders over PKR
                    5,000; otherwise PKR 100 flat fee.
                  </li>
                  <li>
                    Delivery typically takes 3–7 business days.
                  </li>
                  <li>
                    Delivery times are estimates only. Delays due to
                    couriers, weather, or other circumstances may occur.
                  </li>
                  <li>
                    Please provide a valid phone number and address.
                    Undeliverable orders may be returned to sender.
                  </li>
                  <li>
                    Risk of loss passes to you upon delivery to the courier,
                    per Pakistani consumer protection law.
                  </li>
                </ul>
              </Section>

              <Section id="returns" number="06" title="Returns & Refunds">
                <p>
                  Please see our{' '}
                  <Link
                    href="/refund"
                    className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-400 underline-offset-2 transition-colors"
                  >
                    Refund Policy
                  </Link>{' '}
                  for detailed information about returns, exchanges, and
                  refunds.
                </p>
                <p className="mt-3">Summary:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>
                    14-day return window for unused items in original
                    packaging
                  </li>
                  <li>
                    Refunds processed within 5–7 business days of inspection
                  </li>
                  <li>
                    Damaged or wrong items must be reported within 48 hours
                    of delivery
                  </li>
                </ul>
              </Section>

              <Section
                id="coupons"
                number="07"
                title="Coupons & Promotions"
              >
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>
                    Coupon codes are valid only as specified (amount, usage
                    limits, expiry).
                  </li>
                  <li>
                    Coupons cannot be combined unless explicitly stated; one
                    coupon per order.
                  </li>
                  <li>
                    We reserve the right to void coupons obtained through
                    fraud, abuse, or technical errors.
                  </li>
                  <li>
                    Coupons have no cash value and are non-transferable.
                  </li>
                </ul>
              </Section>

              <Section
                id="content"
                number="08"
                title="User Content & Reviews"
              >
                <p>
                  If you submit reviews, comments, or other content, you
                  grant VESTIOR a non-exclusive, royalty-free license to use,
                  publish, and display that content. You agree:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>
                    Not to post false, misleading, or defamatory content
                  </li>
                  <li>Not to violate any third-party rights</li>
                  <li>
                    Not to post spam or promotional content for others
                  </li>
                  <li>
                    To post only content related to genuine experiences
                  </li>
                </ul>
                <p className="mt-3">
                  We reserve the right to remove content that violates these
                  terms.
                </p>
              </Section>

              <Section
                id="ip"
                number="09"
                title="Intellectual Property"
              >
                <p>
                  All content on VESTIOR — including text, images, logos, and
                  code — is the property of VESTIOR or its licensors and is
                  protected by copyright laws. You may not reproduce,
                  distribute, or create derivative works without our written
                  permission.
                </p>
              </Section>

              <Section
                id="prohibited"
                number="10"
                title="Prohibited Activities"
              >
                <p>You agree not to:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-blue-400/70">
                  <li>Attempt to breach or bypass our security</li>
                  <li>
                    Use automated tools to scrape or overload our site
                  </li>
                  <li>Impersonate VESTIOR or its staff</li>
                  <li>
                    Manipulate prices, discounts, or inventory data
                  </li>
                  <li>Engage in fraudulent transactions</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </Section>

              <Section id="disclaimers" number="11" title="Disclaimers">
                <p>
                  VESTIOR provides its services &quot;as is&quot; and
                  &quot;as available.&quot; We make no warranties, express or
                  implied, regarding the reliability, availability, or
                  fitness of our services. We are not responsible for
                  indirect, incidental, or consequential damages.
                </p>
              </Section>

              <Section
                id="liability"
                number="12"
                title="Limitation of Liability"
              >
                <p>
                  To the maximum extent permitted by law, VESTIOR&apos;s
                  total liability for any claim arising from your use of our
                  services is limited to the amount you paid for the
                  product(s) in question.
                </p>
              </Section>

              <Section
                id="indemnification"
                number="13"
                title="Indemnification"
              >
                <p>
                  You agree to indemnify and hold harmless VESTIOR, its
                  employees, and partners from any claims, damages, or
                  expenses arising from your violation of these terms or
                  misuse of our services.
                </p>
              </Section>

              <Section
                id="governing"
                number="14"
                title="Governing Law"
              >
                <p>
                  These Terms of Service are governed by the laws of the
                  Islamic Republic of Pakistan. Any disputes will be subject
                  to the exclusive jurisdiction of the courts of Karachi,
                  Pakistan.
                </p>
              </Section>

              <Section
                id="changes"
                number="15"
                title="Changes to These Terms"
              >
                <p>
                  We may update these Terms from time to time. Material
                  changes will be communicated via email or site notice.
                  Continued use of our services means you accept the updated
                  terms.
                </p>
              </Section>

              <Section
                id="termination"
                number="16"
                title="Termination"
              >
                <p>
                  We reserve the right to suspend or terminate your access to
                  VESTIOR at any time, without notice, for conduct that
                  violates these terms or is harmful to other users or our
                  business.
                </p>
              </Section>

              <Section id="contact" number="17" title="Contact Us">
                <p>Questions about these Terms? Contact us:</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="mailto:zainshahzs110@gmail.com"
                    className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
                      <Mail size={14} className="text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500">
                        Email
                      </p>
                      <p className="text-[12px] text-white font-medium truncate group-hover:text-blue-300 transition-colors">
                        zainshahzs110@gmail.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
                      <MapPin size={14} className="text-indigo-400" aria-hidden="true" />
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
                  By using VESTIOR, you acknowledge that you have read,
                  understood, and agreed to these Terms of Service.
                </p>
              </div>
            </article>

            {/* TOC Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <span
                    className="w-1 h-3 rounded-full bg-blue-500"
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
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/[0.1] border border-blue-500/25 text-[11px] font-bold text-blue-300 tabular-nums">
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