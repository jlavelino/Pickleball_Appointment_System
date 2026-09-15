import { defineEventHandler, readRawBody, createError } from 'h3'
import crypto from 'crypto'
import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const webhookSecret = config.paymongoWebhookSecret

  const rawBody = await readRawBody(event)
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing request body',
    })
  }

  // Signature verification if webhook secret is configured
  const signatureHeader = getRequestHeader(event, 'paymongo-signature')
  if (webhookSecret && !webhookSecret.includes('your-webhook-secret')) {
    if (!signatureHeader) {
      console.warn('[PayMongo Webhook] Missing paymongo-signature header')
      throw createError({
        statusCode: 401,
        statusMessage: 'Missing signature header',
      })
    }

    try {
      // paymongo-signature format: t=timestamp,te=test_signature,li=live_signature
      const parts = signatureHeader.split(',').reduce((acc: Record<string, string>, item: string) => {
        const [k, v] = item.split('=')
        if (k && v) acc[k.trim()] = v.trim()
        return acc
      }, {})

      const timestamp = parts['t']
      const testSig = parts['te']
      const liveSig = parts['li']
      const expectedSig = liveSig || testSig

      if (timestamp && expectedSig) {
        const payloadToSign = `${timestamp}.${rawBody}`
        const computedSig = crypto
          .createHmac('sha256', webhookSecret)
          .update(payloadToSign)
          .digest('hex')

        if (computedSig !== expectedSig) {
          console.error('[PayMongo Webhook] Signature mismatch!')
          throw createError({
            statusCode: 401,
            statusMessage: 'Invalid webhook signature',
          })
        }
      }
    } catch (sigErr: any) {
      if (sigErr.statusCode) throw sigErr
      console.error('[PayMongo Webhook] Signature verification error:', sigErr)
      throw createError({
        statusCode: 401,
        statusMessage: 'Webhook signature verification failed',
      })
    }
  }

  let eventPayload: any
  try {
    eventPayload = JSON.parse(rawBody)
  } catch (parseErr) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid JSON payload',
    })
  }

  const eventType = eventPayload?.data?.attributes?.type
  console.log('[PayMongo Webhook] Received event:', eventType)

  if (eventType === 'checkout_session.payment.paid') {
    const sessionData = eventPayload.data.attributes.data?.attributes || {}
    const metadata = sessionData.metadata || {}
    const bookingId = metadata.booking_id

    if (!bookingId) {
      console.warn('[PayMongo Webhook] No booking_id found in metadata:', metadata)
      return { received: true, message: 'No booking_id metadata' }
    }

    const payments = sessionData.payments || []
    const latestPayment = payments[0]?.attributes || {}
    const paymongoPaymentId = payments[0]?.id || `pay_${eventPayload.data.id}`
    const paymentSource = latestPayment.source?.type || metadata.preferred_method || 'gcash'
    const paymentMethod = paymentSource === 'paymaya' ? 'maya' : paymentSource
    const amount = (latestPayment.amount ? latestPayment.amount / 100 : (sessionData.line_items?.[0]?.amount / 100)) || 0

    const supabase = useServerSupabase()

    // Confirm booking in Supabase
    const { error: rpcError } = await supabase.rpc('confirm_booking_payment', {
      p_booking_id: bookingId,
      p_payment_method: paymentMethod,
      p_transaction_reference: paymongoPaymentId,
      p_amount: amount,
    })

    if (rpcError) {
      console.error('[PayMongo Webhook] confirm_booking_payment error:', rpcError)
      // Return 200 so PayMongo doesn't endlessly retry if it was already confirmed
      return { received: true, error: rpcError.message }
    }

    console.log(`[PayMongo Webhook] Successfully confirmed booking ${bookingId} for ref ${metadata.booking_ref}`)
  }

  return { received: true }
})
