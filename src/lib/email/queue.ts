import 'server-only'
import { Client } from '@upstash/qstash'
import { env } from '@/lib/env'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { renderEmail } from './render'
import { sendEmail } from './mailer'
import type { QueueEmailParams, EmailJobPayload } from './types'

const qstash = new Client({
  token: env.QSTASH_TOKEN,
  baseUrl: env.QSTASH_URL,
})

/**
 * Development detection — QStash can't reach localhost.
 * In dev: send directly.
 * In production: queue via QStash.
 */
function isLocalDevelopment(): boolean {
  const url = env.NEXT_PUBLIC_SITE_URL || ''
  return (
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('192.168.') ||
    url.startsWith('http://')
  )
}

/**
 * Queue (dev: send directly) an email.
 * Always logs to MongoDB. Never throws.
 */
export async function queueEmail(
  params: QueueEmailParams
): Promise<string | null> {
  try {
    const db = await getDb()

    // 1. Log intent
    const log = await db.collection(COLLECTIONS.EMAIL_LOGS).insertOne({
      user_id: params.userId ?? null,
      email: params.to,
      template: params.template,
      status: 'queued',
      metadata: params.data,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const logId = log.insertedId.toString()

    // 2. Development → send directly
    if (isLocalDevelopment()) {
      await sendNow({ ...params, logId })
      return logId
    }

    // 3. Production → queue
    const payload: EmailJobPayload = { ...params, logId }
    await qstash.publishJSON({
      url: `${env.NEXT_PUBLIC_SITE_URL}/api/jobs/send-email`,
      body: payload,
      retries: 3,
      delay: params.delay ? parseDelay(params.delay) : undefined,
    })

    return logId
  } catch (err) {
    console.error('[queueEmail] failed:', err)
    return null
  }
}

/**
 * Direct send path (used in local development).
 */
async function sendNow(payload: EmailJobPayload): Promise<void> {
  try {
    const { html, subject } = await renderEmail(payload.template, payload.data)

    const result = await sendEmail({
      to: payload.to,
      subject: payload.subject ?? subject,
      html,
    })

    await updateEmailLog(payload.logId, {
      status: 'sent',
      provider_message_id: result.messageId,
    })

    console.log(
      `[email] sent "${payload.template}" to ${payload.to} (id: ${result.messageId})`
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[email] direct send failed:', errorMessage)

    await updateEmailLog(payload.logId, {
      status: 'failed',
      error: errorMessage,
    })
  }
}

function parseDelay(input: string): number {
  const match = input.match(/^(\d+)(s|m|h|d)$/)
  if (!match) return 0
  const [, n, unit] = match
  const num = parseInt(n, 10)
  switch (unit) {
    case 's': return num
    case 'm': return num * 60
    case 'h': return num * 3600
    case 'd': return num * 86_400
    default: return 0
  }
}

export async function updateEmailLog(
  logId: string,
  updates: Record<string, unknown>
): Promise<void> {
  try {
    const db = await getDb()
    await db
      .collection(COLLECTIONS.EMAIL_LOGS)
      .updateOne(
        { _id: new ObjectId(logId) },
        { $set: { ...updates, updated_at: new Date() } }
      )
  } catch (err) {
    console.error('[updateEmailLog] failed:', err)
  }
}