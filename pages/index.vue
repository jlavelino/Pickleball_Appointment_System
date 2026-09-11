<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Book a court
      </h1>


      <!-- Calendar picker: dates visible, emits dateSelected on click -->
      <CalendarPicker @dateSelected="openModal" />

      <!-- Selected Time slots summary card (shows if user picked times) -->
      <div
        v-if="hasSelectedTimes"
        class="mt-3 p-4 rounded-2xl bg-[var(--cream-card)] border border-[var(--line)] shadow-sm cursor-pointer hover:border-[var(--ink)] transition-all"
        @click="openModal"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-[var(--ink)] text-[var(--cream)] flex items-center justify-center font-bold text-[12px]">
              ✓
            </span>
            <span class="text-[11.5px] font-bold uppercase tracking-wider text-[var(--ink-soft)]">
              {{ store.fullDateLabel }}
            </span>
          </div>
          <button
            type="button"
            class="text-[13px] font-semibold text-[var(--relish-dark)] underline hover:text-[var(--ink)]"
            @click.stop="openModal"
          >
            Add / Change times
          </button>
        </div>

        <div class="text-[16px] font-semibold text-[var(--ink)] leading-snug">
          {{ store.slotRangeLabel }}
        </div>

        <!-- Selected pills -->
        <div class="flex flex-wrap gap-1.5 mt-2.5">
          <span
            v-for="slot in store.selectedSlotsList"
            :key="slot.label"
            class="px-2.5 py-1 rounded-lg text-[12.5px] font-medium bg-[var(--cream)] border border-[var(--line)] text-[var(--ink)]"
          >
            {{ slot.label }}
          </span>
        </div>
      </div>

      <!-- Quick prompt if no time selected yet -->
      <div
        v-else
        class="mt-3 p-3.5 rounded-2xl border border-dashed border-[var(--line)] bg-[rgba(245,241,222,0.6)] flex items-center justify-between cursor-pointer hover:border-[var(--ink-soft)] transition-colors"
        @click="openModal"
      >
        <div class="flex items-center gap-2.5">
          <span class="text-[16px]">🕒</span>
          <span class="text-[13.5px] text-[var(--ink-soft)] font-medium">
            Tap a date to choose times (8 AM – 11 PM)
          </span>
        </div>
        <span class="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">
          Select →
        </span>
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
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'PickleBook — Book a court' })

const store = useBookingStore()
const showModal = ref(false)

const hasSelectedTimes = computed(() => {
  return store.selectedSlots.length > 0 || store.slotIndex !== null
})

const continueLabel = computed(() => {
  const count = store.selectedSlots.length
  if (count <= 1) return 'Continue'
  return `Continue (${count} hours)`
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
