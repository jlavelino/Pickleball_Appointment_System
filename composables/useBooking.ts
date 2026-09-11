import { useBookingStore, HOLD_DURATION_MS, type PaymentMethod } from '~/stores/booking'

export function useBooking() {
  const store = useBookingStore()

  /**
   * Creates a reservation hold on a court slot.
   * Uses HOLD_DURATION_MS (10 minutes) named constant as the source of truth.
   */
  async function createHold() {
    if (!store.court || !store.date || !store.startTime) {
      throw new Error('Court, date, and start time must be selected to create a hold.')
    }

    const dateStr = store.date.replace(/-/g, '')
    const rand = String(Math.floor(Math.random() * 90000) + 10000)
    const bookingId = `PB-${dateStr}-${rand}`
    const holdExpiresAt = new Date(Date.now() + HOLD_DURATION_MS).toISOString()

    store.bookingId = bookingId
    store.holdExpiresAt = holdExpiresAt

    return {
      bookingId,
      holdExpiresAt,
      holdDurationMs: HOLD_DURATION_MS,
    }
  }

  /**
   * Confirms payment for an active hold.
   */
  async function confirmPayment(method: PaymentMethod) {
    if (!store.bookingId) {
      throw new Error('No active booking hold found.')
    }
    store.paymentMethod = method
    // In production, this calls the payment processing API / Supabase update
    await new Promise(resolve => setTimeout(resolve, 600))
    return {
      success: true,
      bookingId: store.bookingId,
      paidAt: new Date().toISOString(),
    }
  }

  /**
   * Cancels / releases an active hold.
   */
  function releaseHold() {
    store.bookingId = null
    store.holdExpiresAt = null
    store.paymentMethod = null
  }

  return {
    store,
    createHold,
    confirmPayment,
    releaseHold,
    holdDurationMs: HOLD_DURATION_MS,
  }
}
