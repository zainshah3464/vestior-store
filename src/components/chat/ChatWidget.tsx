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
  // Auto-scroll to latest
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350)
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
        throw new Error(
          errData.error || `Request failed (${res.status})`
        )
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

      // Empty response fallback
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

      // Remove the empty placeholder on error
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
      {/* ───────── Floating button ───────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/30 flex items-center justify-center hover:shadow-indigo-500/50 transition-shadow"
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

      {/* ───────── Chat panel ───────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed z-50 bg-[#0f0f0f] border border-white/10 shadow-2xl shadow-black/60 rounded-2xl overflow-hidden flex flex-col
              bottom-2 right-2 left-2 top-2
              sm:bottom-6 sm:right-6 sm:top-auto sm:left-auto sm:w-[400px] sm:h-[600px]
              md:w-[420px] md:h-[640px]"
            role="dialog"
            aria-label="AI shopping assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">
                    VESTIOR Assistant
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Clear conversation"
                    title="Clear conversation"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
                  aria-label="Close chat"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
            >
              {messages.length === 0 ? (
                <EmptyState onPromptClick={handleSend} />
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isStreaming &&
                    messages[messages.length - 1]?.content === '' && (
                      <TypingIndicator />
                    )}
                </>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 bg-[#0a0a0a] flex-shrink-0">
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
                  className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-colors"
                  aria-label="Chat message"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Send message"
                >
                  {isStreaming ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Send size={16} aria-hidden="true" />
                  )}
                </motion.button>
              </form>
              <p className="text-[10px] text-gray-600 text-center mt-2">
                AI assistant · Powered by Groq
              </p>
            </div>
          </motion.div>
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
    <div className="flex flex-col items-center text-center pt-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/20">
        <Sparkles size={24} className="text-white" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">
        Hi, I&apos;m your AI assistant
      </h3>
      <p className="text-xs text-gray-400 max-w-[260px] mb-5 leading-relaxed">
        I can help you find products, check stock, or track orders.
      </p>

      <div className="w-full space-y-2">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onPromptClick(prompt)}
            className="w-full text-left px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 rounded-xl text-xs text-gray-300 hover:text-white transition-all"
          >
            {prompt}
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
    <div className="flex items-center gap-1.5 ml-10 mb-3">
      <div className="flex gap-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl rounded-bl-md">
        {[0, 0.2, 0.4].map((delay) => (
          <motion.span
            key={delay}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay }}
            className="w-1.5 h-1.5 rounded-full bg-gray-400"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}