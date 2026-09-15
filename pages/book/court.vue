<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Step tracker pill -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-card border border-line text-[11.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-relish-dark"></span>
        <span>Step 1 of 4 · Court Selection</span>
      </div>

      <!-- Title & Time slot info -->
      <h1 class="font-display font-bold text-[28px] text-ink m-0 leading-tight">
        Choose your court
      </h1>

      <!-- Date & time banner -->
      <div class="mt-2.5 mb-4 p-3 rounded-2xl bg-cream-card border border-line flex items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-sold flex items-center justify-center text-relish-dark shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-[13.5px] font-bold text-ink truncate leading-tight">
              {{ store.slotRangeLabel }}
            </div>
            <div class="text-[12px] text-ink-soft font-medium">
              {{ store.dateLabel }} · {{ store.slotHours }} hr{{ store.slotHours > 1 ? 's' : '' }} session
            </div>
          </div>
        </div>

        <NuxtLink
          to="/"
          class="shrink-0 text-[11.5px] font-bold text-relish-dark hover:text-ink px-2.5 py-1 rounded-lg bg-sold/60 hover:bg-sold transition-colors"
        >
          Change
        </NuxtLink>
      </div>

      <!-- Multi-court helper toolbar -->
      <div class="flex items-center justify-between mb-3.5 px-1">
        <div class="text-[12px] font-semibold text-ink-soft uppercase tracking-wider">
          {{ store.courtIds.length === 0 ? 'Select 1 or more courts' : `${store.courtIds.length} court${store.courtIds.length > 1 ? 's' : ''} selected` }}
        </div>
        <button
          v-if="store.courtIds.length > 0"
          type="button"
          class="text-[12px] font-bold text-relish-dark hover:text-ink underline transition-colors cursor-pointer"
          @click="store.clearCourts()"
        >
          Reset
        </button>
      </div>

      <!-- Court listing -->
      <CourtCard
        v-for="(c, idx) in store.courts"
        :key="c.id"
        :court="c"
        :court-index="idx"
        :status="store.courtsStatusMap[c.id] || 'open'"
        :is-selected="store.courtIds.map(String).includes(String(c.id))"
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
import { useBookingStore } from '~/stores/booking'
import CourtCard from '~/components/booking/CourtCard.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'
import PriceTotalBar from '~/components/ui/PriceTotalBar.vue'

useHead({ title: 'Pick a court — PickleBook' })

const store = useBookingStore()
if (store.slotIndex === null && store.selectedSlots.length === 0) {
  navigateTo('/')
}

const continueButtonLabel = computed(() => {
  const count = store.courtIds.length
  if (count === 0) return 'Select a court to continue'
  if (count === 1) return `Continue with 1 court · ₱${store.courtTotal.toLocaleString()}`
  return `Continue with ${count} courts · ₱${store.courtTotal.toLocaleString()}`
})

function selectCourt(id: string | number) {
  store.toggleCourt(id)
}

function goNext() {
  if (store.courtIds.length > 0) {
    navigateTo('/book/paddles')
  }
}
</script>
