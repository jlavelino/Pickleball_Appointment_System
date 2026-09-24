import { defineEventHandler, readBody, createError } from 'h3'
import { useServerSupabase } from '../../utils/supabase'

interface ResumeCheckoutBody {
  bookingRef?: string
  bookingId?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secretKey = config.paymongoSecretKey

  if (!secretKey || secretKey.includes('your-secret-key')) {
    throw createError({
      statusCode: 500,
      statusMessage: 'PAYMONGO_SECRET_KEY is not configured on the server.',
    })
  }

  const body = await readBody<ResumeCheckoutBody>(event)
  const cleanRef = body?.bookingRef?.trim()
  const cleanId = body?.bookingId?.trim()

  if (!cleanRef && !cleanId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bookingRef or bookingId is required to resume checkout.',
    })
  }

  const supabase = useServerSupabase()

  let query = supabase
    .from('bookings')
    .select(`
      id,
      reference,
      status,
      created_at,
      total_amount,
      booking_guests(full_name, mobile),
      payments(id, transaction_reference, payment_status, created_at)
    `)

  if (cleanRef) {
    query = query.eq('reference', cleanRef)
  } else if (cleanId) {
    query = query.eq('id', cleanId)
  }

  const { data: booking, error: bErr } = await query.maybeSingle()

  if (bErr || !booking) {
    throw createError({
      statusCode: 404,
      statusMessage: `Booking ${cleanRef || cleanId} not found.`,
    })
  }

  // If already paid and confirmed, inform client
  if (booking.status === 'confirmed') {
    return {
      success: true,
      alreadyPaid: true,
      bookingId: booking.id,
      bookingRef: booking.reference,
    }
  }

  // 10-minute hold window check
  const HOLD_TIMEOUT_MS = 10 * 60 * 1000
  const createdAtMs = booking.created_at ? new Date(booking.created_at).getTime() : 0
  const isExpired = Date.now() - createdAtMs > HOLD_TIMEOUT_MS

  if (isExpired) {
    // Mark as cancelled in Supabase if not already marked
    if (booking.status !== 'cancelled') {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', booking.id)
    }
    return {
      success: false,
      expired: true,
      message: 'This 10-minute reservation hold has expired. The court slot has been released for other players.',
      bookingRef: booking.reference,
    }
  }

  const expiresAtMs = createdAtMs + HOLD_TIMEOUT_MS
  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`

  // Check if an existing PayMongo session exists in payments
  const paymentsList = (booking.payments as any[]) || []
  const validPayment = paymentsList
    .filter((p) => p.transaction_reference && String(p.transaction_reference).startsWith('cs_'))
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())[0]

  if (validPayment?.transaction_reference) {
    try {
      const pmRes: any = await $fetch(`https://api.paymongo.com/v1/checkout_sessions/${validPayment.transaction_reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      })

      const session = pmRes?.data
      const attrs = session?.attributes
      if (session && attrs && attrs.status !== 'expired' && attrs.status !== 'cancelled') {
        return {
          success: true,
          checkoutUrl: attrs.checkout_url || `https://checkout.paymongo.com/${session.id}`,
          sessionId: session.id,
          bookingId: booking.id,
          bookingRef: booking.reference,
          totalAmount: booking.total_amount,
          expiresAt: expiresAtMs,
        }
      }
    } catch (fetchErr) {
      console.warn('[resume-checkout] Could not fetch existing PayMongo session, recreating...', fetchErr)
    }
  }

  // If no existing valid session, create a fresh one for this active booking hold
  let siteUrl = config.public.siteUrl
  if (!siteUrl) {
    const host = getRequestHeader(event, 'host') || 'localhost:3000'
    const proto = getRequestHeader(event, 'x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
    siteUrl = `${proto}://${host}`
  }
  siteUrl = siteUrl.replace(/\/$/, '')

  const guests = (booking.booking_guests as any[]) || []
  const firstGuest = guests[0] || {}
  const amountInCentavos = Math.round(Number(booking.total_amount || 0) * 100)

  const payload = {
    data: {
      attributes: {
        send_email_receipt: false,
        show_description: true,
        show_line_items: true,
        description: `Pickleball Court Reservation — ${booking.reference}`,
        line_items: [
          {
            currency: 'PHP',
            amount: amountInCentavos,
            name: `PickleBook Reservation (${booking.reference})`,
            quantity: 1,
            description: firstGuest.full_name ? `Reserved for ${firstGuest.full_name}` : undefined,
          },
        ],
        payment_method_types: ['gcash', 'paymaya', 'qrph', 'card'],
        reference_number: booking.reference,
        success_url: `${siteUrl}/book/confirmed/${encodeURIComponent(booking.reference)}`,
        cancel_url: `${siteUrl}/book/payment?cancelled=true`,
        metadata: {
          booking_id: booking.id,
          booking_ref: booking.reference,
        },
      },
    },
  }

  const createRes: any = await $fetch('https://api.paymongo.com/v1/checkout_sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: payload,
  })

  const newSession = createRes?.data
  if (!newSession?.attributes?.checkout_url) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to generate PayMongo checkout session URL.',
    })
  }

  // Record payment reference
  try {
    await supabase.from('payments').insert({
      booking_id: booking.id,
      amount: booking.total_amount,
      payment_method: 'gcash',
      payment_status: 'pending',
      transaction_reference: newSession.id,
    })
  } catch {}

  return {
    success: true,
    checkoutUrl: newSession.attributes.checkout_url,
    sessionId: newSession.id,
    bookingId: booking.id,
    bookingRef: booking.reference,
    totalAmount: booking.total_amount,
    expiresAt: expiresAtMs,
  }
})
