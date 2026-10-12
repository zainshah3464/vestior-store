import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ResetPasswordForm from './ResetPasswordForm'

export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const code = typeof sp.code === 'string' ? sp.code : undefined

  const supabase = await createClient()

  // If Supabase redirected here with a `code`, exchange it now.
  // This happens when the user clicks the recovery link from email.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[reset-password] code exchange failed:', error.message)
      redirect('/auth/forgot-password?error=invalid_or_expired_link')
    }
  }

  // User must now have a session (from the exchanged code)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/forgot-password?error=session_expired')
  }

  return <ResetPasswordForm userEmail={user.email ?? ''} />
}