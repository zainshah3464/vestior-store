import 'server-only'
import { createGroq } from '@ai-sdk/groq'
import { env } from '@/lib/env'

/**
 * Groq client — server-only.
 *
 * Uses LPU chips for sub-second inference.
 *
 * ─── Model access note ────────────────────────────────────────
 * Groq's model availability varies by region and account tier.
 * If you get 404 "model does not exist", run:
 *
 *   curl https://api.groq.com/openai/v1/models \
 *     -H "Authorization: Bearer $GROQ_API_KEY"
 *
 * to see which models are actually enabled for your key.
 *
 * As of Oct 2026, accounts in the DMM (Saudi) region have
 * access to openai/gpt-oss-* instead of the llama-* series.
 */

let client: ReturnType<typeof createGroq> | null = null

export function getGroq() {
  if (client) return client

  if (!env.GROQ_API_KEY) {
    throw new Error(
      'GROQ_API_KEY is not set. Add it to .env.local to enable AI features.'
    )
  }

  client = createGroq({
    apiKey: env.GROQ_API_KEY,
  })

  return client
}

export const AI_MODELS = {
  /**
   * Primary model for the chatbot.
   * `gpt-oss-120b` — 500 tok/s, supports tool calling.
   */
  QUALITY: 'openai/gpt-oss-120b',
  /**
   * Faster/cheaper alternative.
   * `gpt-oss-20b` — 1000 tok/s.
   */
  FAST: 'openai/gpt-oss-20b',
} as const