<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <h1 class="font-display font-bold text-[28px] text-ink m-0 leading-tight">
        Reserve a court
      </h1>
      <p class="text-ink-soft text-[14px] m-0 mb-3.5 leading-relaxed">
        Select your preferred date and playing hours below.
      </p>

      <!-- Calendar picker: dates visible, emits dateSelected on click -->
      <CalendarPicker @dateSelected="openModal" />

      <!-- Selected Time slots summary card (shows if user picked times) -->
      <div
        v-if="hasSelectedTimes"
        class="mt-3.5 rounded-2xl border border-ink/20 overflow-hidden shadow-sm cursor-pointer hover:border-ink transition-all group bg-white"
        @click="openModal"
      >
        <!-- Dark header with check & date -->
        <div class="px-4 py-2.5 bg-ink text-cream flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full bg-lime text-ink flex items-center justify-center font-bold text-[10px] shrink-0">
              ✓
            </span>
            <span class="text-[11.5px] font-bold uppercase tracking-wider text-cream/90">
              {{ store.fullDateLabel }}
            </span>
          </div>

          <span class="text-[11px] font-bold text-lime">
            {{ store.selectedSlotsList.length }} hr{{ store.selectedSlotsList.length > 1 ? 's' : '' }} selected
          </span>
        </div>

        <!-- Body -->
        <div class="p-3.5 bg-cream-card">
          <!-- Main Time Range -->
          <div class="text-[17px] font-bold text-ink leading-snug">
            {{ store.slotRangeLabel }}
          </div>

          <!-- Bottom row: Slot chips + Edit button -->
          <div class="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-line/60">
            <div class="flex flex-wrap gap-1.5 items-center">
              <span
                v-for="slot in store.selectedSlotsList"
                :key="slot.label"
                class="px-2.5 py-0.5 rounded-lg text-[12px] font-semibold bg-white border border-line text-ink"
              >
                {{ slot.label }}
              </span>
            </div>

            <button
              type="button"
              class="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sold text-relish-dark text-[12px] font-bold transition-all hover:bg-relish-dark hover:text-white active:scale-95 ml-auto"
              @click.stop="openModal"
            >
              <span class="mdi mdi-clock-outline text-[14px]"></span>
              <span>Change time</span>
            </button>
          </div>
        </div>
      </div>

      <!-- If selected day is fully booked -->
      <div
        v-else-if="store.isCurrentDayFullyBooked"
        class="mt-3.5 p-3.5 rounded-2xl bg-red-50/80 border border-red-200 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-red-400 transition-all overflow-hidden"
        @click="openModal"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 font-bold text-[13px]">
            ✕
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-[13.5px] font-bold text-red-900 leading-snug truncate">
              Fully booked for this date
            </div>
            <div class="text-[12px] text-red-700 font-medium mt-0.5 truncate">
              No open court slots remaining
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-[12px] font-bold opacity-95 active:scale-95 shadow-xs"
        >
          View schedule
        </button>
      </div>

      <!-- Quick prompt if no time selected yet -->
      <div
        v-else
        class="mt-3.5 p-3 rounded-2xl bg-cream-card border border-line shadow-xs flex items-center justify-between gap-2.5 cursor-pointer hover:border-ink transition-all group overflow-hidden"
        @click="openModal"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="w-8 h-8 rounded-xl bg-sold flex items-center justify-center text-relish-dark shrink-0 group-hover:bg-relish-dark group-hover:text-white transition-colors">
            <span class="mdi mdi-clock-outline text-[18px]"></span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-[13.5px] font-bold text-ink leading-snug whitespace-nowrap">
              Select play hours
            </div>
            <div class="text-[12px] text-ink-soft font-medium mt-0.5 whitespace-nowrap">
              Daily · 8 AM – 11 PM
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-ink text-cream text-[12px] font-bold transition-all group-hover:bg-black active:scale-95 shadow-xs"
        >
          <span>Pick times</span>
          <span class="mdi mdi-arrow-right text-[14px]"></span>
        </button>
      </div>
    </div>

    <!-- Bottom Continue button -->
    <BottomCTA
      :label="continueLabel"
      :disabled="!hasSelectedTimes"
      @click="goNext"
    />

    <!-- Time Slot Modal / Bottom sheet -->
    <TimeSlotModal
      :show="showModal"
      @close="closeModal"
      @confirm="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import CalendarPicker from '~/components/booking/CalendarPicker.vue'
import TimeSlotModal from '~/components/booking/TimeSlotModal.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'DINK — Book a court' })

const store = useBookingStore()
const showModal = ref(false)

const hasSelectedTimes = computed(() => {
  return store.selectedSlots.length > 0 || store.slotIndex !== null
})

const continueLabel = computed(() => {
  const count = store.selectedSlots.length
  if (count <= 1) return 'Continue to Court Selection'
  return `Continue to Courts (${count} hrs)`
})

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function goNext() {
  if (hasSelectedTimes.value) {
    store.courtId = null
    navigateTo('/book/court')
  }
}
</script>
