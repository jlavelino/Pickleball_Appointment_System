<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Pick a court
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]">
        {{ store.slotRangeLabel }} · {{ store.dateLabel }}
      </p>

      <CourtCard
        v-for="c in COURTS"
        :key="c.id"
        :court="c"
        :status="store.courtsStatusMap[c.id]"
        :is-selected="store.courtId === c.id"
        @select="selectCourt"
      />
    </div>

    <BottomCTA
      label="Continue"
      :disabled="store.courtId === null"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { useBookingStore, COURTS } from '~/stores/booking'
import CourtCard from '~/components/booking/CourtCard.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'Pick a court — DINK' })

const store = useBookingStore()
if (store.slotIndex === null) {
  navigateTo('/')
}

function selectCourt(id: number) {
  store.setCourt(id)
}

function goNext() {
  if (store.courtId !== null) {
    navigateTo('/book/paddles')
  }
}
</script>
