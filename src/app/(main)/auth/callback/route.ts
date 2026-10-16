import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const redirectUrl = new URL(safeNext, origin)
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 🆕 Naya: token_hash wala flow (reset password + signup confirm)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      console.error('[auth/callback] verifyOtp failed:', error.message)
      return NextResponse.redirect(
        new URL('/auth/forgot-password?error=invalid_or_expired_link', origin)
      )
    }
    return response
  }

  // Purana: OAuth (Google login) ke liye code wala flow
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth/callback] exchange failed:', error.message)
      return NextResponse.redirect(
        new URL('/auth/login?error=oauth_failed', origin)
      )
    }
    return response
  }

  return NextResponse.redirect(new URL('/auth/login', origin))
}