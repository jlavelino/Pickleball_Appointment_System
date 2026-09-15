<template>
  <div
    class="court-card group transition-all duration-200"
    :class="[
      isSelected ? 'court-card--selected' : '',
      isFull ? 'court-card--full' : 'hover:border-ink/40'
    ]"
    @click="!isFull && $emit('select', court.id)"
  >
    <!-- Top badge bar -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-ink text-cream text-[11px] font-bold font-mono tracking-tight">
          {{ courtIndex != null ? String(courtIndex + 1).padStart(2, '0') : 'CT' }}
        </span>
        <span class="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
          {{ court.type || 'Championship Court' }}
        </span>
      </div>

      <!-- Availability status badge -->
      <span class="status-badge" :class="badgeClass">
        <span class="status-dot" :class="dotClass"></span>
        {{ badgeText }}
      </span>
    </div>

    <!-- Court Title & Amenities -->
    <div class="mb-3">
      <div class="font-display font-bold text-[20px] text-ink leading-tight flex items-center justify-between">
        <span>{{ court.name }}</span>
        <div class="text-right">
          <span class="font-display font-extrabold text-[20px] text-ink">₱{{ court.price }}</span>
          <span class="text-[12px] font-medium text-ink-soft">/hr</span>
        </div>
      </div>

      <!-- Multi-hour calculation subtitle -->
      <div v-if="hours && hours > 1" class="text-right text-[12px] font-semibold text-relish-dark mt-0.5">
        ₱{{ (court.price * hours).toLocaleString() }} for {{ hours }} hours
      </div>

      <!-- Facility highlights / amenities -->
      <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
        <span class="amenity-tag">
          <svg class="w-3 h-3 text-relish-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Pro Acrylic
        </span>
        <span class="amenity-tag">
          <svg class="w-3 h-3 text-relish-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Tournament Net
        </span>
        <span class="amenity-tag">
          <svg class="w-3 h-3 text-relish-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Anti-Glare LED
        </span>
      </div>
    </div>

    <!-- Select Action Button -->
    <button
      type="button"
      :disabled="isFull"
      @click.stop="$emit('select', court.id)"
      class="court-btn"
      :class="[
        isSelected ? 'court-btn--chosen' :
        isFull ? 'court-btn--full' : 'court-btn--idle'
      ]"
    >
      <template v-if="isSelected">
        <svg class="w-4 h-4 text-lime shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Court Selected</span>
      </template>
      <template v-else-if="isFull">
        <span>Unavailable</span>
      </template>
      <template v-else>
        <span>Select Court</span>
      </template>
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
  courtIndex?: number
}>()

defineEmits<{
  select: [id: string | number]
}>()

const isFull = computed(() => props.status === 'full')

const badgeText = computed(() => {
  if (props.status === 'open') return 'Available'
  if (props.status === 'low') return '1 slot left'
  return 'Reserved'
})

const badgeClass = computed(() => {
  if (props.status === 'open') return 'badge--open'
  if (props.status === 'low') return 'badge--low'
  return 'badge--full'
})

const dotClass = computed(() => {
  if (props.status === 'open') return 'bg-emerald-500'
  if (props.status === 'low') return 'bg-amber-500'
  return 'bg-gray-400'
})
</script>

<style scoped>
.court-card {
  position: relative;
  background: var(--cream-card, #FDFCF5);
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 18px;
  padding: 16px 18px;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 2px 10px -4px rgba(34, 51, 24, 0.07);
}

.court-card--selected {
  border-color: var(--ink, #223318);
  background: linear-gradient(180deg, #FFFFFF 0%, #F5F7EA 100%);
  box-shadow: 0 6px 20px -6px rgba(34, 51, 24, 0.18), 0 0 0 1px var(--ink, #223318);
}

.court-card--full {
  opacity: 0.55;
  cursor: not-allowed;
  background: var(--cream, #F5F1DE);
}

.amenity-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-soft);
  background: rgba(34, 51, 24, 0.05);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.badge--open { background: #EAF5E8; color: #1D6331; }
.badge--low  { background: #FEF3D6; color: #9B5A03; }
.badge--full { background: #EBEAE4; color: #737063; }

.court-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.15s ease-out;
}

.court-btn--idle {
  background: transparent;
  color: var(--ink, #223318);
  border-color: var(--line, #DDDDB8);
}
.court-card:hover .court-btn--idle {
  background: var(--ink, #223318);
  color: var(--cream, #F5F1DE);
  border-color: var(--ink, #223318);
}

.court-btn--chosen {
  background: var(--ink, #223318);
  color: #FFFFFF;
  border-color: var(--ink, #223318);
  box-shadow: 0 4px 14px -4px rgba(34, 51, 24, 0.35);
}

.court-btn--full {
  background: transparent;
  color: var(--gray, #847E63);
  border-color: var(--line, #DDDDB8);
  cursor: not-allowed;
}
</style>
