import Link from 'next/link'
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Inbox,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 text-center">
        {/* Animated icon */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div
            aria-hidden="true"
            className="absolute w-20 h-20 rounded-full bg-blue-500/20 blur-2xl animate-pulse"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400/30 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Mail
              size={26}
              className="text-white"
              aria-hidden="true"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-3">
          Check your email
        </h1>
        <p className="text-[13px] text-gray-500 leading-relaxed max-w-sm mx-auto mb-8">
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your VESTIOR account.
        </p>

        {/* Tips card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 text-left shadow-2xl shadow-black/40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-amber-500/[0.04] blur-[90px]"
          />

          <div className="relative flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/[0.1] border border-amber-500/25 flex items-center justify-center flex-shrink-0">
              <Inbox
                size={13}
                className="text-amber-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white leading-tight">
                Didn&apos;t receive the email?
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Try these quick checks
              </p>
            </div>
          </div>

          <ul className="relative space-y-2 text-[12px] text-gray-400">
            <li className="flex items-start gap-2">
              <span
                className="w-1 h-1 rounded-full bg-blue-400 mt-[7px] flex-shrink-0"
                aria-hidden="true"
              />
              <span>Check your spam or junk folder</span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className="w-1 h-1 rounded-full bg-blue-400 mt-[7px] flex-shrink-0"
                aria-hidden="true"
              />
              <span>Make sure you entered the correct email</span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className="w-1 h-1 rounded-full bg-blue-400 mt-[7px] flex-shrink-0"
                aria-hidden="true"
              />
              <span>
                Wait a few minutes — delivery can take up to 5 minutes
              </span>
            </li>
          </ul>
        </div>

        {/* Benefit callout */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[10px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={10} aria-hidden="true" />
            Secure verification
          </span>
          <span
            className="w-1 h-1 rounded-full bg-gray-700"
            aria-hidden="true"
          />
          <span className="flex items-center gap-1.5">
            <Clock size={10} aria-hidden="true" />
            Link expires in 24h
          </span>
        </div>

        {/* Back to sign in */}
        <Link
          href="/auth/login"
          className="group mt-8 inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to sign in
        </Link>

        {/* Footer trust */}
        <p className="text-[10px] text-gray-600 text-center mt-6 flex items-center justify-center gap-1.5">
          <Sparkles size={9} aria-hidden="true" />
          Once verified, you&apos;ll get instant access to your account
        </p>
      </div>
    </div>
  )
}