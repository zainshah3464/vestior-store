import 'server-only'
import nodemailer from 'nodemailer'
import type { Transporter, SentMessageInfo } from 'nodemailer'
import { env } from '@/lib/env'

// ─────────────────────────────────────────────────────────────
// Gmail SMTP transporter (singleton)
//
// Gmail limits:
//   • 500 recipients/day (regular Gmail)
//   • 2000/day (Workspace)
//   • ~100 emails/minute burst
// ─────────────────────────────────────────────────────────────
let transporter: Transporter<SentMessageInfo> | null = null

function getTransporter(): Transporter<SentMessageInfo> {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL_USER,
      // App passwords are formatted "xxxx xxxx xxxx xxxx"
      // Stripping spaces is safe and improves reliability
      pass: env.GMAIL_APP_PASSWORD.replace(/\s+/g, ''),
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  })

  return transporter
}

export interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export interface SendEmailResult {
  messageId: string
  accepted: string[]
  rejected: string[]
}

/**
 * Send a single email via Gmail SMTP.
 * Throws on failure so the caller can mark logs as failed.
 */
export async function sendEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  const info: SentMessageInfo = await getTransporter().sendMail({
    from: env.EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })

  // Normalize accepted/rejected arrays (can be string[] or Address[])
  const normalize = (list: unknown[] | undefined): string[] =>
    (list ?? []).map((a) => {
      if (typeof a === 'string') return a
      if (a && typeof a === 'object' && 'address' in a) {
        return String((a as { address: string }).address)
      }
      return String(a)
    })

  return {
    messageId: info.messageId,
    accepted: normalize(info.accepted),
    rejected: normalize(info.rejected),
  }
}