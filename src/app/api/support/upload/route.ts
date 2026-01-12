import { NextRequest, NextResponse } from 'next/server'
import { SupportService } from '@/lib/services/support-service'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

/**
 * POST /api/support/upload
 * Upload an image to storage
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const file = formData.get('file') as File | null
    const conversationId = formData.get('conversation_id') as string | null
    const anonymousId = formData.get('anonymous_id') as string | null

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      )
    }

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'anonymous_id is required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Verify conversation ownership
    const isOwner = await SupportService.verifyConversationOwnership(
      conversationId,
      anonymousId
    )

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to storage
    const result = await SupportService.uploadImage(
      conversationId,
      buffer,
      file.name,
      file.type
    )

    return NextResponse.json({
      url: result.url,
      path: result.path,
    })
  } catch (error) {
    console.error('[API] Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
