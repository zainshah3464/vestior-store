// src/lib/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Browser-side Supabase client (singleton).
 *
 * Why singleton?
 *  - Every `createBrowserClient()` call opens its own WebSocket connection,
 *    registers its own auth listener, and runs its own token refresh loop.
 *  - Multiple clients in the same tab cause:
 *      • duplicate network requests
 *      • refresh-token races (Invalid Refresh Token errors)
 *      • memory / socket leaks
 *
 * The first call creates the client. Every subsequent call in the same
 * browser session returns the SAME instance. Safe to call from any
 * component; no need to memoize.
 */
export function createClient(): SupabaseClient {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}