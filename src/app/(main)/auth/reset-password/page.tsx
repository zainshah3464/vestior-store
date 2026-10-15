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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[reset-password] code exchange failed:', error.message)
      redirect('/auth/forgot-password?error=invalid_or_expired_link')
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/forgot-password?error=session_expired')
  }

  return <ResetPasswordForm userEmail={user.email ?? ''} />
}