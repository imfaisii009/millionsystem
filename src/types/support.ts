// ============================================================================
// Support Chat System - Type Definitions
// ============================================================================

// ============================================================================
// Enums / Union Types
// ============================================================================

export type SupportStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type SupportMode = 'ai_bot' | 'human_agent'
export type SupportSenderType = 'user' | 'bot' | 'support' | 'system'

// ============================================================================
// Database Types
// ============================================================================

export interface SupportConversation {
  id: string
  anonymous_id: string
  contact_name: string
  contact_email: string
  telegram_topic_id: number | null
  telegram_message_id: number | null
  mode: SupportMode
  status: SupportStatus
  last_message_at: string
  created_at: string
  updated_at: string
}

export interface SupportMessage {
  id: string
  conversation_id: string
  sender_type: SupportSenderType
  sender_name: string | null
  sender_telegram_id: number | null
  content: string | null
  image_url: string | null
  telegram_message_id: number | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

// ============================================================================
// Input Types
// ============================================================================

export interface CreateConversationInput {
  anonymous_id: string
  contact_name: string
  contact_email: string
}

export interface UpdateConversationInput {
  status?: SupportStatus
  mode?: SupportMode
  telegram_message_id?: number
  telegram_topic_id?: number
}

export interface CreateMessageInput {
  conversation_id: string
  sender_type: SupportSenderType
  sender_name?: string | null
  sender_telegram_id?: number | null
  content?: string | null
  image_url?: string | null
  telegram_message_id?: number | null
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateConversationRequest {
  anonymous_id: string
  contact_name: string
  contact_email: string
}

export interface CreateConversationResponse {
  conversation: SupportConversation
  messages: SupportMessage[]
}

export interface GetConversationsResponse {
  conversations: SupportConversation[]
}

export interface GetConversationResponse {
  conversation: SupportConversation
  messages: SupportMessage[]
  unreadCount: number
}

export interface SendMessageRequest {
  content?: string
  image_url?: string
  anonymous_id: string
}

export interface SendMessageResponse {
  messages: SupportMessage[]
  conversation: SupportConversation
}

export interface UpdateConversationRequest {
  status: SupportStatus
  anonymous_id: string
}

export interface UpdateConversationResponse {
  conversation: SupportConversation
  message?: SupportMessage
}

export interface UploadImageResponse {
  url: string
  path: string
}

// ============================================================================
// Telegram Types
// ============================================================================

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
}

export interface TelegramPhotoSize {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  file_size?: number
}

export interface TelegramMessage {
  message_id: number
  message_thread_id?: number
  from?: TelegramUser
  chat: {
    id: number
    type: string
    is_forum?: boolean
  }
  date: number
  text?: string
  photo?: TelegramPhotoSize[]
  caption?: string
  reply_to_message?: TelegramMessage
}

export interface TelegramForumTopic {
  message_thread_id: number
  name: string
  icon_color: number
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

export interface TelegramFile {
  file_id: string
  file_unique_id: string
  file_size?: number
  file_path?: string
}

// ============================================================================
// Store Types
// ============================================================================

export interface SupportState {
  // UI State
  isOpen: boolean
  unreadCount: number

  // Anonymous ID (from localStorage)
  anonymousId: string | null

  // Data
  conversations: SupportConversation[]
  currentConversation: SupportConversation | null
  messages: SupportMessage[]

  // Loading States
  isLoading: boolean
  isSending: boolean
  isUploading: boolean
  error: string | null

  // Actions
  initAnonymousId: () => string
  openWidget: () => void
  closeWidget: () => void
  loadConversations: () => Promise<void>
  createConversation: (name: string, email: string) => Promise<SupportConversation | null>
  setCurrentConversation: (conversation: SupportConversation | null) => void
  loadMessages: (conversationId: string) => Promise<void>
  sendMessage: (content?: string, imageUrl?: string) => Promise<void>
  uploadImage: (file: File) => Promise<string | null>
  updateStatus: (status: SupportStatus) => Promise<void>
  subscribeToMessages: (conversationId: string) => () => void
  markAsRead: (messageIds: string[]) => Promise<void>
  reset: () => void
}

// ============================================================================
// Utility Types
// ============================================================================

export interface FormattedSupportMessage {
  id: string
  content: string | null
  imageUrl: string | null
  senderType: SupportSenderType
  senderName: string
  isUser: boolean
  isBot: boolean
  isSupport: boolean
  isSystem: boolean
  timestamp: Date
  isRead: boolean
}

// ============================================================================
// Utility Functions
// ============================================================================

function getDefaultSenderName(senderType: SupportSenderType): string {
  switch (senderType) {
    case 'user':
      return 'You'
    case 'bot':
      return 'Support Bot'
    case 'support':
      return 'Support Agent'
    case 'system':
      return 'System'
    default:
      return 'Unknown'
  }
}

export function formatSupportMessage(msg: SupportMessage): FormattedSupportMessage {
  return {
    id: msg.id,
    content: msg.content,
    imageUrl: msg.image_url,
    senderType: msg.sender_type,
    senderName: msg.sender_name || getDefaultSenderName(msg.sender_type),
    isUser: msg.sender_type === 'user',
    isBot: msg.sender_type === 'bot',
    isSupport: msg.sender_type === 'support',
    isSystem: msg.sender_type === 'system',
    timestamp: new Date(msg.created_at),
    isRead: msg.is_read,
  }
}

export function getStatusInfo(status: SupportStatus): { label: string; color: string; bgColor: string } {
  const statusMap: Record<SupportStatus, { label: string; color: string; bgColor: string }> = {
    open: { label: 'Open', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    pending: { label: 'Pending', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    resolved: { label: 'Resolved', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    closed: { label: 'Closed', color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
  }
  return statusMap[status] || statusMap.open
}

export function getModeInfo(mode: SupportMode): { label: string; color: string } {
  const modeMap: Record<SupportMode, { label: string; color: string }> = {
    ai_bot: { label: 'AI Bot', color: 'text-purple-500' },
    human_agent: { label: 'Human Agent', color: 'text-green-500' },
  }
  return modeMap[mode] || modeMap.ai_bot
}

// ============================================================================
// Constants
// ============================================================================

export const SUPPORT_ANONYMOUS_ID_KEY = 'support_anonymous_id'

export const AGENT_REQUEST_PHRASES = [
  'talk to agent',
  'talk to a human',
  'human agent',
  'real person',
  'speak to someone',
  'transfer to agent',
  'live agent',
  'live support',
  'customer service',
  'support agent',
  'representative',
  'speak to agent',
  'connect me to agent',
  'i want to talk to a person',
  'can i speak to a human',
  'need human help',
  'agent please',
  'human please',
]
