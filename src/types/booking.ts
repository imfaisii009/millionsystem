// ============================================================================
// Booking System - Type Definitions
// ============================================================================

// ============================================================================
// Enums / Union Types
// ============================================================================

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'rescheduled'

// ============================================================================
// Database Types
// ============================================================================

export interface Booking {
  id: string
  cal_booking_uid: string | null
  attendee_name: string
  attendee_email: string
  company: string | null
  project_type: string | null
  scheduled_at: string
  duration_minutes: number
  meeting_url: string | null
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// Cal.com API Types
// ============================================================================

export interface CalTimeSlot {
  time: string // ISO string
}

export interface CalAvailabilityResponse {
  busy: Array<{ start: string; end: string }>
  timeZone: string
  dateRanges: Array<{ start: string; end: string }>
  slots: Record<string, CalTimeSlot[]>
}

export interface CalBookingResponse {
  id: number
  uid: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  status: string
  meetingUrl: string | null
  attendees: Array<{
    email: string
    name: string
    timeZone: string
  }>
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface CalWebhookPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED'
  createdAt: string
  payload: {
    uid: string
    title: string
    startTime: string
    endTime: string
    status: string
    meetingUrl?: string
    attendees: Array<{
      email: string
      name: string
      timeZone: string
    }>
    metadata?: {
      company?: string
      projectType?: string
      notes?: string
    }
  }
}

// ============================================================================
// Form / Input Types
// ============================================================================

export interface BookingFormData {
  name: string
  email: string
  company?: string
  projectType?: string
  notes?: string
}

export interface CreateBookingInput {
  startTime: string
  name: string
  email: string
  company?: string
  projectType?: string
  notes?: string
  timeZone: string
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface GetAvailabilityRequest {
  date: string // YYYY-MM-DD format
  timeZone?: string
}

export interface GetAvailabilityResponse {
  slots: string[] // Array of ISO time strings
  date: string
  timeZone: string
}

export interface CreateBookingRequest {
  startTime: string
  name: string
  email: string
  company?: string
  projectType?: string
  notes?: string
  timeZone: string
}

export interface CreateBookingResponse {
  success: boolean
  booking: {
    uid: string
    title: string
    startTime: string
    endTime: string
    meetingUrl: string | null
  }
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface CalendarPickerProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  availableDates?: Date[]
  minDate?: Date
  maxDate?: Date
  isLoading?: boolean
}

export interface TimeSlotPickerProps {
  slots: string[]
  selectedSlot: string | null
  onSlotSelect: (slot: string) => void
  isLoading?: boolean
  timeZone: string
}

export interface BookingFormProps {
  selectedDateTime: string | null
  onSubmit: (data: BookingFormData) => void
  onBack: () => void
  isSubmitting?: boolean
}

// ============================================================================
// Store Types
// ============================================================================

export interface BookingState {
  // UI State
  step: 'calendar' | 'time' | 'form' | 'confirmation'

  // Selected values
  selectedDate: Date | null
  selectedSlot: string | null

  // Data
  availableSlots: string[]
  confirmedBooking: CreateBookingResponse['booking'] | null

  // Loading States
  isLoadingSlots: boolean
  isSubmitting: boolean
  error: string | null

  // Actions
  setStep: (step: BookingState['step']) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedSlot: (slot: string | null) => void
  loadAvailableSlots: (date: string) => Promise<void>
  createBooking: (data: CreateBookingInput) => Promise<boolean>
  reset: () => void
}

// ============================================================================
// Constants
// ============================================================================

export const PROJECT_TYPES = [
  'AI & Automation',
  'Website Development',
  'Software Development',
  'Mobile App Development',
  'Game Development',
  'AR/VR Development',
  'Backend & Cloud Services',
  'E-commerce Solutions',
  'Digital Marketing & SEO',
] as const

export const BOOKING_DURATION_MINUTES = 30
