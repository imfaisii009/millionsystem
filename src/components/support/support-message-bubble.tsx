'use client'

import { cn } from '@/lib/utils'
import { formatSupportMessage, type SupportMessage } from '@/types/support'
import { Bot, User, HeadphonesIcon, InfoIcon } from 'lucide-react'

interface SupportMessageBubbleProps {
  message: SupportMessage
  contactName?: string
}

export function SupportMessageBubble({
  message,
  contactName,
}: SupportMessageBubbleProps) {
  const formatted = formatSupportMessage(message)

  // Determine alignment and styling
  const isUserMessage = formatted.isUser
  const isSystemMessage = formatted.isSystem

  // Get icon based on sender type
  const SenderIcon = formatted.isUser
    ? User
    : formatted.isBot
    ? Bot
    : formatted.isSupport
    ? HeadphonesIcon
    : InfoIcon

  // Format timestamp
  const timeString = formatted.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  // System messages are centered
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-muted/50 text-muted-foreground text-sm px-4 py-2 rounded-full max-w-[85%] text-center">
          <InfoIcon className="inline-block w-3.5 h-3.5 mr-1.5 -mt-0.5" />
          {formatted.content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-2 mb-3',
        isUserMessage ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUserMessage
            ? 'bg-primary text-primary-foreground'
            : formatted.isBot
            ? 'bg-purple-500/20 text-purple-500'
            : 'bg-green-500/20 text-green-500'
        )}
      >
        <SenderIcon className="w-4 h-4" />
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex flex-col max-w-[75%]',
          isUserMessage ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender name (only for non-user messages) */}
        {!isUserMessage && (
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {formatted.senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isUserMessage
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          {/* Image */}
          {formatted.imageUrl && (
            <div className="mb-2">
              <img
                src={formatted.imageUrl}
                alt="Attached image"
                className="max-w-full rounded-lg max-h-64 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(formatted.imageUrl!, '_blank')}
              />
            </div>
          )}

          {/* Text content */}
          {formatted.content && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {formatted.content}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {timeString}
        </span>
      </div>
    </div>
  )
}
