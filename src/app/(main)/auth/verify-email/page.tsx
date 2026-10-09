import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <Mail size={32} className="text-blue-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Check your email
        </h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          We've sent a verification link to your email address. Click the link
          to activate your VESTIOR account.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left">
          <p className="text-xs text-gray-400 mb-2">Didn't receive the email?</p>
          <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-sm"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}