<template>
  <Teleport to="body">
    <Transition name="sheet-fade">
      <div
        v-if="show"
        class="timeslot-backdrop"
        @click.self="emit('close')"
      >
        <Transition name="sheet-slide" appear>
          <div class="timeslot-sheet" role="dialog" aria-modal="true">
            <!-- Drag handle -->
            <div class="sheet-handle" @click="emit('close')" />

            <!-- Header with Back & Close circular buttons -->
            <div class="sheet-header">
              <button
                type="button"
                class="btn-icon"
                @click="emit('close')"
                aria-label="Back"
              >
                <span class="mdi mdi-chevron-left text-[20px]"></span>
              </button>

              <div class="text-center flex-1 px-2">
                <span class="sheet-eyebrow">{{ store.fullDateLabel.toUpperCase() }}</span>
                <h3 class="sheet-title">
                  {{ store.isCurrentDayFullyBooked ? 'Fully Booked' : 'Available Times' }}
                </h3>
                <p class="sheet-subtitle">
                  Hourly slots · 8 AM – 11 PM
                </p>
              </div>

              <button
                type="button"
                class="btn-icon"
                @click="emit('close')"
                aria-label="Close"
              >
                <span class="mdi mdi-close text-[18px]"></span>
              </button>
            </div>

            <!-- Toolbar / Tap to select multiple times -->
            <div class="sheet-toolbar">
              <span class="text-[12.5px] font-semibold text-[#0B6623]">
                {{ store.isCurrentDayFullyBooked
                  ? 'All time slots are full for this day'
                  : store.selectedSlots.length === 0
                    ? 'Tap to select multiple times'
                    : `${store.selectedSlots.length} hour slot(s) selected`
                }}
              </span>

              <button
                v-if="store.selectedSlots.length > 0"
                type="button"
                class="clear-btn"
                @click="store.clearSlots()"
              >
                Clear all
              </button>
            </div>

            <!-- Slots list -->
            <div class="sheet-slots no-scrollbar">
              <div
                v-for="(s, idx) in store.slots"
                :key="s.label"
                class="slot-card"
                :class="[
                  isSelected(idx) ? 'slot-card--selected' : '',
                  s.open === 0 ? 'slot-card--disabled' : ''
                ]"
                @click="s.open > 0 ? store.toggleSlot(idx) : null"
              >
                <div class="flex items-center gap-3">
                  <!-- Checkbox indicator: square with rounded corners -->
                  <div
                    class="slot-checkbox"
                    :class="isSelected(idx) ? 'slot-checkbox--active' : ''"
                  >
                    <span
                      v-if="isSelected(idx)"
                      class="mdi mdi-check text-[14px] text-white leading-none font-bold"
                    ></span>
                  </div>

                  <!-- Time range text -->
                  <span class="slot-label">
                    {{ s.label }} – {{ formatEndHour(s.label) }}
                  </span>
                </div>

                <!-- Right indicator: courts open with icon -->
                <div class="flex items-center gap-1.5">
                  <span
                    class="slot-badge flex items-center gap-1.5"
                    :class="[
                      s.open === 0
                        ? 'text-[#D94A4A]'
                        : isSelected(idx)
                          ? 'text-[#0B6623] font-bold'
                          : 'text-[#66756D]'
                    ]"
                  >
                    <span class="mdi mdi-account-multiple-outline text-[16px] shrink-0 text-[#0B6623]"></span>
                    <span>{{ s.open === 0 ? 'Full' : `${s.open} ${s.open === 1 ? 'court open' : 'courts open'}` }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Bottom CTA Confirm Button -->
            <div class="sheet-footer">
              <button
                type="button"
                class="btn-primary w-full"
                :disabled="store.selectedSlots.length === 0"
                @click="confirmSelection"
              >
                <span>{{ confirmButtonText }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useBookingStore, formatEndHour } from '~/stores/booking'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const store = useBookingStore()

function isSelected(idx: number): boolean {
  return store.selectedSlots.includes(idx)
}

const confirmButtonText = computed(() => {
  if (store.isCurrentDayFullyBooked) return 'Fully Booked — No Slots'
  const count = store.selectedSlots.length
  if (count === 0) return 'Select time slot(s)'
  if (count === 1) {
    const label = store.slots[store.selectedSlots[0]]?.label || ''
    return `Select time slot (${label})`
  }
  return `Select ${count} time slots (${count} hrs)`
})

function confirmSelection() {
  if (store.selectedSlots.length > 0) {
    emit('confirm')
    emit('close')
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* ── Backdrop: Dark translucent overlay ─────────────────── */
.timeslot-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 35, 28, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

/* ── Modal Sheet (White, 28-32px top radius) ─────────────── */
.timeslot-sheet {
  width: 100%;
  max-width: 430px;
  background: #FFFFFF;
  border-radius: 30px 30px 0 0;
  border: 1px solid #DCE6D8;
  border-bottom: none;
  box-shadow: 0 -16px 48px -4px rgba(20, 35, 28, 0.25);
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  box-sizing: border-box;
}

/* ── Drag Handle ─────────────────────────────────────────── */
.sheet-handle {
  width: 38px;
  height: 4px;
  border-radius: 3px;
  background: #DCE6D8;
  margin: 2px auto 12px;
  cursor: pointer;
}

/* ── Header ──────────────────────────────────────────────── */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sheet-eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #66756D;
  font-family: 'Inter', sans-serif;
}
.sheet-title {
  margin: 2px 0 0;
  font-family: 'DM Serif Display', serif;
  font-size: 24px;
  font-weight: 700;
  color: #14231C;
  line-height: 1.15;
}
.sheet-subtitle {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: #66756D;
  font-weight: 500;
}

/* ── Toolbar ─────────────────────────────────────────────── */
.sheet-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  border-bottom: 1px solid #DCE6D8;
  margin-bottom: 10px;
}
.clear-btn {
  font-size: 12px;
  font-weight: 700;
  color: #0B6623;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
}
.clear-btn:hover {
  background: #E8F4D8;
}

/* ── Slots List ──────────────────────────────────────────── */
.sheet-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 2px 2px 10px;
  max-height: 52vh;
}

/* ── Horizontal Time Slot Card (54-64px height) ─────────── */
.slot-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid #DCE6D8;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}
.slot-card:hover:not(.slot-card--disabled) {
  border-color: #0B6623;
  box-shadow: 0 2px 10px -2px rgba(11, 102, 35, 0.08);
}
.slot-card--selected {
  background: #E8F4D8 !important;
  border-color: #0B6623 !important;
  box-shadow: 0 2px 12px -2px rgba(11, 102, 35, 0.15) !important;
}
.slot-card--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: #FAF9F1;
}

/* Checkbox inside card: square with rounded corners */
.slot-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #DCE6D8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  background: #FFFFFF;
  flex-shrink: 0;
}
.slot-checkbox--active {
  border-color: #0B6623;
  background: #0B6623;
}

.slot-label {
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: #14231C;
}

.slot-badge {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

/* ── Footer ──────────────────────────────────────────────── */
.sheet-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #DCE6D8;
}

/* ── Transitions ─────────────────────────────────────────── */
.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.22s ease;
}
.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

.sheet-slide-enter-active {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-slide-leave-active {
  transition: transform 0.22s ease-in;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>
