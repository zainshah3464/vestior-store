import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'VESTIOR returns, exchanges, and refund policy — 14-day return window for unused items.',
  alternates: { canonical: '/refund' },
}

export default function RefundPolicyPage() {
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
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <RotateCcw
              size={22}
              className="text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Refund & Return Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Customer satisfaction is our priority
            </p>
          </div>
        </div>

        <div className="max-w-none mt-8 space-y-6 text-gray-300 leading-relaxed">
          <p>
            We want you to love your VESTIOR purchase. If something isn&apos;t
            right, we&apos;re here to help. This policy outlines how returns,
            exchanges, and refunds work.
          </p>

          <Section title="1. Return Window">
            <p>
              You have{' '}
              <strong className="text-white">14 days</strong> from the date of
              delivery to request a return. Requests must be submitted within
              this window via email.
            </p>
          </Section>

          <Section title="2. Eligibility for Return">
            <p>To qualify for a return, items must be:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>
                <strong className="text-white">Unused and unworn</strong> — no
                visible wear, stains, or alterations
              </li>
              <li>
                <strong className="text-white">In original packaging</strong> —
                with tags, boxes, and any accessories
              </li>
              <li>
                <strong className="text-white">With proof of purchase</strong> —
                order number or receipt
              </li>
            </ul>
            <p className="mt-3">
              <strong className="text-white">Non-returnable items:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Custom-tailored or made-to-order items</li>
              <li>Underwear, innerwear, and socks (hygiene reasons)</li>
              <li>Items marked &quot;Final Sale&quot;</li>
              <li>Gift cards</li>
            </ul>
          </Section>

          <Section title="3. Damaged or Incorrect Items">
            <p>
              If you received a damaged, defective, or incorrect item, report it{' '}
              <strong className="text-white">within 48 hours</strong> of
              delivery with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>Photos of the item and packaging</li>
              <li>Your order number</li>
              <li>Description of the issue</li>
            </ul>
            <p className="mt-3">
              We&apos;ll send a replacement or full refund — including return
              shipping — at no cost to you.
            </p>
          </Section>

          <Section title="4. How to Initiate a Return">
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                Email us at{' '}
                <a
                  href="mailto:zainshahzs110@gmail.com"
                  className="text-indigo-400 hover:underline"
                >
                  zainshahzs110@gmail.com
                </a>{' '}
                with your order number and reason for return.
              </li>
              <li>
                We&apos;ll review your request and respond within 24–48 hours
                with return instructions.
              </li>
              <li>
                Pack the item securely in its original packaging with all tags.
              </li>
              <li>
                Ship the item to the address we provide. Return shipping is at
                your cost unless the item was damaged/incorrect.
              </li>
              <li>
                Email us the tracking number once shipped.
              </li>
            </ol>
          </Section>

          <Section title="5. Refund Process">
            <p>Once we receive and inspect your return:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>
                <strong className="text-white">Approval time:</strong> 2–3
                business days after receipt
              </li>
              <li>
                <strong className="text-white">Refund processing:</strong> 5–7
                business days after approval
              </li>
              <li>
                <strong className="text-white">Card refunds:</strong> Credited
                back to the original card via Stripe
              </li>
              <li>
                <strong className="text-white">COD refunds:</strong> Processed
                via bank transfer to the account you provide
              </li>
            </ul>
            <p className="mt-3">
              Refunds cover the product price only. Original shipping fees are
              non-refundable, except for damaged or incorrect items.
            </p>
          </Section>

          <Section title="6. Exchanges">
            <p>
              We currently offer refunds rather than direct exchanges. To get a
              different size or color:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Return the original item per the process above</li>
              <li>Place a new order for the desired item</li>
            </ol>
            <p className="mt-3">
              This ensures you don&apos;t miss out on inventory and get the
              fastest possible turnaround.
            </p>
          </Section>

          <Section title="7. Sale Items">
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>
                Sale items may be returned within 14 days for a refund of the
                sale price.
              </li>
              <li>Final Sale items are non-returnable and non-refundable.</li>
            </ul>
          </Section>

          <Section title="8. Order Cancellations">
            <p>
              You can cancel your order free of charge{' '}
              <strong className="text-white">within 12 hours</strong> of placing
              it (before it ships). After shipping, cancellations are subject to
              the return process.
            </p>
            <p className="mt-3">
              To cancel, email us immediately with your order number.
            </p>
          </Section>

          <Section title="9. Failed Deliveries">
            <p>
              If a delivery fails because:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
              <li>
                <strong className="text-white">You refused delivery:</strong>{' '}
                Return shipping and restocking fees apply
              </li>
              <li>
                <strong className="text-white">
                  The address was incorrect or incomplete:
                </strong>{' '}
                We&apos;ll attempt re-delivery once at your cost
              </li>
              <li>
                <strong className="text-white">
                  You were unavailable after 2 attempts:
                </strong>{' '}
                Order is returned to us; refunds issued minus shipping
              </li>
            </ul>
          </Section>

          <Section title="10. Contact for Returns">
            <p>For any return or refund question, contact us:</p>
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
                <strong className="text-white">Response time:</strong> Within 24
                hours (business days)
              </li>
              <li>
                <strong className="text-white">Location:</strong> Karachi,
                Pakistan
              </li>
            </ul>
          </Section>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-500">
            <p>
              This policy is provided in good faith and complies with Pakistani
              consumer protection regulations. VESTIOR reserves the right to
              modify this policy at any time.
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