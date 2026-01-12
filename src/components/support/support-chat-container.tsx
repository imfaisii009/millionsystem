'use client'

import { useEffect, useState } from 'react'
import { useSupportStore } from '@/stores/support-store'
import { SupportChatHeader } from './support-chat-header'
import { SupportChatMessages } from './support-chat-messages'
import { SupportChatInput } from './support-chat-input'
import { SupportContactForm } from './support-contact-form'
import { SupportConversationList } from './support-conversation-list'

type View = 'list' | 'new' | 'chat'

export function SupportChatContainer() {
  const {
    currentConversation,
    conversations,
    loadConversations,
    initAnonymousId,
    subscribeToMessages,
  } = useSupportStore()

  const [view, setView] = useState<View>('list')

  // Initialize on mount
  useEffect(() => {
    initAnonymousId()
    loadConversations()
  }, [])

  // Switch to chat view when conversation is selected/created
  useEffect(() => {
    if (currentConversation) {
      setView('chat')
    }
  }, [currentConversation?.id])

  // Subscribe to messages when in chat view
  useEffect(() => {
    if (view === 'chat' && currentConversation) {
      const unsubscribe = subscribeToMessages(currentConversation.id)
      return () => {
        unsubscribe()
      }
    }
  }, [view, currentConversation?.id])

  const handleNewConversation = () => {
    setView('new')
  }

  const handleBackToList = () => {
    setView('list')
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <SupportChatHeader
        showBackButton={view !== 'list'}
        onBack={handleBackToList}
      />

      {/* Content */}
      {view === 'list' && (
        <SupportConversationList onNewConversation={handleNewConversation} />
      )}

      {view === 'new' && <SupportContactForm />}

      {view === 'chat' && currentConversation && (
        <>
          <SupportChatMessages />
          <SupportChatInput />
        </>
      )}
    </div>
  )
}
