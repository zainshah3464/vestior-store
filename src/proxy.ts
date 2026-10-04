import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import {
  getLimiterForPath,
  getClientKey,
} from '@/lib/ratelimit'

// ────────────────────────────────────────────
// Next.js 16 proxy (formerly "middleware")
// Runs on every request before rendering.
// ────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  // ────────────────────────────────────────────
  // 0. Rate limiting
  // ────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null

  const { limiter, name: limiterName } = getLimiterForPath(
    request.nextUrl.pathname
  )

  try {
    const { success, limit, reset } = await limiter.limit(
      getClientKey(ip)
    )

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded for ${limiterName}. Try again in ${retryAfter}s.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(reset),
            'Retry-After': String(retryAfter),
          },
        }
      )
    }
  } catch (err) {
    console.error('[ratelimit] redis error:', err)
  }

  // ────────────────────────────────────────────
  // 1. Supabase session refresh
  // ────────────────────────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ────────────────────────────────────────────
  // 2. Redirect helper
  // ────────────────────────────────────────────
  const redirectWithCookies = (path: string) => {
    const redirect = NextResponse.redirect(new URL(path, request.url))
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        sameSite: cookie.sameSite,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        maxAge: cookie.maxAge,
        expires: cookie.expires,
      })
    })
    return redirect
  }

  const { pathname } = request.nextUrl

  // ────────────────────────────────────────────
  // 3. Route guards
  // ────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!user) return redirectWithCookies('/auth/login')

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') return redirectWithCookies('/')
  }

  const protectedPaths = ['/checkout', '/profile', '/orders']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    return redirectWithCookies('/auth/login')
  }

  if (user && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    return redirectWithCookies('/')
  }

  return response
}

// Next.js 16 proxy config — same as old middleware `config`
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf)$).*)',
  ],
}