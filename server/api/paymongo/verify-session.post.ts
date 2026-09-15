import { defineEventHandler, readBody, createError } from 'h3'
import { useServerSupabase } from '../../utils/supabase'

interface VerifySessionBody {
  sessionId?: string
  bookingRef?: string
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

  const body = await readBody<VerifySessionBody>(event)
  let targetSessionId = body?.sessionId?.trim()

  const supabase = useServerSupabase()

  // If sessionId is missing or contains literal template placeholder, resolve via bookingRef
  if (!targetSessionId || targetSessionId.startsWith('{')) {
    if (!body?.bookingRef) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either sessionId or bookingRef is required to verify checkout session.',
      })
    }

    // Look up the booking and find the PayMongo checkout session recorded in payments
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('id, reference, status, total_amount, payments(transaction_reference, payment_status, created_at)')
      .eq('reference', body.bookingRef)
      .maybeSingle()

    if (bErr || !booking) {
      throw createError({
        statusCode: 404,
        statusMessage: `Booking ${body.bookingRef} not found.`,
      })
    }

    // If booking is already confirmed, we're done!
    if (booking.status === 'confirmed') {
      return {
        success: true,
        paid: true,
        status: 'confirmed',
        bookingId: booking.id,
        bookingRef: booking.reference,
      }
    }

    const payList = (booking.payments as any[]) || []
    const pendingSession = payList
      .filter(p => p.transaction_reference && p.transaction_reference.startsWith('cs_'))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

    if (pendingSession) {
      targetSessionId = pendingSession.transaction_reference
    }
  }

  if (!targetSessionId || targetSessionId.startsWith('{')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not resolve PayMongo checkout session ID.',
    })
  }

  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`

  try {
    const response: any = await $fetch(`https://api.paymongo.com/v1/checkout_sessions/${encodeURIComponent(targetSessionId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    })

    const session = response?.data
    if (!session) {
      throw new Error('Session not found in PayMongo.')
    }

    const attrs = session.attributes || {}
    const paymentIntent = attrs.payment_intent?.attributes || {}
    const payments = attrs.payments || paymentIntent.payments || []

    // PayMongo considers the session paid if attrs.status == 'paid',
    // or payment_intent status == 'succeeded', or any payment in payments is 'paid'
    const isPaid =
      attrs.status === 'paid' ||
      paymentIntent.status === 'succeeded' ||
      payments.some((p: any) => p?.attributes?.status === 'paid')

    const metadata = attrs.metadata || {}
    const bookingId = metadata.booking_id
    const bookingRef = metadata.booking_ref || body.bookingRef

    if (isPaid && bookingId) {
      // Check current booking status in database
      const { data: booking, error: fetchErr } = await supabase
        .from('bookings')
        .select('id, status, total_amount')
        .eq('id', bookingId)
        .maybeSingle()

      if (!fetchErr && booking && booking.status === 'pending_payment') {
        const paidItem = payments.find((p: any) => p?.attributes?.status === 'paid') || payments[0] || {}
        const paidAttrs = paidItem.attributes || {}
        const paymongoPaymentId = paidItem.id || paymentIntent.id || `pay_${session.id}`
        const paymentSource = paidAttrs.source?.type || attrs.payment_method_used || metadata.preferred_method || 'gcash'
        const paymentType = paymentSource === 'paymaya' ? 'maya' : paymentSource
        const paidAmount = (paidAttrs.amount ? paidAttrs.amount / 100 : booking.total_amount) || 0

        const { error: rpcError } = await supabase.rpc('confirm_booking_payment', {
          p_booking_id: bookingId,
          p_payment_method: paymentType,
          p_transaction_reference: paymongoPaymentId,
          p_amount: paidAmount,
        })

        if (rpcError) {
          console.error('[PayMongo verify-session] confirm_booking_payment error:', rpcError)
        } else {
          console.log(`[PayMongo verify-session] Booking ${bookingRef} confirmed successfully!`)
        }
      }

      return {
        success: true,
        paid: true,
        status: 'confirmed',
        bookingId,
        bookingRef,
      }
    }

    return {
      success: true,
      paid: isPaid,
      status: attrs.status,
      bookingRef,
    }
  } catch (err: any) {
    console.error('[PayMongo verify-session] error:', err?.data || err?.message || err)
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.data?.errors?.[0]?.detail || err?.message || 'Failed to verify checkout session',
    })
  }
})
