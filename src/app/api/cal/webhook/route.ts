import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calWebhookSchema } from '@/schemas/booking.schema'
import { verifyWebhookSignature } from '@/lib/services/cal-service'

// Create Supabase client with service role for webhook operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables not set')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-cal-signature-256') || ''

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse and validate payload
    const body = JSON.parse(rawBody)
    const validation = calWebhookSchema.safeParse(body)

    if (!validation.success) {
      console.error('Webhook validation error:', validation.error.issues)
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    const { triggerEvent, payload } = validation.data
    const supabase = getSupabaseAdmin()

    // Get first attendee (the person who booked)
    const attendee = payload.attendees[0]
    if (!attendee) {
      return NextResponse.json(
        { error: 'No attendee found in payload' },
        { status: 400 }
      )
    }

    // Calculate duration in minutes
    const startTime = new Date(payload.startTime)
    const endTime = new Date(payload.endTime)
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000)

    switch (triggerEvent) {
      case 'BOOKING_CREATED': {
        // Insert new booking record
        const { error } = await supabase.from('bookings').insert({
          cal_booking_uid: payload.uid,
          attendee_name: attendee.name,
          attendee_email: attendee.email,
          company: payload.metadata?.company || null,
          project_type: payload.metadata?.projectType || null,
          scheduled_at: payload.startTime,
          duration_minutes: durationMinutes,
          meeting_url: payload.meetingUrl || null,
          status: 'confirmed',
          notes: payload.metadata?.notes || null,
        })

        if (error) {
          console.error('Error inserting booking:', error)
          throw error
        }

        console.log(`Booking created: ${payload.uid}`)
        break
      }

      case 'BOOKING_CANCELLED': {
        // Update booking status to cancelled
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('cal_booking_uid', payload.uid)

        if (error) {
          console.error('Error cancelling booking:', error)
          throw error
        }

        console.log(`Booking cancelled: ${payload.uid}`)
        break
      }

      case 'BOOKING_RESCHEDULED': {
        // Update booking with new time
        const { error } = await supabase
          .from('bookings')
          .update({
            scheduled_at: payload.startTime,
            duration_minutes: durationMinutes,
            status: 'rescheduled',
          })
          .eq('cal_booking_uid', payload.uid)

        if (error) {
          console.error('Error rescheduling booking:', error)
          throw error
        }

        console.log(`Booking rescheduled: ${payload.uid}`)
        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
