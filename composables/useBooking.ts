import { useBookingStore, HOLD_DURATION_MS, type PaymentMethod } from '~/stores/booking'

export function useBooking() {
  const store = useBookingStore()

  /**
   * Creates a reservation hold on a court slot.
   * Uses HOLD_DURATION_MS (10 minutes) named constant as the source of truth.
   */
  async function createHold() {
    if ((!store.courtId && store.courtIds.length === 0) || (store.selectedSlots.length === 0 && store.slotIndex === null)) {
      throw new Error('Court, date, and start time must be selected to create a hold.')
    }

    const y = store.year
    const m = String(store.month + 1).padStart(2, '0')
    const d = String(store.day).padStart(2, '0')
    const dateStr = `${y}${m}${d}`
    const rand = String(Math.floor(Math.random() * 90000) + 10000)
    const bookingId = `PB-${dateStr}-${rand}`
    const holdExpiresAt = new Date(Date.now() + HOLD_DURATION_MS).toISOString()

    store.bookingRef = bookingId
    store.startHold()

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
    if (!store.bookingRef) {
      throw new Error('No active booking hold found.')
    }
    store.payMethod = method
    // In production, this calls the payment processing API / Supabase update
    await new Promise(resolve => setTimeout(resolve, 600))
    return {
      success: true,
      bookingId: store.bookingRef,
      paidAt: new Date().toISOString(),
    }
  }

  /**
   * Cancels / releases an active hold.
   */
  function releaseHold() {
    store.bookingRef = null
    store.holdSeconds = 10 * 60
  }

  return {
    store,
    createHold,
    confirmPayment,
    releaseHold,
    holdDurationMs: HOLD_DURATION_MS,
  }
}
