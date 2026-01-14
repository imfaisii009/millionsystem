import { NextRequest, NextResponse } from 'next/server'
import { createBookingSchema } from '@/schemas/booking.schema'
import { createBooking } from '@/lib/services/cal-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createBookingSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { startTime, name, email, company, projectType, notes, timeZone } = validation.data

    // Create booking via Cal.com
    const booking = await createBooking({
      startTime,
      name,
      email,
      company,
      projectType,
      notes,
      timeZone,
    })

    return NextResponse.json({
      success: true,
      booking: {
        uid: booking.uid,
        title: booking.title,
        startTime: booking.startTime,
        endTime: booking.endTime,
        meetingUrl: booking.meetingUrl,
      },
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    )
  }
}
