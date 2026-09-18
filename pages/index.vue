<template>
  <div class="flex flex-col min-h-full relative pb-10">
    <div class="flex-1 pb-2">
      <!-- Hero text with side_design decoration -->
      <div class="relative mb-3 pt-1 min-h-[110px]">
        <!-- Text: given generous right padding to stay clear of the art -->
        <div class="pr-[145px]">
          <h1 class="font-display font-bold text-[32px] text-ink m-0 leading-[1.15]">
            Reserve <span class="text-[#4C7A22]">a court</span>
          </h1>
          <p class="text-ink-soft text-[13.5px] m-0 mt-1 leading-relaxed">
            Select your preferred date and playing hours below.
          </p>
        </div>

        <!-- Side design: court aerial + pickleball, large, top-right -->
        <div
          class="absolute pointer-events-none select-none"
          style="right: -20px; top: -28px; width: 195px; height: 165px;"
        >
          <img
            src="~/assets/images/side_design-removebg-preview.png"
            alt=""
            style="width: 100%; height: 100%; object-fit: contain; object-position: right top;"
          />
        </div>
      </div>

      <!-- Calendar card: dates visible, emits dateSelected on click -->
      <CalendarPicker @dateSelected="openModal" />

      <!-- Selected Time slots summary card (Mockup faithful) -->
      <div
        v-if="hasSelectedTimes"
        class="mt-3.5 rounded-2xl bg-white border border-[#2D5A27]/40 overflow-hidden shadow-xs cursor-pointer hover:border-[#2D5A27] transition-all group"
        @click="openModal"
      >
        <div class="p-3.5 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-full bg-[#EDF7E7] text-[#2D5A27] flex items-center justify-center shrink-0">
              <span class="mdi mdi-clock-check-outline text-[20px]"></span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[14px] font-bold text-ink leading-snug truncate">
                {{ store.slotRangeLabel }}
              </div>
              <div class="text-[12px] text-ink-soft font-medium mt-0.5">
                {{ store.dateLabel }} · {{ store.slotHours }} hr{{ store.slotHours > 1 ? 's' : '' }} session
              </div>
            </div>
          </div>

          <!-- Compact edit button: icon only -->
          <button
            type="button"
            class="shrink-0 w-9 h-9 rounded-full bg-[#223318] text-white flex items-center justify-center transition-all hover:bg-[#2D5A27] active:scale-95 shadow-xs"
            aria-label="Edit times"
            @click.stop="openModal"
          >
            <span class="mdi mdi-pencil-outline text-[16px]"></span>
          </button>
        </div>
      </div>


      <!-- If selected day is fully booked -->
      <div
        v-else-if="store.isCurrentDayFullyBooked"
        class="mt-3.5 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-red-400 transition-all overflow-hidden"
        @click="openModal"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 font-bold text-[14px]">
            ✕
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-[13.5px] font-bold text-red-900 leading-snug truncate">
              Fully booked for this date
            </div>
            <div class="text-[12px] text-red-700 font-medium mt-0.5 truncate">
              No open courts remaining
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-[12px] font-bold opacity-95 active:scale-95 shadow-xs"
        >
          View times
        </button>
      </div>

      <!-- Quick prompt if no time selected yet (Matches Screen 1 Mockup) -->
      <div
        v-else
        class="mt-3.5 p-3.5 rounded-2xl bg-white border border-line/80 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#223318] transition-all group"
        @click="openModal"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-[#EDF7E7] text-[#2D5A27] flex items-center justify-center shrink-0 group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
            <span class="mdi mdi-clock-outline text-[20px]"></span>
          </div>
          <div class="min-w-0">
            <div class="text-[14px] font-bold text-ink leading-snug whitespace-nowrap">
              Select play hours
            </div>
            <div class="text-[12px] text-ink-soft font-medium mt-0.5 whitespace-nowrap">
              Daily · 8 AM – 11 PM
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#223318] text-white text-[12.5px] font-bold transition-all group-hover:bg-[#2D5A27] active:scale-95 shadow-xs"
        >
          <span>Pick times</span>
        </button>
      </div>
    </div>

    <!-- Bottom Continue CTA button -->
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

useHead({ title: 'PickleBook — Reserve a court' })

const store = useBookingStore()
const showModal = ref(false)

const hasSelectedTimes = computed(() => {
  return store.selectedSlots.length > 0 || store.slotIndex !== null
})

const continueLabel = computed(() => {
  const count = store.selectedSlots.length
  if (count === 0) return 'Pick times to continue'
  if (count === 1) return 'Continue to Court Selection'
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

