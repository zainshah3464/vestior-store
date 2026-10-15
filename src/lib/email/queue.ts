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

function isLocalDevelopment(): boolean {
  const url = env.NEXT_PUBLIC_SITE_URL || ''
  return (
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('192.168.') ||
    url.endsWith('.local')
  )
}

export async function queueEmail(
  params: QueueEmailParams
): Promise<string | null> {
  let logId: string | null = null

  try {
    const db = await getDb()

    const log = await db.collection(COLLECTIONS.EMAIL_LOGS).insertOne({
      user_id: params.userId ?? null,
      email: params.to,
      template: params.template,
      status: 'queued',
      metadata: params.data,
      created_at: new Date(),
      updated_at: new Date(),
    })

    logId = log.insertedId.toString()

    if (isLocalDevelopment()) {
      await sendNow({ ...params, logId })
      return logId
    }

    const payload: EmailJobPayload = { ...params, logId }
    const res = await qstash.publishJSON({
      url: `${env.NEXT_PUBLIC_SITE_URL}/api/jobs/send-email`,
      body: payload,
      retries: 3,
      delay: params.delay ? parseDelay(params.delay) : undefined,
    })

    console.log(
      `[queueEmail] queued ${params.template} → ${params.to} (qstash=${res.messageId})`
    )

    return logId
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[queueEmail] failed:', errorMessage)

    if (logId) {
      await updateEmailLog(logId, { status: 'failed', error: errorMessage })
    }

    return null
  }
}

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