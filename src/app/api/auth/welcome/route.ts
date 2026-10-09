import { NextRequest, NextResponse } from 'next/server'
import { queueEmail } from '@/lib/email/queue'
import { limiters } from '@/lib/ratelimit'
import { getClientKey } from '@/lib/ratelimit'
import { z } from 'zod'

export const runtime = 'nodejs'

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(100),
})

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  try {
    const { success } = await limiters.general.limit(getClientKey(ip))
    if (!success) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }
  } catch {}

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  await queueEmail({
    template: 'welcome',
    to: parsed.data.email,
    data: {
      fullName: parsed.data.fullName,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  })

  return NextResponse.json({ success: true })
}