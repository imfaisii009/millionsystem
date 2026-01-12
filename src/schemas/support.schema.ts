import { z } from 'zod'

// ============================================================================
// Enums
// ============================================================================

export const supportStatusSchema = z.enum(['open', 'pending', 'resolved', 'closed'])
export const supportModeSchema = z.enum(['ai_bot', 'human_agent'])
export const supportSenderTypeSchema = z.enum(['user', 'bot', 'support', 'system'])

// ============================================================================
// Contact Form Schema
// ============================================================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// ============================================================================
// Create Conversation Schema
// ============================================================================

export const createConversationSchema = z.object({
  anonymous_id: z
    .string()
    .min(1, 'Anonymous ID is required')
    .max(100, 'Anonymous ID must be less than 100 characters'),
  contact_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  contact_email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
})

export type CreateConversationData = z.infer<typeof createConversationSchema>

// ============================================================================
// Send Message Schema
// ============================================================================

export const sendMessageSchema = z
  .object({
    content: z
      .string()
      .max(5000, 'Message must be less than 5000 characters')
      .optional()
      .nullable(),
    image_url: z
      .string()
      .url('Invalid image URL')
      .optional()
      .nullable(),
    anonymous_id: z
      .string()
      .min(1, 'Anonymous ID is required'),
  })
  .refine(
    (data) => data.content || data.image_url,
    { message: 'Either content or image is required' }
  )

export type SendMessageData = z.infer<typeof sendMessageSchema>

// ============================================================================
// Update Conversation Schema
// ============================================================================

export const updateConversationSchema = z.object({
  status: supportStatusSchema,
  anonymous_id: z.string().min(1, 'Anonymous ID is required'),
})

export type UpdateConversationData = z.infer<typeof updateConversationSchema>

// ============================================================================
// Upload Image Schema
// ============================================================================

export const uploadImageSchema = z.object({
  conversation_id: z.string().uuid('Invalid conversation ID'),
  anonymous_id: z.string().min(1, 'Anonymous ID is required'),
})

export type UploadImageData = z.infer<typeof uploadImageSchema>

// ============================================================================
// Query Params Schemas
// ============================================================================

export const getConversationsQuerySchema = z.object({
  anonymous_id: z.string().min(1, 'Anonymous ID is required'),
  status: supportStatusSchema.optional(),
})

export type GetConversationsQuery = z.infer<typeof getConversationsQuerySchema>

export const getMessagesQuerySchema = z.object({
  anonymous_id: z.string().min(1, 'Anonymous ID is required'),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  before: z.string().uuid().optional(),
})

export type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>
