import 'server-only'
import { Receiver } from '@upstash/qstash'
import { env } from '@/lib/env'

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
})

/**
 * Verify a QStash signature on an incoming webhook.
 * Returns true if valid, false otherwise.
 */
export async function verifyQStashSignature(
  signature: string,
  body: string
): Promise<boolean> {
  try {
    return await receiver.verify({ signature, body })
  } catch {
    return false
  }
}