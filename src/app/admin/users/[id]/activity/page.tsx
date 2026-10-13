import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { fetchUserSessions } from '@/lib/tracking/session-queries'
import UserActivityTimeline from '@/components/admin/UserActivityTimeline'

export const dynamic = 'force-dynamic'

export default async function UserActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, role, phone, created_at')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const sessions = await fetchUserSessions(id)

  return (
    <UserActivityTimeline
      profile={{
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        created_at: profile.created_at,
      }}
      sessions={sessions}
    />
  )
}