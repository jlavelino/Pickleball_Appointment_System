<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-6">
      <!-- Loading verification state -->
      <div v-if="isVerifying" class="text-center py-16">
        <div class="inline-block w-10 h-10 border-4 border-lime border-t-transparent rounded-full animate-spin mb-4" />
        <h2 class="text-[18px] font-semibold text-ink mb-1 font-display">Verifying payment…</h2>
        <p class="text-ink-soft text-[14px]">Confirming your GCash / Maya payment with PayMongo</p>
      </div>

      <!-- Verification error state -->
      <div v-else-if="verificationError" class="p-4 rounded-xl bg-[#FEECEB] border border-[#FDB8B4] text-[#CE2C31] text-[13.5px] mb-4">
        <div class="font-bold mb-1">Payment Verification Notice</div>
        <div>{{ verificationError }}</div>
      </div>

      <!-- Confirmed QR View -->
      <BookingQR
        v-else
        :booking-ref="bookingRef"
        :court-name="displayCourtName"
        :court-type="displayCourtType"
        :slot-range="displaySlotRange"
        :date-label="displayDateLabel"
        :date-iso="displayDateIso"
        :start-time="displayStartTime"
        :end-time="displayEndTime"
        :pay-method="displayPayMethod"
        :total-amount="displayTotalAmount"
        :paddle-count="displayPaddleCount"
        :food-count="displayFoodCount"
        :booker-name="displayBookerName"
        :booker-mobile="displayBookerMobile"
        @restart="handleRestart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingStore, slotToTimeString } from '~/stores/booking'
import { useSupabase } from '~/composables/useSupabase'
import BookingQR from '~/components/booking/BookingQr.vue'

useHead({ title: 'Booking confirmed — DINK' })

const route = useRoute()
const store = useBookingStore()
const supabase = useSupabase()

const isVerifying = ref(false)
const verificationError = ref<string | null>(null)
const dbBooking = ref<any>(null)

const bookingRef = computed(() =>
  String(route.params.bookingId || store.bookingRef || 'PB-20260915-00124')
)

// Dynamic display fields (prioritize store if active, fallback to database record)
const displayCourtName = computed(() => {
  if (store.courtNamesLabel) return store.courtNamesLabel
  if (store.selectedCourt?.name) return store.selectedCourt.name
  if (dbBooking.value?.court_names) return dbBooking.value.court_names
  return 'Court 1'
})

const displayCourtType = computed(() => {
  if (store.selectedCourt?.type) return store.selectedCourt.type
  if (dbBooking.value?.booking_courts?.[0]?.courts?.type) return dbBooking.value.booking_courts[0].courts.type
  return 'indoor'
})

const displaySlotRange = computed(() => {
  if (store.slotRangeLabel) return store.slotRangeLabel
  if (dbBooking.value) {
    const start = dbBooking.value.start_time?.slice(0, 5)
    const end = dbBooking.value.end_time?.slice(0, 5)
    return `${start} – ${end}`
  }
  return '8:00 AM – 10:00 AM'
})

const displayStartTime = computed(() => {
  if (dbBooking.value?.start_time) return dbBooking.value.start_time
  if (store.selectedSlots.length > 0) {
    return slotToTimeString(Math.min(...store.selectedSlots))
  }
  return '08:00:00'
})

const displayEndTime = computed(() => {
  if (dbBooking.value?.end_time) return dbBooking.value.end_time
  if (store.selectedSlots.length > 0) {
    return slotToTimeString(Math.max(...store.selectedSlots) + 1)
  }
  return '09:00:00'
})

const displayDateIso = computed(() => {
  if (dbBooking.value?.booking_date) return dbBooking.value.booking_date
  const m = String(store.month + 1).padStart(2, '0')
  const d = String(store.day).padStart(2, '0')
  return `${store.year}-${m}-${d}`
})

const displayDateLabel = computed(() => {
  if (store.dateLabel) return store.dateLabel
  if (dbBooking.value?.booking_date) {
    const d = new Date(dbBooking.value.booking_date)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
  return 'Tue, Sep 15'
})

const displayPayMethod = computed(() => {
  if (store.payMethod) return store.payMethod
  if (dbBooking.value?.payments?.[0]?.payment_method) {
    return dbBooking.value.payments[0].payment_method
  }
  return 'gcash'
})

const displayTotalAmount = computed(() => {
  if (store.grandTotal > 0) return store.grandTotal
  if (dbBooking.value?.total_amount) return Number(dbBooking.value.total_amount)
  if (dbBooking.value?.payments?.[0]?.amount) return Number(dbBooking.value.payments[0].amount)
  return 0
})

const displayPaddleCount = computed(() => {
  if (store.paddleCount > 0) return store.paddleCount
  if (dbBooking.value?.booking_paddles?.length) {
    return dbBooking.value.booking_paddles.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
  }
  return 0
})

const displayFoodCount = computed(() => {
  if (store.foodCount > 0) return store.foodCount
  if (dbBooking.value?.booking_food?.length) {
    return dbBooking.value.booking_food.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
  }
  return 0
})

const displayBookerName = computed(() => {
  if (store.bookerName) return store.bookerName
  if (dbBooking.value?.booking_guests?.full_name) return dbBooking.value.booking_guests.full_name
  return ''
})

const displayBookerMobile = computed(() => {
  if (store.bookerMobile) return store.bookerMobile
  if (dbBooking.value?.booking_guests?.mobile) return dbBooking.value.booking_guests.mobile
  return ''
})

onMounted(async () => {
  let sessionId = (route.query.session_id as string) || ''
  if (sessionId.startsWith('{')) {
    sessionId = ''
  }
  if (!sessionId && typeof window !== 'undefined' && bookingRef.value) {
    sessionId = sessionStorage.getItem(`paymongo_session_${bookingRef.value}`) || ''
  }

  // Always attempt verification if we have a bookingRef or sessionId
  if (bookingRef.value || sessionId) {
    isVerifying.value = true
    try {
      const res = await $fetch<{ success: boolean; paid: boolean; status: string; bookingRef?: string }>('/api/paymongo/verify-session', {
        method: 'POST',
        body: {
          sessionId: sessionId || undefined,
          bookingRef: bookingRef.value,
        },
      })

      if (res?.paid) {
        verificationError.value = null
      }
    } catch (err: any) {
      console.warn('[verify-session] warning:', err?.data?.statusMessage || err?.message || err)
    } finally {
      isVerifying.value = false
    }
  }

  // Hydrate booking details from Supabase if needed
  await fetchBookingFromDb()
})

async function fetchBookingFromDb() {
  if (!bookingRef.value) return
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, reference, status, booking_date, start_time, end_time, total_amount,
        booking_guests(full_name, mobile),
        booking_courts(courts(name, type)),
        booking_paddles(quantity),
        booking_food(quantity),
        payments(payment_method, payment_status, amount)
      `)
      .eq('reference', bookingRef.value)
      .maybeSingle()

    if (!error && data) {
      const courtNames = ((data.booking_courts as any[]) || [])
        .map(bc => bc.courts?.name)
        .filter(Boolean)
        .join(' & ')

      dbBooking.value = {
        ...data,
        court_names: courtNames || 'Court 1',
      }
    }
  } catch (err) {
    console.warn('Failed to fetch booking details from Supabase:', err)
  }
}

function handleRestart() {
  store.reset()
  navigateTo('/')
}
</script>
