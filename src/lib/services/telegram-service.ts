import type {
  SupportConversation,
  SupportMessage,
  TelegramMessage,
  TelegramForumTopic,
  TelegramFile,
} from '@/types/support'

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot'

/**
 * Telegram Bot API Service
 * Handles all communication with Telegram for support chat
 */
export const TelegramService = {
  // ============================================================================
  // Configuration
  // ============================================================================

  getConfig() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET

    if (!token) {
      throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable')
    }

    return { token, adminChatId, webhookSecret }
  },

  // ============================================================================
  // Core API Methods
  // ============================================================================

  /**
   * Make a request to the Telegram Bot API
   */
  async apiRequest<T>(method: string, params?: Record<string, unknown>): Promise<T> {
    const { token } = this.getConfig()
    const url = `${TELEGRAM_API_BASE}${token}/${method}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params ? JSON.stringify(params) : undefined,
    })

    const data = await response.json()

    if (!data.ok) {
      console.error(`[TelegramService] API error for ${method}:`, data)
      throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`)
    }

    return data.result as T
  },

  /**
   * Send a text message
   */
  async sendMessage(
    chatId: number | string,
    text: string,
    options?: {
      messageThreadId?: number
      parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
      replyToMessageId?: number
    }
  ): Promise<TelegramMessage> {
    return this.apiRequest<TelegramMessage>('sendMessage', {
      chat_id: chatId,
      text,
      message_thread_id: options?.messageThreadId,
      parse_mode: options?.parseMode,
      reply_to_message_id: options?.replyToMessageId,
    })
  },

  /**
   * Send a photo
   */
  async sendPhoto(
    chatId: number | string,
    photo: string, // URL or file_id
    options?: {
      messageThreadId?: number
      caption?: string
    }
  ): Promise<TelegramMessage> {
    return this.apiRequest<TelegramMessage>('sendPhoto', {
      chat_id: chatId,
      photo,
      message_thread_id: options?.messageThreadId,
      caption: options?.caption,
    })
  },

  /**
   * Get file info from Telegram
   */
  async getFile(fileId: string): Promise<TelegramFile> {
    return this.apiRequest<TelegramFile>('getFile', { file_id: fileId })
  },

  /**
   * Download a file from Telegram servers
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    const { token } = this.getConfig()
    const url = `https://api.telegram.org/file/bot${token}/${filePath}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  },

  // ============================================================================
  // Forum Topic Methods
  // ============================================================================

  /**
   * Topic icon colors (Telegram only allows these specific values)
   */
  TOPIC_COLORS: {
    BLUE: 7322096,
    YELLOW: 16766590,
    PURPLE: 13338331,
    GREEN: 9367192,
    PINK: 16749490,
    RED: 16478047,
  } as const,

  /**
   * Create a forum topic for a support ticket
   */
  async createForumTopic(
    chatId: number | string,
    name: string,
    iconColor?: number
  ): Promise<TelegramForumTopic> {
    // Truncate name if too long (Telegram limit is 128 chars)
    const truncatedName = name.length > 128 ? name.substring(0, 125) + '...' : name

    return this.apiRequest<TelegramForumTopic>('createForumTopic', {
      chat_id: chatId,
      name: truncatedName,
      icon_color: iconColor || this.TOPIC_COLORS.BLUE,
    })
  },

  /**
   * Close a forum topic
   */
  async closeForumTopic(chatId: number | string, topicId: number): Promise<boolean> {
    return this.apiRequest<boolean>('closeForumTopic', {
      chat_id: chatId,
      message_thread_id: topicId,
    })
  },

  /**
   * Reopen a forum topic
   */
  async reopenForumTopic(chatId: number | string, topicId: number): Promise<boolean> {
    return this.apiRequest<boolean>('reopenForumTopic', {
      chat_id: chatId,
      message_thread_id: topicId,
    })
  },

  // ============================================================================
  // Support Integration Methods
  // ============================================================================

  /**
   * Format the initial support message with conversation history
   */
  formatInitialSupportMessage(
    conversation: SupportConversation,
    messages: SupportMessage[]
  ): string {
    const header = [
      `New Support Ticket`,
      ``,
      `Name: ${conversation.contact_name}`,
      `Email: ${conversation.contact_email}`,
      `Ticket ID: ${conversation.id.substring(0, 8)}`,
      `Created: ${new Date(conversation.created_at).toLocaleString()}`,
      ``,
      `--- Conversation History ---`,
      ``,
    ].join('\n')

    const history = messages
      .map((msg) => {
        const sender = msg.sender_type === 'user'
          ? conversation.contact_name
          : msg.sender_type === 'bot'
          ? 'AI Bot'
          : msg.sender_name || 'Support'
        const time = new Date(msg.created_at).toLocaleTimeString()
        const content = msg.content || '[Image]'
        return `[${time}] ${sender}: ${content}`
      })
      .join('\n')

    return header + history
  },

  /**
   * Format a user message for Telegram
   */
  formatUserMessage(
    conversation: SupportConversation,
    content?: string | null,
    hasImage?: boolean
  ): string {
    const name = conversation.contact_name
    const text = content || (hasImage ? '[Image attached]' : '[No content]')
    return `${name}: ${text}`
  },

  /**
   * Forward a user message to the Telegram support group
   */
  async forwardToSupport(
    conversation: SupportConversation,
    messages: SupportMessage[],
    newMessage: SupportMessage
  ): Promise<{ topicId: number; messageId: number }> {
    const { adminChatId } = this.getConfig()

    if (!adminChatId) {
      throw new Error('TELEGRAM_ADMIN_CHAT_ID not configured')
    }

    let topicId = conversation.telegram_topic_id

    // Create topic if it doesn't exist
    if (!topicId) {
      const topicName = `#${conversation.id.substring(0, 8)} - ${conversation.contact_name}`
      const topic = await this.createForumTopic(adminChatId, topicName, this.TOPIC_COLORS.BLUE)
      topicId = topic.message_thread_id

      // Send initial message with history
      const initialMessage = this.formatInitialSupportMessage(conversation, messages)
      await this.sendMessage(adminChatId, initialMessage, {
        messageThreadId: topicId,
      })
    }

    // Send the new message
    let sentMessage: TelegramMessage

    if (newMessage.image_url) {
      sentMessage = await this.sendPhoto(adminChatId, newMessage.image_url, {
        messageThreadId: topicId,
        caption: newMessage.content
          ? `${conversation.contact_name}: ${newMessage.content}`
          : `${conversation.contact_name}: [Image]`,
      })
    } else {
      const text = this.formatUserMessage(conversation, newMessage.content)
      sentMessage = await this.sendMessage(adminChatId, text, {
        messageThreadId: topicId,
      })
    }

    return {
      topicId,
      messageId: sentMessage.message_id,
    }
  },

  /**
   * Forward an image to Telegram support
   */
  async forwardImageToSupport(
    conversation: SupportConversation,
    imageUrl: string,
    caption?: string
  ): Promise<{ messageId: number }> {
    const { adminChatId } = this.getConfig()

    if (!adminChatId || !conversation.telegram_topic_id) {
      throw new Error('Telegram not configured for this conversation')
    }

    const sentMessage = await this.sendPhoto(adminChatId, imageUrl, {
      messageThreadId: conversation.telegram_topic_id,
      caption: caption
        ? `${conversation.contact_name}: ${caption}`
        : `${conversation.contact_name}: [Image]`,
    })

    return { messageId: sentMessage.message_id }
  },

  /**
   * Notify about status change
   */
  async notifyStatusChange(
    conversation: SupportConversation,
    newStatus: string
  ): Promise<void> {
    const { adminChatId } = this.getConfig()

    if (!adminChatId || !conversation.telegram_topic_id) {
      return // Silently skip if not configured
    }

    try {
      const statusEmoji = {
        open: 'Open',
        pending: 'Pending',
        resolved: 'Resolved',
        closed: 'Closed',
      }[newStatus] || newStatus

      await this.sendMessage(
        adminChatId,
        `Ticket status changed to: ${statusEmoji}`,
        { messageThreadId: conversation.telegram_topic_id }
      )

      // Close/reopen topic based on status
      if (newStatus === 'resolved' || newStatus === 'closed') {
        await this.closeForumTopic(adminChatId, conversation.telegram_topic_id)
      } else if (newStatus === 'open') {
        await this.reopenForumTopic(adminChatId, conversation.telegram_topic_id)
      }
    } catch (error) {
      console.error('[TelegramService] Error notifying status change:', error)
      // Don't throw - this is a non-critical operation
    }
  },

  // ============================================================================
  // Webhook Handling
  // ============================================================================

  /**
   * Validate webhook secret token
   */
  validateWebhookSecret(headerSecret: string | null): boolean {
    const { webhookSecret } = this.getConfig()
    return webhookSecret ? headerSecret === webhookSecret : true
  },

  /**
   * Check if message is from the admin chat
   */
  isFromAdminChat(message: TelegramMessage): boolean {
    const { adminChatId } = this.getConfig()
    return adminChatId ? message.chat.id.toString() === adminChatId : false
  },

  /**
   * Extract support reply info from a Telegram message
   */
  extractReplyInfo(message: TelegramMessage): {
    topicId: number | null
    senderId: number | null
    senderName: string | null
    text: string | null
    hasPhoto: boolean
    photoFileId: string | null
  } {
    return {
      topicId: message.message_thread_id || null,
      senderId: message.from?.id || null,
      senderName: message.from
        ? [message.from.first_name, message.from.last_name].filter(Boolean).join(' ')
        : null,
      text: message.text || message.caption || null,
      hasPhoto: !!message.photo?.length,
      photoFileId: message.photo?.length
        ? message.photo[message.photo.length - 1].file_id // Get largest photo
        : null,
    }
  },
}
