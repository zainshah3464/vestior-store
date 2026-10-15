'use client'

import { motion } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold ring-1 ring-white/10 mt-0.5"
          aria-hidden="true"
        >
          V
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-sm shadow-md shadow-indigo-500/20'
            : 'bg-white/[0.04] border border-white/[0.08] text-gray-200 rounded-bl-sm'
        }`}
      >
        <MessageContent content={message.content} isUser={isUser} />
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Simple safe markdown renderer
//   • Escapes HTML first (XSS protection)
//   • **bold**, `code`, bullet lists
//   • No external dependency needed
// ─────────────────────────────────────────────────────────────
function MessageContent({
  content,
  isUser,
}: {
  content: string
  isUser: boolean
}) {
  const escapeHtml = (str: string): string =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const renderInline = (text: string): string => {
    let html = escapeHtml(text)
    // **bold**
    html = html.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    )
    // `code`
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="px-1 py-0.5 bg-black/40 rounded text-[11px] font-mono">$1</code>'
    )
    return html
  }

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: string[] = []

  const flushList = () => {
    if (currentList.length === 0) return
    elements.push(
      <ul
        key={`list-${elements.length}`}
        className="list-disc list-outside pl-4 space-y-1 my-1.5"
      >
        {currentList.map((item, i) => (
          <li
            key={i}
            className="text-[12.5px] sm:text-[13px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInline(item) }}
          />
        ))}
      </ul>
    )
    currentList = []
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2))
    } else if (trimmed === '') {
      flushList()
      if (elements.length > 0) {
        elements.push(<div key={`sp-${idx}`} className="h-1.5" />)
      }
    } else {
      flushList()
      elements.push(
        <p
          key={idx}
          className="text-[12.5px] sm:text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
        />
      )
    }
  })

  flushList()

  return (
    <div
      className={`break-words ${
        isUser ? 'text-white' : 'text-gray-200'
      }`}
    >
      {elements.length > 0 ? (
        elements
      ) : (
        <p className="text-[12.5px] sm:text-[13px] leading-relaxed">
          {content}
        </p>
      )}
    </div>
  )
}