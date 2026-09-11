<template>
  <div>
    <!-- Month head -->
    <div class="flex items-center justify-between mb-[14px]">
      <h3 class="font-display text-[18px] font-semibold m-0">{{ monthName }} {{ store.year }}</h3>
      <div class="flex gap-1.5">
        <button
          type="button"
          @click="store.prevMonth"
          aria-label="Previous Month"
          class="w-7 h-7 rounded-lg border border-line bg-white cursor-pointer text-[13px] text-ink flex items-center justify-center hover:bg-cream/50"
        >
          ‹
        </button>
        <button
          type="button"
          @click="store.nextMonth"
          aria-label="Next Month"
          class="w-7 h-7 rounded-lg border border-line bg-white cursor-pointer text-[13px] text-ink flex items-center justify-center hover:bg-cream/50"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-y-1 gap-x-0.5 mb-[22px]">
      <div
        v-for="d in dows"
        :key="d"
        class="text-center text-[12px] text-gray font-semibold pb-1.5"
      >
        {{ d }}
      </div>

      <div
        v-for="i in firstDow"
        :key="'empty-' + i"
        class="text-center py-[9px] text-[14.5px]"
      ></div>

      <button
        v-for="d in daysInMonth"
        :key="'day-' + d"
        type="button"
        :disabled="isPast(d)"
        @click="store.setDay(d)"
        class="text-center py-[9px] rounded-[10px] text-[14.5px] cursor-pointer transition-colors border-none"
        :class="[
          d === store.day
            ? 'bg-ink text-white font-semibold'
            : isPast(d)
              ? 'text-[#C9C4B3] cursor-not-allowed bg-transparent'
              : 'text-ink bg-transparent hover:bg-white'
        ]"
      >
        {{ d }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'

const store = useBookingStore()

const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const monthName = computed(() =>
  new Date(store.year, store.month, 1).toLocaleDateString('en-US', { month: 'long' })
)

const firstDow = computed(() =>
  new Date(store.year, store.month, 1).getDay()
)

const daysInMonth = computed(() =>
  new Date(store.year, store.month + 1, 0).getDate()
)

const today = new Date(2026, 8, 10) // September 10, 2026 benchmark

function isPast(d: number): boolean {
  const cellDate = new Date(store.year, store.month, d)
  return cellDate < today
}
</script>
