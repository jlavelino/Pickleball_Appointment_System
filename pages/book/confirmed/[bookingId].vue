<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-6">
      <BookingQR
        :booking-ref="bookingRef"
        :court-name="store.selectedCourt?.name || 'Court 2'"
        :slot-range="store.slotRangeLabel || '7:00 – 8:00 PM'"
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
import BookingQR from '~/components/booking/BookingQR.vue'

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
