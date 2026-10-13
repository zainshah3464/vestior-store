'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { z } from 'zod'

const changeRoleSchema = z.object({
  userId: z.string().uuid(),
  newRole: z.enum(['admin', 'customer']),
})

export async function changeUserRole(
  userId: string,
  newRole: 'admin' | 'customer'
): Promise<{ success: true }> {
  const parsed = changeRoleSchema.safeParse({ userId, newRole })
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid input')
  }

  // ─────────────────────────────────────────────
  // 1. Authenticate (user session client)
  // ─────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ─────────────────────────────────────────────
  // 2. Verify caller is super admin (via admin client — bypasses RLS)
  // ─────────────────────────────────────────────
  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('email, is_super_admin')
    .eq('id', user.id)
    .single()

  if (!callerProfile?.is_super_admin) {
    throw new Error('Forbidden: Super admin access required')
  }

  // ─────────────────────────────────────────────
  // 3. Fetch target (for audit)
  // ─────────────────────────────────────────────
  const { data: target } = await supabaseAdmin
    .from('profiles')
    .select('email, role')
    .eq('id', userId)
    .single()

  if (!target) throw new Error('Target user not found')

  // ─────────────────────────────────────────────
  // 4. Call the RPC using the USER's session client
  //    (not supabaseAdmin) — auth.uid() must return the caller.
  //    The RPC is SECURITY DEFINER, so it bypasses RLS internally.
  // ─────────────────────────────────────────────
  const { data, error } = await supabase.rpc('admin_change_user_role', {
    p_target_user_id: userId,
    p_new_role: newRole,
  })

  if (error) {
    const raw = (error.message || '').trim()
    const cleaned = raw
      .replace(/^PostgresError:\s*/i, '')
      .replace(/^P\d{4}:\s*/, '')
      .trim()
    throw new Error(cleaned || 'Failed to change role')
  }

  // ─────────────────────────────────────────────
  // 5. Audit log
  // ─────────────────────────────────────────────
  await logAudit({
    actorId: user.id,
    actorEmail: callerProfile.email || user.email || '',
    action: 'user.change_role',
    targetType: 'user',
    targetId: userId,
    before: { role: target.role },
    after: { role: newRole },
    metadata: { targetEmail: target.email, rpcResult: data },
  })

  revalidatePath('/admin/users')
  return { success: true }
}