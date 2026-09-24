<template>
  <div class="flex flex-col min-h-full relative pb-4">
    <div class="flex-1">
      <!-- Heading Area with subtle pickleball paddle decoration -->
      <div class="relative mb-4 pt-1 flex items-start justify-between">
        <div class="pr-4 flex-1">
          <h1 class="font-display font-bold text-[32px] text-[#14231C] m-0 leading-[1.15]">
            Reserve <span class="text-[#0B6623]">a court</span>
          </h1>
          <p class="text-[#66756D] text-[14px] m-0 mt-1.5 leading-relaxed font-normal">
            Select your preferred date and playing hours below.
          </p>
        </div>

        <!-- Subtle decorative pickleball & paddle graphic -->
        <div class="w-12 h-12 shrink-0 pointer-events-none select-none opacity-80 mt-1">
          <svg viewBox="0 0 60 60" fill="none" class="w-full h-full">
            <path d="M12 48 C 22 36, 36 28, 50 20" stroke="#9ACD32" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 4" opacity="0.6" />
            <rect x="22" y="8" width="26" height="32" rx="10" transform="rotate(18 22 8)" fill="#0B6623" opacity="0.12" stroke="#0B6623" stroke-width="1.5" />
            <circle cx="44" cy="18" r="9" fill="#9ACD32" stroke="#0B6623" stroke-width="1.2" />
            <circle cx="41" cy="15" r="1.1" fill="#14231C" opacity="0.7" />
            <circle cx="47" cy="15" r="1.1" fill="#14231C" opacity="0.7" />
            <circle cx="44" cy="18" r="1.3" fill="#14231C" opacity="0.8" />
            <circle cx="41" cy="21" r="1.1" fill="#14231C" opacity="0.7" />
            <circle cx="47" cy="21" r="1.1" fill="#14231C" opacity="0.7" />
          </svg>
        </div>
      </div>

      <!-- Calendar Card -->
      <CalendarPicker @dateSelected="openModal" />

      <!-- Play Hours Card (Section 9) -->
      <!-- Case 1: Time Selected -->
      <div
        v-if="hasSelectedTimes"
        class="mt-3.5 card-base p-4 cursor-pointer hover:border-[#0B6623] transition-all flex items-center justify-between gap-3 shadow-subtle group"
        @click="openModal"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center shrink-0">
            <span class="mdi mdi-clock-outline text-[20px]"></span>
          </div>
          <div class="min-w-0">
            <div class="text-[14.5px] font-bold text-[#14231C] leading-snug truncate">
              {{ store.slotRangeLabel }}
            </div>
            <div class="text-[12px] text-[#66756D] font-medium mt-0.5 truncate">
              {{ store.dateLabel }} · {{ store.slotHours }} hr{{ store.slotHours > 1 ? 's' : '' }} session
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0B6623] text-white text-[12px] font-bold transition-all hover:bg-[#08521C] active:scale-95 shadow-xs"
          @click.stop="openModal"
        >
          <span>Edit times</span>
          <span class="mdi mdi-arrow-right text-[13px]"></span>
        </button>
      </div>

      <!-- Case 2: Selected Day is Fully Booked -->
      <div
        v-else-if="store.isCurrentDayFullyBooked"
        class="mt-3.5 card-base p-4 border-[#D94A4A]/40 bg-[#FDE8E8]/40 flex items-center justify-between gap-3 cursor-pointer hover:border-[#D94A4A] transition-all"
        @click="openModal"
      >
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-10 h-10 rounded-full bg-[#FDE8E8] text-[#D94A4A] flex items-center justify-center shrink-0 font-bold text-[14px]">
            ✕
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-[14px] font-bold text-[#D94A4A] leading-snug truncate">
              Fully booked for this date
            </div>
            <div class="text-[12px] text-[#66756D] font-medium mt-0.5 truncate">
              No open courts remaining
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 px-3.5 py-2 rounded-full bg-[#D94A4A] text-white text-[12px] font-bold opacity-95 active:scale-95"
        >
          View times
        </button>
      </div>

      <!-- Case 3: Prompt to Pick Times -->
      <div
        v-else
        class="mt-3.5 card-base p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#0B6623] transition-all group"
        @click="openModal"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center shrink-0 group-hover:bg-[#0B6623] group-hover:text-white transition-colors">
            <span class="mdi mdi-clock-outline text-[20px]"></span>
          </div>
          <div class="min-w-0">
            <div class="text-[14.5px] font-bold text-[#14231C] leading-snug whitespace-nowrap">
              Select play hours
            </div>
            <div class="text-[12px] text-[#66756D] font-medium mt-0.5 whitespace-nowrap">
              Daily · 8 AM – 11 PM
            </div>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0B6623] text-white text-[12.5px] font-bold transition-all group-hover:bg-[#08521C] active:scale-95 shadow-xs"
        >
          <span>Pick times</span>
          <span class="mdi mdi-arrow-right text-[14px]"></span>
        </button>
      </div>
    </div>

    <!-- Bottom Continue CTA button -->
    <BottomCTA
      :label="continueLabel"
      :disabled="!hasSelectedTimes"
      @click="goNext"
    />

    <!-- Time Slot Modal / Bottom Sheet -->
    <TimeSlotModal
      :show="showModal"
      @close="closeModal"
      @confirm="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingStore } from '~/stores/booking'
import CalendarPicker from '~/components/booking/CalendarPicker.vue'
import TimeSlotModal from '~/components/booking/TimeSlotModal.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'PickleBook — Reserve a court' })

const store = useBookingStore()
const showModal = ref(false)

onMounted(() => {
  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const selectedDate = new Date(store.year, store.month, store.day)
  if (selectedDate < todayMidnight) {
    store.setDate(now.getFullYear(), now.getMonth(), now.getDate())
  }
})

const hasSelectedTimes = computed(() => {
  return store.selectedSlots.length > 0 || store.slotIndex !== null
})

const continueLabel = computed(() => {
  const count = store.selectedSlots.length
  if (count === 0) return 'Pick times to continue'
  if (count === 1) return 'Continue to Courts (1 hr)'
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
