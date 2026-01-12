'use client'

import { useSupportStore } from '@/stores/support-store'
import { getStatusInfo } from '@/types/support'
import { Button } from '@/components/ui/button'
import { Loader2, MessageCircle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupportConversationListProps {
  onNewConversation: () => void
}

export function SupportConversationList({
  onNewConversation,
}: SupportConversationListProps) {
  const {
    conversations,
    isLoading,
    setCurrentConversation,
    loadMessages,
    subscribeToMessages,
  } = useSupportStore()

  const handleSelectConversation = async (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      setCurrentConversation(conversation)
      await loadMessages(conversationId)
      subscribeToMessages(conversationId)
    }
  }

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* New conversation button */}
      <div className="p-4 border-b">
        <Button onClick={onNewConversation} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Conversation list */}
      {conversations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No conversations yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Start a new conversation to get help
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const statusInfo = getStatusInfo(conversation.status)
            const lastMessageDate = new Date(conversation.last_message_at)
            const isToday =
              lastMessageDate.toDateString() === new Date().toDateString()
            const timeString = isToday
              ? lastMessageDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : lastMessageDate.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })

            return (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className="w-full px-4 py-3 border-b hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {conversation.contact_name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full flex-shrink-0',
                          statusInfo.bgColor,
                          statusInfo.color
                        )}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {conversation.contact_email}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {timeString}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
