import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import UsersTable from '@/components/admin/UsersTable'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  // Fetch all profiles (admin-only view)
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, full_name, email, phone, role, is_super_admin, created_at, address_line1, address_line2, city, state, pincode, updated_at'
    )
    .order('created_at', { ascending: false })

  // Fetch current viewer's super admin status
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let viewerIsSuperAdmin = false
  if (user) {
    const { data: viewer } = await supabaseAdmin
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single()
    viewerIsSuperAdmin = viewer?.is_super_admin ?? false
  }

  return (
    <UsersTable
      profiles={profiles || []}
      viewerIsSuperAdmin={viewerIsSuperAdmin}
      viewerId={user?.id ?? null}
    />
  )
}