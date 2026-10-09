/**
 * QStash job handler — sends a single email via Gmail SMTP.
 *
 * Security: verifies QStash signature.
 * Retries: on failure, returns 500 → QStash retries (up to 3x).
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderEmail } from '@/lib/email/render'
import { updateEmailLog } from '@/lib/email/queue'
import { verifyQStashSignature } from '@/lib/qstash/verify'
import { sendEmail } from '@/lib/email/mailer'
import type { EmailJobPayload } from '@/lib/email/types'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('upstash-signature')

  // 1. Verify signature
  if (!signature || !(await verifyQStashSignature(signature, body))) {
    console.warn('[send-email] invalid signature')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse
  let payload: EmailJobPayload
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 3. Render
  let html: string
  let subject: string
  try {
    const rendered = await renderEmail(payload.template, payload.data)
    html = rendered.html
    subject = payload.subject ?? rendered.subject
  } catch (err) {
    console.error('[send-email] render failed:', err)
    await updateEmailLog(payload.logId, {
      status: 'failed',
      error: (err as Error).message,
    })
    // Don't retry render errors
    return NextResponse.json({ error: 'Render failed' }, { status: 200 })
  }

  // 4. Send via Gmail SMTP
  try {
    const result = await sendEmail({
      to: payload.to,
      subject,
      html,
    })

    await updateEmailLog(payload.logId, {
      status: 'sent',
      provider_message_id: result.messageId,
    })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    })
  } catch (err) {
    console.error('[send-email] smtp failed:', err)
    await updateEmailLog(payload.logId, {
      status: 'failed',
      error: (err as Error).message,
    })
    // Return 500 so QStash retries
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}