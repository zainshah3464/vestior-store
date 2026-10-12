'use client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mr-2">
          V
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-md'
            : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-md'
        }`}
      >
        <MessageContent content={message.content} isUser={isUser} />
      </div>
    </div>
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
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
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
        className="list-disc list-inside space-y-0.5 my-1.5"
      >
        {currentList.map((item, i) => (
          <li
            key={i}
            className="text-[13px] leading-relaxed"
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
        elements.push(<div key={`sp-${idx}`} className="h-2" />)
      }
    } else {
      flushList()
      elements.push(
        <p
          key={idx}
          className="text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
        />
      )
    }
  })

  flushList()

  return (
    <div className={isUser ? 'text-white' : 'text-gray-200'}>
      {elements.length > 0 ? elements : <p className="text-[13px]">{content}</p>}
    </div>
  )
}