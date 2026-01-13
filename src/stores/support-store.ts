import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import type {
  SupportState,
  SupportConversation,
  SupportMessage,
  SupportStatus,
  CreateConversationResponse,
  GetConversationsResponse,
  GetConversationResponse,
  SendMessageResponse,
  UpdateConversationResponse,
  UploadImageResponse,
} from '@/types/support'
import { SUPPORT_ANONYMOUS_ID_KEY } from '@/types/support'

// ============================================================================
// Helper Functions
// ============================================================================

function getOrCreateAnonymousId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  let id = localStorage.getItem(SUPPORT_ANONYMOUS_ID_KEY)
  if (!id) {
    id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(SUPPORT_ANONYMOUS_ID_KEY, id)
  }
  return id
}

// ============================================================================
// Subscription Management
// ============================================================================

interface SubscriptionState {
  channelName: string | null
  unsubscribe: (() => void) | null
}

const subscriptionState: SubscriptionState = {
  channelName: null,
  unsubscribe: null,
}

// ============================================================================
// Store
// ============================================================================

export const useSupportStore = create<SupportState>((set, get) => ({
  // Initial State
  isOpen: false,
  unreadCount: 0,
  anonymousId: null,
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  isUploading: false,
  error: null,

  // ============================================================================
  // Anonymous ID
  // ============================================================================

  initAnonymousId: () => {
    const id = getOrCreateAnonymousId()
    set({ anonymousId: id })
    return id
  },

  // ============================================================================
  // Widget State
  // ============================================================================

  openWidget: () => {
    set({ isOpen: true, unreadCount: 0 })

    // Mark all messages as read when opening
    const { currentConversation } = get()
    if (currentConversation) {
      get().markAsRead([])
    }
  },

  closeWidget: () => {
    set({ isOpen: false })
  },

  // ============================================================================
  // Conversations
  // ============================================================================

  loadConversations: async () => {
    const anonymousId = get().anonymousId || get().initAnonymousId()

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(
        `/api/support/conversations?anonymous_id=${encodeURIComponent(anonymousId)}`
      )

      if (!response.ok) {
        throw new Error('Failed to load conversations')
      }

      const data: GetConversationsResponse = await response.json()
      set({ conversations: data.conversations })
    } catch (error) {
      console.error('[SupportStore] Error loading conversations:', error)
      set({ error: 'Failed to load conversations' })
    } finally {
      set({ isLoading: false })
    }
  },

  createConversation: async (name: string, email: string) => {
    const anonymousId = get().anonymousId || get().initAnonymousId()

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/support/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymous_id: anonymousId,
          contact_name: name,
          contact_email: email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create conversation')
      }

      const data: CreateConversationResponse = await response.json()

      set((state) => ({
        conversations: [data.conversation, ...state.conversations],
        currentConversation: data.conversation,
        messages: data.messages,
      }))

      return data.conversation
    } catch (error) {
      console.error('[SupportStore] Error creating conversation:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to create conversation' })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  setCurrentConversation: (conversation: SupportConversation | null) => {
    set({ currentConversation: conversation, messages: [] })
  },

  loadMessages: async (conversationId: string) => {
    const anonymousId = get().anonymousId || get().initAnonymousId()

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(
        `/api/support/conversations/${conversationId}?anonymous_id=${encodeURIComponent(anonymousId)}`
      )

      if (!response.ok) {
        throw new Error('Failed to load messages')
      }

      const data: GetConversationResponse = await response.json()

      set({
        currentConversation: data.conversation,
        messages: data.messages,
        unreadCount: data.unreadCount,
      })
    } catch (error) {
      console.error('[SupportStore] Error loading messages:', error)
      set({ error: 'Failed to load messages' })
    } finally {
      set({ isLoading: false })
    }
  },

  // ============================================================================
  // Messages
  // ============================================================================

  sendMessage: async (content?: string, imageUrl?: string) => {
    const { currentConversation, anonymousId, messages, isOpen } = get()

    if (!currentConversation) {
      set({ error: 'No conversation selected' })
      return
    }

    const anonId = anonymousId || get().initAnonymousId()

    // Create optimistic message
    const optimisticMessage: SupportMessage = {
      id: `temp_${Date.now()}`,
      conversation_id: currentConversation.id,
      sender_type: 'user',
      sender_name: currentConversation.contact_name,
      sender_telegram_id: null,
      content: content || null,
      image_url: imageUrl || null,
      telegram_message_id: null,
      is_read: true,
      read_at: null,
      created_at: new Date().toISOString(),
    }

    // Add optimistic message immediately
    set({
      messages: [...messages, optimisticMessage],
      isSending: true,
      error: null,
    })

    try {
      const response = await fetch(
        `/api/support/conversations/${currentConversation.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content || null,
            image_url: imageUrl || null,
            anonymous_id: anonId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data: SendMessageResponse = await response.json()

      // Replace optimistic message with real messages
      set((state) => ({
        messages: [
          ...state.messages.filter((m) => !m.id.startsWith('temp_')),
          ...data.messages,
        ],
        currentConversation: data.conversation,
      }))

      // Update conversation in list
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === data.conversation.id ? data.conversation : c
        ),
      }))
    } catch (error) {
      console.error('[SupportStore] Error sending message:', error)

      // Remove optimistic message on error
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== optimisticMessage.id),
        error: error instanceof Error ? error.message : 'Failed to send message',
      }))
    } finally {
      set({ isSending: false })
    }
  },

  uploadImage: async (file: File) => {
    const { currentConversation, anonymousId } = get()

    if (!currentConversation) {
      set({ error: 'No conversation selected' })
      return null
    }

    const anonId = anonymousId || get().initAnonymousId()

    set({ isUploading: true, error: null })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('conversation_id', currentConversation.id)
      formData.append('anonymous_id', anonId)

      const response = await fetch('/api/support/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data: UploadImageResponse = await response.json()
      return data.url
    } catch (error) {
      console.error('[SupportStore] Error uploading image:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to upload image' })
      return null
    } finally {
      set({ isUploading: false })
    }
  },

  // ============================================================================
  // Status Updates
  // ============================================================================

  updateStatus: async (status: SupportStatus) => {
    const { currentConversation, anonymousId } = get()

    if (!currentConversation) {
      set({ error: 'No conversation selected' })
      return
    }

    const anonId = anonymousId || get().initAnonymousId()

    try {
      const response = await fetch(
        `/api/support/conversations/${currentConversation.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            anonymous_id: anonId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update status')
      }

      const data: UpdateConversationResponse = await response.json()

      // Update current conversation
      set({ currentConversation: data.conversation })

      // Add status message if present
      if (data.message) {
        set((state) => ({
          messages: [...state.messages, data.message!],
        }))
      }

      // Update in conversations list
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === data.conversation.id ? data.conversation : c
        ),
      }))
    } catch (error) {
      console.error('[SupportStore] Error updating status:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to update status' })
    }
  },

  // ============================================================================
  // Realtime Subscription
  // ============================================================================

  subscribeToMessages: (conversationId: string) => {
    const channelName = `support-messages-${conversationId}`

    // Don't create duplicate subscriptions
    if (subscriptionState.channelName === channelName) {
      return subscriptionState.unsubscribe || (() => {})
    }

    // Cleanup previous subscription
    if (subscriptionState.unsubscribe) {
      subscriptionState.unsubscribe()
      subscriptionState.channelName = null
      subscriptionState.unsubscribe = null
    }

    const supabase = createClient()

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: RealtimePostgresInsertPayload<SupportMessage>) => {
          console.log('[SupportStore] Realtime message received:', payload)
          const newMessage = payload.new as SupportMessage

          // Skip user messages (handled by optimistic updates)
          if (newMessage.sender_type === 'user') {
            console.log('[SupportStore] Skipping user message')
            return
          }

          const { messages, isOpen } = get()

          // Check for duplicates
          if (messages.some((m) => m.id === newMessage.id)) {
            console.log('[SupportStore] Skipping duplicate message:', newMessage.id)
            return
          }

          console.log('[SupportStore] Adding new message to state:', newMessage.id)
          // Add message to state
          set((state) => ({
            messages: [...state.messages, newMessage],
            unreadCount: isOpen ? state.unreadCount : state.unreadCount + 1,
          }))
        }
      )
      .subscribe((status: string, err?: Error) => {
        console.log('[SupportStore] Subscription status:', status, 'channel:', channelName)
        if (err) {
          console.error('[SupportStore] Subscription error:', err)
        }
        if (status === 'SUBSCRIBED') {
          console.log('[SupportStore] Successfully subscribed to realtime for conversation:', conversationId)
        }
      })

    // Store subscription info
    const unsubscribe = () => {
      supabase.removeChannel(channel)
      subscriptionState.channelName = null
      subscriptionState.unsubscribe = null
    }

    subscriptionState.channelName = channelName
    subscriptionState.unsubscribe = unsubscribe

    return unsubscribe
  },

  // ============================================================================
  // Read Status
  // ============================================================================

  markAsRead: async (messageIds: string[]) => {
    const { currentConversation, anonymousId, messages } = get()

    if (!currentConversation) return

    // Get unread message IDs if not provided
    const idsToMark =
      messageIds.length > 0
        ? messageIds
        : messages
            .filter((m) => !m.is_read && m.sender_type !== 'user')
            .map((m) => m.id)

    if (idsToMark.length === 0) return

    // Update locally immediately
    set((state) => ({
      messages: state.messages.map((m) =>
        idsToMark.includes(m.id) ? { ...m, is_read: true } : m
      ),
      unreadCount: 0,
    }))

    // Note: In a production app, you might want to call an API to persist this
    // For now, we just update locally since the main indicator is the widget badge
  },

  // ============================================================================
  // Reset
  // ============================================================================

  reset: () => {
    // Cleanup subscription
    if (subscriptionState.unsubscribe) {
      subscriptionState.unsubscribe()
      subscriptionState.channelName = null
      subscriptionState.unsubscribe = null
    }

    set({
      isOpen: false,
      unreadCount: 0,
      conversations: [],
      currentConversation: null,
      messages: [],
      isLoading: false,
      isSending: false,
      isUploading: false,
      error: null,
    })
  },
}))
