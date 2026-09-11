<template>
  <div
    class="border border-line bg-white rounded-card p-[18px] mb-4 transition-all"
    :class="[
      isSelected ? 'border-lime bg-lime-soft' : '',
      isFull ? 'opacity-55' : ''
    ]"
  >
    <div class="flex justify-between items-start mb-1">
      <div class="font-display font-semibold text-[19px]">{{ court.name }}</div>
      <span
        class="text-[12.5px] font-semibold px-[11px] py-1 rounded-full"
        :class="badgeClass"
      >
        {{ badgeText }}
      </span>
    </div>
    <div class="text-ink-soft text-[14px] mb-[14px]">
      ₱{{ court.price }} / hour · {{ court.type }}
    </div>
    <button
      type="button"
      :disabled="isFull"
      @click="$emit('select', court.id)"
      class="w-full p-[13px] rounded-[11px] font-semibold text-[15px] cursor-pointer transition-colors border"
      :class="[
        isSelected
          ? 'bg-ink text-white border-ink'
          : isFull
            ? 'cursor-not-allowed border-line text-gray bg-white'
            : 'border-ink bg-white text-ink hover:bg-ink hover:text-white'
      ]"
    >
      {{ isSelected ? 'Selected' : isFull ? 'Full' : 'Select court' }}
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
  if (props.status === 'open') return 'bg-lime-soft text-lime-text'
  if (props.status === 'low') return 'bg-danger-bg text-danger-text'
  return 'bg-[#EFEAE0] text-gray'
})
</script>
