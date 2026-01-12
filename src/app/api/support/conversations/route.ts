import { NextRequest, NextResponse } from 'next/server'
import { SupportService } from '@/lib/services/support-service'
import { SupportAIService } from '@/lib/services/support-ai-service'
import { createConversationSchema, getConversationsQuerySchema } from '@/schemas/support.schema'

/**
 * GET /api/support/conversations
 * List conversations for an anonymous user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const anonymousId = searchParams.get('anonymous_id')
    const status = searchParams.get('status')

    // Validate query params
    const validation = getConversationsQuerySchema.safeParse({
      anonymous_id: anonymousId,
      status: status || undefined,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    const conversations = await SupportService.getConversationsByAnonymousId(
      validation.data.anonymous_id,
      validation.data.status
    )

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('[API] Error getting conversations:', error)
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/support/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createConversationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { anonymous_id, contact_name, contact_email } = validation.data

    // Create the conversation
    const conversation = await SupportService.createConversation({
      anonymous_id,
      contact_name,
      contact_email,
    })

    // Create welcome message from bot
    const welcomeContent = SupportAIService.getWelcomeMessage(contact_name)
    const welcomeMessage = await SupportService.createMessage({
      conversation_id: conversation.id,
      sender_type: 'bot',
      sender_name: 'Support Bot',
      content: welcomeContent,
    })

    return NextResponse.json(
      {
        conversation,
        messages: [welcomeMessage],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
