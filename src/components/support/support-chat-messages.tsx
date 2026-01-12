'use client'

import { useEffect, useRef } from 'react'
import { useSupportStore } from '@/stores/support-store'
import { SupportMessageBubble } from './support-message-bubble'
import { Loader2 } from 'lucide-react'

export function SupportChatMessages() {
  const { messages, currentConversation, isLoading, isSending } = useSupportStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No messages yet. Start the conversation!
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-1"
    >
      {messages.map((message) => (
        <SupportMessageBubble
          key={message.id}
          message={message}
          contactName={currentConversation?.contact_name}
        />
      ))}

      {/* Typing indicator when AI is generating */}
      {isSending && currentConversation?.mode === 'ai_bot' && (
        <div className="flex gap-2 mb-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground mb-1 px-1">
              Support Bot
            </span>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
