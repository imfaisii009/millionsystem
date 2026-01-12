import { NextRequest, NextResponse } from 'next/server'
import { SupportService } from '@/lib/services/support-service'
import { SupportAIService } from '@/lib/services/support-ai-service'
import { TelegramService } from '@/lib/services/telegram-service'
import { sendMessageSchema, getMessagesQuerySchema } from '@/schemas/support.schema'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/support/conversations/[id]/messages
 * Get messages for a conversation
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams

    const anonymousId = searchParams.get('anonymous_id')
    const limit = searchParams.get('limit')
    const before = searchParams.get('before')

    // Validate query params
    const validation = getMessagesQuerySchema.safeParse({
      anonymous_id: anonymousId,
      limit: limit ? parseInt(limit, 10) : undefined,
      before: before || undefined,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    // Verify ownership
    const isOwner = await SupportService.verifyConversationOwnership(
      id,
      validation.data.anonymous_id
    )

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get messages
    const messages = await SupportService.getMessages(id, {
      limit: validation.data.limit,
      before: validation.data.before,
    })

    // Check if there are more messages
    const hasMore = messages.length === validation.data.limit

    return NextResponse.json({ messages, hasMore })
  } catch (error) {
    console.error('[API] Error getting messages:', error)
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/support/conversations/[id]/messages
 * Send a message
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validation = sendMessageSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { content, image_url, anonymous_id } = validation.data

    // Get conversation and verify ownership
    const conversation = await SupportService.getConversation(id)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (conversation.anonymous_id !== anonymous_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Create user message
    const userMessage = await SupportService.createMessage({
      conversation_id: id,
      sender_type: 'user',
      sender_name: conversation.contact_name,
      content: content || null,
      image_url: image_url || null,
    })

    const newMessages = [userMessage]
    let updatedConversation = conversation

    // Handle based on current mode
    if (conversation.mode === 'ai_bot') {
      // Check if user wants to talk to agent
      if (content && SupportAIService.isAgentRequest(content)) {
        // Switch to human agent mode
        updatedConversation = await SupportService.updateConversation(id, {
          mode: 'human_agent',
        })

        // Get all previous messages for context
        const previousMessages = await SupportService.getMessages(id)

        // Create handoff message
        const handoffMessage = await SupportService.createMessage({
          conversation_id: id,
          sender_type: 'system',
          content: SupportAIService.getHandoffMessage(),
        })
        newMessages.push(handoffMessage)

        // Forward to Telegram (create topic + send history)
        try {
          const telegramResult = await TelegramService.forwardToSupport(
            updatedConversation,
            previousMessages,
            userMessage
          )

          // Update conversation with Telegram topic ID
          updatedConversation = await SupportService.updateConversation(id, {
            telegram_topic_id: telegramResult.topicId,
          })
        } catch (telegramError) {
          console.error('[API] Error forwarding to Telegram:', telegramError)
          // Continue even if Telegram fails - message is saved
        }
      } else {
        // Generate AI response
        const previousMessages = await SupportService.getMessages(id)
        const aiResponse = await SupportAIService.generateResponse(
          conversation,
          previousMessages,
          content || ''
        )

        const botMessage = await SupportService.createMessage({
          conversation_id: id,
          sender_type: 'bot',
          sender_name: 'Support Bot',
          content: aiResponse,
        })
        newMessages.push(botMessage)
      }
    } else if (conversation.mode === 'human_agent') {
      // Forward message to Telegram
      if (conversation.telegram_topic_id) {
        try {
          await TelegramService.forwardToSupport(
            conversation,
            [], // No need for history, topic already exists
            userMessage
          )
        } catch (telegramError) {
          console.error('[API] Error forwarding to Telegram:', telegramError)
          // Continue even if Telegram fails - message is saved
        }
      }

      // Update status to open if it was pending
      if (conversation.status === 'pending') {
        updatedConversation = await SupportService.updateConversation(id, {
          status: 'open',
        })
      }
    }

    return NextResponse.json({
      messages: newMessages,
      conversation: updatedConversation,
    })
  } catch (error) {
    console.error('[API] Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
