import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions governing your use of the VESTIOR website and services.',
  alternates: { canonical: '/terms' },
}

const LAST_UPDATED = 'October 13, 2026'

export default function TermsPage() {
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
            <FileText size={22} className="text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Terms of Service
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>

        <div className="max-w-none mt-8 space-y-6 text-gray-300 leading-relaxed">
          <p>
            Welcome to <strong className="text-white">VESTIOR</strong>. By
            accessing or using our website at{' '}
            <a
              href="https://vestior.vercel.app"
              className="text-indigo-400 hover:underline"
            >
              https://vestior.vercel.app
            </a>{' '}
            and purchasing our products, you agree to be bound by these Terms
            of Service. If you do not agree, please do not use our services.
          </p>

          <Section title="1. Eligibility">
            <p>To use VESTIOR, you must:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Be at least 18 years old, or have parental consent</li>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not use our services for any illegal purpose</li>
            </ul>
          </Section>

          <Section title="2. Account Registration">
            <p>
              When you create an account, you are responsible for maintaining
              the confidentiality of your login credentials. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Provide a valid email address</li>
              <li>
                Verify your email address within a reasonable time of signup
              </li>
              <li>Choose a strong password meeting our requirements</li>
              <li>
                Notify us immediately of any unauthorized account activity
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that
              violate these terms.
            </p>
          </Section>

          <Section title="3. Products & Pricing">
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>
                All prices are listed in{' '}
                <strong className="text-white">Pakistani Rupees (PKR)</strong>{' '}
                unless otherwise noted.
              </li>
              <li>
                We reserve the right to change prices without prior notice.
              </li>
              <li>
                Product images are for illustration. Actual colors may vary
                slightly based on screen settings.
              </li>
              <li>
                We strive for accurate product descriptions, but errors may
                occur. We reserve the right to cancel orders resulting from
                pricing or description errors.
              </li>
            </ul>
          </Section>

          <Section title="4. Orders & Payments">
            <p>
              By placing an order, you make an offer to purchase. Orders are
              accepted only when we confirm them via email.
            </p>
            <p className="mt-3">
              <strong className="text-white">Payment methods:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>
                <strong className="text-white">
                  Cash on Delivery (COD):
                </strong>{' '}
                Pay the courier when you receive the order.
              </li>
              <li>
                <strong className="text-white">Card Payment:</strong> Processed
                securely via Stripe. We never see or store your card details.
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to cancel any order if:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Payment fails or cannot be verified</li>
              <li>The product is out of stock</li>
              <li>Fraud or suspicious activity is detected</li>
              <li>You violate these terms</li>
            </ul>
          </Section>

          <Section title="5. Shipping & Delivery">
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>
                We ship within Pakistan. Free shipping on orders over PKR
                5,000; otherwise PKR 100 flat fee.
              </li>
              <li>Delivery typically takes 3–7 business days.</li>
              <li>
                Delivery times are estimates only. Delays due to couriers,
                weather, or other circumstances may occur.
              </li>
              <li>
                Please provide a valid phone number and address. Undeliverable
                orders may be returned to sender.
              </li>
              <li>
                Risk of loss passes to you upon delivery to the courier, per
                Pakistani consumer protection law.
              </li>
            </ul>
          </Section>

          <Section title="6. Returns & Refunds">
            <p>
              Please see our{' '}
              <Link href="/refund" className="text-indigo-400 hover:underline">
                Refund Policy
              </Link>{' '}
              for detailed information about returns, exchanges, and refunds.
            </p>
            <p className="mt-3">Summary:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>14-day return window for unused items in original packaging</li>
              <li>Refunds processed within 5–7 business days of inspection</li>
              <li>
                Damaged or wrong items must be reported within 48 hours of
                delivery
              </li>
            </ul>
          </Section>

          <Section title="7. Coupons & Promotions">
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>
                Coupon codes are valid only as specified (amount, usage limits,
                expiry).
              </li>
              <li>
                Coupons cannot be combined unless explicitly stated; one coupon
                per order.
              </li>
              <li>
                We reserve the right to void coupons obtained through fraud,
                abuse, or technical errors.
              </li>
              <li>
                Coupons have no cash value and are non-transferable.
              </li>
            </ul>
          </Section>

          <Section title="8. User Content & Reviews">
            <p>
              If you submit reviews, comments, or other content, you grant
              VESTIOR a non-exclusive, royalty-free license to use, publish, and
              display that content. You agree:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Not to post false, misleading, or defamatory content</li>
              <li>Not to violate any third-party rights</li>
              <li>Not to post spam or promotional content for others</li>
              <li>To post only content related to genuine experiences</li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove content that violates these terms.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              All content on VESTIOR — including text, images, logos, and code —
              is the property of VESTIOR or its licensors and is protected by
              copyright laws. You may not reproduce, distribute, or create
              derivative works without our written permission.
            </p>
          </Section>

          <Section title="10. Prohibited Activities">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Attempt to breach or bypass our security</li>
              <li>Use automated tools to scrape or overload our site</li>
              <li>Impersonate VESTIOR or its staff</li>
              <li>Manipulate prices, discounts, or inventory data</li>
              <li>Engage in fraudulent transactions</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </Section>

          <Section title="11. Disclaimers">
            <p>
              VESTIOR provides its services &quot;as is&quot; and &quot;as
              available.&quot; We make no warranties, express or implied,
              regarding the reliability, availability, or fitness of our
              services. We are not responsible for indirect, incidental, or
              consequential damages.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, VESTIOR&apos;s total
              liability for any claim arising from your use of our services is
              limited to the amount you paid for the product(s) in question.
            </p>
          </Section>

          <Section title="13. Indemnification">
            <p>
              You agree to indemnify and hold harmless VESTIOR, its employees,
              and partners from any claims, damages, or expenses arising from
              your violation of these terms or misuse of our services.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              These Terms of Service are governed by the laws of the Islamic
              Republic of Pakistan. Any disputes will be subject to the
              exclusive jurisdiction of the courts of Karachi, Pakistan.
            </p>
          </Section>

          <Section title="15. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Material changes will
              be communicated via email or site notice. Continued use of our
              services means you accept the updated terms.
            </p>
          </Section>

          <Section title="16. Termination">
            <p>
              We reserve the right to suspend or terminate your access to
              VESTIOR at any time, without notice, for conduct that violates
              these terms or is harmful to other users or our business.
            </p>
          </Section>

          <Section title="17. Contact Us">
            <p>Questions about these Terms? Contact us:</p>
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
              By using VESTIOR, you acknowledge that you have read, understood,
              and agreed to these Terms of Service.
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