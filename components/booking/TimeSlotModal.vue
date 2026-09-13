<template>
  <Teleport to="body">
    <Transition name="sheet-fade">
      <div
        v-if="show"
        class="timeslot-backdrop"
        @click.self="emit('close')"
      >
        <Transition name="sheet-slide" appear>
          <div v-if="show" class="timeslot-sheet" role="dialog" aria-modal="true">
            <!-- Drag handle -->
            <div class="sheet-handle" @click="emit('close')" />

            <!-- Header -->
            <div class="sheet-header">
              <div class="sheet-header-text">
                <span class="sheet-eyebrow">{{ store.fullDateLabel.toUpperCase() }}</span>
                <div class="flex items-center gap-2">
                  <h3 class="sheet-title">{{ store.isCurrentDayFullyBooked ? 'Fully Booked' : 'Available Times' }}</h3>
                  <span
                    v-if="store.isCurrentDayFullyBooked"
                    class="px-2 py-0.5 rounded-full bg-[#FEECEB] text-[#E5484D] text-[11px] font-bold tracking-wide uppercase"
                  >
                    Sold out
                  </span>
                  <span
                    v-else-if="store.selectedSlots.length > 0"
                    class="selected-count-badge"
                  >
                    {{ store.selectedSlots.length }} selected
                  </span>
                </div>
                <p class="sheet-subtitle whitespace-nowrap">
                  {{ store.isCurrentDayFullyBooked ? 'No courts open for this date' : 'Hourly slots · 8 AM – 11 PM' }}
                </p>
              </div>
              <button
                type="button"
                class="sheet-close-btn"
                @click="emit('close')"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <!-- Toolbar / Quick Select -->
            <div class="sheet-toolbar">
              <span
                class="text-[12px] font-medium"
                :class="store.isCurrentDayFullyBooked ? 'text-[#E5484D] font-semibold' : 'text-[var(--ink-soft)]'"
              >
                {{ store.isCurrentDayFullyBooked
                  ? 'All time slots are full for this day'
                  : store.selectedSlots.length === 0
                    ? 'Tap to select multiple times'
                    : `${store.selectedSlots.length} slot(s) chosen`
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

            <!-- Slots list (Scrollable 8 AM - 11 PM) -->
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
                  <!-- Checkbox indicator -->
                  <div
                    class="slot-checkbox"
                    :class="isSelected(idx) ? 'slot-checkbox--active' : ''"
                  >
                    <svg
                      v-if="isSelected(idx)"
                      class="w-3.5 h-3.5 text-cream"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span class="slot-label">{{ s.label }}</span>
                </div>

                <span
                  class="slot-badge"
                  :class="[
                    isSelected(idx)
                      ? 'slot-badge--selected'
                      : s.open === 0
                        ? 'slot-badge--full'
                        : 'slot-badge--open'
                  ]"
                >
                  {{ s.open === 0 ? 'Full' : `${s.open} ${s.open === 1 ? 'court open' : 'courts open'}` }}
                </span>
              </div>
            </div>

            <!-- Footer Confirm -->
            <div class="sheet-footer">
              <button
                type="button"
                class="confirm-btn"
                :disabled="store.selectedSlots.length === 0"
                @click="confirmSelection"
              >
                {{ confirmButtonText }}
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
import { useBookingStore } from '~/stores/booking'

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
    return `Confirm ${label} (1 hr)`
  }
  return `Confirm ${count} time slots (${count} hrs)`
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
/* ── Backdrop ────────────────────────────────────────────── */
.timeslot-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 30, 14, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

/* ── Sheet Container ─────────────────────────────────────── */
.timeslot-sheet {
  width: 100%;
  max-width: 420px;
  background: #F5F1DE;
  border-radius: 28px 28px 0 0;
  border: 1.5px solid rgba(222, 221, 184, 0.8);
  border-bottom: none;
  box-shadow: 0 -16px 48px -4px rgba(20, 30, 14, 0.4);
  padding: 12px 20px 24px;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  box-sizing: border-box;
}

