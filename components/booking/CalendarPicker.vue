<template>
  <div class="calendar-card">
    <!-- Top Month Row -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center shrink-0">
          <span class="mdi mdi-calendar-blank-outline text-[18px]"></span>
        </div>
        <h3 class="font-display text-[20px] font-bold text-[#14231C] m-0">
          {{ monthName }} {{ viewYear }}
        </h3>
      </div>

      <!-- Month Navigation Buttons: Circular, Soft green bg, Dark green arrow -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="prevMonth"
          aria-label="Previous Month"
          class="cal-nav-btn"
        >
          <span class="mdi mdi-chevron-left text-[19px]"></span>
        </button>
        <button
          type="button"
          @click="nextMonth"
          aria-label="Next Month"
          class="cal-nav-btn"
        >
          <span class="mdi mdi-chevron-right text-[19px]"></span>
        </button>
      </div>
    </div>

    <!-- Calendar Weekdays: S M T W T F S in muted green-gray -->
    <div class="grid grid-cols-7 gap-1 text-center mb-1">
      <div
        v-for="d in dows"
        :key="d"
        class="text-[12.5px] font-bold text-[#66756D] py-1 select-none"
      >
        {{ d }}
      </div>
    </div>

    <!-- Calendar Grid with generous spacing -->
    <div class="grid grid-cols-7 gap-y-1.5 gap-x-1 mb-3">
      <!-- Leading empty days -->
      <div
        v-for="i in firstDow"
        :key="'empty-' + i"
        class="h-11"
      />

      <!-- Day cells -->
      <div
        v-for="d in daysInMonth"
        :key="'day-' + d"
        class="flex flex-col items-center justify-center min-h-[46px]"
      >
        <button
          type="button"
          :disabled="isPast(d)"
          @click="selectDay(d)"
          class="cal-day relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-150"
          :class="[
            isSelected(d)
              ? 'cal-day--selected'
              : isPast(d)
                ? 'cal-day--past'
                : isFullyBooked(d)
                  ? 'cal-day--booked'
                  : 'cal-day--available'
          ]"
        >
          <span
            class="text-[14.5px] leading-none"
            :class="isSelected(d) ? 'font-bold' : 'font-medium'"
          >
            {{ d }}
          </span>
        </button>

        <!-- Indicators below date -->
        <div class="h-2 flex items-center justify-center mt-0.5">
          <!-- Red indicator for fully booked date -->
          <span
            v-if="isFullyBooked(d) && !isPast(d)"
            class="w-1.5 h-1.5 rounded-full bg-[#D94A4A]"
            title="Fully booked"
          />
        </div>
      </div>
    </div>

    <!-- Fully booked legend -->
    <div class="pt-3 border-t border-[#DCE6D8] flex items-center justify-center text-[12px] font-medium text-[#66756D]">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#D94A4A] shrink-0"></span>
        <span class="text-[#14231C]">Fully booked</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBookingStore } from '~/stores/booking'

const emit = defineEmits<{ dateSelected: [] }>()
const store = useBookingStore()

const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Independent calendar view month & year so browsing other months does not overwrite selected booking date
const viewYear = ref(store.year)
const viewMonth = ref(store.month)

// Synchronize calendar view if store's date is updated externally
watch(
  () => [store.year, store.month],
  ([y, m]) => {
    viewYear.value = y
    viewMonth.value = m
  }
)

const monthName = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('en-US', { month: 'long' })
)

const firstDow = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).getDay()
)

const daysInMonth = computed(() =>
  new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
)

const today = new Date(2026, 8, 10) // Benchmark September 10, 2026

function isPast(d: number): boolean {
  const cellDate = new Date(viewYear.value, viewMonth.value, d)
  return cellDate < today
}

function isSelected(d: number): boolean {
  return store.year === viewYear.value && store.month === viewMonth.value && store.day === d
}

function isFullyBooked(d: number): boolean {
  if (isSelected(d)) {
    return store.isCurrentDayFullyBooked
  }
  return false
}

function prevMonth() {
  viewMonth.value -= 1
  if (viewMonth.value < 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  }
}

function nextMonth() {
  viewMonth.value += 1
  if (viewMonth.value > 11) {
    viewMonth.value = 0
    viewYear.value += 1
  }
}

function selectDay(d: number) {
  store.setDate(viewYear.value, viewMonth.value, d)
  emit('dateSelected')
}
</script>

<style scoped>
.calendar-card {
  background: #FFFFFF;
  border-radius: 24px;
  border: 1px solid #DCE6D8;
  box-shadow: 0 4px 16px -2px rgba(20, 35, 28, 0.04);
  padding: 20px 18px 16px;
}

.cal-nav-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #DCE6D8;
  background: #E8F4D8;
  color: #0B6623;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}
.cal-nav-btn:hover {
  background: #D9EBC4;
  color: #084718;
  border-color: #0B6623;
}
.cal-nav-btn:active {
  transform: scale(0.92);
}

.cal-day {
  cursor: pointer;
  border: none;
  background: transparent;
  color: #14231C;
  user-select: none;
}

.cal-day--available:hover {
  background: #E8F4D8;
  color: #0B6623;
}

.cal-day--selected {
  background: #0B6623 !important;
  color: #FFFFFF !important;
  font-weight: 700;
  box-shadow: 0 4px 12px -2px rgba(11, 102, 35, 0.45);
}

.cal-day--booked {
  color: #14231C;
}
.cal-day--booked:hover {
  background: #FDE8E8;
  color: #D94A4A;
}

.cal-day--past {
  color: #C5C8C6;
  cursor: not-allowed;
}
</style>
