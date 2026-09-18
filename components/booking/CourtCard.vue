<template>
  <div
    class="court-card group transition-all duration-200"
    :class="[
      isSelected ? 'court-card--selected' : '',
      isMaintenance ? 'court-card--maintenance' : isFull ? 'court-card--full' : ''
    ]"
    @click="!isFull && $emit('select', court.id)"
  >
    <!-- Top Row: Court number badge + INDOOR + Availability badge -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-2.5">
        <!-- Dark forest green rounded square badge (32-36px) -->
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#14231C] text-white text-[12px] font-bold font-mono tracking-tight shrink-0 shadow-xs">
          {{ courtIndex != null ? String(courtIndex + 1).padStart(2, '0') : '01' }}
        </span>
        <!-- Indoor label in muted green-gray small uppercase -->
        <span class="text-[11.5px] font-bold uppercase tracking-wider text-[#66756D]">
          {{ court.type ? court.type.toUpperCase() : 'INDOOR' }}
        </span>
      </div>

      <!-- Availability status badge -->
      <span class="status-badge" :class="badgeClass">
        <span class="status-dot" :class="dotClass"></span>
        {{ badgeText }}
      </span>
    </div>

    <!-- Middle Row: Court Name & Price (Dark forest green #0B6623) -->
    <div class="flex items-baseline justify-between mb-2">
      <div class="font-display font-bold text-[24px] text-[#14231C] leading-tight">
        {{ court.name }}
      </div>
      <div class="text-right">
        <span class="font-display font-bold text-[22px] text-[#0B6623]">₱{{ court.price }}</span>
        <span class="text-[12px] font-medium text-[#66756D]">/hr</span>
      </div>
    </div>

    <!-- Multi-hour calculation subtitle if user booked > 1 hour -->
    <div v-if="hours && hours > 1" class="text-right text-[11.5px] font-bold text-[#0B6623] -mt-1 mb-2.5">
      ₱{{ (court.price * hours).toLocaleString() }} for {{ hours }} hours
    </div>



    <!-- Court Image: 100% width with Selection Indicator in overlay/corner -->
    <div class="relative w-full h-[104px] rounded-xl overflow-hidden border border-[#DCE6D8] bg-black/5">
      <img
        src="~/assets/images/court_preview.jpg"
        alt="Pickleball Court Preview"
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

      <!-- Selection Indicator bottom-right of image / card -->
      <div class="absolute bottom-2.5 right-2.5 shrink-0 flex items-center justify-center">
        <div
          v-if="isSelected"
          class="w-7 h-7 rounded-full bg-[#0B6623] text-white flex items-center justify-center font-bold text-[14px] shadow-sm border border-white"
        >
          <span class="mdi mdi-check text-[16px] leading-none"></span>
        </div>
        <div
          v-else
          class="w-7 h-7 rounded-full border-2 border-white/80 bg-black/30 backdrop-blur-xs group-hover:border-white transition-colors"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Court } from '~/stores/booking'

const props = defineProps<{
  court: Court
  status: 'open' | 'low' | 'full' | 'maintenance'
  isSelected: boolean
  hours?: number
  courtIndex?: number
}>()

defineEmits<{
  select: [id: string | number]
}>()

const isFull = computed(() => props.status === 'full' || props.status === 'maintenance')
const isMaintenance = computed(() => props.status === 'maintenance')

const badgeText = computed(() => {
  if (props.status === 'maintenance') return 'Under Maintenance'
  if (props.status === 'open') return 'Available'
  if (props.status === 'low') return '1 slot left'
  return 'Reserved'
})

const badgeClass = computed(() => {
  if (props.status === 'maintenance') return 'badge--maintenance'
  if (props.status === 'open') return 'badge--open'
  if (props.status === 'low') return 'badge--low'
  return 'badge--full'
})

const dotClass = computed(() => {
  if (props.status === 'maintenance') return 'bg-[#D98216]'
  if (props.status === 'open') return 'bg-[#0B6623]'
  if (props.status === 'low') return 'bg-[#D98216]'
  return 'bg-[#8A938D]'
})
</script>

<style scoped>
.court-card {
  position: relative;
  background: #FFFFFF;
  border: 1px solid #DCE6D8;
  border-radius: 20px;
  padding: 16px 18px;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 2px 10px -2px rgba(20, 35, 28, 0.04);
  user-select: none;
  transition: all 0.15s ease;
}

.court-card:hover:not(.court-card--full):not(.court-card--selected) {
  border-color: #0B6623;
  box-shadow: 0 4px 14px -2px rgba(11, 102, 35, 0.08);
}

/* Selected state: 2px forest green border + subtle green tint */
.court-card--selected {
  border: 2px solid #0B6623 !important;
  background: #F6FAF2 !important;
  box-shadow: 0 4px 16px -2px rgba(11, 102, 35, 0.14) !important;
}

.court-card--full {
  opacity: 0.55;
  cursor: not-allowed;
  background: #FAF9F1;
}

.feature-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #14231C;
  background: #F2F7EC;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.badge--open { background: #E8F4D8; color: #0B6623; }
.badge--low  { background: #FEF3D6; color: #D98216; }
.badge--full { background: #EAEFE7; color: #66756D; }
.badge--maintenance { background: #FEF3D6; color: #D98216; border: 1px solid #FCD34D; }

.court-card--maintenance {
  opacity: 0.72;
  cursor: not-allowed;
  background: #FAF9F1;
}
</style>
