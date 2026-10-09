import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Best-effort lookup of the current user for tracking enrichment.
 * Returns null if not authenticated — never throws.
 */
export async function getCurrentUser(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}