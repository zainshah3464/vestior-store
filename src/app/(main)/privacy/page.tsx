import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How VESTIOR collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' },
}

const LAST_UPDATED = 'October 13, 2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-6 transition text-sm"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Shield size={22} className="text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mt-8 space-y-6 text-gray-300 leading-relaxed">
          <p>
            At <strong className="text-white">VESTIOR</strong>, your privacy is
            important to us. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website
            at{' '}
            <a
              href="https://vestior.vercel.app"
              className="text-indigo-400 hover:underline"
            >
              https://vestior.vercel.app
            </a>{' '}
            and make purchases from our store.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect information that you provide directly to us:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>
                <strong className="text-white">Account Information:</strong>{' '}
                Name, email address, phone number, and password when you create
                an account.
              </li>
              <li>
                <strong className="text-white">Order Information:</strong>{' '}
                Shipping address, billing details, and order history when you
                make a purchase.
              </li>
              <li>
                <strong className="text-white">Payment Information:</strong>{' '}
                Payment method details. Card payments are processed by Stripe —
                we never store your full card number.
              </li>
              <li>
                <strong className="text-white">Communications:</strong> Messages
                you send us through email, chat, or support forms.
              </li>
            </ul>
            <p className="mt-3">
              We also automatically collect certain information when you browse
              our site:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>IP address (anonymized via SHA-256 hashing)</li>
              <li>Device type, operating system, and browser</li>
              <li>Pages viewed and time spent on the site</li>
              <li>Referring website (if any)</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information to:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations, shipping updates, and invoices</li>
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

          <Section title="3. How We Share Your Information">
            <p>
              We <strong className="text-white">do not sell</strong> your
              personal information. We share it only with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>
                <strong className="text-white">Payment Processors:</strong>{' '}
                Stripe (for card payments) to process transactions securely.
              </li>
              <li>
                <strong className="text-white">Shipping Partners:</strong>{' '}
                Courier services (e.g., TCS, Leopards) to deliver your order.
              </li>
              <li>
                <strong className="text-white">Service Providers:</strong> Cloud
                infrastructure (Vercel, Supabase, MongoDB Atlas) that host our
                platform.
              </li>
              <li>
                <strong className="text-white">Legal Authorities:</strong> When
                required by law or to protect our rights.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>
              We use industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>All traffic encrypted via HTTPS/TLS</li>
              <li>Passwords hashed with bcrypt (never stored in plain text)</li>
              <li>Row-Level Security (RLS) on every database table</li>
              <li>
                IP addresses are anonymized using one-way cryptographic hashing
              </li>
              <li>Card data never touches our servers (handled by Stripe)</li>
              <li>Regular security audits and dependency updates</li>
            </ul>
            <p className="mt-3">
              No method of transmission over the internet is 100% secure. While
              we strive to protect your data, we cannot guarantee absolute
              security.
            </p>
          </Section>

          <Section title="5. Data Retention">
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>
                <strong className="text-white">Account data:</strong> Kept
                while your account is active, deleted within 30 days of account
                deletion.
              </li>
              <li>
                <strong className="text-white">Order history:</strong> Kept for
                7 years to comply with tax and accounting requirements.
              </li>
              <li>
                <strong className="text-white">Analytics events:</strong>{' '}
                Auto-deleted after 90 days.
              </li>
              <li>
                <strong className="text-white">Email logs:</strong> Kept for
                troubleshooting and delivery verification.
              </li>
            </ul>
          </Section>

          <Section title="6. Cookies & Tracking">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Keep you logged in across sessions</li>
              <li>Remember your cart contents</li>
              <li>Analyze traffic (via Google Analytics 4)</li>
              <li>Improve site performance and personalization</li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling
              essential cookies will break login and checkout functionality.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Access the personal information we hold about you</li>
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
                className="text-indigo-400 hover:underline"
              >
                zainshahzs110@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              VESTIOR is not intended for children under 13 years of age. We do
              not knowingly collect data from children under 13. If you believe
              a child has provided us with personal information, contact us and
              we will delete it promptly.
            </p>
          </Section>

          <Section title="9. International Data Transfers">
            <p>
              Your data may be stored and processed in countries outside of
              Pakistan (where our cloud providers operate). By using our
              services, you consent to such transfers. We ensure appropriate
              safeguards are in place to protect your information.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will revise the &quot;Last updated&quot; date at the top of
              this page. Material changes will be communicated via email or
              site notice. Continued use of our services after changes means you
              accept the updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="list-none space-y-1.5 ml-2 mt-3">
              <li>
                <strong className="text-white">Email:</strong>{' '}
                <a
                  href="mailto:zainshahzs110@gmail.com"
                  className="text-indigo-400 hover:underline"
                >
                  zainshahzs110@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-white">Location:</strong> Karachi,
                Pakistan
              </li>
            </ul>
          </Section>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-500">
            <p>
              By using VESTIOR, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mt-8 mb-3">{title}</h2>
      <div className="text-sm">{children}</div>
    </section>
  )
}