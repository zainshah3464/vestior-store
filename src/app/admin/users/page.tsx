// src/app/admin/users/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin'
import UsersTable from '@/components/admin/UsersTable'

export default async function AdminUsersPage() {
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at, address_line1, address_line2, city, state, pincode, updated_at')
    .order('created_at', { ascending: false })

  return <UsersTable profiles={profiles || []} />
}