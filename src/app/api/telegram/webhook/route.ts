import { NextRequest, NextResponse } from 'next/server'
import { SupportService } from '@/lib/services/support-service'
import { TelegramService } from '@/lib/services/telegram-service'
import type { TelegramUpdate } from '@/types/support'

/**
 * POST /api/telegram/webhook
 * Handle incoming Telegram updates (support replies)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secretToken = request.headers.get('x-telegram-bot-api-secret-token')
    if (!TelegramService.validateWebhookSecret(secretToken)) {
      console.warn('[Webhook] Invalid secret token')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const update: TelegramUpdate = await request.json()

    // Only process messages
    if (!update.message) {
      return NextResponse.json({ ok: true })
    }

    const message = update.message

    // Only process messages from admin chat
    if (!TelegramService.isFromAdminChat(message)) {
      console.log('[Webhook] Message not from admin chat, ignoring')
      return NextResponse.json({ ok: true })
    }

    // Extract reply info
    const replyInfo = TelegramService.extractReplyInfo(message)

    // Must be in a topic (forum thread)
    if (!replyInfo.topicId) {
      console.log('[Webhook] Message not in a topic, ignoring')
      return NextResponse.json({ ok: true })
    }

    // Ignore bot messages (including our own)
    if (message.from?.is_bot) {
      return NextResponse.json({ ok: true })
    }

    // Find conversation by topic ID
    const conversation = await SupportService.getConversationByTelegramTopicId(
      replyInfo.topicId
    )

    if (!conversation) {
      console.log('[Webhook] No conversation found for topic:', replyInfo.topicId)
      return NextResponse.json({ ok: true })
    }

    // Handle photo if present
    let imageUrl: string | null = null
    if (replyInfo.hasPhoto && replyInfo.photoFileId) {
      try {
        // Get file info from Telegram
        const fileInfo = await TelegramService.getFile(replyInfo.photoFileId)

        if (fileInfo.file_path) {
          // Download from Telegram
          const fileBuffer = await TelegramService.downloadFile(fileInfo.file_path)

          // Get file extension from path
          const extension = fileInfo.file_path.split('.').pop() || 'jpg'
          const filename = `telegram_${Date.now()}.${extension}`
          const contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`

          // Upload to our storage
          const uploadResult = await SupportService.uploadImage(
            conversation.id,
            fileBuffer,
            filename,
            contentType
          )

          imageUrl = uploadResult.url
        }
      } catch (photoError) {
        console.error('[Webhook] Error processing photo:', photoError)
        // Continue without photo
      }
    }

    // Skip if no content (text or image)
    if (!replyInfo.text && !imageUrl) {
      console.log('[Webhook] No content in message, ignoring')
      return NextResponse.json({ ok: true })
    }

    // Create support message in database
    await SupportService.createMessage({
      conversation_id: conversation.id,
      sender_type: 'support',
      sender_name: replyInfo.senderName || 'Support Agent',
      sender_telegram_id: replyInfo.senderId,
      content: replyInfo.text,
      image_url: imageUrl,
      telegram_message_id: message.message_id,
    })

    // Update conversation status to pending (waiting for user response)
    if (conversation.status === 'open') {
      await SupportService.updateConversation(conversation.id, {
        status: 'pending',
      })
    }

    console.log('[Webhook] Support reply saved for conversation:', conversation.id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Webhook] Error processing update:', error)
    // Always return 200 to Telegram to prevent retries
    return NextResponse.json({ ok: true })
  }
}

/**
 * GET /api/telegram/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Telegram webhook endpoint is active',
  })
}
