import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ResetPasswordForm from './ResetPasswordForm'

export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // User must be authenticated via the recovery link
  // (Supabase establishes a session when they click the email link)
  if (!user) {
    redirect('/auth/forgot-password?error=session_expired')
  }

  return <ResetPasswordForm userEmail={user.email ?? ''} />
}