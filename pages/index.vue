<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Book a court
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]">
        Cagayan de Oro · Uptown branch
      </p>

      <CalendarPicker />
      <TimeSlotList />
    </div>

    <BottomCTA
      label="Continue"
      :disabled="store.slotIndex === null"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import CalendarPicker from '~/components/booking/CalendarPicker.vue'
import TimeSlotList from '~/components/booking/TimeSlotList.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'DINK — Book a court' })

const store = useBookingStore()

function goNext() {
  if (store.slotIndex !== null) {
    store.courtId = null
    navigateTo('/book/court')
  }
}
</script>
