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
          class="cal-nav-btn"
        >
          ‹
        </button>
        <button
          type="button"
          @click="store.nextMonth"
          aria-label="Next Month"
          class="cal-nav-btn"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-y-1 gap-x-0.5 mb-[22px]">
      <!-- Day-of-week headers -->
      <div
        v-for="d in dows"
        :key="d"
        class="text-center text-[12px] text-gray font-semibold pb-1.5"
      >
        {{ d }}
      </div>

      <!-- Empty leading cells -->
      <div
        v-for="i in firstDow"
        :key="'empty-' + i"
        class="text-center py-[9px] text-[14.5px]"
      ></div>

      <!-- Day cells -->
      <button
        v-for="d in daysInMonth"
        :key="'day-' + d"
        type="button"
        :disabled="isPast(d)"
        @click="store.setDay(d)"
        class="cal-day"
        :class="[
          d === store.day
            ? 'cal-day--selected'
            : isPast(d)
              ? 'cal-day--past'
              : 'cal-day--available'
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

<style scoped>
/* ── Month nav buttons ───────────────────────────────────────── */
.cal-nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1.5px solid var(--ink);
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, color 0.12s;
}
.cal-nav-btn:hover {
  background: var(--ink);
  color: var(--cream);
}

/* ── Day cells ───────────────────────────────────────────────── */
.cal-day {
  text-align: center;
  padding: 9px 0;
  border-radius: 10px;
  font-size: 14.5px;
  cursor: pointer;
  border: none;
  outline: none;
  transition: background 0.12s, color 0.12s, box-shadow 0.12s;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

/* Available — visible ink text, subtle hover */
.cal-day--available {
  color: var(--ink);
  background: transparent;
}
.cal-day--available:hover {
  background: rgba(34, 51, 24, 0.10);   /* ink at 10% — clearly visible on cream */
  font-weight: 600;
}

/* Selected — inverted, max contrast */
.cal-day--selected {
  background: var(--ink);
  color: var(--cream);
  font-weight: 700;
  box-shadow: 0 3px 12px -3px rgba(34, 51, 24, 0.40);
}

/* Past / disabled */
.cal-day--past {
  color: #C0BC9E;   /* muted but still visible on cream */
  background: transparent;
  cursor: not-allowed;
}
</style>
