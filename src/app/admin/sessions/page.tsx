import { getDb } from '@/lib/mongodb'
import { notFound } from 'next/navigation'
import { SESSIONS_COLLECTION } from '@/lib/tracking/session-queries'
import SessionDetail from '@/components/admin/SessionDetail'
import type { StoredSession } from '@/lib/tracking/session-types'

export const dynamic = 'force-dynamic'

export default async function SessionDetailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const sessionId = typeof sp.id === 'string' ? sp.id : null

  if (!sessionId) notFound()

  const db = await getDb()
  const session = await db
    .collection<StoredSession>(SESSIONS_COLLECTION)
    .findOne({ session_id: sessionId })

  if (!session) notFound()

  return <SessionDetail session={session} />
}