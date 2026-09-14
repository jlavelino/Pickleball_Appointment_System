<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-6">
      <BookingQR
        :booking-ref="bookingRef"
        :court-name="store.courtNamesLabel || store.selectedCourt?.name || 'Court 1'"
        :slot-range="store.slotRangeLabel || '8:00 AM – 10:00 AM'"
        :date-label="store.dateLabel || 'Tue, Sep 15'"
        :pay-method="store.payMethod"
        :paddle-count="store.paddleCount"
        :food-count="store.foodCount"
        @restart="handleRestart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import BookingQR from '~/components/booking/BookingQr.vue'

useHead({ title: 'Booking confirmed — DINK' })

const route = useRoute()
const store = useBookingStore()

const bookingRef = computed(() =>
  String(route.params.bookingId || store.bookingRef || 'PB-20260915-00124')
)

function handleRestart() {
  store.reset()
  navigateTo('/')
}
</script>
