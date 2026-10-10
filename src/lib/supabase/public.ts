import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Public (anonymous) Supabase client — no cookies, no session.
 *
 * Use this in Server Components that fetch only public data
 * (products, categories, etc.). Unlike `createClient()` from
 * `@/lib/supabase/server`, this does NOT call cookies(), so
 * the page can be statically generated or cached with ISR.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
)