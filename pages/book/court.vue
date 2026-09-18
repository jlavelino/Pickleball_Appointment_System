<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Title -->
      <h1 class="font-display font-bold text-[30px] text-[#14231C] m-0 leading-tight">
        Choose your court
      </h1>

      <!-- Selected Time Summary Card (Section 12) -->
      <div class="mt-3.5 mb-4 p-3.5 rounded-2xl bg-white border border-[#DCE6D8] flex items-center justify-between gap-3 shadow-subtle">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center shrink-0">
            <span class="mdi mdi-clock-outline text-[18px]"></span>
          </div>
          <div class="min-w-0">
            <div class="text-[14px] font-bold text-[#14231C] truncate leading-tight">
              {{ store.slotRangeLabel }}
            </div>
            <div class="text-[12px] text-[#66756D] font-medium mt-0.5">
              {{ store.dateLabel }} · {{ store.slotHours }} hr{{ store.slotHours > 1 ? 's' : '' }} session
            </div>
          </div>
        </div>

        <!-- Subtle light-green secondary action, NOT orange -->
        <NuxtLink
          to="/book"
          class="shrink-0 btn-secondary text-[12px] font-bold py-1.5 px-3 rounded-full"
        >
          Change
        </NuxtLink>
      </div>

      <!-- Section Label: SELECT 1 OR MORE COURTS -->
      <div class="flex items-center justify-between mb-3 px-1">
        <div class="text-[11.5px] font-bold text-[#66756D] uppercase tracking-wider">
          {{ store.courtIds.length === 0 ? 'Select 1 or more courts' : `${store.courtIds.length} court${store.courtIds.length > 1 ? 's' : ''} selected` }}
        </div>
        <button
          v-if="store.courtIds.length > 0"
          type="button"
          class="text-[12px] font-bold text-[#0B6623] hover:underline transition-all cursor-pointer"
          @click="store.clearCourts()"
        >
          Reset selection
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

    <!-- Bottom CTA (Section 17) -->
    <BottomCTA
      :label="continueButtonLabel"
      :disabled="store.courtIds.length === 0"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import CourtCard from '~/components/booking/CourtCard.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'PickleBook — Choose your court' })

const store = useBookingStore()
if (store.slotIndex === null && store.selectedSlots.length === 0) {
  navigateTo('/')
}

const continueButtonLabel = computed(() => {
  const count = store.courtIds.length
  if (count === 0) return 'Select a court to continue'
  if (count === 1) {
    const courtName = store.courts.find(c => String(c.id) === String(store.courtIds[0]))?.name || 'Court 1'
    return `Continue with ${courtName} · ₱${store.courtTotal.toLocaleString()}`
  }
  return `Book ${count} Courts · ₱${store.courtTotal.toLocaleString()} total`
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
