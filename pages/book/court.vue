<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Pick a court
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-3 leading-[1.4]">
        {{ store.slotRangeLabel }} · {{ store.dateLabel }}
      </p>

      <!-- Multi-court helper toolbar -->
      <div class="flex items-center justify-between mb-4 px-1">
        <span class="text-[12.5px] text-[var(--ink-soft)] font-medium">
          {{ store.courtIds.length === 0 ? 'Select one or more courts' : `${store.courtIds.length} court${store.courtIds.length > 1 ? 's' : ''} selected` }}
        </span>
        <button
          v-if="store.courtIds.length > 0"
          type="button"
          class="text-[12.5px] font-semibold text-[var(--relish-dark)] underline hover:text-[var(--ink)] cursor-pointer"
          @click="store.clearCourts()"
        >
          Clear selection
        </button>
      </div>

      <CourtCard
        v-for="c in COURTS"
        :key="c.id"
        :court="c"
        :status="store.courtsStatusMap[c.id]"
        :is-selected="store.courtIds.includes(c.id)"
        :hours="store.slotHours"
        @select="selectCourt"
      />
    </div>

    <BottomCTA
      :label="continueButtonLabel"
      :disabled="store.courtIds.length === 0"
      @click="goNext"
    >
      <template #above>
        <PriceTotalBar :show="store.courtIds.length > 0" />
      </template>
    </BottomCTA>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore, COURTS } from '~/stores/booking'
import CourtCard from '~/components/booking/CourtCard.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'
import PriceTotalBar from '~/components/ui/PriceTotalBar.vue'

useHead({ title: 'Pick a court — PickleBook' })

const store = useBookingStore()
if (store.slotIndex === null && store.selectedSlots.length === 0) {
  navigateTo('/')
}

const continueButtonLabel = computed(() => {
  const count = store.courtIds.length
  if (count === 0) return 'Select a court'
  if (count === 1) return `Continue (1 court · ₱${store.courtTotal})`
  return `Continue (${count} courts · ₱${store.courtTotal})`
})

function selectCourt(id: number) {
  store.toggleCourt(id)
}

function goNext() {
  if (store.courtIds.length > 0) {
    navigateTo('/book/paddles')
  }
}
</script>
