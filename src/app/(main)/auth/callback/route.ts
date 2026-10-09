import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Sanitize `next` — only allow same-origin relative paths
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'

  // If no code, redirect straight to login
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Build the redirect response FIRST so we can attach cookies to it
  const redirectUrl = new URL(safeNext, request.url)
const response = NextResponse.redirect(redirectUrl)

  // Server client bound to `response.cookies` — every cookie it sets
  // will land on the redirect response, not on next/headers
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
            // Set on request (so downstream reads work)
            request.cookies.set(name, value)
            // Set on response (so browser receives them)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchange failed:', error.message)
    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_failed', request.url)
    )
  }

  return response
}