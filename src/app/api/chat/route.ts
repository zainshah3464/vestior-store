/**
 * POST /api/chat — Streaming AI chatbot endpoint.
 *
 * AI SDK v5 API:
 *   • `ModelMessage` type for streamText input
 *   • `stopWhen: stepCountIs(N)` instead of `maxSteps`
 *   • `toTextStreamResponse()` for plain-text streaming
 *
 * Security:
 *   • Rate-limited (20 messages/min per IP)
 *   • Max 20 messages per request
 *   • Max 2000 chars per message
 *   • System messages stripped from client input (prompt injection guard)
 */

import { NextRequest } from 'next/server'
import { streamText, stepCountIs, type ModelMessage } from 'ai'
import { z } from 'zod'
import { getGroq, AI_MODELS } from '@/lib/ai/groq'
import { VESTIOR_SYSTEM_PROMPT } from '@/lib/ai/system-prompt'
import { vestiorTools } from '@/lib/ai/tools'
import { limiters, getClientKey } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ─────────────────────────────────────────────────────────────
// Request validation
// ─────────────────────────────────────────────────────────────
const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
})

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
})

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  try {
    const { success } = await limiters.chat.limit(getClientKey(ip))
    if (!success) {
      return Response.json(
        { error: 'Too many messages. Please wait a minute.' },
        { status: 429 }
      )
    }
  } catch {
    // Fail-open: allow request if Redis is down
  }

  // 2. Check Groq config
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: 'AI chatbot is not configured.' },
      { status: 503 }
    )
  }

  // 3. Parse + validate
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = chatRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  // 4. Build ModelMessage[] — role + string content only
  //    Client `system` messages are rejected by the schema, so no
  //    prompt-injection via role spoofing.
  const safeMessages: ModelMessage[] = parsed.data.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  // 5. Stream with tool calling
  try {
    const groq = getGroq()

    const result = streamText({
      model: groq(AI_MODELS.QUALITY),
      system: VESTIOR_SYSTEM_PROMPT,
      messages: safeMessages,
      tools: vestiorTools,
      // Allow the model to make up to 3 tool calls per turn
      // (e.g., search → getProductById → getMyOrders)
      stopWhen: stepCountIs(3),
      temperature: 0.7,
      maxOutputTokens: 800,
    })

    // Plain-text streaming response — client reads with TextDecoder
    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[chat] groq stream failed:', err)
    return Response.json(
      { error: 'AI service temporarily unavailable' },
      { status: 500 }
    )
  }
}