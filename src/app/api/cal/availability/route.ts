import { NextRequest, NextResponse } from 'next/server'
import { getAvailabilitySchema } from '@/schemas/booking.schema'
import { getAvailability } from '@/lib/services/cal-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const timeZone = searchParams.get('timeZone') || Intl.DateTimeFormat().resolvedOptions().timeZone

    // Validate query params
    const validation = getAvailabilitySchema.safeParse({ date, timeZone })
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { date: validDate, timeZone: validTimeZone } = validation.data

    // Fetch availability from Cal.com
    const availability = await getAvailability(validDate, validTimeZone)

    return NextResponse.json(availability, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      }
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
