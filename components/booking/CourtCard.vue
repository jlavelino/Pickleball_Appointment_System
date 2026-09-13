<template>
  <div
    class="court-card"
    :class="[
      isSelected ? 'court-card--selected' : '',
      isFull    ? 'court-card--full'     : ''
    ]"
  >
    <!-- Header row -->
    <div class="flex justify-between items-start mb-1">
      <div class="font-display font-semibold text-[19px]">{{ court.name }}</div>
      <span class="badge" :class="badgeClass">{{ badgeText }}</span>
    </div>

    <!-- Sub-line -->
    <div class="text-[14px] mb-[14px]" style="color: var(--ink-soft)">
      <span>₱{{ court.price }} / hour</span>
      <span v-if="hours && hours > 1" class="font-semibold text-[var(--ink)]">
        · ₱{{ court.price * hours }} total ({{ hours }} hrs)
      </span>
    </div>

    <!-- CTA button -->
    <button
      type="button"
      :disabled="isFull"
      @click="$emit('select', court.id)"
      class="court-btn btn-press"
      :class="[
        isSelected ? 'court-btn--chosen' :
        isFull     ? 'court-btn--full'   : 'court-btn--idle'
      ]"
    >
      {{ isSelected ? '✓ Selected' : isFull ? 'Full' : 'Select court' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Court } from '~/stores/booking'

const props = defineProps<{
  court: Court
  status: 'open' | 'low' | 'full'
  isSelected: boolean
  hours?: number
}>()

defineEmits<{
  select: [id: number]
}>()

const isFull = computed(() => props.status === 'full')

const badgeText = computed(() => {
  if (props.status === 'open') return 'Open'
  if (props.status === 'low') return '1 left'
  return 'Full'
})

const badgeClass = computed(() => {
  if (props.status === 'open') return 'badge--open'
  if (props.status === 'low') return 'badge--low'
  return 'badge--full'
})
</script>

<style scoped>
/* ── Card shell ───────────────────────────────────────────── */
.court-card {
  background: var(--cream-card, #FDFCF5);
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 10px -4px rgba(34, 51, 24, 0.10);
}
.court-card--selected {
  border-color: #4C7A22;                      /* --orange (lime-green) */
  background: #EAF1CE;                        /* lime-soft */
  box-shadow: 0 4px 16px -4px rgba(76, 122, 34, 0.22);
}
.court-card--full {
  opacity: 0.55;
}

/* ── Badge ────────────────────────────────────────────────── */
.badge {
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 11px;
  border-radius: 999px;
}
.badge--open { background: #EAF1CE; color: #3F6019; }
.badge--low  { background: #F7E8D2; color: #B4661E; }
.badge--full { background: #EFEAE0; color: #847E63; }

/* ── CTA button ───────────────────────────────────────────── */
.court-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 13px;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: 2px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
}

/* Idle — outlined ink, fills on hover */
.court-btn--idle {
  background: transparent;
  color: var(--ink, #223318);
  border-color: var(--ink, #223318);
}
.court-btn--idle:hover {
  background: var(--ink, #223318);
  color: var(--cream, #F5F1DE);
  box-shadow: 0 4px 14px -4px rgba(34, 51, 24, 0.40);
}

/* Selected — solid ink, cream text — maximum contrast */
.court-btn--chosen {
  background: var(--ink, #223318);
  color: var(--cream, #F5F1DE);
  border-color: var(--ink, #223318);
  box-shadow: 0 4px 14px -4px rgba(34, 51, 24, 0.45);
}

/* Full / disabled */
.court-btn--full {
  background: transparent;
  color: var(--gray, #847E63);
  border-color: var(--line, #DDDDB8);
  cursor: not-allowed;
}
</style>
