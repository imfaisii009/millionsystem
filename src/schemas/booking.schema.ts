import { z } from 'zod'

// ============================================================================
// Enums
// ============================================================================

export const bookingStatusSchema = z.enum(['confirmed', 'cancelled', 'completed', 'rescheduled'])

// ============================================================================
// Booking Form Schema
// ============================================================================

export const bookingFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  projectType: z
    .string()
    .max(100, 'Project type must be less than 100 characters')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

// ============================================================================
// Create Booking Schema (API)
// ============================================================================

export const createBookingSchema = z.object({
  startTime: z
    .string()
    .min(1, 'Start time is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  projectType: z
    .string()
    .max(100, 'Project type must be less than 100 characters')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  timeZone: z
    .string()
    .min(1, 'Timezone is required'),
})

export type CreateBookingData = z.infer<typeof createBookingSchema>

// ============================================================================
// Get Availability Schema (Query Params)
// ============================================================================

export const getAvailabilitySchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  timeZone: z
    .string()
    .optional()
    .default('UTC'),
})

export type GetAvailabilityQuery = z.infer<typeof getAvailabilitySchema>

// ============================================================================
// Webhook Payload Schema
// ============================================================================

export const calWebhookSchema = z.object({
  triggerEvent: z.enum(['BOOKING_CREATED', 'BOOKING_CANCELLED', 'BOOKING_RESCHEDULED']),
  createdAt: z.string(),
  payload: z.object({
    uid: z.string(),
    title: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.string(),
    meetingUrl: z.string().nullable().optional(),
    attendees: z.array(z.object({
      email: z.string(),
      name: z.string(),
      timeZone: z.string(),
    })),
    metadata: z.object({
      company: z.string().optional(),
      projectType: z.string().optional(),
      notes: z.string().optional(),
    }).optional(),
  }),
})

export type CalWebhookData = z.infer<typeof calWebhookSchema>