/* ── Drag Handle ─────────────────────────────────────────── */
.sheet-handle {
  width: 40px;
  height: 5px;
  border-radius: 3px;
  background: rgba(34, 51, 24, 0.22);
  margin: 2px auto 14px;
  cursor: pointer;
}

/* ── Header ──────────────────────────────────────────────── */
.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}
.sheet-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sheet-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #5E6B4E;
  font-family: 'Inter', sans-serif;
}
.sheet-title {
  margin: 0;
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 700;
  color: #223318;
  line-height: 1.2;
}
.sheet-subtitle {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: #5E6B4E;
}
.selected-count-badge {
  font-size: 11px;
  font-weight: 700;
  background: #223318;
  color: #F5F1DE;
  padding: 2px 8px;
  border-radius: 999px;
}
.sheet-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(34, 51, 24, 0.15);
  background: transparent;
  color: #223318;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
  flex-shrink: 0;
}
.sheet-close-btn:hover {
  background: rgba(34, 51, 24, 0.1);
  border-color: #223318;
}

/* ── Toolbar ─────────────────────────────────────────────── */
.sheet-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px 10px;
  border-bottom: 1px solid rgba(34, 51, 24, 0.08);
  margin-bottom: 10px;
}
.clear-btn {
  font-size: 12px;
  font-weight: 600;
  color: #C97A1E;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
}
.clear-btn:hover {
  text-decoration: underline;
}

/* ── Slots List ──────────────────────────────────────────── */
.sheet-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 2px 2px 8px;
  max-height: 52vh;
}

/* ── Slot Card ───────────────────────────────────────────── */
.slot-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border-radius: 14px;
  border: 1.5px solid #DDDDB8;
  background: #FDFCF5;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}
.slot-card:hover:not(.slot-card--disabled) {
  border-color: rgba(34, 51, 24, 0.45);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(34, 51, 24, 0.1);
}
.slot-card--selected {
  background: #223318 !important;
  border-color: #223318 !important;
  color: #F5F1DE !important;
  box-shadow: 0 5px 16px -3px rgba(34, 51, 24, 0.35) !important;
}
.slot-card--disabled {
  opacity: 0.38;
  cursor: not-allowed;
  background: #EFEBD6;
}

/* Checkbox inside card */
.slot-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid rgba(34, 51, 24, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  background: #FFFFFF;
}
.slot-checkbox--active {
  border-color: #96C33E;
  background: #96C33E;
  color: #223318;
}

.slot-label {
  font-family: 'Inter', sans-serif;
  font-size: 15.5px;
  font-weight: 600;
  color: inherit;
}

/* ── Badges ──────────────────────────────────────────────── */
.slot-badge {
  font-size: 12.5px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}
.slot-badge--open {
  color: #5E6B4E;
}
.slot-badge--selected {
  color: #C8D9B0;
  font-weight: 600;
}
.slot-badge--full {
  color: #C97A1E;
  font-weight: 600;
}

/* ── Footer ──────────────────────────────────────────────── */
.sheet-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(34, 51, 24, 0.1);
}
.confirm-btn {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  background: #223318;
  color: #F5F1DE;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 16px -3px rgba(34, 51, 24, 0.4);
  transition: all 0.15s ease;
}
.confirm-btn:hover:not(:disabled) {
  background: #2E4A1A;
  box-shadow: 0 6px 20px -3px rgba(34, 51, 24, 0.5);
  transform: translateY(-1px);
}
.confirm-btn:active:not(:disabled) {
  transform: scale(0.98);
}
.confirm-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

/* ── Animations ──────────────────────────────────────────── */
.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.22s ease;
}
.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

.sheet-slide-enter-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-slide-leave-active {
  transition: transform 0.22s ease-in;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>
