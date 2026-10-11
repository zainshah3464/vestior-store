import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { saveCartSnapshot, ensureCartIndexes } from '@/lib/carts/queries'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().int().positive(),
        image: z.string().nullable().optional(),
        size: z.string().nullable().optional(),
      })
    )
    .max(100),
})

export async function POST(req: NextRequest) {
  // Auth
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 200 })

  // Parse
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Profile name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const items = parsed.data.items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image ?? null,
    size: i.size ?? null,
  }))

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  try {
    await ensureCartIndexes()
    await saveCartSnapshot({
      userId: user.id,
      userEmail: user.email ?? '',
      userName: profile?.full_name ?? user.email?.split('@')[0] ?? 'Customer',
      items,
      subtotal,
      itemCount,
    })
  } catch (err) {
    console.error('[cart/sync] save failed:', err)
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}