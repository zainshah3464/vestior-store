'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import ChatMessage from './ChatMessage'

interface ChatMsg {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  'Show me suits under ₹25,000',
  'What categories do you have?',
  'Do you have Gurkha pants in stock?',
  'Where is my latest order?',
]

// Session-scoped persistence — cleared when browser tab closes
const STORAGE_KEY = 'vestior-chat-history'

export default function ChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Don't show on admin pages
  const isAdmin = pathname?.startsWith('/admin')

  // ─────────────────────────────────────────────────────────
  // Load / persist from sessionStorage
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setMessages(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // ignore quota
    }
  }, [messages])

  // ─────────────────────────────────────────────────────────
  // Body scroll lock — CRITICAL FIX
  //   • Prevents background page scroll while chat is open
  //   • Compensates for scrollbar width to avoid layout shift
  //   • Handles iOS Safari quirks
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    const body = document.body
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    const prevTouchAction = body.style.touchAction

    // Calculate scrollbar width to avoid content shift on desktop
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    body.style.touchAction = 'none'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
      body.style.touchAction = prevTouchAction
    }
  }, [isOpen])

  // ─────────────────────────────────────────────────────────
  // Auto-scroll to latest
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened (delay on mobile to let animation finish)
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  // ─────────────────────────────────────────────────────────
  // Send message + stream response
  // ─────────────────────────────────────────────────────────
  const handleSend = async (content?: string) => {
    const text = (content ?? input).trim()
    if (!text || isStreaming) return

    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsStreaming(true)

    // Placeholder assistant message (filled via streaming)
    const assistantId = `a-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Request failed (${res.status})`)
      }

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        )
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm sorry, I couldn't generate a response. Please try again.",
                }
              : m
          )
        )
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return

      const msg = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(msg)

      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleClear = () => {
    setMessages([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  if (isAdmin) return null

  return (
    <>
      {/* ═════════════ Floating button ═════════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:shadow-indigo-500/60 transition-shadow
              bottom-[max(1.5rem,env(safe-area-inset-bottom))]
              right-[max(1.25rem,env(safe-area-inset-right))]"
            aria-label="Open AI shopping assistant"
          >
            <MessageCircle size={24} aria-hidden="true" />
            {messages.length === 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-pulse"
                aria-hidden="true"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═════════════ Chat panel ═════════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — mobile only, improves focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm sm:hidden"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="AI shopping assistant"
              className="fixed z-[100] flex flex-col overflow-hidden bg-[#0f0f0f] border-white/[0.08]
                /* ─── Mobile: true fullscreen ─── */
                inset-0 h-[100dvh] w-screen max-w-none rounded-none border-0
                /* ─── Tablet/Desktop: floating panel ─── */
                sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:left-auto
                sm:w-[400px] sm:h-[600px] sm:max-w-[calc(100vw-3rem)]
                sm:max-h-[calc(100dvh-3rem)]
                sm:rounded-2xl sm:border
                sm:shadow-2xl sm:shadow-black/60
                md:w-[420px] md:h-[640px]"
              style={{
                // iOS safe areas for mobile fullscreen
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              {/* ───── Header ───── */}
              <header className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-white/[0.08] bg-gradient-to-r from-indigo-500/[0.08] to-violet-500/[0.08] flex-shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10">
                    <Sparkles
                      size={15}
                      className="text-white"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0f0f]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-semibold text-white leading-tight truncate">
                      VESTIOR Assistant
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200"
                      aria-label="Clear conversation"
                      title="Clear conversation"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                    aria-label="Close chat"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </header>

              {/* ───── Messages (only this area scrolls) ───── */}
              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 sm:px-4 py-4 scroll-smooth"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                }}
              >
                {messages.length === 0 ? (
                  <EmptyState onPromptClick={handleSend} />
                ) : (
                  <>
                    {messages.map((msg, idx) => {
                      const isLast = idx === messages.length - 1
                      // Skip the empty streaming assistant placeholder —
                      // the TypingIndicator below represents it instead,
                      // preventing a duplicate avatar + empty bubble.
                      const isEmptyStreamingPlaceholder =
                        isStreaming &&
                        isLast &&
                        msg.role === 'assistant' &&
                        msg.content === ''

                      if (isEmptyStreamingPlaceholder) return null

                      return <ChatMessage key={msg.id} message={msg} />
                    })}
                    {isStreaming &&
                      messages[messages.length - 1]?.role === 'assistant' &&
                      messages[messages.length - 1]?.content === '' && (
                        <TypingIndicator />
                      )}
                  </>
                )}
              </div>

              {/* ───── Input (pinned to bottom) ───── */}
              <footer className="flex-shrink-0 px-3 py-3 border-t border-white/[0.08] bg-[#0a0a0a]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-end gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about products, orders…"
                    disabled={isStreaming}
                    maxLength={2000}
                    className="flex-1 min-w-0 px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] disabled:opacity-50 transition-all duration-200"
                    aria-label="Chat message"
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    whileHover={input.trim() && !isStreaming ? { scale: 1.05 } : {}}
                    whileTap={input.trim() && !isStreaming ? { scale: 0.95 } : {}}
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-shadow"
                    aria-label="Send message"
                  >
                    {isStreaming ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Send size={16} aria-hidden="true" />
                    )}
                  </motion.button>
                </form>
                <p className="text-[10px] text-gray-600 text-center mt-2">
                  AI assistant · Powered by Groq
                </p>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Empty state with suggested prompts
// ─────────────────────────────────────────────────────────────
function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void
}) {
  return (
    <div className="flex flex-col items-center text-center pt-4 pb-2">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25"
      >
        <Sparkles size={24} className="text-white" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-xl -z-10"
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="text-[15px] font-semibold text-white mb-1.5"
      >
        Hi, I&apos;m your AI assistant
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-[12px] text-gray-400 max-w-[280px] mb-6 leading-relaxed"
      >
        I can help you find products, check stock, or track your orders.
      </motion.p>

      <div className="w-full space-y-2">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <motion.button
            key={i}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15 + i * 0.06,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPromptClick(prompt)}
            className="group w-full text-left px-3.5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-indigo-500/40 rounded-xl text-[12px] text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-between gap-2"
          >
            <span className="truncate">{prompt}</span>
            <Send
              size={12}
              className="flex-shrink-0 text-gray-600 group-hover:text-indigo-400 transition-colors"
              aria-hidden="true"
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Typing indicator (three bouncing dots)
// ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2 mb-3"
    >
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold ring-1 ring-white/10"
        aria-hidden="true"
      >
        V
      </div>
      <div className="flex gap-1 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-bl-sm">
        {[0, 0.15, 0.3].map((delay) => (
          <motion.span
            key={delay}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            aria-hidden="true"
          />
        ))}
      </div>
    </motion.div>
  )
}