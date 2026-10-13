/**
 * POST /api/auth/login-success
 *
 * Called by the login page after a successful signin. Records
 * the login timestamp and (optionally) sends a "welcome back"
 * email to returning users.
 *
 * Rules:
 *   • First login ever (last_login_at is null) → no email, just record
 *   • Returning user (last_login_at is set) → send welcome-back,
 *     throttled to at most once every 7 days
 *
 * Auth: requires session cookie (user must be logged in)
 * Idempotent: safe to call multiple times
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { queueEmail } from '@/lib/email/queue'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WELCOME_BACK_COOLDOWN_DAYS = 7

export async function POST(req: NextRequest) {
  try {
    // ─────────────────────────────────────────────
    // 1. Authenticate
    // ─────────────────────────────────────────────
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    // ─────────────────────────────────────────────
    // 2. Fetch profile
    // ─────────────────────────────────────────────
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('full_name, email, last_login_at, welcome_back_sent_at, role')
      .eq('id', user.id)
      .single()

    if (profileErr || !profile) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const now = new Date()
    const lastLoginAt = profile.last_login_at
      ? new Date(profile.last_login_at)
      : null
    const welcomeBackSentAt = profile.welcome_back_sent_at
      ? new Date(profile.welcome_back_sent_at)
      : null

    const isFirstLoginEver = lastLoginAt === null

    // Skip welcome-back for admins (they see the dashboard)
    const isAdmin = profile.role === 'admin'

    // Throttle: don't send if sent within last 7 days
    const sentRecently =
      welcomeBackSentAt !== null &&
      now.getTime() - welcomeBackSentAt.getTime() <
        WELCOME_BACK_COOLDOWN_DAYS * 86400 * 1000

    // ─────────────────────────────────────────────
    // 3. Send welcome-back if eligible
    // ─────────────────────────────────────────────
    let emailSent = false

    if (!isFirstLoginEver && !isAdmin && !sentRecently) {
      try {
        // Fetch most recent order for personalization
        const { data: lastOrder } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        await queueEmail({
          template: 'welcome-back',
          to: user.email!,
          userId: user.id,
          data: {
            fullName:
              profile.full_name || user.email?.split('@')[0] || 'there',
            siteUrl: env.NEXT_PUBLIC_SITE_URL,
            lastOrderId: lastOrder?.id ?? null,
          },
        })

        emailSent = true
      } catch (err) {
        console.error('[login-success] welcome-back queue failed:', err)
        // Non-fatal — continue to update login timestamp
      }
    }

    // ─────────────────────────────────────────────
    // 4. Update login timestamp + email sent marker
    // ─────────────────────────────────────────────
    const updates: Record<string, unknown> = {
      last_login_at: now.toISOString(),
    }
    if (emailSent) {
      updates.welcome_back_sent_at = now.toISOString()
    }

    await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    return NextResponse.json({
      ok: true,
      isFirstLogin: isFirstLoginEver,
      emailSent,
    })
  } catch (err) {
    console.error('[login-success] error:', err)
    // Always return 200 — this is best-effort tracking
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}