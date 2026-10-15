import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ArrowLeft, Clock, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How VESTIOR collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' },
}

const LAST_UPDATED = 'October 13, 2026'

const TOC = [
  { id: 'info-collect', label: 'Information We Collect' },
  { id: 'info-use', label: 'How We Use Your Information' },
  { id: 'info-share', label: 'How We Share Your Information' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'children', label: "Children's Privacy" },
  { id: 'international', label: 'International Data Transfers' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-black pt-20 md:pt-24 xl:pt-28 pb-20 md:pb-24 xl:pb-28 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient backdrop — full width
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-blue-500/[0.03] blur-[110px]" />
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
              <Shield size={11} className="text-indigo-400" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
                Legal
              </span>
            </div>

            <div className="flex items-start gap-4 sm:gap-5 flex-wrap">
              <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500/[0.15] to-violet-500/[0.1] border border-indigo-500/25 flex items-center justify-center shadow-[0_0_40px_-12px_rgba(99,102,241,0.5)]">
                <Shield size={26} className="text-indigo-400" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-3xl bg-indigo-500/[0.06] blur-2xl -z-10"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-tight">
                  Privacy Policy
                </h1>
                <p className="text-[13px] sm:text-[14px] text-gray-500 mt-2 max-w-2xl leading-relaxed">
                  How VESTIOR collects, uses, and protects your personal
                  information.
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
            {/* Main content */}
            <article className="w-full lg:flex-1 lg:min-w-0 space-y-10">
              <p className="text-[14px] text-gray-300 leading-relaxed">
                At{' '}
                <strong className="text-white font-semibold">VESTIOR</strong>
                , your privacy is important to us. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you visit our website at{' '}
                <a
                  href="https://vestior.vercel.app"
                  className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30 hover:decoration-indigo-400 underline-offset-2 transition-colors"
                >
                  https://vestior.vercel.app
                </a>{' '}
                and make purchases from our store.
              </p>

              <Section id="info-collect" number="01" title="Information We Collect">
                <p>We collect information that you provide directly to us:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      Account Information:
                    </strong>{' '}
                    Name, email address, phone number, and password when you
                    create an account.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Order Information:
                    </strong>{' '}
                    Shipping address, billing details, and order history when
                    you make a purchase.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Payment Information:
                    </strong>{' '}
                    Payment method details. Card payments are processed by
                    Stripe — we never store your full card number.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Communications:
                    </strong>{' '}
                    Messages you send us through email, chat, or support
                    forms.
                  </li>
                </ul>
                <p className="mt-3">
                  We also automatically collect certain information when you
                  browse our site:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>IP address (anonymized via SHA-256 hashing)</li>
                  <li>Device type, operating system, and browser</li>
                  <li>Pages viewed and time spent on the site</li>
                  <li>Referring website (if any)</li>
                </ul>
              </Section>

              <Section id="info-use" number="02" title="How We Use Your Information">
                <p>We use your information to:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>Process and fulfill your orders</li>
                  <li>
                    Send order confirmations, shipping updates, and invoices
                  </li>
                  <li>Respond to your questions and support requests</li>
                  <li>Improve our website, products, and services</li>
                  <li>Prevent fraud and secure your account</li>
                  <li>
                    Send promotional emails (only if you opt in — you can
                    unsubscribe anytime)
                  </li>
                  <li>Comply with legal obligations</li>
                </ul>
              </Section>

              <Section
                id="info-share"
                number="03"
                title="How We Share Your Information"
              >
                <p>
                  We <strong className="text-white font-semibold">do not sell</strong>{' '}
                  your personal information. We share it only with:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      Payment Processors:
                    </strong>{' '}
                    Stripe (for card payments) to process transactions
                    securely.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Shipping Partners:
                    </strong>{' '}
                    Courier services (e.g., TCS, Leopards) to deliver your
                    order.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Service Providers:
                    </strong>{' '}
                    Cloud infrastructure (Vercel, Supabase, MongoDB Atlas)
                    that host our platform.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Legal Authorities:
                    </strong>{' '}
                    When required by law or to protect our rights.
                  </li>
                </ul>
              </Section>

              <Section id="data-security" number="04" title="Data Security">
                <p>
                  We use industry-standard security measures to protect your
                  data:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>All traffic encrypted via HTTPS/TLS</li>
                  <li>
                    Passwords hashed with bcrypt (never stored in plain text)
                  </li>
                  <li>Row-Level Security (RLS) on every database table</li>
                  <li>
                    IP addresses are anonymized using one-way cryptographic
                    hashing
                  </li>
                  <li>
                    Card data never touches our servers (handled by Stripe)
                  </li>
                  <li>Regular security audits and dependency updates</li>
                </ul>
                <p className="mt-3">
                  No method of transmission over the internet is 100% secure.
                  While we strive to protect your data, we cannot guarantee
                  absolute security.
                </p>
              </Section>

              <Section id="data-retention" number="05" title="Data Retention">
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>
                    <strong className="text-white font-semibold">
                      Account data:
                    </strong>{' '}
                    Kept while your account is active, deleted within 30 days
                    of account deletion.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Order history:
                    </strong>{' '}
                    Kept for 7 years to comply with tax and accounting
                    requirements.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Analytics events:
                    </strong>{' '}
                    Auto-deleted after 90 days.
                  </li>
                  <li>
                    <strong className="text-white font-semibold">
                      Email logs:
                    </strong>{' '}
                    Kept for troubleshooting and delivery verification.
                  </li>
                </ul>
              </Section>

              <Section id="cookies" number="06" title="Cookies & Tracking">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>Keep you logged in across sessions</li>
                  <li>Remember your cart contents</li>
                  <li>Analyze traffic (via Google Analytics 4)</li>
                  <li>Improve site performance and personalization</li>
                </ul>
                <p className="mt-3">
                  You can control cookies through your browser settings.
                  Disabling essential cookies will break login and checkout
                  functionality.
                </p>
              </Section>

              <Section id="rights" number="07" title="Your Rights">
                <p>You have the right to:</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5 marker:text-indigo-400/70">
                  <li>
                    Access the personal information we hold about you
                  </li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                  <li>File a complaint with the relevant authority</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, email us at{' '}
                  <a
                    href="mailto:zainshahzs110@gmail.com"
                    className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30 hover:decoration-indigo-400 underline-offset-2 transition-colors"
                  >
                    zainshahzs110@gmail.com
                  </a>
                  .
                </p>
              </Section>

              <Section
                id="children"
                number="08"
                title="Children's Privacy"
              >
                <p>
                  VESTIOR is not intended for children under 13 years of age.
                  We do not knowingly collect data from children under 13. If
                  you believe a child has provided us with personal
                  information, contact us and we will delete it promptly.
                </p>
              </Section>

              <Section
                id="international"
                number="09"
                title="International Data Transfers"
              >
                <p>
                  Your data may be stored and processed in countries outside
                  of Pakistan (where our cloud providers operate). By using
                  our services, you consent to such transfers. We ensure
                  appropriate safeguards are in place to protect your
                  information.
                </p>
              </Section>

              <Section
                id="changes"
                number="10"
                title="Changes to This Policy"
              >
                <p>
                  We may update this Privacy Policy from time to time. When
                  we do, we will revise the &quot;Last updated&quot; date at
                  the top of this page. Material changes will be communicated
                  via email or site notice. Continued use of our services
                  after changes means you accept the updated policy.
                </p>
              </Section>

              <Section id="contact" number="11" title="Contact Us">
                <p>
                  If you have questions about this Privacy Policy, please
                  contact us:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="mailto:zainshahzs110@gmail.com"
                    className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
                      <Mail size={14} className="text-indigo-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500">
                        Email
                      </p>
                      <p className="text-[12px] text-white font-medium truncate group-hover:text-indigo-300 transition-colors">
                        zainshahzs110@gmail.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
                      <MapPin size={14} className="text-blue-400" aria-hidden="true" />
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
                  By using VESTIOR, you acknowledge that you have read and
                  understood this Privacy Policy.
                </p>
              </div>
            </article>

            {/* TOC Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <span
                    className="w-1 h-3 rounded-full bg-indigo-500"
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
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 text-[11px] font-bold text-indigo-300 tabular-nums">
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