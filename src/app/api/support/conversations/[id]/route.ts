import { NextRequest, NextResponse } from 'next/server'
import { SupportService } from '@/lib/services/support-service'
import { SupportAIService } from '@/lib/services/support-ai-service'
import { TelegramService } from '@/lib/services/telegram-service'
import { updateConversationSchema } from '@/schemas/support.schema'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/support/conversations/[id]
 * Get conversation details with messages
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const anonymousId = searchParams.get('anonymous_id')

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'anonymous_id is required' },
        { status: 400 }
      )
    }

    // Get conversation
    const conversation = await SupportService.getConversation(id)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (conversation.anonymous_id !== anonymousId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get messages
    const messages = await SupportService.getMessages(id)

    // Get unread count
    const unreadCount = await SupportService.getUnreadCount(id)

    return NextResponse.json({
      conversation,
      messages,
      unreadCount,
    })
  } catch (error) {
    console.error('[API] Error getting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/support/conversations/[id]
 * Update conversation status
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validation = updateConversationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { status, anonymous_id } = validation.data

    // Get current conversation
    const conversation = await SupportService.getConversation(id)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (conversation.anonymous_id !== anonymous_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Skip if status is the same
    if (conversation.status === status) {
      return NextResponse.json({ conversation })
    }

    // Update status
    const updatedConversation = await SupportService.updateConversation(id, {
      status,
    })

    // Create system message about status change
    const statusMessage = await SupportService.createMessage({
      conversation_id: id,
      sender_type: 'system',
      content: SupportAIService.getStatusUpdateMessage(status, true),
    })

    // Notify Telegram about status change (non-blocking)
    TelegramService.notifyStatusChange(updatedConversation, status).catch(
      (error) => console.error('[API] Error notifying Telegram:', error)
    )

    return NextResponse.json({
      conversation: updatedConversation,
      message: statusMessage,
    })
  } catch (error) {
    console.error('[API] Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}
