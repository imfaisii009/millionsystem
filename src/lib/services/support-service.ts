import { getAdminClient } from '@/lib/supabase/admin'
import type {
  SupportConversation,
  SupportMessage,
  CreateConversationInput,
  UpdateConversationInput,
  CreateMessageInput,
  SupportStatus,
} from '@/types/support'

/**
 * Support Service - Database operations for the support chat system
 * Uses the admin client to bypass RLS since all users are anonymous
 */
export const SupportService = {
  // ============================================================================
  // Conversations
  // ============================================================================

  /**
   * Create a new support conversation
   */
  async createConversation(input: CreateConversationInput): Promise<SupportConversation> {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('support_conversations')
      .insert({
        anonymous_id: input.anonymous_id,
        contact_name: input.contact_name,
        contact_email: input.contact_email,
        mode: 'ai_bot',
        status: 'open',
      } as Record<string, unknown>)
      .select()
      .single()

    if (error) {
      console.error('[SupportService] Error creating conversation:', error)
      throw new Error(`Failed to create conversation: ${error.message}`)
    }

    return data as SupportConversation
  },

  /**
   * Get a conversation by ID
   */
  async getConversation(id: string): Promise<SupportConversation | null> {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('[SupportService] Error getting conversation:', error)
      throw new Error(`Failed to get conversation: ${error.message}`)
    }

    return data as SupportConversation
  },

  /**
   * Get conversations for an anonymous user
   */
  async getConversationsByAnonymousId(
    anonymousId: string,
    status?: SupportStatus
  ): Promise<SupportConversation[]> {
    const supabase = getAdminClient()

    let query = supabase
      .from('support_conversations')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .order('last_message_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('[SupportService] Error getting conversations:', error)
      throw new Error(`Failed to get conversations: ${error.message}`)
    }

    return (data || []) as SupportConversation[]
  },

  /**
   * Update a conversation
   */
  async updateConversation(
    id: string,
    input: UpdateConversationInput
  ): Promise<SupportConversation> {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('support_conversations')
      .update(input as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[SupportService] Error updating conversation:', error)
      throw new Error(`Failed to update conversation: ${error.message}`)
    }

    return data as SupportConversation
  },

  /**
   * Verify that a conversation belongs to an anonymous user
   */
  async verifyConversationOwnership(
    conversationId: string,
    anonymousId: string
  ): Promise<boolean> {
    const conversation = await this.getConversation(conversationId)
    return conversation?.anonymous_id === anonymousId
  },

  // ============================================================================
  // Messages
  // ============================================================================

  /**
   * Create a new message
   */
  async createMessage(input: CreateMessageInput): Promise<SupportMessage> {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: input.conversation_id,
        sender_type: input.sender_type,
        sender_name: input.sender_name || null,
        sender_telegram_id: input.sender_telegram_id || null,
        content: input.content || null,
        image_url: input.image_url || null,
        telegram_message_id: input.telegram_message_id || null,
        is_read: input.sender_type === 'user', // User messages are auto-read
      } as Record<string, unknown>)
      .select()
      .single()

    if (error) {
      console.error('[SupportService] Error creating message:', error)
      throw new Error(`Failed to create message: ${error.message}`)
    }

    return data as SupportMessage
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    options?: { limit?: number; before?: string }
  ): Promise<SupportMessage[]> {
    const supabase = getAdminClient()
    const limit = options?.limit || 50

    let query = supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (options?.before) {
      // Get the timestamp of the cursor message
      const { data: cursorMsg } = await supabase
        .from('support_messages')
        .select('created_at')
        .eq('id', options.before)
        .single()

      if (cursorMsg && typeof cursorMsg === 'object' && 'created_at' in cursorMsg) {
        query = query.lt('created_at', cursorMsg.created_at as string)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('[SupportService] Error getting messages:', error)
      throw new Error(`Failed to get messages: ${error.message}`)
    }

    return (data || []) as SupportMessage[]
  },

  /**
   * Get unread message count for a conversation
   */
  async getUnreadCount(conversationId: string): Promise<number> {
    const supabase = getAdminClient()

    const { count, error } = await supabase
      .from('support_messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .eq('is_read', false)
      .neq('sender_type', 'user') // Don't count user's own messages

    if (error) {
      console.error('[SupportService] Error getting unread count:', error)
      return 0
    }

    return count || 0
  },

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    if (messageIds.length === 0) return

    const supabase = getAdminClient()

    const { error } = await supabase
      .from('support_messages')
      .update({ is_read: true, read_at: new Date().toISOString() } as Record<string, unknown>)
      .in('id', messageIds)

    if (error) {
      console.error('[SupportService] Error marking messages as read:', error)
      throw new Error(`Failed to mark messages as read: ${error.message}`)
    }
  },

  /**
   * Mark all messages in a conversation as read (for non-user messages)
   */
  async markAllMessagesAsRead(conversationId: string): Promise<void> {
    const supabase = getAdminClient()

    const { error } = await supabase
      .from('support_messages')
      .update({ is_read: true, read_at: new Date().toISOString() } as Record<string, unknown>)
      .eq('conversation_id', conversationId)
      .eq('is_read', false)
      .neq('sender_type', 'user')

    if (error) {
      console.error('[SupportService] Error marking all messages as read:', error)
      throw new Error(`Failed to mark messages as read: ${error.message}`)
    }
  },

  /**
   * Find conversation by Telegram topic ID
   */
  async getConversationByTelegramTopicId(
    topicId: number
  ): Promise<SupportConversation | null> {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('telegram_topic_id', topicId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('[SupportService] Error finding conversation by topic:', error)
      throw new Error(`Failed to find conversation: ${error.message}`)
    }

    return data as SupportConversation
  },

  // ============================================================================
  // Storage
  // ============================================================================

  /**
   * Upload an image to storage
   */
  async uploadImage(
    conversationId: string,
    file: Buffer,
    filename: string,
    contentType: string
  ): Promise<{ url: string; path: string }> {
    const supabase = getAdminClient()

    const timestamp = Date.now()
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const path = `${conversationId}/${timestamp}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('support-images')
      .upload(path, file, {
        contentType,
        upsert: false,
      })

    if (uploadError) {
      console.error('[SupportService] Error uploading image:', uploadError)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage
      .from('support-images')
      .getPublicUrl(path)

    return {
      url: urlData.publicUrl,
      path,
    }
  },

  /**
   * Delete an image from storage
   */
  async deleteImage(path: string): Promise<void> {
    const supabase = getAdminClient()

    const { error } = await supabase.storage
      .from('support-images')
      .remove([path])

    if (error) {
      console.error('[SupportService] Error deleting image:', error)
      throw new Error(`Failed to delete image: ${error.message}`)
    }
  },
}
