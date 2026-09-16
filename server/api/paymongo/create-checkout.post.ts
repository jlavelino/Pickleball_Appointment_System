import { defineEventHandler, readBody, createError } from 'h3'
import { useServerSupabase } from '../../utils/supabase'

interface CreateCheckoutBody {
  bookingId: string
  bookingRef: string
  amount: number
  paymentMethod?: 'gcash' | 'maya'
  bookerName?: string
  bookerMobile?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secretKey = config.paymongoSecretKey

  if (!secretKey || secretKey.includes('your-secret-key')) {
    throw createError({
      statusCode: 500,
      statusMessage: 'PAYMONGO_SECRET_KEY is not configured. Please set your PayMongo Secret Key in .env',
    })
  }

  const body = await readBody<CreateCheckoutBody>(event)

  if (!body.bookingId || !body.bookingRef || !body.amount || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid booking data. bookingId, bookingRef, and valid amount are required.',
    })
  }

  // Determine site URL for redirects
  let siteUrl = config.public.siteUrl
  if (!siteUrl) {
    const host = getRequestHeader(event, 'host') || 'localhost:3000'
    const proto = getRequestHeader(event, 'x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
    siteUrl = `${proto}://${host}`
  }

  // Ensure siteUrl has no trailing slash
  siteUrl = siteUrl.replace(/\/$/, '')

  // Map payment method types
  // PayMongo uses 'gcash' and 'paymaya'
  let methodTypes: string[] = ['gcash', 'paymaya']
  if (body.paymentMethod === 'gcash') {
    methodTypes = ['gcash', 'paymaya']
  } else if (body.paymentMethod === 'maya') {
    methodTypes = ['paymaya', 'gcash']
  }

  const amountInCentavos = Math.round(body.amount * 100)

  const payload = {
    data: {
      attributes: {
        send_email_receipt: false,
        show_description: true,
        show_line_items: true,
        description: `Pickleball Court Reservation — ${body.bookingRef}`,
        line_items: [
          {
            currency: 'PHP',
            amount: amountInCentavos,
            name: `PickleBook Reservation (${body.bookingRef})`,
            quantity: 1,
            description: body.bookerName ? `Reserved for ${body.bookerName}` : undefined,
          },
        ],
        payment_method_types: methodTypes,
        reference_number: body.bookingRef,
        success_url: `${siteUrl}/book/confirmed/${encodeURIComponent(body.bookingRef)}`,
        cancel_url: `${siteUrl}/book/payment?cancelled=true`,
        metadata: {
          booking_id: body.bookingId,
          booking_ref: body.bookingRef,
          preferred_method: body.paymentMethod || 'gcash',
        },
      },
    },
  }

  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`

  try {
    const response: any = await $fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: payload,
    })

    const checkoutData = response?.data
    if (!checkoutData || !checkoutData.attributes?.checkout_url) {
      throw new Error('PayMongo returned an invalid checkout session response.')
    }

    // Save pending payment record referencing this checkout session
    try {
      const supabase = useServerSupabase()
      await supabase.from('payments').insert({
        booking_id: body.bookingId,
        amount: body.amount,
        payment_method: body.paymentMethod === 'maya' ? 'maya' : 'gcash',
        payment_status: 'pending',
        transaction_reference: checkoutData.id,
      })
    } catch (insertErr) {
      console.warn('[PayMongo create-checkout] Could not record pending payment:', insertErr)
    }

    return {
      success: true,
      sessionId: checkoutData.id,
      checkoutUrl: checkoutData.attributes.checkout_url,
    }
  } catch (err: any) {
    console.error('[PayMongo create-checkout] error:', err?.data || err?.message || err)
    const errorDetails = err?.data?.errors?.[0]?.detail || err?.message || 'Failed to create PayMongo checkout session'
    throw createError({
      statusCode: err?.statusCode || 502,
      statusMessage: errorDetails,
    })
  }
})
