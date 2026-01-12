# Support Chat System - Complete Implementation Guide

A real-time support chat system with Telegram integration, AI bot responses, and human agent escalation.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Setup Guide](#setup-guide)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Telegram Integration](#telegram-integration)
8. [Real-time Updates](#real-time-updates)
9. [Frontend Implementation](#frontend-implementation)
10. [AI Bot Service](#ai-bot-service)
11. [Type Definitions](#type-definitions)
12. [Implementation Checklist](#implementation-checklist)
13. [Troubleshooting](#troubleshooting)

---

## Overview

The support chat system provides:
- **AI Bot Mode**: Automated responses using AI for common questions
- **Human Agent Mode**: Escalation to human support via Telegram forum topics
- **Real-time Updates**: Live message updates using Supabase Realtime
- **Anonymous Support**: Works for both authenticated and anonymous users
- **Image Support**: Users can send images, agents can reply with images
- **Ticket Management**: Full lifecycle tracking (open, pending, resolved, closed)

### System Flow

```
User Opens Chat Widget
        │
        ▼
┌───────────────────┐
│  New Ticket Form  │ ◄── Contact details collected
│  (Name + Email)   │
└────────┬──────────┘
         │
         │ User submits form
         ▼
┌───────────────────┐
│  AI Bot Mode      │ ◄── Default mode
│  (Automated)      │
└────────┬──────────┘
         │
         │ User types "talk to agent"
         │ (or similar trigger phrase)
         ▼
┌───────────────────┐
│  Human Agent Mode │
│  (Telegram)       │
└────────┬──────────┘
         │
         │ Creates Forum Topic in Telegram
         ▼
┌───────────────────┐     Webhook      ┌───────────────────┐
│  Message saved    │ ◄──────────────► │  Telegram Bot     │
│  to Database      │                  │  (Forum Group)    │
└────────┬──────────┘                  └───────────────────┘
         │
         │ Supabase Realtime
         ▼
┌───────────────────┐
│  UI Updates       │
│  Instantly        │
└───────────────────┘
```

---

## Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Zustand (state management) |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Real-time | Supabase Realtime (postgres_changes) |
| AI | xAI Grok (or OpenAI) via LangChain |
| Messaging | Telegram Bot API (Forum Topics) |
| Storage | Supabase Storage (images) |

### File Structure

```
├── app/
│   └── api/
│       ├── support/
│       │   ├── conversations/
│       │   │   ├── route.ts                    # GET: list, POST: create
│       │   │   └── [id]/
│       │   │       ├── route.ts                # GET: details, PATCH: update status
│       │   │       └── messages/
│       │   │           └── route.ts            # GET: list, POST: send
│       │   └── upload/
│       │       └── route.ts                    # POST: image upload
│       └── telegram/
│           └── webhook/
│               └── route.ts                    # POST: Telegram webhook handler
├── components/
│   └── support/
│       ├── support-widget.tsx                  # Floating widget button
│       ├── support-chat-container.tsx          # Main container (routing)
│       ├── support-chat-header.tsx             # Header with status/actions
│       ├── support-chat-messages.tsx           # Message list
│       ├── support-chat-input.tsx              # Input with image upload
│       ├── support-message-bubble.tsx          # Individual message
│       ├── support-contact-form.tsx            # Contact details form
│       └── support-quick-questions.tsx         # Quick question buttons
├── lib/
│   ├── services/
│   │   ├── telegram-service.ts                 # Telegram Bot API integration
│   │   └── support-ai-service.ts               # AI response generation
│   └── supabase/
│       └── services/
│           └── support-service.ts              # Database operations
├── store/
│   └── support-store.ts                        # Zustand state management
├── types/
│   └── support.ts                              # TypeScript type definitions
└── supabase/
    └── migrations/
        ├── 018_support_chat_system.sql         # Initial schema
        └── 019_support_anonymous_realtime.sql  # RLS for realtime
```

---

## Features

### 1. AI Bot Mode (Default)

When a user opens the chat, they interact with an AI bot that:
- Answers common questions about the product
- Provides helpful information based on a system prompt
- Detects when user wants human support via trigger phrases

**Trigger phrases for human escalation:**
```typescript
const AGENT_REQUEST_PHRASES = [
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
  // ... more phrases
]
```

### 2. Human Agent Mode (Telegram)

After escalation:
1. A forum topic is created in Telegram for the ticket
2. All messages are forwarded to that topic
3. Support team replies within the topic
4. Replies appear in real-time in the chat widget

### 3. Conversation States

| Status | Description |
|--------|-------------|
| `open` | Active conversation, user/bot interacting |
| `pending` | Waiting for user response after agent replied |
| `resolved` | Issue resolved (topic closed in Telegram) |
| `closed` | Conversation closed (topic closed in Telegram) |

### 4. Chat Modes

| Mode | Description |
|------|-------------|
| `ai_bot` | AI handles responses automatically |
| `human_agent` | Human support via Telegram |

### 5. Message Sender Types

| Type | Description |
|------|-------------|
| `user` | Message from the user |
| `bot` | Message from AI bot |
| `support` | Message from human support agent |
| `system` | System notification (status changes) |

### 6. Ticket Lifecycle

```
┌─────────┐    User creates    ┌─────────┐
│  NEW    │ ────────────────►  │  OPEN   │
└─────────┘                    └────┬────┘
                                    │
                    Agent replies   │
                         ▼          │
                   ┌─────────┐      │
                   │ PENDING │◄─────┘
                   └────┬────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
       ▼                ▼                ▼
┌───────────┐    ┌───────────┐    ┌───────────┐
│ RESOLVED  │    │  CLOSED   │    │   OPEN    │
│(by user)  │    │ (by user) │    │(new msg)  │
└───────────┘    └───────────┘    └───────────┘
```

### 7. Unread Notification Badge

- A red badge appears on the chat widget button when new messages arrive while closed
- Badge shows count (or "9+" for counts above 9)
- Count resets when widget is opened

---

## Setup Guide

### Prerequisites

1. **Supabase Project** with Realtime enabled
2. **Telegram Bot** created via @BotFather
3. **Telegram Forum Group** for support (topics enabled)
4. **Environment Variables** configured

### Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow instructions
3. Save the bot token (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Create Forum Group

1. Create a new Telegram group
2. Go to Group Settings → Topics → Enable Topics
3. Add your bot as an administrator with permissions:
   - Post messages
   - Manage topics
   - Delete messages (optional)

### Step 3: Get Your Chat ID

1. Add the bot to the forum group
2. Send any message in the group
3. Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Find your `chat.id` in the response (it will be negative for groups)

### Step 4: Environment Variables

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_ADMIN_CHAT_ID=-1001234567890  # Negative for groups
TELEGRAM_WEBHOOK_SECRET=random-32-character-string

# Site URL (for webhook)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# AI for support responses (optional, but recommended)
XAI_API_KEY=your-xai-api-key
```

### Step 5: Database Migration

Run these migrations in Supabase SQL Editor:

**Migration 1: Core Schema (018_support_chat_system.sql)**
```sql
-- See full migration in Database Schema section below
```

**Migration 2: Anonymous Realtime (019_support_anonymous_realtime.sql)**
```sql
-- See full migration in Database Schema section below
```

### Step 6: Create Storage Bucket

In Supabase Dashboard → Storage:
1. Create a new bucket named `support-images`
2. Make it public (for serving images)
3. Add policy to allow uploads from API

### Step 7: Register Telegram Webhook

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>"
```

### Step 8: Verify Setup

1. Check webhook status:
   ```
   https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

2. Test the endpoint:
   ```
   curl https://your-domain.com/api/telegram/webhook
   ```

---

## Database Schema

### Full Migration: 018_support_chat_system.sql

```sql
-- =============================================
-- SUPPORT CHAT SYSTEM MIGRATION
-- =============================================
-- Enables live chat support with Telegram integration
-- Features: AI bot responses, human agent escalation, image support

-- Support Conversations (Tickets)
CREATE TABLE IF NOT EXISTS public.support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User identification (nullable for anonymous users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Anonymous user identification (stored in localStorage)
  anonymous_id VARCHAR(100),

  -- Telegram integration
  telegram_message_id BIGINT,     -- ID of forwarded message (for reply threading)
  telegram_topic_id BIGINT,       -- Forum topic ID for this ticket

  -- Conversation state
  mode VARCHAR(20) DEFAULT 'ai_bot' CHECK (mode IN ('ai_bot', 'human_agent')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),

  -- Timestamps
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Messages
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,

  -- Sender information
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'support', 'system', 'bot')),
  sender_name VARCHAR(100),       -- Display name for support agents
  sender_telegram_id BIGINT,      -- Telegram user ID if from support

  -- Content
  content TEXT,                   -- Can be NULL if only image
  image_url TEXT,                 -- Supabase Storage URL for images

  -- Telegram tracking
  telegram_message_id BIGINT,     -- For reply matching

  -- Read status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_support_conversations_user_id
  ON public.support_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_support_conversations_anonymous_id
  ON public.support_conversations(anonymous_id);

CREATE INDEX IF NOT EXISTS idx_support_conversations_status
  ON public.support_conversations(status);

CREATE INDEX IF NOT EXISTS idx_support_conversations_last_message
  ON public.support_conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_messages_conversation_id
  ON public.support_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_support_messages_created_at
  ON public.support_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_support_messages_telegram_id
  ON public.support_messages(telegram_message_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Conversations: Users can view their own conversations
CREATE POLICY "Users can view own support conversations"
  ON public.support_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Conversations: Users can create conversations
CREATE POLICY "Users can create support conversations"
  ON public.support_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Conversations: Users can update their own conversations
CREATE POLICY "Users can update own support conversations"
  ON public.support_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view messages in own conversations"
  ON public.support_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.support_conversations
      WHERE user_id = auth.uid()
    )
  );

-- Messages: Users can create messages in their conversations
CREATE POLICY "Users can create messages in own conversations"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.support_conversations
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- =============================================
-- SERVICE ROLE POLICIES
-- =============================================

CREATE POLICY "Service role has full access to conversations"
  ON public.support_conversations FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to messages"
  ON public.support_messages FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- REALTIME
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at on conversation changes
CREATE OR REPLACE FUNCTION update_support_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_support_conversation_updated_at
  BEFORE UPDATE ON public.support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_support_conversation_updated_at();

-- Auto-update last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.support_conversations
  SET last_message_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message_at
  AFTER INSERT ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message_at();
```

### Migration 2: 019_support_anonymous_realtime.sql

```sql
-- =============================================
-- SUPPORT CHAT - ANONYMOUS USER REALTIME FIX
-- =============================================
-- Allows anonymous users to receive realtime updates

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own support conversations" ON public.support_conversations;
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.support_messages;

-- Conversations: Allow SELECT for authenticated OR anonymous
CREATE POLICY "Users can view support conversations"
  ON public.support_conversations FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    user_id IS NULL  -- Anonymous conversations - API handles verification
  );

-- Messages: Allow SELECT for messages in accessible conversations
CREATE POLICY "Users can view support messages"
  ON public.support_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.support_conversations
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- Enable replica identity for realtime filtering
ALTER TABLE public.support_messages REPLICA IDENTITY FULL;
```

### Storage Bucket Policy

```sql
-- Allow authenticated users and service role to upload
CREATE POLICY "Allow uploads to support-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'support-images');

-- Allow public read access
CREATE POLICY "Allow public read access to support-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support-images');
```

---

## API Reference

### Conversations

#### `GET /api/support/conversations`

List user's conversations.

**Query params:**
- `anonymous_id` - For anonymous users

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "user_id": "uuid | null",
      "anonymous_id": "string | null",
      "telegram_topic_id": 123,
      "mode": "ai_bot | human_agent",
      "status": "open | pending | resolved | closed",
      "last_message_at": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/support/conversations`

Create new conversation.

**Body:**
```json
{
  "anonymous_id": "anon_123..."  // Optional, for anonymous users
}
```

**Response:**
```json
{
  "conversation": { /* conversation object */ },
  "messages": [ /* welcome message from bot */ ]
}
```

#### `GET /api/support/conversations/[id]`

Get conversation details with messages.

**Query params:**
- `anonymous_id` - For anonymous users

**Response:**
```json
{
  "conversation": { /* conversation object */ },
  "messages": [ /* array of messages */ ]
}
```

#### `PATCH /api/support/conversations/[id]`

Update conversation status.

**Body:**
```json
{
  "status": "resolved | closed | open",
  "anonymous_id": "anon_123..."
}
```

### Messages

#### `GET /api/support/conversations/[id]/messages`

Get messages for conversation.

**Query params:**
- `anonymous_id` - For anonymous users

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_type": "user | bot | support | system",
      "sender_name": "string | null",
      "content": "string | null",
      "image_url": "string | null",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/support/conversations/[id]/messages`

Send a message.

**Body:**
```json
{
  "content": "Hello!",
  "image_url": "https://...",  // Optional
  "anonymous_id": "anon_123..."
}
```

**Behavior:**
1. Creates user message
2. If in `ai_bot` mode:
   - Checks for agent request phrases
   - If found: switches to `human_agent`, creates topic, forwards to Telegram
   - If not: generates AI response
3. If in `human_agent` mode:
   - Forwards message to Telegram topic

### Image Upload

#### `POST /api/support/upload`

Upload image to Supabase Storage.

**Body:** `multipart/form-data`
- `file` - Image file (max 10MB)
- `conversation_id` - Conversation ID
- `anonymous_id` - For anonymous users (optional)

**Response:**
```json
{
  "url": "https://supabase.co/.../image.jpg",
  "path": "conversation_id/timestamp-filename.jpg"
}
```

### Telegram Webhook

#### `POST /api/telegram/webhook`

Handles incoming Telegram updates.

**Headers:**
- `x-telegram-bot-api-secret-token` - Must match `TELEGRAM_WEBHOOK_SECRET`

**Processing:**
1. Validates secret token
2. Checks message is from admin chat
3. Finds conversation by topic ID or reply_to_message
4. Saves support reply to database
5. Handles photo attachments (downloads, re-uploads to Supabase)

---

## Telegram Integration

### Message Flow: User → Telegram

1. User sends message in chat widget
2. API saves message to database
3. If in `human_agent` mode:
   - `TelegramService.forwardToSupport()` is called
   - Creates forum topic if not exists
   - Message sent to topic
   - Topic ID saved to conversation

### Message Flow: Telegram → User

1. Support replies in Telegram topic
2. Telegram sends webhook to `/api/telegram/webhook`
3. Webhook verifies secret token
4. `TelegramService.handleSupportReply()` processes reply
5. Message saved with `sender_type: 'support'`
6. Supabase Realtime notifies client
7. UI updates instantly

### Forum Topic Management

Each support ticket gets its own forum topic:

```typescript
// Create topic for new ticket
const topicResult = await createForumTopic(ADMIN_CHAT_ID, topicName)

// Topic name format
const topicName = `🎫 #${ticketId} - ${userName}`  // Max 128 chars

// Store topic ID
await SupportService.updateConversation(conversation.id, {
  telegram_topic_id: topicId,
})
```

### Topic Colors

```typescript
const TOPIC_COLORS = {
  BLUE: 7322096,    // 0x6FB9F0
  YELLOW: 16766590, // 0xFFD67E
  PURPLE: 13338331, // 0xCB86DB
  GREEN: 9367192,   // 0x8EEE98
  PINK: 16749490,   // 0xFF93B2
  RED: 16478047,    // 0xFB6F5F
}
```

### Status Changes → Topic Management

```typescript
// When status changes to closed/resolved
if (newStatus === 'closed' || newStatus === 'resolved') {
  await closeForumTopic(ADMIN_CHAT_ID, conversation.telegram_topic_id)
}

// When status changes back to open
if (newStatus === 'open') {
  await reopenForumTopic(ADMIN_CHAT_ID, conversation.telegram_topic_id)
}
```

### Telegram Service API

```typescript
export const TelegramService = {
  // Core methods
  sendMessage,           // Send text message
  sendPhoto,             // Send photo
  getFile,               // Get file info
  downloadFile,          // Download file as Buffer

  // Forum topic methods
  createForumTopic,      // Create topic for ticket
  closeForumTopic,       // Close topic when resolved
  reopenForumTopic,      // Reopen topic

  // Support integration
  formatInitialSupportMessage,   // Format first message with history
  formatUserMessage,             // Format subsequent messages
  forwardToSupport,              // Forward user message to Telegram
  forwardImageToSupport,         // Forward image to Telegram
  handleSupportReply,            // Handle Telegram reply → database
  notifyStatusChange,            // Notify about status changes
}
```

---

## Real-time Updates

### Supabase Realtime Configuration

**Requirements:**
1. Table added to publication
2. Replica identity set to FULL
3. RLS policies allow SELECT

```sql
-- Add to publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;

-- Set replica identity (required for filtered subscriptions)
ALTER TABLE public.support_messages REPLICA IDENTITY FULL;
```

### Client Subscription

```typescript
const supabase = createClient()

const channel = supabase
  .channel(`support_messages:${conversationId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'support_messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      const newMessage = payload.new as SupportMessage

      // Skip user messages (handled by optimistic updates)
      if (newMessage.sender_type === 'user') return

      // Add to state if not exists
      // Handle read status based on widget state
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status)
  })

// Cleanup
const unsubscribe = () => supabase.removeChannel(channel)
```

### Subscription Management

```typescript
// Prevent duplicate subscriptions
let activeSubscription: { conversationId: string; unsubscribe: () => void } | null = null

function subscribeToMessages(conversationId: string) {
  // Skip if already subscribed
  if (activeSubscription?.conversationId === conversationId) {
    return activeSubscription.unsubscribe
  }

  // Cleanup previous subscription
  if (activeSubscription) {
    activeSubscription.unsubscribe()
    activeSubscription = null
  }

  // Create new subscription...
}
```

---

## Frontend Implementation

### Zustand Store Structure

```typescript
interface SupportState {
  // UI State
  isOpen: boolean
  unreadCount: number

  // Data
  conversations: SupportConversation[]
  currentConversation: SupportConversation | null
  messages: SupportMessage[]

  // Loading states
  isLoading: boolean
  isSending: boolean
  isUploading: boolean
  error: string | null

  // Actions
  openWidget: () => void
  closeWidget: () => void
  loadConversations: () => Promise<void>
  createConversation: () => Promise<SupportConversation | null>
  setCurrentConversation: (conv: SupportConversation | null) => void
  loadMessages: (conversationId: string) => Promise<void>
  sendMessage: (content?: string, imageUrl?: string) => Promise<void>
  uploadImage: (file: File) => Promise<string | null>
  updateStatus: (status: SupportStatus) => Promise<void>
  subscribeToMessages: (conversationId: string) => () => void
  markAsRead: (messageIds: string[]) => Promise<void>
  reset: () => void
}
```

### Anonymous User Identification

```typescript
function getAnonymousId(): string {
  const storageKey = 'support_anonymous_id'
  let anonymousId = localStorage.getItem(storageKey)

  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(storageKey, anonymousId)
  }

  return anonymousId
}
```

### Optimistic Updates

```typescript
async sendMessage(content?: string, imageUrl?: string) {
  // Create optimistic message
  const optimisticMessage: SupportMessage = {
    id: `temp_${Date.now()}`,
    conversation_id: currentConversation.id,
    sender_type: 'user',
    content: content || null,
    image_url: imageUrl || null,
    is_read: true,
    created_at: new Date().toISOString(),
    // ...
  }

  // Add immediately
  set({ messages: [...messages, optimisticMessage], isSending: true })

  try {
    const response = await fetch(...)

    // Replace with real messages
    set((state) => {
      const filtered = state.messages.filter(m => !m.id.startsWith('temp_'))
      return { messages: [...filtered, ...serverMessages] }
    })
  } catch {
    // Remove optimistic message on error
    set((state) => ({
      messages: state.messages.filter(m => m.id !== optimisticMessage.id),
      error: 'Failed to send'
    }))
  }
}
```

### Component Hierarchy

```
<SupportWidget>                    // Floating button + container
├── <FloatingMenuButton>           // Menu with Chat/Theme/Home buttons
└── <SupportChatContainer>         // Main container
    ├── <SupportChatHeader>        // Header with status, actions, close
    ├── <SupportContactForm>       // Name/email form (new ticket)
    ├── <SupportQuickQuestions>    // Quick question buttons
    ├── <TicketList>               // List of user's tickets
    ├── <SupportChatMessages>      // Message list
    │   └── <SupportMessageBubble> // Individual message
    └── <SupportChatInput>         // Input with image upload
```

### Image Upload Flow

```typescript
// 1. User selects file
const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate type and size
  if (!file.type.startsWith('image/')) return alert('Invalid type')
  if (file.size > 10 * 1024 * 1024) return alert('Too large')

  // Show preview
  setImageFile(file)
  setPreviewImage(URL.createObjectURL(file))
}

// 2. Upload on send
const handleSubmit = async () => {
  let imageUrl: string | undefined

  if (imageFile) {
    imageUrl = await uploadImage(imageFile) || undefined
  }

  await sendMessage(input.trim() || undefined, imageUrl)

  // Clear state
  setInput('')
  setPreviewImage(null)
  setImageFile(null)
}
```

---

## AI Bot Service

### Configuration

```typescript
const SUPPORT_MODEL = 'grok-3-mini'  // Or 'gpt-4o-mini'
const MAX_TOKENS = 500
const TEMPERATURE = 0.7
```

### System Prompt Structure

```typescript
const SUPPORT_SYSTEM_PROMPT = `You are [App]'s friendly AI support assistant.

=== ABOUT [APP] ===
Brief description of your product/service.

=== FEATURES & PRICING ===
List key features and pricing tiers.

=== COMMON QUESTIONS ===
FAQ items with answers.

=== YOUR GUIDELINES ===
1. Be helpful, friendly, and concise
2. Answer questions using the info above
3. You can ONLY provide information - you CANNOT perform actions
4. For complex issues, suggest "talk to agent"
5. NEVER make up information about user accounts
6. If user seems frustrated, offer human support

Remember: You're first line of support. Be helpful but know your limits.`
```

### Agent Request Detection

```typescript
function isAgentRequest(content: string): boolean {
  const normalizedContent = content.toLowerCase().trim()
  return AGENT_REQUEST_PHRASES.some(phrase =>
    normalizedContent.includes(phrase)
  )
}
```

### Response Generation

```typescript
async function generateResponse(
  conversation: SupportConversation,
  messages: SupportMessage[],
  userMessage: string
): Promise<string> {
  const model = new ChatXAI({
    model: SUPPORT_MODEL,
    temperature: TEMPERATURE,
    maxTokens: MAX_TOKENS,
    apiKey: process.env.XAI_API_KEY,
  })

  const langchainMessages = [
    new SystemMessage(SUPPORT_SYSTEM_PROMPT),
    ...buildMessageHistory(messages),  // Last 10 messages
    new HumanMessage(userMessage),
  ]

  const response = await model.invoke(langchainMessages)
  return response.content as string
}
```

### Predefined Messages

```typescript
// Welcome message for new conversations
function getWelcomeMessage(): string {
  return "Hi there! I'm [App]'s support assistant. How can I help you today?"
}

// Handoff message when switching to human agent
function getHandoffMessage(): string {
  return "You're now connected to our support team! A team member will respond shortly."
}

// Status update messages
function getStatusUpdateMessage(status: string): string {
  switch (status) {
    case 'resolved':
      return "This ticket has been marked as resolved."
    case 'closed':
      return "This ticket has been closed. Thank you!"
    // ...
  }
}
```

---

## Type Definitions

### Full types/support.ts

```typescript
// ============================================================================
// Enums / Union Types
// ============================================================================

export type SupportStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type SupportMode = 'ai_bot' | 'human_agent'
export type SupportSenderType = 'user' | 'support' | 'system' | 'bot'

// ============================================================================
// Database Types
// ============================================================================

export interface SupportConversation {
  id: string
  user_id: string | null
  anonymous_id: string | null
  telegram_message_id: number | null
  telegram_topic_id: number | null
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
  user_id?: string | null
  anonymous_id?: string | null
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
  message_thread_id?: number  // Forum topic ID
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
  isOpen: boolean
  conversations: SupportConversation[]
  currentConversation: SupportConversation | null
  messages: SupportMessage[]
  isLoading: boolean
  isSending: boolean
  isUploading: boolean
  error: string | null
  unreadCount: number

  openWidget: () => void
  closeWidget: () => void
  loadConversations: () => Promise<void>
  createConversation: () => Promise<SupportConversation | null>
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
// Utility Functions
// ============================================================================

export function formatSupportMessage(msg: SupportMessage): FormattedSupportMessage {
  return {
    id: msg.id,
    content: msg.content,
    imageUrl: msg.image_url,
    senderType: msg.sender_type,
    senderName: msg.sender_name || defaultName(msg.sender_type),
    isUser: msg.sender_type === 'user',
    isBot: msg.sender_type === 'bot',
    isSupport: msg.sender_type === 'support',
    isSystem: msg.sender_type === 'system',
    timestamp: new Date(msg.created_at),
    isRead: msg.is_read,
  }
}

export function getStatusInfo(status: SupportStatus): { label: string; color: string } {
  const statusMap = {
    open: { label: 'Open', color: 'bg-blue-500' },
    pending: { label: 'Pending', color: 'bg-yellow-500' },
    resolved: { label: 'Resolved', color: 'bg-green-500' },
    closed: { label: 'Closed', color: 'bg-gray-500' },
  }
  return statusMap[status] || statusMap.open
}
```

---

## Implementation Checklist

### Database Setup

- [ ] Create `support_conversations` table
- [ ] Create `support_messages` table
- [ ] Add indexes for performance
- [ ] Enable Row Level Security (RLS)
- [ ] Add RLS policies for users and service role
- [ ] Enable Realtime for `support_messages`
- [ ] Set `REPLICA IDENTITY FULL` for realtime filtering
- [ ] Create `support-images` storage bucket

### Backend

- [ ] Create conversation API routes (`/api/support/conversations`)
- [ ] Create message API routes (`/api/support/conversations/[id]/messages`)
- [ ] Create image upload route (`/api/support/upload`)
- [ ] Create Telegram webhook endpoint (`/api/telegram/webhook`)
- [ ] Implement `SupportService` (database operations)
- [ ] Implement `TelegramService` (Telegram API integration)
- [ ] Implement `SupportAIService` (AI responses)

### Frontend

- [ ] Create Zustand store (`support-store.ts`)
- [ ] Create widget container component
- [ ] Create chat header with status/actions
- [ ] Create message list with auto-scroll
- [ ] Create input with image upload support
- [ ] Create message bubble component
- [ ] Create contact form for new tickets
- [ ] Create quick questions component
- [ ] Implement realtime subscription
- [ ] Implement optimistic updates
- [ ] Implement unread badge

### Telegram Setup

- [ ] Create bot via @BotFather
- [ ] Create forum group with topics enabled
- [ ] Add bot to group as admin
- [ ] Get group chat ID
- [ ] Register webhook URL
- [ ] Verify webhook is active

### Environment Variables

- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `TELEGRAM_ADMIN_CHAT_ID`
- [ ] `TELEGRAM_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `XAI_API_KEY` (or `OPENAI_API_KEY`)

---

## Troubleshooting

### Webhook Returns 401 Unauthorized

**Cause:** Secret token mismatch between Telegram and your app.

**Fix:**
1. Check `TELEGRAM_WEBHOOK_SECRET` in environment variables
2. Re-register webhook:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<URL>&secret_token=<SECRET>"
   ```

### Messages Not Appearing in Real-time

**Cause:** RLS policies blocking realtime or replica identity not set.

**Fix:**
1. Check RLS policies allow SELECT
2. Verify replica identity:
   ```sql
   ALTER TABLE public.support_messages REPLICA IDENTITY FULL;
   ```
3. Check browser console for subscription status:
   ```
   Subscription status: SUBSCRIBED
   ```

### Telegram Not Receiving Messages

**Cause:** Missing env vars, webhook not registered, or wrong chat ID.

**Fix:**
1. Verify environment variables are set
2. Check webhook info:
   ```
   https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```
3. Verify `TELEGRAM_ADMIN_CHAT_ID` is correct (negative for groups)

### Forum Topics Not Creating

**Cause:** Bot doesn't have topic management permissions.

**Fix:**
1. Make bot an admin in the group
2. Grant "Manage Topics" permission
3. Verify group has topics enabled

### Conversation Not Found Error

**Cause:** RLS blocking server-side queries.

**Fix:** Ensure service functions use service role client:
```typescript
const supabase = client || getServiceRoleClient()
```

### Images Not Uploading

**Cause:** Storage bucket not configured or policies missing.

**Fix:**
1. Create `support-images` bucket in Supabase
2. Make bucket public or add appropriate policies
3. Use service role client for uploads

### Anonymous Users Can't Subscribe to Realtime

**Cause:** RLS policies too restrictive.

**Fix:** Apply migration `019_support_anonymous_realtime.sql` that allows:
- Anonymous conversations (`user_id IS NULL`)
- API-level verification of `anonymous_id`

---

## Security Considerations

1. **Webhook Verification:** Always verify `x-telegram-bot-api-secret-token` header
2. **RLS Policies:** Ensure users can only access their own conversations
3. **Anonymous ID:** Store in localStorage, validate server-side
4. **Admin Chat ID:** Verify messages come from authorized admin chat
5. **Service Role:** Use service role client only on server-side
6. **Image Validation:** Validate file type and size before upload
7. **Rate Limiting:** Consider adding rate limits on API routes
8. **Content Sanitization:** Sanitize message content to prevent XSS

---

## Additional Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Forum Topics](https://core.telegram.org/bots/api#forum)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [LangChain JS](https://js.langchain.com/)
- [Zustand](https://github.com/pmndrs/zustand)
