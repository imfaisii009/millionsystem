import type {
  CalAvailabilityResponse,
  CalBookingResponse,
  CreateBookingInput,
  GetAvailabilityResponse,
} from '@/types/booking'

// ============================================================================
// Cal.com API Service
// ============================================================================

const CAL_API_URL = 'https://api.cal.com/v1'

// Additional recipients who should receive booking notifications
const ADDITIONAL_GUESTS = ['ruigostadefrango@gmail.com']

/**
 * Get API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.CAL_API_KEY
  if (!apiKey) {
    throw new Error('CAL_API_KEY environment variable is not set')
  }
  return apiKey
}

/**
 * Get event type ID from environment
 */
function getEventTypeId(): string {
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID
  if (!eventTypeId) {
    throw new Error('CAL_EVENT_TYPE_ID environment variable is not set')
  }
  return eventTypeId
}

/**
 * Get available time slots for a specific date
 */
export async function getAvailability(
  date: string,
  timeZone: string = 'UTC'
): Promise<GetAvailabilityResponse> {
  const apiKey = getApiKey()
  const eventTypeId = getEventTypeId()

  // Cal.com API expects date range
  const startTime = `${date}T00:00:00.000Z`
  const endTime = `${date}T23:59:59.999Z`

  const url = new URL(`${CAL_API_URL}/slots`)
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('eventTypeId', eventTypeId)
  url.searchParams.set('startTime', startTime)
  url.searchParams.set('endTime', endTime)
  url.searchParams.set('timeZone', timeZone)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Cache for 1 minute
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Cal.com availability error:', error)
    throw new Error(`Failed to fetch availability: ${response.status}`)
  }

  const data: CalAvailabilityResponse = await response.json()

  // Extract slots for the requested date
  const slots = data.slots[date] || []

  return {
    slots: slots.map((slot) => slot.time),
    date,
    timeZone,
  }
}

/**
 * Create a booking via Cal.com API
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CalBookingResponse> {
  const apiKey = getApiKey()
  const eventTypeId = getEventTypeId()

  const url = new URL(`${CAL_API_URL}/bookings`)
  url.searchParams.set('apiKey', apiKey)

  const body = {
    eventTypeId: parseInt(eventTypeId, 10),
    start: input.startTime,
    responses: {
      name: input.name,
      email: input.email,
      notes: input.notes || '',
      guests: ADDITIONAL_GUESTS, // Additional recipients for meeting notifications
    },
    metadata: {
      company: input.company || '',
      projectType: input.projectType || '',
      notes: input.notes || '',
    },
    timeZone: input.timeZone,
    language: 'en',
  }

  console.log('Cal.com booking request body:', JSON.stringify(body, null, 2))

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Cal.com booking error response:', error)
    console.error('Cal.com booking error status:', response.status)
    throw new Error(`Failed to create booking: ${response.status} - ${error}`)
  }

  const data: CalBookingResponse = await response.json()
  return data
}

/**
 * Cancel a booking via Cal.com API
 */
export async function cancelBooking(bookingUid: string): Promise<void> {
  const apiKey = getApiKey()

  const url = new URL(`${CAL_API_URL}/bookings/${bookingUid}/cancel`)
  url.searchParams.set('apiKey', apiKey)

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Cal.com cancel error:', error)
    throw new Error(`Failed to cancel booking: ${response.status}`)
  }
}

/**
 * Verify webhook signature from Cal.com
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret) {
    console.warn('CAL_WEBHOOK_SECRET not set, skipping verification')
    return true
  }

  // Cal.com uses HMAC-SHA256 for webhook signatures
  // For now, we'll do basic verification
  // In production, implement proper HMAC verification
  return signature.length > 0
}
